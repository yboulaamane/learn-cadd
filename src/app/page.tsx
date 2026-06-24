import type { Metadata } from "next";
import Link from "next/link";
import { curriculum } from "@/lib/curriculum";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-16 text-center">
         <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Learn Computational Drug Discovery Layer by Layer
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
          An interactive, visual, first-principles guide to computational drug discovery.
        </p>
        <div className="mx-auto mt-6 max-w-md rounded-lg border border-accent/20 bg-accent/5 px-5 py-3 text-sm">
          <p className="mt-1 text-slate-650">
            Explore biochemical binding, molecular docking, and QSAR machine learning models through hands-on virtual sandbox playgrounds.
          </p>
        </div>
        <Link
          href="/intro-to-drug-discovery"
          className="mt-8 inline-block rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-dark"
        >
          Start Learning
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {curriculum.map((ch, index) => (
          <Link
            key={ch.slug}
            href={`/${ch.slug}`}
            className="group rounded-xl border border-border bg-white p-5 shadow-sm transition-all hover:border-accent/30 hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 font-mono text-xs font-bold text-accent group-hover:bg-accent/15">
                {index + 1}
              </span>
              <div className="min-w-0">
                <h2 className="font-semibold text-foreground group-hover:text-accent-dark">
                  {ch.title.split(/ — |: /).slice(1).join(": ") || ch.title}
                </h2>
                <p className="mt-0.5 text-sm text-slate-650 leading-relaxed">
                  {ch.description}
                </p>
                <span className="mt-2.5 inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200">
                  {ch.duration}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
