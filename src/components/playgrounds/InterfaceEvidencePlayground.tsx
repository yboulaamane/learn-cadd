"use client";

import { useMemo, useState } from "react";

type EvidenceKey = "restraints" | "clashes" | "ensemble" | "developability";
type EvidenceSettings = Record<EvidenceKey, boolean>;

interface InterfacePose {
  id: string;
  energyScore: number;
  restraintSatisfaction: number;
  clashes: number;
  ensembleSupport: number;
  developabilityScore: number;
}

const POSES: InterfacePose[] = [
  { id: "Pose A", energyScore: 96, restraintSatisfaction: 42, clashes: 8, ensembleSupport: 1, developabilityScore: 35 },
  { id: "Pose B", energyScore: 82, restraintSatisfaction: 91, clashes: 1, ensembleSupport: 4, developabilityScore: 72 },
  { id: "Pose C", energyScore: 70, restraintSatisfaction: 76, clashes: 0, ensembleSupport: 3, developabilityScore: 90 },
];

const EVIDENCE: { key: EvidenceKey; label: string; description: string }[] = [
  {
    key: "restraints",
    label: "Experimental restraints",
    description: "Reward agreement with epitope mapping, crosslinks, competition, or controlled mutagenesis.",
  },
  {
    key: "clashes",
    label: "Steric-clash rejection",
    description: "Penalize buried overlaps that refinement cannot plausibly resolve.",
  },
  {
    key: "ensemble",
    label: "Ensemble robustness",
    description: "Reward interfaces recovered across reasonable starting conformations.",
  },
  {
    key: "developability",
    label: "Developability screen",
    description: "Penalize exposed hydrophobic patches and liabilities introduced by the modeled interface.",
  },
];

const SCORE_ONLY: EvidenceSettings = {
  restraints: false,
  clashes: false,
  ensemble: false,
  developability: false,
};

const BALANCED: EvidenceSettings = {
  restraints: true,
  clashes: true,
  ensemble: true,
  developability: true,
};

export function InterfaceEvidencePlayground() {
  const [settings, setSettings] = useState<EvidenceSettings>(SCORE_ONLY);

  const rankedPoses = useMemo(() => {
    return POSES.map((pose) => {
      const components = [pose.energyScore];
      if (settings.restraints) components.push(pose.restraintSatisfaction);
      if (settings.clashes) components.push(Math.max(0, 100 - pose.clashes * 12));
      if (settings.ensemble) components.push(pose.ensembleSupport * 20);
      if (settings.developability) components.push(pose.developabilityScore);

      return {
        ...pose,
        consensus: Math.round(components.reduce((sum, value) => sum + value, 0) / components.length),
      };
    }).sort((first, second) => second.consensus - first.consensus);
  }, [settings]);

  const activeEvidence = Object.values(settings).filter(Boolean).length;
  const winner = rankedPoses[0];

  return (
    <section className="not-prose mb-10 space-y-5 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm dark:from-slate-900 dark:to-slate-950 sm:p-6">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-wider text-blue-700">Interactive interface-ranking exercise</p>
        <h2 className="mt-1 text-lg font-extrabold text-slate-950">Which protein-complex pose would you advance?</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-700">
          Raw energy favors Pose A. Add independent evidence to test whether that ranking survives
          clashes, experimental restraints, conformational uncertainty, and developability risk.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSettings(SCORE_ONLY)}
          className="rounded-full border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-800 transition hover:border-blue-400 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Docking score only
        </button>
        <button
          type="button"
          onClick={() => setSettings(BALANCED)}
          className="rounded-full border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-800 transition hover:border-blue-400 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Evidence-balanced review
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.2fr)]">
        <div className="space-y-3">
          {EVIDENCE.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setSettings((current) => ({ ...current, [item.key]: !current[item.key] }))}
              aria-pressed={settings[item.key]}
              className={`w-full rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                settings[item.key]
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-slate-200 bg-white hover:border-blue-300"
              }`}
            >
              <span className="flex items-start justify-between gap-3">
                <span className="text-sm font-extrabold text-slate-950">{item.label}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                  settings[item.key] ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                }`}>
                  {settings[item.key] ? "Included" : "Ignored"}
                </span>
              </span>
              <span className="mt-2 block text-xs leading-relaxed text-slate-600">{item.description}</span>
            </button>
          ))}
        </div>

        <div className="space-y-4" aria-live="polite">
          <div className="rounded-xl bg-slate-950 p-5 text-white">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Current decision</p>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
              <p className="text-xl font-black">Advance {winner.id}</p>
              <p className="font-mono text-3xl font-black text-blue-300">{winner.consensus}<span className="text-base">/100</span></p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-200">
              {activeEvidence === 0
                ? "This decision uses only the docking-energy rank and is a hypothesis, not a validated interface."
                : activeEvidence < 3
                  ? "The ranking now includes some orthogonal evidence, but important failure modes remain untested."
                  : "The ranking integrates independent evidence. Experimental testing is still required before accepting the pose."}
            </p>
          </div>

          <div className="space-y-3">
            {rankedPoses.map((pose, index) => (
              <article key={pose.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-extrabold text-slate-950">#{index + 1} {pose.id}</h3>
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 font-mono text-xs font-extrabold text-blue-800">
                    consensus {pose.consensus}
                  </span>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 sm:grid-cols-5">
                  <div><dt>Energy</dt><dd className="font-bold text-slate-950">{pose.energyScore}</dd></div>
                  <div><dt>Restraints</dt><dd className="font-bold text-slate-950">{pose.restraintSatisfaction}%</dd></div>
                  <div><dt>Clashes</dt><dd className="font-bold text-slate-950">{pose.clashes}</dd></div>
                  <div><dt>Ensemble</dt><dd className="font-bold text-slate-950">{pose.ensembleSupport}/5</dd></div>
                  <div><dt>Developability</dt><dd className="font-bold text-slate-950">{pose.developabilityScore}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </div>

      <p className="rounded-lg bg-white p-3 text-xs leading-relaxed text-slate-600 ring-1 ring-inset ring-slate-200">
        Teaching model: these normalized values illustrate evidence integration; they are not physical
        energies or a universal scoring function. In a real project, predefine acceptance criteria and
        challenge the leading poses experimentally.
      </p>
    </section>
  );
}
