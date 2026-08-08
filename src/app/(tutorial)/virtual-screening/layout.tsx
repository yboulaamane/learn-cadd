import type { Metadata } from "next";

// Kept in sync with the matching entry in src/lib/curriculum.ts.
export const metadata: Metadata = {
  title: "Virtual Screening Strategies",
  description: "Master ligand- and structure-based screening, database preparation, multi-stage cascades, assay-interference triage, and statistical evaluation.",
  openGraph: {
    title: "Module 8: Virtual Screening Strategies — Learn CADD",
    description: "Master ligand- and structure-based screening, database preparation, multi-stage cascades, assay-interference triage, and statistical evaluation.",
    siteName: "Learn CADD",
    type: "article",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
