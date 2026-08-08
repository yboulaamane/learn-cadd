import type { Metadata } from "next";

// Kept in sync with the matching entry in src/lib/curriculum.ts.
export const metadata: Metadata = {
  title: "In Silico ADMET & Safety Assessment",
  description: "Profile oral drug-likeness with Lipinski's Rule of Five and Veber's rules, then predict cardiotoxicity (hERG), hepatotoxicity (DILI), and mutagenicity (Ames) using machine learning, interpreting alerts with SHAP explainability.",
  openGraph: {
    title: "Module 12: In Silico ADMET & Safety Assessment — Learn CADD",
    description: "Profile oral drug-likeness with Lipinski's Rule of Five and Veber's rules, then predict cardiotoxicity (hERG), hepatotoxicity (DILI), and mutagenicity (Ames) using machine learning, interpreting alerts with SHAP explainability.",
    siteName: "Learn CADD",
    type: "article",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
