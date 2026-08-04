"use client";

import { useMemo, useState } from "react";

type EvidenceKey = "genetics" | "perturbation" | "expression" | "chemical" | "structure" | "safety";
type EvidenceInputs = Record<EvidenceKey, number>;

interface EvidenceDimension {
  key: EvidenceKey;
  label: string;
  question: string;
  weight: number;
  nextExperiment: string;
}

const LEVELS = ["Absent", "Indirect", "Moderate", "Strong"];

const DIMENSIONS: EvidenceDimension[] = [
  {
    key: "genetics",
    label: "Human genetics",
    question: "Do variants support the target and direction of modulation?",
    weight: 1.25,
    nextExperiment: "Resolve the causal gene and modulation direction with fine-mapping or functional variant studies.",
  },
  {
    key: "perturbation",
    label: "Functional perturbation",
    question: "Do genetic or chemical perturbations change the disease phenotype?",
    weight: 1.25,
    nextExperiment: "Test rescue and dose-dependent perturbation in a disease-relevant model.",
  },
  {
    key: "expression",
    label: "Cell-state relevance",
    question: "Is the target present and altered in the relevant cell type and condition?",
    weight: 0.75,
    nextExperiment: "Confirm target abundance and state in the relevant cells using an orthogonal protein-level assay.",
  },
  {
    key: "chemical",
    label: "Chemical tractability",
    question: "Do selective ligands or convincing chemical starting points exist?",
    weight: 1,
    nextExperiment: "Generate an orthogonal chemical probe or validate engagement with a direct biophysical assay.",
  },
  {
    key: "structure",
    label: "Structural tractability",
    question: "Is a relevant pocket, interface, or ligandable state supported?",
    weight: 0.75,
    nextExperiment: "Obtain or validate a task-relevant structure and assess pocket conservation and flexibility.",
  },
  {
    key: "safety",
    label: "Safety margin evidence",
    question: "Do tissue, phenotype, and selectivity data support a usable safety window?",
    weight: 1,
    nextExperiment: "Profile essential tissues, paralogs, liabilities, and on-target phenotypes before lead expansion.",
  },
];

const DEFAULT_INPUTS: EvidenceInputs = {
  genetics: 2,
  perturbation: 2,
  expression: 2,
  chemical: 2,
  structure: 2,
  safety: 1,
};

const PRESETS: Record<string, EvidenceInputs> = {
  "Genetic signal only": {
    genetics: 3,
    perturbation: 1,
    expression: 2,
    chemical: 0,
    structure: 1,
    safety: 1,
  },
  "Triangulated target": {
    genetics: 3,
    perturbation: 3,
    expression: 2,
    chemical: 3,
    structure: 2,
    safety: 2,
  },
  "Tractable, weak biology": {
    genetics: 0,
    perturbation: 1,
    expression: 2,
    chemical: 3,
    structure: 3,
    safety: 2,
  },
};

export function TargetEvidencePlayground() {
  const [inputs, setInputs] = useState<EvidenceInputs>(DEFAULT_INPUTS);

  const assessment = useMemo(() => {
    const maximum = DIMENSIONS.reduce((sum, dimension) => sum + dimension.weight * 3, 0);
    const observed = DIMENSIONS.reduce(
      (sum, dimension) => sum + inputs[dimension.key] * dimension.weight,
      0,
    );
    const score = Math.round((observed / maximum) * 100);
    const causalEvidence = Math.min(inputs.genetics, inputs.perturbation);
    const tractability = Math.max(inputs.chemical, inputs.structure);

    let status = "Promising, conditional";
    let summary = "The evidence is useful, but the target hypothesis still depends on one or more untested assumptions.";

    if (causalEvidence <= 1) {
      status = "Causal evidence gap";
      summary = "Tractability cannot compensate for weak evidence that modulating this target changes disease biology.";
    } else if (tractability <= 1) {
      status = "Tractability gap";
      summary = "The biological case is developing, but a credible modality, binding site, or chemical starting point is missing.";
    } else if (inputs.safety <= 1) {
      status = "Safety uncertainty";
      summary = "The target may be biologically and chemically promising, but the therapeutic window is not yet supported.";
    } else if (score >= 75 && causalEvidence >= 2) {
      status = "Triangulated hypothesis";
      summary = "Independent evidence types converge, making this a stronger candidate for milestone-driven CADD work.";
    }

    const priorities = [...DIMENSIONS]
      .sort((first, second) => {
        const levelDifference = inputs[first.key] - inputs[second.key];
        return levelDifference !== 0 ? levelDifference : second.weight - first.weight;
      })
      .slice(0, 2);

    return { score, status, summary, priorities };
  }, [inputs]);

  return (
    <section className="not-prose mb-10 space-y-5 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm sm:p-6">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-wider text-blue-700">Interactive evidence exercise</p>
        <h2 className="mt-1 text-lg font-extrabold text-slate-950">Would you advance this target?</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-700">
          Grade each independent evidence stream. Watch how a chemically tractable target can still
          fail when disease causality or safety remains weak.
        </p>
      </div>

      <div className="flex flex-wrap gap-2" aria-label="Target evidence presets">
        {Object.entries(PRESETS).map(([name, preset]) => (
          <button
            key={name}
            type="button"
            onClick={() => setInputs(preset)}
            className="rounded-full border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-800 transition hover:border-blue-400 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {name}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
        <div className="space-y-3">
          {DIMENSIONS.map((dimension) => (
            <div key={dimension.key} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <label htmlFor={`evidence-${dimension.key}`} className="text-sm font-extrabold text-slate-950">
                    {dimension.label}
                  </label>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">{dimension.question}</p>
                </div>
                <output
                  htmlFor={`evidence-${dimension.key}`}
                  className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-extrabold text-blue-800"
                >
                  {LEVELS[inputs[dimension.key]]}
                </output>
              </div>
              <input
                id={`evidence-${dimension.key}`}
                type="range"
                min={0}
                max={3}
                step={1}
                value={inputs[dimension.key]}
                onChange={(event) => setInputs((current) => ({
                  ...current,
                  [dimension.key]: Number(event.target.value),
                }))}
                aria-describedby="target-evidence-boundary"
                className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
              />
              <div className="mt-1 flex justify-between text-[10px] font-bold uppercase tracking-wide text-slate-500" aria-hidden="true">
                <span>Absent</span><span>Indirect</span><span>Moderate</span><span>Strong</span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4" aria-live="polite">
          <div className="rounded-xl bg-slate-950 p-5 text-white shadow-sm">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Evidence readiness</p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <p className="text-xl font-black">{assessment.status}</p>
              <p className="font-mono text-3xl font-black text-blue-300">{assessment.score}<span className="text-base">/100</span></p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-700" aria-hidden="true">
              <div className="h-full rounded-full bg-blue-400 transition-[width]" style={{ width: `${assessment.score}%` }} />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-200">{assessment.summary}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-extrabold text-slate-950">Highest-value next experiments</h3>
            <ol className="mt-3 space-y-3">
              {assessment.priorities.map((priority, index) => (
                <li key={priority.key} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 font-mono text-xs font-bold text-blue-700">{index + 1}</span>
                  <span><strong className="text-slate-950">{priority.label}:</strong> {priority.nextExperiment}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-extrabold text-slate-950">Triangulation check</h3>
            <dl className="mt-3 space-y-2 text-sm">
              {[
                ["Disease causality", Math.min(inputs.genetics, inputs.perturbation)],
                ["Chemical or structural access", Math.max(inputs.chemical, inputs.structure)],
                ["Biological context", inputs.expression],
                ["Safety margin", inputs.safety],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3">
                  <dt className="text-slate-700">{label}</dt>
                  <dd className="font-bold text-slate-950">{LEVELS[value as number]}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <p id="target-evidence-boundary" className="rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-950 ring-1 ring-inset ring-amber-200">
        <strong>Model boundary:</strong> The weighted score is a teaching aid, not a probability of clinical success. Record the source, independence, quality, direction, and disease context of each evidence claim, then define experiments that could falsify the target hypothesis.
      </p>
    </section>
  );
}
