import type { Metadata } from "next";

// Kept in sync with the matching entry in src/lib/curriculum.ts.
export const metadata: Metadata = {
  title: "Pharmacophore Modeling",
  description: "Define pharmacophore features, distinguish ligand-based vs. structure-based models, and explore scaffold hopping.",
  openGraph: {
    title: "Module 7: Pharmacophore Modeling — Learn CADD",
    description: "Define pharmacophore features, distinguish ligand-based vs. structure-based models, and explore scaffold hopping.",
    siteName: "Learn CADD",
    type: "article",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
