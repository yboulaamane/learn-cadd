import type { Metadata } from "next";

// Kept in sync with the matching entry in src/lib/curriculum.ts.
export const metadata: Metadata = {
  title: "Pharmacokinetics & DMPK",
  description: "Connect molecular properties to absorption, distribution, metabolism, excretion, exposure, clearance, dosing, and modality-aware PK design.",
  openGraph: {
    title: "Module 15: Pharmacokinetics & DMPK — Learn CADD",
    description: "Connect molecular properties to absorption, distribution, metabolism, excretion, exposure, clearance, dosing, and modality-aware PK design.",
    siteName: "Learn CADD",
    type: "article",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
