import type { Metadata } from "next";

// Kept in sync with the matching entry in src/lib/curriculum.ts.
export const metadata: Metadata = {
  title: "Protein, Antibody & Protein-Protein Modeling",
  description: "Model flexible protein interfaces, antibody paratopes, multispecific architectures, and developability risks using ensemble and evidence-driven methods.",
  openGraph: {
    title: "Module 16: Protein, Antibody & Protein-Protein Modeling — Learn CADD",
    description: "Model flexible protein interfaces, antibody paratopes, multispecific architectures, and developability risks using ensemble and evidence-driven methods.",
    siteName: "Learn CADD",
    type: "article",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
