"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { CheckCircle2, Circle, BookOpen, Zap, Trophy } from "lucide-react";

interface NodeData {
  label: string;
  difficulty: string;
  completed: boolean;
  onToggleComplete: (nodeId: string) => void;
  onNodeClick: (nodeId: string) => void;
  dbNodeId: string;
}

const difficultyConfig: Record<
  string,
  { color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  Beginner: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    icon: <BookOpen className="h-3 w-3" />,
  },
  Intermediate: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: <Zap className="h-3 w-3" />,
  },
  Advanced: {
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    icon: <Trophy className="h-3 w-3" />,
  },
};

function NodeCard({ data, id }: NodeProps<NodeData>) {
  const config = difficultyConfig[data.difficulty] || difficultyConfig.Beginner;

  return (
    <div
      className={`group relative min-w-[200px] max-w-[260px] cursor-pointer rounded-xl border ${
        data.completed
          ? "border-emerald-500/40 bg-emerald-500/5"
          : "border-slate-700/50 bg-slate-900/90"
      } p-4 shadow-xl backdrop-blur-sm transition-all duration-200 hover:border-violet-500/50 hover:shadow-violet-500/10 hover:scale-[1.02]`}
      onClick={() => data.onNodeClick(id)}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-violet-500 !border-0"
      />

      <div className="flex items-start gap-3">
        {/* Completion toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            data.onToggleComplete(data.dbNodeId);
          }}
          className="mt-0.5 shrink-0 transition-transform hover:scale-110"
        >
          {data.completed ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          ) : (
            <Circle className="h-5 w-5 text-slate-600 hover:text-slate-400" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3
            className={`text-sm font-semibold leading-tight ${
              data.completed
                ? "text-emerald-300 line-through opacity-70"
                : "text-white"
            }`}
          >
            {data.label}
          </h3>

          {/* Difficulty badge */}
          <div
            className={`mt-2 inline-flex items-center gap-1 rounded-full ${config.bg} ${config.border} border px-2 py-0.5`}
          >
            {config.icon}
            <span className={`text-[10px] font-medium ${config.color}`}>
              {data.difficulty}
            </span>
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-cyan-500 !border-0"
      />
    </div>
  );
}

export default memo(NodeCard);
