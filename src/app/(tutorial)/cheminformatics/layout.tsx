import type { Metadata } from "next";

// Kept in sync with the matching entry in src/lib/curriculum.ts.
export const metadata: Metadata = {
  title: "Cheminformatics & Molecular Representations",
  description: "Master chemical graph representation, SMILES/SMARTS/InChI, fingerprints and similarity, matched molecular pairs, activity cliffs, bioisosteres, and chemical-data standardization.",
  openGraph: {
    title: "Module 5: Cheminformatics & Molecular Representations — Learn CADD",
    description: "Master chemical graph representation, SMILES/SMARTS/InChI, fingerprints and similarity, matched molecular pairs, activity cliffs, bioisosteres, and chemical-data standardization.",
    siteName: "Learn CADD",
    type: "article",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
