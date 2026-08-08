import type { Metadata } from "next";

// Kept in sync with the matching entry in src/lib/curriculum.ts.
export const metadata: Metadata = {
  title: "De Novo & Generative Molecular Design",
  description: "Design molecules instead of searching for them. Master the three pillars of generative design — construction, scoring, and search — plus 3D diffusion models and multi-objective Pareto optimization.",
  openGraph: {
    title: "Module 11: De Novo & Generative Molecular Design — Learn CADD",
    description: "Design molecules instead of searching for them. Master the three pillars of generative design — construction, scoring, and search — plus 3D diffusion models and multi-objective Pareto optimization.",
    siteName: "Learn CADD",
    type: "article",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
