import type { Metadata } from "next";

// Kept in sync with the matching entry in src/lib/curriculum.ts.
export const metadata: Metadata = {
  title: "QSAR Modeling & AI Interpretation",
  description: "Learn Hansch and 3D-QSAR foundations, machine-learning workflows, imbalanced-class evaluation, applicability domains, model interpretation, and deep learning architectures.",
  openGraph: {
    title: "Module 9: QSAR Modeling & AI Interpretation — Learn CADD",
    description: "Learn Hansch and 3D-QSAR foundations, machine-learning workflows, imbalanced-class evaluation, applicability domains, model interpretation, and deep learning architectures.",
    siteName: "Learn CADD",
    type: "article",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
