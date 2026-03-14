"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { Map, Sparkles } from "lucide-react";

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
            <Map className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            RoadmapAI
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
              >
                <Sparkles className="h-4 w-4" />
                Dashboard
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8 ring-2 ring-slate-700",
                  },
                }}
              />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40 hover:brightness-110"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
