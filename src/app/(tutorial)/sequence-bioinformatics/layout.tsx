import type { Metadata } from "next";

// Kept in sync with the matching entry in src/lib/curriculum.ts.
export const metadata: Metadata = {
  title: "Sequence Bioinformatics & Evolution",
  description: "Interpret biological databases, pairwise and multiple alignments, BLAST searches, sequence profiles, phylogenetic trees, and genomic context for CADD decisions.",
  openGraph: {
    title: "Module 18: Sequence Bioinformatics & Evolution — Learn CADD",
    description: "Interpret biological databases, pairwise and multiple alignments, BLAST searches, sequence profiles, phylogenetic trees, and genomic context for CADD decisions.",
    siteName: "Learn CADD",
    type: "article",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
