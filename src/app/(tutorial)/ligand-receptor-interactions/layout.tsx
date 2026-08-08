import type { Metadata } from "next";

// Kept in sync with the matching entry in src/lib/curriculum.ts.
export const metadata: Metadata = {
  title: "Fundamentals of Ligand-Receptor Interactions",
  description: "Explore the thermodynamic basis of binding, molecular recognition models, non-covalent interactions, and affinity-efficiency metrics used in medicinal chemistry.",
  openGraph: {
    title: "Module 3: Fundamentals of Ligand-Receptor Interactions — Learn CADD",
    description: "Explore the thermodynamic basis of binding, molecular recognition models, non-covalent interactions, and affinity-efficiency metrics used in medicinal chemistry.",
    siteName: "Learn CADD",
    type: "article",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
