import type { Metadata } from "next";

// Kept in sync with the matching entry in src/lib/curriculum.ts.
export const metadata: Metadata = {
  title: "Introduction to Drug Discovery",
  description: "Learn the stages of the drug discovery and development pipeline, key terminology (hit, lead, candidate), hit-finding strategies including DNA-encoded libraries, and the undruggable proteome.",
  openGraph: {
    title: "Module 1: Introduction to Drug Discovery — Learn CADD",
    description: "Learn the stages of the drug discovery and development pipeline, key terminology (hit, lead, candidate), hit-finding strategies including DNA-encoded libraries, and the undruggable proteome.",
    siteName: "Learn CADD",
    type: "article",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
