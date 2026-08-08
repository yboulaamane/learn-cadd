import type { Metadata } from "next";

// Kept in sync with the matching entry in src/lib/curriculum.ts.
export const metadata: Metadata = {
  title: "Molecular Mechanics & Force Fields",
  description: "Master the physics engine behind docking and MD: the force field energy decomposition, bonded and non-bonded terms, parameterization, energy minimization, and conformational analysis.",
  openGraph: {
    title: "Module 4: Molecular Mechanics & Force Fields — Learn CADD",
    description: "Master the physics engine behind docking and MD: the force field energy decomposition, bonded and non-bonded terms, parameterization, energy minimization, and conformational analysis.",
    siteName: "Learn CADD",
    type: "article",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
