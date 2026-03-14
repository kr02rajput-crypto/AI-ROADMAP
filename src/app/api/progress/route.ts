import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { progress, roadmapNodes } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

// Toggle node completion
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { nodeId, completed } = body;

    if (!nodeId) {
      return NextResponse.json(
        { error: "nodeId is required" },
        { status: 400 }
      );
    }

    // Check if progress record exists
    const existing = await db.query.progress.findFirst({
      where: and(eq(progress.userId, user.id), eq(progress.nodeId, nodeId)),
    });

    if (existing) {
      // Update existing
      await db
        .update(progress)
        .set({
          completed: completed ?? !existing.completed,
          completedAt: completed ? new Date() : null,
        })
        .where(eq(progress.id, existing.id));
    } else {
      // Create new
      await db.insert(progress).values({
        userId: user.id,
        nodeId: nodeId,
        completed: completed ?? true,
        completedAt: new Date(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}

// Get progress for a roadmap
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const roadmapId = searchParams.get("roadmapId");

    if (!roadmapId) {
      return NextResponse.json(
        { error: "roadmapId is required" },
        { status: 400 }
      );
    }

    // Get all nodes for the roadmap
    const nodes = await db.query.roadmapNodes.findMany({
      where: eq(roadmapNodes.roadmapId, roadmapId),
    });

    const nodeIds = nodes.map((n) => n.id);

    // Get progress for all those nodes
    const progressRecords = await db.query.progress.findMany({
      where: and(
        eq(progress.userId, user.id),
      ),
    });

    // Filter to only relevant nodes
    const filtered = progressRecords.filter((p) =>
      nodeIds.includes(p.nodeId)
    );

    const progressMap: Record<string, boolean> = {};
    for (const p of filtered) {
      progressMap[p.nodeId] = p.completed;
    }

    return NextResponse.json({ progress: progressMap });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
