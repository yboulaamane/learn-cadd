import type { Metadata } from "next";

// Kept in sync with the matching entry in src/lib/curriculum.ts.
export const metadata: Metadata = {
  title: "Bioinformatics & Systems Biology Foundations",
  description: "Integrate omics, interaction networks, pathways, perturbation data, and chemical-biology evidence into target selection and CADD project design.",
  openGraph: {
    title: "Module 17: Bioinformatics & Systems Biology Foundations — Learn CADD",
    description: "Integrate omics, interaction networks, pathways, perturbation data, and chemical-biology evidence into target selection and CADD project design.",
    siteName: "Learn CADD",
    type: "article",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
