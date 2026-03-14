"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import PromptBox from "@/components/PromptBox";
import RoadmapCard from "@/components/RoadmapCard";
import { Map, Loader2 } from "lucide-react";

interface Roadmap {
  id: string;
  title: string;
  description: string | null;
  prompt: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoadmaps() {
      try {
        const res = await fetch("/api/roadmaps");
        if (res.ok) {
          const data = await res.json();
          setRoadmaps(data.roadmaps);
        }
      } catch (err) {
        console.error("Failed to fetch roadmaps:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRoadmaps();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Generate a{" "}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Learning Roadmap
            </span>
          </h1>
          <p className="mt-3 text-slate-400">
            Describe what you want to learn and AI will create a personalized
            roadmap for you.
          </p>
        </div>

        {/* Prompt Box */}
        <PromptBox />

        {/* Saved Roadmaps */}
        <div className="mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Map className="h-5 w-5 text-violet-400" />
            <h2 className="text-xl font-bold text-white">Your Roadmaps</h2>
            {roadmaps.length > 0 && (
              <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-400">
                {roadmaps.length}
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
            </div>
          ) : roadmaps.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 py-16 text-center">
              <Map className="mx-auto h-12 w-12 text-slate-700 mb-4" />
              <p className="text-slate-500 text-sm">
                No roadmaps yet. Generate your first one above!
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {roadmaps.map((roadmap) => (
                <RoadmapCard
                  key={roadmap.id}
                  id={roadmap.id}
                  title={roadmap.title}
                  description={roadmap.description}
                  prompt={roadmap.prompt}
                  createdAt={roadmap.createdAt}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
