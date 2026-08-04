import type { Metadata } from "next";
import Link from "next/link";
import { curriculum } from "@/lib/curriculum";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  const coreModules = curriculum.filter((module) => module.track !== "extension");
  const extensionModules = curriculum.filter((module) => module.track === "extension");

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-16 text-center">
         <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Learn Computer-Aided Drug Design from First Principles
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
          An interactive, visual guide to CADD — from biological evidence and the physics of binding to generative design, DMPK, and reproducible workflows.
        </p>
        <div className="mx-auto mt-6 max-w-md rounded-lg border border-accent/20 bg-accent/5 px-5 py-3 text-sm">
          <p className="mt-1 text-slate-600">
            Follow 12 core modules, then apply them through structural bioinformatics, workflow automation, pharmacokinetics, protein modeling, and systems biology.
          </p>
        </div>
        <Link
          href="/intro-to-drug-discovery"
          className="mt-8 inline-block rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-dark"
        >
          Start Learning
        </Link>
      </div>

      <section>
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Core curriculum</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">CADD from first principles</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Build the conceptual foundation before moving into tool-specific and cross-disciplinary practice.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {coreModules.map((ch, index) => (
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
                  <p className="mt-0.5 text-sm text-slate-600 leading-relaxed">
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
      </section>

      <section className="mt-14 border-t border-border pt-12">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Applied extensions</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">From concepts to research practice</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            These modules cover the structural, computational, pharmacokinetic, biologics, and systems-level material used in real projects.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {extensionModules.map((ch) => {
            const index = curriculum.indexOf(ch);
            return (
              <Link
                key={ch.slug}
                href={`/${ch.slug}`}
                className="group rounded-xl border border-blue-200 bg-blue-50/30 p-5 shadow-sm transition-all hover:border-accent/40 hover:bg-blue-50/60 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 font-mono text-xs font-bold text-accent group-hover:bg-accent/15">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground group-hover:text-accent-dark">
                      {ch.title.split(/ — |: /).slice(1).join(": ") || ch.title}
                    </h3>
                    <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{ch.description}</p>
                    <span className="mt-2.5 inline-flex items-center rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200">
                      {ch.duration}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
