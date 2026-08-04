import type { ReactNode } from "react";
import { CollapsibleCode } from "@/components/CollapsibleCode";
import { Quiz, type Question } from "@/components/Quiz";

interface LessonCard {
  title: string;
  description: string;
  items?: string[];
}

interface LessonStep {
  title: string;
  description: string;
}

interface LessonTable {
  headers: string[];
  rows: string[][];
}

export interface LessonSection {
  title: string;
  paragraphs?: string[];
  cards?: LessonCard[];
  steps?: LessonStep[];
  table?: LessonTable;
  note?: string;
  code?: {
    title: string;
    value: string;
  };
}

interface ExtensionLessonProps {
  moduleNumber: number;
  title: string;
  summary: string;
  outcomes: string[];
  playground?: ReactNode;
  sections: LessonSection[];
  questions: Question[];
}

export function ExtensionLesson({
  moduleNumber,
  title,
  summary,
  outcomes,
  playground,
  sections,
  questions,
}: ExtensionLessonProps) {
  return (
    <>
      <header className="mb-10 space-y-4">
        <div className="not-prose inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 ring-1 ring-inset ring-blue-200">
          Applied extension
        </div>
        <h1>
          Module {moduleNumber}: {title}
        </h1>
        <p className="lead text-slate-700">{summary}</p>

        <div className="not-prose rounded-xl border border-blue-200 bg-blue-50/60 p-5">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-blue-900">
            Learning outcomes
          </h2>
          <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-slate-800 sm:grid-cols-2">
            {outcomes.map((outcome) => (
              <li key={outcome} className="flex gap-2">
                <span aria-hidden="true" className="mt-1 text-blue-600">
                  ✓
                </span>
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {playground}

      {sections.map((section, sectionIndex) => (
        <section key={section.title} className="space-y-4">
          <h2>
            {sectionIndex + 1}. {section.title}
          </h2>

          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          {section.cards && (
            <div className="not-prose grid gap-4 md:grid-cols-2">
              {section.cards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <h3 className="text-sm font-extrabold text-slate-950">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{card.description}</p>
                  {card.items && (
                    <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-slate-700">
                      {card.items.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span aria-hidden="true" className="text-blue-500">
                            •
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          )}

          {section.steps && (
            <ol className="not-prose space-y-3">
              {section.steps.map((step, stepIndex) => (
                <li
                  key={step.title}
                  className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 font-mono text-xs font-bold text-white">
                    {stepIndex + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-950">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-700">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}

          {section.table && (
            <div className="not-prose overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {section.table.headers.map((header) => (
                      <th
                        key={header}
                        className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wide text-slate-700"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {section.table.rows.map((row) => (
                    <tr key={row.join("|")}>
                      {row.map((cell, cellIndex) => (
                        <td
                          key={`${cellIndex}-${cell}`}
                          className={`px-4 py-3 align-top leading-relaxed text-slate-700 ${
                            cellIndex === 0 ? "font-bold text-slate-950" : ""
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {section.code && (
            <CollapsibleCode title={section.code.title} code={section.code.value} />
          )}

          {section.note && (
            <aside className="not-prose rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
              <strong>Practical checkpoint:</strong> {section.note}
            </aside>
          )}
        </section>
      ))}

      <section className="space-y-5">
        <h2>Knowledge check</h2>
        <Quiz moduleTitle={title} questions={questions} />
      </section>
    </>
  );
}
