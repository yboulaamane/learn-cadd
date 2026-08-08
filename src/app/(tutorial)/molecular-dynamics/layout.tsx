import type { Metadata } from "next";

// Kept in sync with the matching entry in src/lib/curriculum.ts.
export const metadata: Metadata = {
  title: "Molecular Dynamics & Free Energy Methods",
  description: "Simulate time-dependent trajectories, analyze RMSD/RMSF/Rg/SASA, apply enhanced sampling, compute binding free energies with MM/GBSA and FEP, and explore machine-learned force fields.",
  openGraph: {
    title: "Module 10: Molecular Dynamics & Free Energy Methods — Learn CADD",
    description: "Simulate time-dependent trajectories, analyze RMSD/RMSF/Rg/SASA, apply enhanced sampling, compute binding free energies with MM/GBSA and FEP, and explore machine-learned force fields.",
    siteName: "Learn CADD",
    type: "article",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
