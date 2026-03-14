import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateRoadmap } from "@/lib/groq";
import { getOrCreateUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { roadmaps, roadmapNodes, resources } from "@/drizzle/schema";

interface RoadmapResource {
  title: string;
  type: string;
  url: string;
}

interface RoadmapProject {
  title: string;
  description: string;
}

interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  resources: RoadmapResource[];
  projects: RoadmapProject[];
  children: string[];
}

interface RoadmapData {
  title: string;
  description: string;
  nodes: RoadmapNode[];
}

function calculateNodePositions(nodes: RoadmapNode[]) {
  const positions: Record<string, { x: number; y: number }> = {};
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // Find root nodes (nodes that are not children of any other node)
  const allChildIds = new Set(nodes.flatMap((n) => n.children));
  const rootNodes = nodes.filter((n) => !allChildIds.has(n.id));

  const HORIZONTAL_SPACING = 300;
  const VERTICAL_SPACING = 200;

  function layoutNode(
    nodeId: string,
    depth: number,
    horizontalIndex: number
  ): number {
    const node = nodeMap.get(nodeId);
    if (!node || positions[nodeId]) return horizontalIndex;

    positions[nodeId] = {
      x: horizontalIndex * HORIZONTAL_SPACING,
      y: depth * VERTICAL_SPACING,
    };

    let currentIndex = horizontalIndex;
    for (const childId of node.children) {
      currentIndex = layoutNode(childId, depth + 1, currentIndex);
      currentIndex++;
    }

    // Center parent over its children
    if (node.children.length > 0) {
      const firstChildPos = positions[node.children[0]];
      const lastChildPos = positions[node.children[node.children.length - 1]];
      if (firstChildPos && lastChildPos) {
        positions[nodeId].x = (firstChildPos.x + lastChildPos.x) / 2;
      }
    }

    return Math.max(currentIndex, horizontalIndex);
  }

  let hIndex = 0;
  for (const root of rootNodes) {
    hIndex = layoutNode(root.id, 0, hIndex);
    hIndex += 2;
  }

  return positions;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Generate roadmap using Groq AI
    const roadmapData: RoadmapData = await generateRoadmap(prompt);

    // Calculate node positions for visualization
    const positions = calculateNodePositions(roadmapData.nodes);

    // Save roadmap to database
    const [savedRoadmap] = await db
      .insert(roadmaps)
      .values({
        userId: user.id,
        title: roadmapData.title,
        description: roadmapData.description,
        prompt: prompt,
        roadmapData: JSON.stringify(roadmapData),
      })
      .returning();

    // Save nodes and resources
    for (const node of roadmapData.nodes) {
      const pos = positions[node.id] || { x: 0, y: 0 };

      const [savedNode] = await db
        .insert(roadmapNodes)
        .values({
          roadmapId: savedRoadmap.id,
          nodeId: node.id,
          title: node.title,
          description: node.description,
          difficulty: node.difficulty,
          parentId:
            roadmapData.nodes.find((n) => n.children.includes(node.id))?.id ||
            null,
          positionX: pos.x,
          positionY: pos.y,
        })
        .returning();

      // Save resources
      if (node.resources && node.resources.length > 0) {
        await db.insert(resources).values(
          node.resources.map((r) => ({
            nodeId: savedNode.id,
            title: r.title,
            url: r.url,
            type: r.type,
          }))
        );
      }
    }

    return NextResponse.json({
      id: savedRoadmap.id,
      title: savedRoadmap.title,
      description: savedRoadmap.description,
    });
  } catch (error) {
    console.error("Error generating roadmap:", error);
    return NextResponse.json(
      { error: "Failed to generate roadmap" },
      { status: 500 }
    );
  }
}
