import type { Metadata } from "next";

// Kept in sync with the matching entry in src/lib/curriculum.ts.
export const metadata: Metadata = {
  title: "Structural Bioinformatics & Molecular Visualization",
  description: "Connect sequence to structural hierarchy, then select, interpret, prepare, and validate experimental, predicted, or comparative biomolecular structures using PDB/mmCIF records and molecular viewers.",
  openGraph: {
    title: "Module 13: Structural Bioinformatics & Molecular Visualization — Learn CADD",
    description: "Connect sequence to structural hierarchy, then select, interpret, prepare, and validate experimental, predicted, or comparative biomolecular structures using PDB/mmCIF records and molecular viewers.",
    siteName: "Learn CADD",
    type: "article",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
