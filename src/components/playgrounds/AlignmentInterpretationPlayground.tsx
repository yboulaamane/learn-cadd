"use client";

import { useMemo, useState } from "react";

type AnalysisTask = "structure" | "function" | "selectivity";

interface SequenceHit {
  id: string;
  name: string;
  relationship: string;
  identity: number;
  coverage: number;
  eValue: string;
  pocketConservation: number;
  architectureMatch: boolean;
  holo: boolean;
  curated: boolean;
  ortholog: boolean;
  sameSpeciesParalog: boolean;
}

const HITS: SequenceHit[] = [
  {
    id: "A",
    name: "Human paralog",
    relationship: "Same-family human protein",
    identity: 64,
    coverage: 92,
    eValue: "3 × 10⁻¹⁴⁰",
    pocketConservation: 87,
    architectureMatch: true,
    holo: false,
    curated: true,
    ortholog: false,
    sameSpeciesParalog: true,
  },
  {
    id: "B",
    name: "Ligand-bound template",
    relationship: "Experimentally solved homolog",
    identity: 46,
    coverage: 88,
    eValue: "4 × 10⁻¹⁰⁸",
    pocketConservation: 92,
    architectureMatch: true,
    holo: true,
    curated: true,
    ortholog: false,
    sameSpeciesParalog: false,
  },
  {
    id: "C",
    name: "Curated ortholog",
    relationship: "Full-length ortholog with known function",
    identity: 76,
    coverage: 97,
    eValue: "< 10⁻¹⁸⁰",
    pocketConservation: 82,
    architectureMatch: true,
    holo: false,
    curated: true,
    ortholog: true,
    sameSpeciesParalog: false,
  },
  {
    id: "D",
    name: "Domain-only hit",
    relationship: "Short conserved region",
    identity: 82,
    coverage: 21,
    eValue: "2 × 10⁻³⁴",
    pocketConservation: 18,
    architectureMatch: false,
    holo: false,
    curated: false,
    ortholog: false,
    sameSpeciesParalog: false,
  },
];

const TASKS: Record<AnalysisTask, { label: string; prompt: string }> = {
  structure: {
    label: "Choose a docking template",
    prompt: "Prioritize local pocket conservation, coverage, structural state, and architecture rather than identity alone.",
  },
  function: {
    label: "Transfer a function",
    prompt: "Prioritize full-length coverage, orthology, curated evidence, and matching domain architecture.",
  },
  selectivity: {
    label: "Assess selectivity risk",
    prompt: "Prioritize the same-species paralog with a conserved pocket that a ligand may also recognize.",
  },
};

function scoreHit(hit: SequenceHit, task: AnalysisTask) {
  if (task === "structure") {
    return (
      hit.identity * 0.15 +
      hit.coverage * 0.2 +
      hit.pocketConservation * 0.35 +
      (hit.architectureMatch ? 10 : 0) +
      (hit.holo ? 15 : 0) +
      (hit.curated ? 5 : 0)
    );
  }

  if (task === "function") {
    return (
      hit.identity * 0.3 +
      hit.coverage * 0.25 +
      (hit.architectureMatch ? 15 : 0) +
      (hit.curated ? 10 : 0) +
      (hit.ortholog ? 20 : 0)
    );
  }

  return (
    hit.identity * 0.2 +
    hit.coverage * 0.15 +
    hit.pocketConservation * 0.35 +
    (hit.architectureMatch ? 5 : 0) +
    (hit.sameSpeciesParalog ? 25 : 0)
  );
}

function rankHits(task: AnalysisTask) {
  return [...HITS]
    .map((hit) => ({ hit, score: Math.round(scoreHit(hit, task)) }))
    .sort((first, second) => second.score - first.score);
}

const RECOMMENDATIONS: Record<AnalysisTask, string> = {
  structure:
    "Hit B is preferred because its ligand-bound state and strong pocket coverage outweigh its lower global identity. Confirm local geometry and retrospective docking before prospective use.",
  function:
    "Hit C is preferred because it is a curated, full-length ortholog with matching architecture. Even then, confirm critical residues and experimental context before transferring a precise mechanism.",
  selectivity:
    "Hit A is the priority liability because it is a same-species paralog with high pocket conservation. Map the differing pocket residues and test selectivity experimentally.",
};

export function AlignmentInterpretationPlayground() {
  const [task, setTask] = useState<AnalysisTask>("structure");
  const [selectedHitId, setSelectedHitId] = useState("B");

  const rankedHits = useMemo(() => rankHits(task), [task]);
  const selectedRank = rankedHits.findIndex(({ hit }) => hit.id === selectedHitId);
  const selected = rankedHits[selectedRank] ?? rankedHits[0];

  const chooseTask = (nextTask: AnalysisTask) => {
    const bestHit = rankHits(nextTask)[0].hit;
    setTask(nextTask);
    setSelectedHitId(bestHit.id);
  };

  const observations = useMemo(() => {
    const notes: string[] = [];
    const hit = selected.hit;

    if (hit.coverage < 50) notes.push(`Only ${hit.coverage}% of the query aligns, so the high identity describes a short region.`);
    if (!hit.architectureMatch) notes.push("The full domain architecture does not match the query.");
    if (hit.pocketConservation < 60) notes.push("The task-relevant pocket is poorly covered or conserved.");
    if (task === "structure" && !hit.holo) notes.push("The available structure is not ligand-bound, so the pocket may require an alternative conformation.");
    if (task === "function" && !hit.ortholog) notes.push("This is not an established ortholog; family similarity alone does not justify detailed function transfer.");
    if (task === "selectivity" && !hit.sameSpeciesParalog) notes.push("This hit is not the nearest same-species paralog, so it is not the first selectivity comparator.");
    if (notes.length === 0) notes.push("The hit fits the selected task, but the computational ranking still requires structural or experimental validation.");

    return notes;
  }, [selected, task]);

  return (
    <section className="not-prose mb-10 space-y-5 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm dark:from-neutral-950 dark:to-black sm:p-6">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-wider text-blue-700">Interactive interpretation challenge</p>
        <h2 className="mt-1 text-lg font-extrabold text-slate-950">The best sequence hit depends on the CADD question</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-700">
          Switch tasks and compare four realistic-looking hits. The smallest E-value or highest
          identity is not automatically the best biological choice.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-3" role="group" aria-label="Sequence analysis task">
        {(Object.entries(TASKS) as [AnalysisTask, { label: string; prompt: string }][]).map(([value, details]) => (
          <button
            key={value}
            type="button"
            onClick={() => chooseTask(value)}
            aria-pressed={task === value}
            className={`rounded-xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              task === value
                ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-800 hover:border-blue-300 hover:bg-blue-50"
            }`}
          >
            <span className="block text-sm font-extrabold">{details.label}</span>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-relaxed text-blue-950">
        <strong>Decision rule:</strong> {TASKS[task].prompt}
      </div>

      <div className="grid gap-3 lg:grid-cols-2" aria-label="Candidate sequence hits">
        {rankedHits.map(({ hit, score }, index) => (
          <button
            key={hit.id}
            type="button"
            onClick={() => setSelectedHitId(hit.id)}
            aria-pressed={selectedHitId === hit.id}
            className={`rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              selectedHitId === hit.id
                ? "border-blue-500 bg-white shadow-md ring-1 ring-blue-200"
                : "border-slate-200 bg-white/80 hover:border-blue-300 hover:bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 font-mono text-xs font-black text-white">{hit.id}</span>
                  <h3 className="text-sm font-extrabold text-slate-950">{hit.name}</h3>
                  {index === 0 && <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-emerald-700">Best for task</span>}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{hit.relationship}</p>
              </div>
              <span className="rounded-lg bg-blue-50 px-2.5 py-1 font-mono text-sm font-black text-blue-800">{score}</span>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-4">
              <div><dt className="text-slate-500">Identity</dt><dd className="font-bold text-slate-950">{hit.identity}%</dd></div>
              <div><dt className="text-slate-500">Coverage</dt><dd className="font-bold text-slate-950">{hit.coverage}%</dd></div>
              <div><dt className="text-slate-500">Pocket</dt><dd className="font-bold text-slate-950">{hit.pocketConservation}%</dd></div>
              <div><dt className="text-slate-500">E-value</dt><dd className="font-bold text-slate-950">{hit.eValue}</dd></div>
            </dl>
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]" aria-live="polite">
        <div className="rounded-xl bg-slate-950 p-5 text-white">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Recommended interpretation</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-100">{RECOMMENDATIONS[task]}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-extrabold text-slate-950">
            Hit {selected.hit.id}: rank {selectedRank + 1} for this task
          </h3>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">
            {observations.map((note) => <li key={note} className="flex gap-2"><span aria-hidden="true" className="text-blue-600">•</span><span>{note}</span></li>)}
          </ul>
        </div>
      </div>

      <p id="alignment-playground-boundary" className="rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-950 ring-1 ring-inset ring-amber-200">
        <strong>Model boundary:</strong> The task scores are transparent teaching weights, not BLAST outputs or validated probabilities. Real decisions require the alignment itself, domain boundaries, sequence quality, structural metadata, species context, and experimental evidence.
      </p>
    </section>
  );
}
