import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Sparkles,
  Map,
  BookOpen,
  BarChart3,
  ArrowRight,
  Zap,
  CheckCircle2,
  Youtube,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-32">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl animate-glow" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-cyan-600/10 blur-3xl animate-glow [animation-delay:1.5s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-violet-600/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 mb-8">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span className="text-sm font-medium text-violet-300">
              AI-Powered Learning Paths
            </span>
          </div>

          {/* Heading */}
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Your Learning Journey,{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Powered by AI
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">
            Type what you want to learn and get an interactive roadmap with
            curated resources, hands-on projects, and progress tracking — all
            generated in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 px-8 py-3.5 text-base font-semibold text-white shadow-2xl shadow-violet-500/25 transition-all hover:shadow-violet-500/40 hover:brightness-110"
            >
              Start Learning Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-800 hover:text-white"
            >
              Go to Dashboard
            </Link>
          </div>

          {/* Demo preview */}
          <div className="mt-20 mx-auto max-w-4xl">
            <div className="relative rounded-2xl border border-slate-800 bg-slate-900/50 p-2 shadow-2xl">
              <div className="rounded-xl border border-slate-800/50 bg-slate-950 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <div className="ml-4 flex-1 rounded-lg bg-slate-800 px-4 py-1.5">
                    <span className="text-xs text-slate-500">
                      roadmapai.dev/dashboard
                    </span>
                  </div>
                </div>

                {/* Simulated flowchart */}
                <div className="flex flex-col items-center gap-4">
                  <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 px-6 py-3 text-sm font-medium text-violet-300">
                    🚀 React Fundamentals
                  </div>
                  <div className="h-6 w-0.5 bg-violet-500/30" />
                  <div className="flex gap-8">
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-2.5 text-sm font-medium text-emerald-300">
                      ✅ JSX & Components
                    </div>
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-2.5 text-sm font-medium text-amber-300">
                      ⚡ Hooks & State
                    </div>
                  </div>
                  <div className="h-6 w-0.5 bg-violet-500/30" />
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-6 py-3 text-sm font-medium text-rose-300">
                    🏆 Advanced Patterns
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                learn smarter
              </span>
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              AI-generated roadmaps with real resources and hands-on projects.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Zap className="h-6 w-6" />,
                title: "AI-Powered Generation",
                description:
                  "Type any topic and get a structured learning path in seconds with the power of advanced AI.",
                gradient: "from-violet-500 to-fuchsia-500",
              },
              {
                icon: <Map className="h-6 w-6" />,
                title: "Interactive Flowcharts",
                description:
                  "Visualize your learning journey with interactive, draggable flowchart nodes.",
                gradient: "from-cyan-500 to-blue-500",
              },
              {
                icon: <Youtube className="h-6 w-6" />,
                title: "Curated Resources",
                description:
                  "Each topic comes with handpicked YouTube tutorials and learning materials.",
                gradient: "from-red-500 to-rose-500",
              },
              {
                icon: <BookOpen className="h-6 w-6" />,
                title: "Practice Projects",
                description:
                  "Reinforce each topic with suggested hands-on projects and exercises.",
                gradient: "from-amber-500 to-orange-500",
              },
              {
                icon: <CheckCircle2 className="h-6 w-6" />,
                title: "Progress Tracking",
                description:
                  "Mark topics as complete and track your learning progress over time.",
                gradient: "from-emerald-500 to-green-500",
              },
              {
                icon: <BarChart3 className="h-6 w-6" />,
                title: "Saved Roadmaps",
                description:
                  "All your roadmaps are saved to your account for easy access anytime.",
                gradient: "from-indigo-500 to-violet-500",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-800/50 bg-slate-900/30 p-6 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/50"
              >
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                  }}
                />
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/50 to-slate-900/80 p-12 sm:p-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to start learning?
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              Join thousands of learners using AI-powered roadmaps to master new
              skills faster.
            </p>
            <Link
              href="/sign-up"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 px-10 py-4 text-base font-semibold text-white shadow-2xl shadow-violet-500/25 transition-all hover:shadow-violet-500/40 hover:brightness-110"
            >
              Create Free Account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500">
                <Map className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                RoadmapAI
              </span>
            </div>
            <p className="text-sm text-slate-600">
              © {new Date().getFullYear()} RoadmapAI. Built with AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
