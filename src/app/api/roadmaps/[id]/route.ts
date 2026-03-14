import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { roadmaps, roadmapNodes, resources } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await params;

    const roadmap = await db.query.roadmaps.findFirst({
      where: eq(roadmaps.id, id),
    });

    if (!roadmap || roadmap.userId !== user.id) {
      return NextResponse.json(
        { error: "Roadmap not found" },
        { status: 404 }
      );
    }

    const nodes = await db.query.roadmapNodes.findMany({
      where: eq(roadmapNodes.roadmapId, id),
      with: {
        resources: true,
      },
    });

    return NextResponse.json({ roadmap, nodes });
  } catch (error) {
    console.error("Error fetching roadmap:", error);
    return NextResponse.json(
      { error: "Failed to fetch roadmap" },
      { status: 500 }
    );
  }
}
