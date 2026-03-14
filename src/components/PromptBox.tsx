"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, Send } from "lucide-react";

export default function PromptBox() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate roadmap");
      }

      const data = await res.json();
      router.push(`/roadmap/${data.id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "I want to learn React",
    "Full-stack web development roadmap",
    "Machine Learning with Python",
    "DevOps and Cloud Engineering",
    "Mobile App Development with Flutter",
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/50 shadow-2xl shadow-violet-500/5 backdrop-blur-sm transition-all focus-within:border-violet-500/50 focus-within:shadow-violet-500/10">
          <div className="flex items-center gap-3 px-5 pt-5 pb-2">
            <Sparkles className="h-5 w-5 text-violet-400 shrink-0" />
            <span className="text-sm font-medium text-slate-400">
              What do you want to learn?
            </span>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder='e.g. "I want to learn React from scratch"'
            className="w-full resize-none bg-transparent px-5 py-3 text-base text-white placeholder-slate-600 outline-none min-h-[80px]"
            rows={3}
            disabled={loading}
          />
          <div className="flex items-center justify-between px-5 pb-4">
            <span className="text-xs text-slate-600">
              {prompt.length > 0 ? `${prompt.length} characters` : ""}
            </span>
            <button
              type="submit"
              disabled={!prompt.trim() || loading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-violet-500/25 disabled:hover:brightness-100"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Generate Roadmap
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Quick suggestions */}
      <div className="mt-6">
        <p className="text-xs font-medium text-slate-500 mb-3">
          Try these suggestions:
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setPrompt(s)}
              className="rounded-full border border-slate-700/50 bg-slate-800/50 px-3 py-1.5 text-xs text-slate-400 transition-all hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
