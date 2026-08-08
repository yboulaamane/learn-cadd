import type { Metadata } from "next";

// Kept in sync with the matching entry in src/lib/curriculum.ts.
export const metadata: Metadata = {
  title: "Applied CADD Workflows & Reproducibility",
  description: "Build auditable chemical-data, docking, MD, ML, KNIME, Python, and HPC pipelines with explicit provenance, validation, and failure checks.",
  openGraph: {
    title: "Module 14: Applied CADD Workflows & Reproducibility — Learn CADD",
    description: "Build auditable chemical-data, docking, MD, ML, KNIME, Python, and HPC pipelines with explicit provenance, validation, and failure checks.",
    siteName: "Learn CADD",
    type: "article",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
