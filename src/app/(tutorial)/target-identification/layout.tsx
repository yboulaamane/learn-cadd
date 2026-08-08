import type { Metadata } from "next";

// Kept in sync with the matching entry in src/lib/curriculum.ts.
export const metadata: Metadata = {
  title: "Target Identification, Validation & Druggability",
  description: "Choose the right target before modelling anything. Explore target classes, the evidence chain for target validation, binding-site detection, druggability scoring, and polypharmacology.",
  openGraph: {
    title: "Module 2: Target Identification, Validation & Druggability — Learn CADD",
    description: "Choose the right target before modelling anything. Explore target classes, the evidence chain for target validation, binding-site detection, druggability scoring, and polypharmacology.",
    siteName: "Learn CADD",
    type: "article",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
