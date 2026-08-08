import type { Metadata } from "next";

// Kept in sync with the matching entry in src/lib/curriculum.ts.
export const metadata: Metadata = {
  title: "Molecular Docking",
  description: "Understand conformational search algorithms, scoring functions, pose validation, covalent docking, PROTAC ternary complexes, and receptor flexibility.",
  openGraph: {
    title: "Module 6: Molecular Docking — Learn CADD",
    description: "Understand conformational search algorithms, scoring functions, pose validation, covalent docking, PROTAC ternary complexes, and receptor flexibility.",
    siteName: "Learn CADD",
    type: "article",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
