"use client";

import Link from "next/link";
import { Map, Calendar, ArrowRight } from "lucide-react";

interface RoadmapCardProps {
  id: string;
  title: string;
  description?: string | null;
  prompt: string;
  createdAt: string;
}

export default function RoadmapCard({
  id,
  title,
  description,
  prompt,
  createdAt,
}: RoadmapCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link href={`/roadmap/${id}`} className="group block">
      <div className="relative overflow-hidden rounded-xl border border-slate-800/50 bg-slate-900/30 p-5 transition-all duration-300 hover:border-violet-500/30 hover:bg-slate-900/50 hover:shadow-xl hover:shadow-violet-500/5">
        {/* Gradient accent */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-violet-600 to-cyan-600 opacity-0 transition-opacity group-hover:opacity-100" />

        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400 transition-colors group-hover:bg-violet-500/20">
            <Map className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate group-hover:text-violet-300 transition-colors">
              {title}
            </h3>
            <p className="mt-1 text-sm text-slate-500 line-clamp-2">
              {description || prompt}
            </p>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Calendar className="h-3.5 w-3.5" />
                {formattedDate}
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-violet-400 opacity-0 transition-all group-hover:opacity-100">
                View
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
