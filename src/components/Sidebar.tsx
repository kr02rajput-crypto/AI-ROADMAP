"use client";

import {
  X,
  ExternalLink,
  Youtube,
  Globe,
  FileText,
  FolderKanban,
  BookOpen,
  Zap,
  Trophy,
  CheckCircle2,
  Circle,
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  url: string;
  type: string;
}

interface Project {
  title: string;
  description: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  node: {
    id: string;
    dbNodeId: string;
    title: string;
    description: string;
    difficulty: string;
    resources: Resource[];
    projects: Project[];
    completed: boolean;
  } | null;
  onToggleComplete: (nodeId: string) => void;
}

const difficultyConfig: Record<
  string,
  { color: string; bg: string; icon: React.ReactNode; label: string }
> = {
  Beginner: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    icon: <BookOpen className="h-4 w-4" />,
    label: "Beginner",
  },
  Intermediate: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    icon: <Zap className="h-4 w-4" />,
    label: "Intermediate",
  },
  Advanced: {
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    icon: <Trophy className="h-4 w-4" />,
    label: "Advanced",
  },
};

function getResourceConfig(type: string) {
  switch (type.toLowerCase()) {
    case "wikipedia":
      return {
        icon: <Globe className="h-5 w-5" />,
        colorClass: "text-blue-400",
        bgClass: "bg-blue-500/10",
        borderClass: "hover:border-blue-500/30",
        hoverBgClass: "hover:bg-blue-500/5",
      };
    case "article":
      return {
        icon: <FileText className="h-5 w-5" />,
        colorClass: "text-emerald-400",
        bgClass: "bg-emerald-500/10",
        borderClass: "hover:border-emerald-500/30",
        hoverBgClass: "hover:bg-emerald-500/5",
      };
    case "youtube":
    default:
      return {
        icon: <Youtube className="h-5 w-5" />,
        colorClass: "text-red-500",
        bgClass: "bg-red-500/10",
        borderClass: "hover:border-red-500/30",
        hoverBgClass: "hover:bg-red-500/5",
      };
  }
}

export default function Sidebar({
  isOpen,
  onClose,
  node,
  onToggleComplete,
}: SidebarProps) {
  if (!node) return null;

  const config = difficultyConfig[node.difficulty] || difficultyConfig.Beginner;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform border-l border-slate-800 bg-slate-950/95 backdrop-blur-xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-white">{node.title}</h2>
                <div
                  className={`mt-2 inline-flex items-center gap-1.5 rounded-full ${config.bg} px-3 py-1`}
                >
                  {config.icon}
                  <span className={`text-xs font-medium ${config.color}`}>
                    {config.label}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Completion toggle */}
            <button
              onClick={() => onToggleComplete(node.dbNodeId)}
              className={`mt-4 flex w-full items-center gap-3 rounded-xl border ${
                node.completed
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : "border-slate-700 bg-slate-800/50"
              } px-4 py-3 transition-all hover:border-emerald-500/50`}
            >
              {node.completed ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <Circle className="h-5 w-5 text-slate-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  node.completed ? "text-emerald-300" : "text-slate-300"
                }`}
              >
                {node.completed ? "Completed" : "Mark as completed"}
              </span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-5 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Description
              </h3>
              <p className="text-sm leading-relaxed text-slate-300">
                {node.description}
              </p>
            </div>

            {/* Resources */}
            {node.resources && node.resources.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                  Learning Resources
                </h3>
                <div className="space-y-2">
                  {node.resources.map((resource, idx) => {
                    const rc = getResourceConfig(resource.type);
                    return (
                      <a
                        key={resource.id || idx}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-3 transition-all ${rc.borderClass} ${rc.hoverBgClass} group`}
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${rc.bgClass} ${rc.colorClass}`}
                        >
                          {rc.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-300 truncate group-hover:text-white">
                            {resource.title}
                          </p>
                          <p className="text-xs text-slate-600 capitalize">
                            {resource.type}
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 shrink-0 text-slate-600 group-hover:text-slate-400" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Projects */}
            {node.projects && node.projects.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                  Practice Projects
                </h3>
                <div className="space-y-2">
                  {node.projects.map((project, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-800 bg-slate-900/50 p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <FolderKanban className="h-4 w-4 text-violet-400" />
                        <p className="text-sm font-semibold text-white">
                          {project.title}
                        </p>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
