import Link from "next/link";
import { curriculum } from "@/lib/curriculum";
import { scientificPractice } from "@/lib/scientific-practice";

export function ScientificPractice({ moduleNumber }: { moduleNumber: number }) {
  const practice = scientificPractice[moduleNumber];
  if (!practice) return null;

  return (
    <section aria-label="Research decision checkpoint" className="not-prose my-8 space-y-4 rounded-xl border border-blue-200 bg-blue-50/50 p-5">
      <h2 className="text-base font-extrabold text-slate-950">Research decision checkpoint</h2>
      {practice.prerequisites.length > 0 ? (
        <p className="text-xs leading-relaxed text-slate-700">
          Helpful background:{" "}
          {practice.prerequisites.map((number, index) => (
            <span key={number}>
              {index > 0 ? " · " : ""}
              <Link href={`/${curriculum[number - 1].slug}`} className="underline underline-offset-2">
                {curriculum[number - 1].title}
              </Link>
            </span>
          ))}
        </p>
      ) : null}
      <p className="text-sm font-bold leading-relaxed text-slate-950">{practice.question}</p>
      <p className="text-sm leading-relaxed text-slate-700"><strong>Your output:</strong> {practice.output}</p>
      <details className="rounded-lg border border-blue-100 bg-white p-3">
        <summary className="cursor-pointer text-sm font-bold text-blue-800">Compare your reasoning</summary>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">{practice.reasoning}</p>
      </details>
      <p className="text-xs leading-relaxed text-slate-600">
        Evidence anchor: <a href={practice.source.url} target="_blank" rel="noreferrer" className="underline underline-offset-2">{practice.source.label}</a>.
        {" "}A first reading and this prompt do not replace a validated practical exercise.
      </p>
    </section>
  );
}
