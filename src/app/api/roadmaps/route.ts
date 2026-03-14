import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { roadmaps, roadmapNodes, resources } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userRoadmaps = await db.query.roadmaps.findMany({
      where: eq(roadmaps.userId, user.id),
      orderBy: (roadmaps, { desc }) => [desc(roadmaps.createdAt)],
    });

    return NextResponse.json({ roadmaps: userRoadmaps });
  } catch (error) {
    console.error("Error fetching roadmaps:", error);
    return NextResponse.json(
      { error: "Failed to fetch roadmaps" },
      { status: 500 }
    );
  }
}
