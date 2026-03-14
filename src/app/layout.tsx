import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "RoadmapAI — AI-Powered Learning Roadmaps",
  description:
    "Generate interactive learning roadmaps using AI. Type what you want to learn and get a structured path with resources, projects, and progress tracking.",
  keywords: ["roadmap", "learning", "AI", "education", "React", "programming"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#7c3aed",
          colorBackground: "#0f172a",
          colorInputBackground: "#1e293b",
          colorInputText: "#f1f5f9",
        },
      }}
    >
      <html lang="en" className="dark">
        <body className={`${inter.variable} font-sans`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
