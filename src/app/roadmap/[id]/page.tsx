"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import RoadmapGraph from "@/components/RoadmapGraph";
import Sidebar from "@/components/Sidebar";
import { Loader2, ArrowLeft, Share2, BarChart3 } from "lucide-react";
import Link from "next/link";

interface Resource {
  id: string;
  title: string;
  url: string;
  type: string;
}

interface RoadmapNode {
  id: string;
  nodeId: string;
  title: string;
  description: string;
  difficulty: string;
  parentId: string | null;
  positionX: number;
  positionY: number;
  resources: Resource[];
}

interface Roadmap {
  id: string;
  title: string;
  description: string;
  prompt: string;
  roadmapData: string | null;
  createdAt: string;
}

interface Project {
  title: string;
  description: string;
}

export default function RoadmapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [nodes, setNodes] = useState<RoadmapNode[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch roadmap data
  useEffect(() => {
    async function fetchRoadmap() {
      try {
        const res = await fetch(`/api/roadmaps/${id}`);
        if (!res.ok) {
          router.push("/dashboard");
          return;
        }
        const data = await res.json();
        setRoadmap(data.roadmap);
        setNodes(data.nodes);

        // Fetch progress
        const progressRes = await fetch(`/api/progress?roadmapId=${id}`);
        if (progressRes.ok) {
          const progressData = await progressRes.json();
          setProgressMap(progressData.progress);
        }
      } catch (err) {
        console.error("Failed to fetch roadmap:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRoadmap();
  }, [id, router]);

  // Toggle node completion
  const handleToggleComplete = useCallback(
    async (dbNodeId: string) => {
      const currentState = progressMap[dbNodeId] || false;
      const newState = !currentState;

      // Optimistic update
      setProgressMap((prev) => ({ ...prev, [dbNodeId]: newState }));

      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nodeId: dbNodeId, completed: newState }),
        });
      } catch (err) {
        // Revert on error
        setProgressMap((prev) => ({ ...prev, [dbNodeId]: currentState }));
        console.error("Failed to update progress:", err);
      }
    },
    [progressMap]
  );

  // Handle node click to open sidebar
  const handleNodeClick = useCallback(
    (nodeId: string) => {
      setSelectedNodeId(nodeId);
      setSidebarOpen(true);
    },
    []
  );

  // Get selected node's data for sidebar
  const getSelectedNodeData = useCallback(() => {
    if (!selectedNodeId) return null;

    const node = nodes.find((n) => n.nodeId === selectedNodeId);
    if (!node) return null;

    // Get projects from roadmapData
    let projects: Project[] = [];
    if (roadmap?.roadmapData) {
      try {
        const parsed = JSON.parse(roadmap.roadmapData);
        const aiNode = parsed.nodes?.find(
          (n: { id: string }) => n.id === selectedNodeId
        );
        if (aiNode?.projects) {
          projects = aiNode.projects;
        }
      } catch {}
    }

    return {
      id: selectedNodeId,
      dbNodeId: node.id,
      title: node.title,
      description: node.description || "",
      difficulty: node.difficulty || "Beginner",
      resources: node.resources || [],
      projects,
      completed: progressMap[node.id] || false,
    };
  }, [selectedNodeId, nodes, roadmap, progressMap]);

  // Calculate completion stats
  const completedCount = Object.values(progressMap).filter(Boolean).length;
  const totalNodes = nodes.length;
  const completionPercent =
    totalNodes > 0 ? Math.round((completedCount / totalNodes) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-violet-400 mx-auto" />
          <p className="mt-4 text-slate-400">Loading your roadmap...</p>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400">Roadmap not found.</p>
          <Link
            href="/dashboard"
            className="mt-4 inline-flex items-center gap-2 text-violet-400 hover:text-violet-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-slate-950">
      <Navbar />

      {/* Top bar with roadmap info */}
      <div className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-sm pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <Link
                href="/dashboard"
                className="shrink-0 rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-800 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-white truncate">
                  {roadmap.title}
                </h1>
                <p className="text-sm text-slate-500 truncate">
                  {roadmap.description}
                </p>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-violet-400" />
                <span className="text-sm text-slate-400">
                  {completedCount}/{totalNodes} completed
                </span>
              </div>
              <div className="w-32 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-violet-400">
                {completionPercent}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* React Flow Graph */}
      <div className="flex-1 relative">
        <RoadmapGraph
          nodesData={nodes}
          roadmapData={roadmap.roadmapData}
          progressMap={progressMap}
          onToggleComplete={handleToggleComplete}
          onNodeClick={handleNodeClick}
        />
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        node={getSelectedNodeData()}
        onToggleComplete={handleToggleComplete}
      />
    </div>
  );
}
