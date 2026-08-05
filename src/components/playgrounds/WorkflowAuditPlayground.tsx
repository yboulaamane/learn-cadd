"use client";

import { useMemo, useState } from "react";

type SafeguardKey =
  | "immutableInputs"
  | "pinnedEnvironment"
  | "versionedConfig"
  | "fixedSeeds"
  | "stageChecks"
  | "provenanceLog";

type Safeguards = Record<SafeguardKey, boolean>;

interface SafeguardDefinition {
  key: SafeguardKey;
  label: string;
  purpose: string;
  weight: number;
}

const SAFEGUARDS: SafeguardDefinition[] = [
  {
    key: "immutableInputs",
    label: "Checksummed raw inputs",
    purpose: "Detects changed structures, receptor files, or assay tables before a rerun.",
    weight: 20,
  },
  {
    key: "pinnedEnvironment",
    label: "Pinned software environment",
    purpose: "Records exact RDKit, docking-engine, Python, and operating-system dependencies.",
    weight: 20,
  },
  {
    key: "versionedConfig",
    label: "Versioned scientific configuration",
    purpose: "Moves grid coordinates, protonation policy, exhaustiveness, and thresholds out of command history.",
    weight: 20,
  },
  {
    key: "fixedSeeds",
    label: "Recorded random seeds",
    purpose: "Makes stochastic conformer generation, splitting, and docking behavior traceable.",
    weight: 10,
  },
  {
    key: "stageChecks",
    label: "Fail-fast stage checks",
    purpose: "Stops the run when parsed molecules, poses, scores, or expected outputs disappear.",
    weight: 20,
  },
  {
    key: "provenanceLog",
    label: "Machine-readable run manifest",
    purpose: "Links inputs, versions, parameters, counts, failures, and outputs to one run identifier.",
    weight: 10,
  },
];

const PRESETS: Record<string, Safeguards> = {
  "Ad hoc commands": {
    immutableInputs: false,
    pinnedEnvironment: false,
    versionedConfig: false,
    fixedSeeds: false,
    stageChecks: false,
    provenanceLog: false,
  },
  "Versioned scripts": {
    immutableInputs: true,
    pinnedEnvironment: true,
    versionedConfig: true,
    fixedSeeds: false,
    stageChecks: false,
    provenanceLog: false,
  },
  "Auditable pipeline": {
    immutableInputs: true,
    pinnedEnvironment: true,
    versionedConfig: true,
    fixedSeeds: true,
    stageChecks: true,
    provenanceLog: true,
  },
};

const DEFAULT_SAFEGUARDS = PRESETS["Versioned scripts"];

export function WorkflowAuditPlayground() {
  const [safeguards, setSafeguards] = useState<Safeguards>(DEFAULT_SAFEGUARDS);

  const audit = useMemo(() => {
    const score = SAFEGUARDS.reduce(
      (total, safeguard) => total + (safeguards[safeguard.key] ? safeguard.weight : 0),
      0,
    );
    const missing = SAFEGUARDS.filter((safeguard) => !safeguards[safeguard.key]);
    const silentLoss = safeguards.stageChecks ? 0 : 6;

    let status = "Reproducible and auditable";
    let decision = "A collaborator can rerun the workflow and investigate every rejected record.";

    if (!safeguards.immutableInputs || !safeguards.pinnedEnvironment || !safeguards.versionedConfig) {
      status = "Not reproducible";
      decision = "The scientific result can change without a traceable change to the workflow definition.";
    } else if (!safeguards.stageChecks || !safeguards.provenanceLog) {
      status = "Rerunnable, not auditable";
      decision = "The commands may rerun, but missing compounds or outputs can pass through silently.";
    } else if (!safeguards.fixedSeeds) {
      status = "Auditable with stochastic drift";
      decision = "The workflow records its work, but stochastic stages cannot be reproduced exactly.";
    }

    return { score, missing, silentLoss, status, decision };
  }, [safeguards]);

  const toggleSafeguard = (key: SafeguardKey) => {
    setSafeguards((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <section className="not-prose mb-10 space-y-5 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm dark:from-neutral-950 dark:to-black sm:p-6">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-wider text-blue-700">Interactive workflow audit</p>
        <h2 className="mt-1 text-lg font-extrabold text-slate-950">Would you trust this pipeline rerun?</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-700">
          Turn safeguards on and off. A script becomes a defensible scientific pipeline only when its
          inputs, environment, decisions, failures, and outputs remain traceable.
        </p>
      </div>

      <div className="flex flex-wrap gap-2" aria-label="Workflow audit presets">
        {Object.entries(PRESETS).map(([name, preset]) => (
          <button
            key={name}
            type="button"
            onClick={() => setSafeguards(preset)}
            className="rounded-full border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-800 transition hover:border-blue-400 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {name}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
        <div className="grid gap-3 sm:grid-cols-2">
          {SAFEGUARDS.map((safeguard) => (
            <button
              key={safeguard.key}
              type="button"
              onClick={() => toggleSafeguard(safeguard.key)}
              aria-pressed={safeguards[safeguard.key]}
              className={`rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                safeguards[safeguard.key]
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-slate-200 bg-white hover:border-blue-300"
              }`}
            >
              <span className="flex items-start justify-between gap-3">
                <span className="text-sm font-extrabold text-slate-950">{safeguard.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                    safeguards[safeguard.key]
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {safeguards[safeguard.key] ? "On" : "Off"}
                </span>
              </span>
              <span className="mt-2 block text-xs leading-relaxed text-slate-600">{safeguard.purpose}</span>
            </button>
          ))}
        </div>

        <div className="space-y-4" aria-live="polite">
          <div className="rounded-xl bg-slate-950 p-5 text-white shadow-sm">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Audit readiness</p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <p className="text-xl font-black">{audit.status}</p>
              <p className="font-mono text-3xl font-black text-blue-300">
                {audit.score}<span className="text-base">/100</span>
              </p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-700" aria-hidden="true">
              <div className="h-full rounded-full bg-blue-400 transition-[width]" style={{ width: `${audit.score}%` }} />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-200">{audit.decision}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-extrabold text-slate-950">Example stage ledger</h3>
            <dl className="mt-3 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-sm text-slate-700">
              <dt>Input structures</dt><dd className="font-mono font-bold text-slate-950">250</dd>
              <dt>Parsed successfully</dt><dd className="font-mono font-bold text-slate-950">248</dd>
              <dt>Docked successfully</dt><dd className="font-mono font-bold text-slate-950">244</dd>
              <dt>Silently missing</dt>
              <dd className={`font-mono font-bold ${audit.silentLoss ? "text-red-700" : "text-emerald-700"}`}>
                {audit.silentLoss}
              </dd>
            </dl>
            <p className="mt-3 border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-600">
              {safeguards.stageChecks
                ? "Stage checks reconcile every identifier and route six failures to an explicit rejection table."
                : "Without stage checks, the final ranking looks complete even though six compounds disappeared."}
            </p>
          </div>

          {audit.missing.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <h3 className="text-sm font-extrabold text-amber-950">Next safeguard to add</h3>
              <p className="mt-2 text-sm leading-relaxed text-amber-900">
                <strong>{audit.missing[0].label}:</strong> {audit.missing[0].purpose}
              </p>
            </div>
          )}
        </div>
      </div>

      <p className="rounded-lg bg-white p-3 text-xs leading-relaxed text-slate-600 ring-1 ring-inset ring-slate-200">
        Boundary: a high audit score shows that the computation is traceable. It does not prove that
        the docking setup, force field, assay labels, or predictive model are scientifically valid.
      </p>
    </section>
  );
}
