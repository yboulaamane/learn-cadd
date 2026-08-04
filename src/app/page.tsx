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
    <main id="course-content" className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-12 text-center sm:mb-16">
         <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
          Learn Computer-Aided Drug Design from First Principles
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
          An interactive, visual guide to CADD — from biological evidence and the physics of binding to generative design, DMPK, and reproducible workflows.
        </p>
        <div className="mx-auto mt-6 max-w-xl rounded-xl border border-accent/20 bg-accent/5 px-5 py-4 text-base leading-relaxed">
          <p className="text-slate-700">
            Follow 12 core modules, then apply them through structural bioinformatics, workflow automation, pharmacokinetics, protein modeling, and systems biology.
          </p>
        </div>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link
            href="/intro-to-drug-discovery"
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-accent px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-accent-dark focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            Start from the beginning
          </Link>
          <Link
            href="#core-curriculum"
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            Browse the curriculum
          </Link>
        </div>
      </div>

      <section aria-labelledby="learning-path-heading" className="mb-14 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-7">
        <div className="mb-5 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Choose your path</p>
          <h2 id="learning-path-heading" className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            Learn at the level that fits you
          </h2>
          <p className="mt-2 text-base leading-relaxed text-slate-700">
            The same scientific content supports a guided first pass or a focused refresher.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-blue-200 bg-white p-5 shadow-sm">
            <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wide text-blue-800">
              New to CADD
            </span>
            <h3 className="mt-3 text-lg font-extrabold text-slate-950">Follow the core modules in order</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-slate-700">
              Use the default Learn view, pause at equations and worked examples, try each playground,
              and finish with the knowledge check before continuing.
            </p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wide text-slate-700">
              Refreshing concepts
            </span>
            <h3 className="mt-3 text-lg font-extrabold text-slate-950">Jump directly to the topic you need</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-slate-700">
              Switch lessons to Review view for faster scanning, use the playgrounds to test your
              intuition, then move into the applied extensions for research workflows.
            </p>
          </article>
        </div>
      </section>

      <section id="core-curriculum" className="scroll-mt-20">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Core curriculum</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">CADD from first principles</h2>
          <p className="mt-2 text-base leading-relaxed text-slate-600">
            Build the conceptual foundation before moving into tool-specific and cross-disciplinary practice.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {coreModules.map((ch, index) => (
            <Link
              key={ch.slug}
              href={`/${ch.slug}`}
              className="group rounded-xl border border-border bg-white p-5 shadow-sm transition-all hover:border-accent/30 hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 font-mono text-xs font-bold text-accent group-hover:bg-accent/15">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <h2 className="font-semibold text-foreground group-hover:text-accent-dark">
                    {ch.title.split(/ — |: /).slice(1).join(": ") || ch.title}
                  </h2>
                  <p className="mt-1 text-[0.9375rem] text-slate-600 leading-relaxed">
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
          <p className="mt-2 text-base leading-relaxed text-slate-600">
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
                className="group rounded-xl border border-blue-200 bg-blue-50/30 p-5 shadow-sm transition-all hover:border-accent/40 hover:bg-blue-50/60 hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 font-mono text-xs font-bold text-accent group-hover:bg-accent/15">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground group-hover:text-accent-dark">
                      {ch.title.split(/ — |: /).slice(1).join(": ") || ch.title}
                    </h3>
                    <p className="mt-1 text-[0.9375rem] leading-relaxed text-slate-600">{ch.description}</p>
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
