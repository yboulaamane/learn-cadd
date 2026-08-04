"use client";

import { useMemo, useState } from "react";

type StructureMethod = "xray" | "cryoem" | "nmr" | "predicted";
type StructureState = "holo" | "apo" | "unknown";
type StructureTask = "docking" | "md" | "template";

interface StructureInputs {
  method: StructureMethod;
  localQuality: number;
  pocketCompleteness: number;
  state: StructureState;
  assemblyVerified: boolean;
  chemistryReviewed: boolean;
}

const DEFAULT_INPUTS: StructureInputs = {
  method: "xray",
  localQuality: 90,
  pocketCompleteness: 95,
  state: "holo",
  assemblyVerified: true,
  chemistryReviewed: true,
};

const PRESETS: Record<string, StructureInputs> = {
  "Holo crystal": DEFAULT_INPUTS,
  "Incomplete cryo-EM": {
    method: "cryoem",
    localQuality: 68,
    pocketCompleteness: 62,
    state: "apo",
    assemblyVerified: true,
    chemistryReviewed: false,
  },
  "Predicted model": {
    method: "predicted",
    localQuality: 72,
    pocketCompleteness: 80,
    state: "unknown",
    assemblyVerified: false,
    chemistryReviewed: false,
  },
};

const TASK_LABELS: Record<StructureTask, string> = {
  docking: "Docking receptor",
  md: "MD starting model",
  template: "Homology template",
};

const METHOD_LABELS: Record<StructureMethod, string> = {
  xray: "X-ray crystallography",
  cryoem: "Cryo-EM",
  nmr: "NMR ensemble",
  predicted: "Predicted model",
};

function RangeField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-4 text-sm font-bold text-slate-700">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id} className="font-mono text-slate-950">
          {value}%
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={5}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-describedby="structure-readiness-boundary"
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
      />
    </div>
  );
}

export function StructureReadinessPlayground() {
  const [task, setTask] = useState<StructureTask>("docking");
  const [inputs, setInputs] = useState<StructureInputs>(DEFAULT_INPUTS);

  const assessment = useMemo(() => {
    const methodScore: Record<StructureMethod, number> = {
      xray: 92,
      cryoem: 80,
      nmr: 74,
      predicted: 55,
    };
    const stateScore: Record<StructureState, number> = {
      holo: task === "docking" ? 100 : 85,
      apo: task === "docking" ? 48 : 72,
      unknown: task === "docking" ? 20 : 45,
    };

    const score =
      task === "md"
        ? methodScore[inputs.method] * 0.15 +
          inputs.localQuality * 0.2 +
          inputs.pocketCompleteness * 0.3 +
          stateScore[inputs.state] * 0.05 +
          (inputs.assemblyVerified ? 15 : 0) +
          (inputs.chemistryReviewed ? 15 : 0)
        : task === "template"
          ? methodScore[inputs.method] * 0.2 +
            inputs.localQuality * 0.25 +
            inputs.pocketCompleteness * 0.25 +
            stateScore[inputs.state] * 0.1 +
            (inputs.assemblyVerified ? 10 : 0) +
            (inputs.chemistryReviewed ? 10 : 0)
          : methodScore[inputs.method] * 0.15 +
            inputs.localQuality * 0.3 +
            inputs.pocketCompleteness * 0.2 +
            stateScore[inputs.state] * 0.15 +
            (inputs.assemblyVerified ? 10 : 0) +
            (inputs.chemistryReviewed ? 10 : 0);

    const roundedScore = Math.round(Math.min(100, score));
    const blockers: string[] = [];
    const cautions: string[] = [];
    const actions: string[] = [];

    if (inputs.localQuality < 50) {
      blockers.push("The local pocket or interface is too uncertain for reliable atom-level interpretation.");
      actions.push("Find a better entry or rebuild and validate the uncertain local region.");
    } else if (inputs.localQuality < 70) {
      cautions.push("Local quality is only moderate; inspect residue-level density or confidence.");
      actions.push("Compare alternative structures and test sensitivity to local conformations.");
    }

    if (inputs.pocketCompleteness < 60) {
      blockers.push("Key pocket or interface residues are missing.");
      actions.push("Model missing residues only with evidence, then validate pocket geometry.");
    } else if (inputs.pocketCompleteness < 80) {
      cautions.push("Missing atoms or segments may alter pocket shape and dynamics.");
      actions.push("Repair side chains or loops and retain an unmodified comparison model.");
    }

    if (task === "docking" && inputs.state !== "holo") {
      cautions.push("An apo or unknown state may not represent a ligand-ready pocket.");
      actions.push("Compare with holo homologs, known ligands, or an ensemble of plausible pocket states.");
    }

    if (!inputs.assemblyVerified) {
      blockers.push(task === "md" ? "The biological assembly is unverified for a system-level simulation." : "The modeled chain or interface may not match the biological assembly.");
      actions.push("Verify the biological assembly, interfaces, cofactors, and construct metadata.");
    }

    if (!inputs.chemistryReviewed) {
      cautions.push("Protonation, bond orders, metals, cofactors, and mechanistic waters are unresolved.");
      actions.push("Review receptor chemistry and document every retained or removed component.");
    }

    if (inputs.method === "predicted") {
      cautions.push("Prediction confidence does not guarantee a ligand-ready side-chain arrangement.");
      actions.push("Use experimental or holo information to validate the pocket before prospective docking.");
    }

    const status = blockers.length > 0 || roundedScore < 55
      ? "Not ready"
      : cautions.length > 0 || roundedScore < 80
        ? "Conditional"
        : "Ready for validation";

    return {
      score: roundedScore,
      status,
      blockers,
      cautions,
      actions: [...new Set(actions)].slice(0, 4),
    };
  }, [inputs, task]);

  const updateInput = <Key extends keyof StructureInputs>(key: Key, value: StructureInputs[Key]) => {
    setInputs((current) => ({ ...current, [key]: value }));
  };

  const statusColor =
    assessment.status === "Ready for validation"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : assessment.status === "Conditional"
        ? "border-amber-200 bg-amber-50 text-amber-950"
        : "border-red-200 bg-red-50 text-red-950";

  return (
    <section className="not-prose mb-10 space-y-5 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm sm:p-6">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-wider text-blue-700">Interactive decision sandbox</p>
        <h2 className="mt-1 text-lg font-extrabold text-slate-950">Is this structure ready for the task?</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-700">
          Change the intended use and local evidence. The same coordinate model can be suitable for
          one question and unsafe for another.
        </p>
      </div>

      <div className="flex flex-wrap gap-2" aria-label="Structure presets">
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

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm font-bold text-slate-700">
              Intended use
              <select
                value={task}
                onChange={(event) => setTask(event.target.value as StructureTask)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {Object.entries(TASK_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5 text-sm font-bold text-slate-700">
              Structure source
              <select
                value={inputs.method}
                onChange={(event) => updateInput("method", event.target.value as StructureMethod)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {Object.entries(METHOD_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="space-y-1.5 text-sm font-bold text-slate-700">
            Conformational state
            <select
              value={inputs.state}
              onChange={(event) => updateInput("state", event.target.value as StructureState)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <option value="holo">Holo or ligand-informed</option>
              <option value="apo">Apo</option>
              <option value="unknown">Unknown or predicted</option>
            </select>
          </label>

          <RangeField
            id="structure-local-quality"
            label="Local pocket confidence"
            value={inputs.localQuality}
            onChange={(value) => updateInput("localQuality", value)}
          />
          <RangeField
            id="structure-completeness"
            label="Pocket or interface completeness"
            value={inputs.pocketCompleteness}
            onChange={(value) => updateInput("pocketCompleteness", value)}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["assemblyVerified", "Biological assembly verified"],
              ["chemistryReviewed", "Chemistry and waters reviewed"],
            ].map(([key, label]) => (
              <label key={key} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={inputs[key as "assemblyVerified" | "chemistryReviewed"]}
                  onChange={(event) => updateInput(key as "assemblyVerified" | "chemistryReviewed", event.target.checked)}
                  className="h-4 w-4 rounded accent-blue-600"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4" aria-live="polite">
          <div className={`rounded-xl border p-5 ${statusColor}`}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider opacity-75">Readiness</p>
                <p className="mt-1 text-xl font-black">{assessment.status}</p>
              </div>
              <p className="font-mono text-3xl font-black">{assessment.score}<span className="text-base">/100</span></p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/70" aria-hidden="true">
              <div className="h-full rounded-full bg-current transition-[width]" style={{ width: `${assessment.score}%` }} />
            </div>
          </div>

          {(assessment.blockers.length > 0 || assessment.cautions.length > 0) && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-extrabold text-slate-950">What needs attention</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">
                {assessment.blockers.map((item) => <li key={item}><strong className="text-red-700">Blocker:</strong> {item}</li>)}
                {assessment.cautions.map((item) => <li key={item}><strong className="text-amber-700">Caution:</strong> {item}</li>)}
              </ul>
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-extrabold text-slate-950">Next defensible actions</h3>
            {assessment.actions.length > 0 ? (
              <ol className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">
                {assessment.actions.map((action, index) => (
                  <li key={action} className="flex gap-2"><span className="font-mono font-bold text-blue-700">{index + 1}.</span><span>{action}</span></li>
                ))}
              </ol>
            ) : (
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                Record preparation provenance, validate retrospectively where possible, and keep an
                alternative receptor model for sensitivity testing.
              </p>
            )}
          </div>
        </div>
      </div>

      <p id="structure-readiness-boundary" className="rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-950 ring-1 ring-inset ring-amber-200">
        <strong>Model boundary:</strong> This score is an educational checklist, not a structure-validation metric. Inspect the experimental map or prediction confidence, chemistry, biological assembly, and task-specific retrospective performance before using a receptor prospectively.
      </p>
    </section>
  );
}
