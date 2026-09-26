"use client";

import { useMemo, useState } from "react";
import { Activity, ChevronDown, RotateCcw } from "lucide-react";

interface PkInputs {
  dose: number;
  bioavailability: number;
  absorptionRate: number;
  clearance: number;
  volume: number;
}

type Prediction = "decrease" | "similar" | "increase";

const DEFAULT_INPUTS: PkInputs = {
  dose: 100,
  bioavailability: 70,
  absorptionRate: 1.2,
  clearance: 5,
  volume: 40,
};

const PRESETS: Record<string, PkInputs> = {
  Baseline: DEFAULT_INPUTS,
  "Fast clearance": { dose: 100, bioavailability: 70, absorptionRate: 1.2, clearance: 12, volume: 35 },
  "Slow absorption": { dose: 100, bioavailability: 70, absorptionRate: 0.3, clearance: 5, volume: 40 },
  "Low bioavailability": { dose: 100, bioavailability: 25, absorptionRate: 1.2, clearance: 5, volume: 40 },
};

const GUIDED_TASKS: Array<{
  title: string;
  prompt: string;
  instruction: string;
  key: keyof PkInputs;
}> = [
  {
    title: "1. Double clearance",
    prompt: "If clearance doubles while dose and bioavailability stay fixed, what happens to total exposure (AUC)?",
    instruction: "Now move clearance from 5 to 10 L/h.",
    key: "clearance",
  },
  {
    title: "2. Reduce bioavailability",
    prompt: "If bioavailability falls from 70% to 35%, what happens to total exposure (AUC)?",
    instruction: "Now move bioavailability from 70% to 35%.",
    key: "bioavailability",
  },
  {
    title: "3. Slow absorption",
    prompt: "If absorption slows while dose, bioavailability, and clearance stay fixed, what happens to total exposure (AUC)?",
    instruction: "Now move the absorption rate from 1.2 to 0.4 h⁻¹.",
    key: "absorptionRate",
  },
];

function concentrationAt(time: number, inputs: PkInputs) {
  const fractionAvailable = inputs.bioavailability / 100;
  const eliminationRate = inputs.clearance / inputs.volume;
  const scale = (fractionAvailable * inputs.dose) / inputs.volume;

  if (Math.abs(inputs.absorptionRate - eliminationRate) < 0.0001) {
    return scale * inputs.absorptionRate * time * Math.exp(-eliminationRate * time);
  }

  return (
    scale *
    (inputs.absorptionRate / (inputs.absorptionRate - eliminationRate)) *
    (Math.exp(-eliminationRate * time) - Math.exp(-inputs.absorptionRate * time))
  );
}

function summarize(inputs: PkInputs) {
  const eliminationRate = inputs.clearance / inputs.volume;
  const halfLife = Math.log(2) / eliminationRate;
  const tMax =
    Math.abs(inputs.absorptionRate - eliminationRate) < 0.0001
      ? 1 / eliminationRate
      : Math.log(inputs.absorptionRate / eliminationRate) /
        (inputs.absorptionRate - eliminationRate);

  return {
    halfLife,
    tMax,
    cMax: concentrationAt(tMax, inputs),
    auc: ((inputs.bioavailability / 100) * inputs.dose) / inputs.clearance,
    suggestedHours: Math.max(12, Math.min(72, Math.ceil(Math.max(5 * halfLife, 2 * tMax)))),
  };
}

function sameInputs(a: PkInputs, b: PkInputs) {
  return (Object.keys(a) as Array<keyof PkInputs>).every((key) => a[key] === b[key]);
}

function RangeField({
  id,
  label,
  value,
  unit,
  min,
  max,
  step,
  disabled = false,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  const updateValue = (rawValue: number) => {
    if (Number.isFinite(rawValue)) onChange(Math.min(max, Math.max(min, rawValue)));
  };

  return (
    <div className={`space-y-2 ${disabled ? "opacity-55" : ""}`}>
      <div className="flex items-center justify-between gap-4 text-xs font-bold text-slate-700">
        <label htmlFor={id}>{label}</label>
        <label className="flex items-center rounded-md border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-blue-500">
          <span className="sr-only">{label} numeric value</span>
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            onChange={(event) => updateValue(Number(event.target.value))}
            className="w-20 rounded-l-md bg-transparent px-2 py-1 text-right font-mono text-slate-950 outline-none disabled:cursor-not-allowed"
            aria-label={`${label} numeric value`}
          />
          <span className="border-l border-slate-200 px-2 py-1 text-slate-500">{unit}</span>
        </label>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => updateValue(Number(event.target.value))}
        aria-describedby="pk-model-note"
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600 disabled:cursor-not-allowed"
      />
    </div>
  );
}

export function PharmacokineticsPlayground() {
  const [inputs, setInputs] = useState<PkInputs>(DEFAULT_INPUTS);
  const [guidedTask, setGuidedTask] = useState(0);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [taskTouched, setTaskTouched] = useState(false);
  const [exploreFurther, setExploreFurther] = useState(false);

  const model = useMemo(() => {
    const current = summarize(inputs);
    const baseline = summarize(DEFAULT_INPUTS);
    const chartHours = Math.max(current.suggestedHours, baseline.suggestedHours);
    const currentPoints = Array.from({ length: 121 }, (_, index) => {
      const time = (index / 120) * chartHours;
      return { time, concentration: Math.max(0, concentrationAt(time, inputs)) };
    });
    const baselinePoints = Array.from({ length: 121 }, (_, index) => {
      const time = (index / 120) * chartHours;
      return { time, concentration: Math.max(0, concentrationAt(time, DEFAULT_INPUTS)) };
    });
    const yMax =
      Math.max(
        ...currentPoints.map((point) => point.concentration),
        ...baselinePoints.map((point) => point.concentration),
        0.01,
      ) * 1.12;
    const toPath = (points: typeof currentPoints) =>
      points
        .map((point, index) => {
          const x = 42 + (point.time / chartHours) * 286;
          const y = 174 - (point.concentration / yMax) * 134;
          return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
        })
        .join(" ");

    return {
      current,
      baseline,
      chartHours,
      yMax,
      currentPath: toPath(currentPoints),
      baselinePath: toPath(baselinePoints),
    };
  }, [inputs]);

  const currentTask = GUIDED_TASKS[guidedTask];
  const activePreset = Object.entries(PRESETS).find(([, preset]) => sameInputs(inputs, preset))?.[0];

  const updateInput = (key: keyof PkInputs, value: number) => {
    setInputs((current) => ({ ...current, [key]: value }));
    if (key === currentTask.key && value !== DEFAULT_INPUTS[key]) setTaskTouched(true);
  };

  const selectTask = (index: number) => {
    setGuidedTask(index);
    setInputs(DEFAULT_INPUTS);
    setPrediction(null);
    setTaskTouched(false);
  };

  const applyPreset = (preset: PkInputs) => {
    setInputs(preset);
    setTaskTouched(preset[currentTask.key] !== DEFAULT_INPUTS[currentTask.key]);
  };

  const reset = () => {
    setInputs(DEFAULT_INPUTS);
    setPrediction(null);
    setTaskTouched(false);
    setExploreFurther(false);
  };

  const feedback = (() => {
    const predictionLead = prediction ? `You predicted “${prediction}.” ` : "";
    if (guidedTask === 0) {
      return `${predictionLead}In this linear model, AUC is inversely proportional to clearance. Doubling clearance from 5 to 10 L/h halves AUC from ${model.baseline.auc.toFixed(1)} to ${(model.baseline.auc / 2).toFixed(1)} mg·h/L and shortens half-life.`;
    }
    if (guidedTask === 1) {
      return `${predictionLead}AUC and Cmax scale with bioavailability here. Halving F from 70% to 35% halves exposure, while Tmax and elimination half-life remain unchanged.`;
    }
    return `${predictionLead}Slower absorption lowers and delays the peak, but AUC stays ${model.current.auc.toFixed(1)} mg·h/L because dose, bioavailability, and clearance did not change.`;
  })();

  const fields: Array<{
    key: keyof PkInputs;
    id: string;
    label: string;
    unit: string;
    min: number;
    max: number;
    step: number;
  }> = [
    { key: "dose", id: "pk-dose", label: "Oral dose", unit: "mg", min: 10, max: 500, step: 10 },
    { key: "bioavailability", id: "pk-bioavailability", label: "Bioavailability (F)", unit: "%", min: 10, max: 100, step: 5 },
    { key: "absorptionRate", id: "pk-absorption", label: "Absorption rate (ka)", unit: "h⁻¹", min: 0.2, max: 3, step: 0.1 },
    { key: "clearance", id: "pk-clearance", label: "Clearance (CL)", unit: "L/h", min: 0.5, max: 20, step: 0.5 },
    { key: "volume", id: "pk-volume", label: "Apparent volume (Vd)", unit: "L", min: 5, max: 100, step: 5 },
  ];
  const visibleFields = exploreFurther ? fields : fields.filter((field) => field.key === currentTask.key);

  const metricCards = [
    { label: "Cmax", current: model.current.cMax, baseline: model.baseline.cMax, unit: "mg/L", digits: 2 },
    { label: "Tmax", current: model.current.tMax, baseline: model.baseline.tMax, unit: "h", digits: 1 },
    { label: "AUC₀–∞", current: model.current.auc, baseline: model.baseline.auc, unit: "mg·h/L", digits: 1 },
    { label: "Half-life", current: model.current.halfLife, baseline: model.baseline.halfLife, unit: "h", digits: 1 },
  ];

  return (
    <section className="not-prose mb-10 space-y-5 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm dark:from-neutral-950 dark:to-black sm:p-6">
      <div className="flex items-start gap-3">
        <span className="rounded-lg bg-blue-600 p-2 text-white" aria-hidden="true">
          <Activity size={18} />
        </span>
        <div>
          <h2 className="text-base font-extrabold text-slate-950">Interactive PK exposure simulator</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">
            Predict first, then compare the modified oral profile with the fixed baseline.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-blue-200 bg-white p-4">
        <p className="text-xs font-extrabold uppercase tracking-wider text-blue-700">Guided experiment</p>
        <div className="mt-3 flex flex-wrap gap-2" aria-label="PK guided tasks">
          {GUIDED_TASKS.map((task, index) => (
            <button
              key={task.title}
              type="button"
              onClick={() => selectTask(index)}
              aria-pressed={guidedTask === index}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${guidedTask === index ? "border-blue-700 bg-blue-700 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-blue-400"}`}
            >
              {task.title}
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm font-bold leading-relaxed text-slate-950">{currentTask.prompt}</p>
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Predicted change in exposure">
          {(["decrease", "similar", "increase"] as Prediction[]).map((choice) => (
            <button
              key={choice}
              type="button"
              onClick={() => setPrediction(choice)}
              aria-pressed={prediction === choice}
              className={`rounded-md border px-3 py-1.5 text-xs font-bold capitalize ${prediction === choice ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400"}`}
            >
              {choice}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-600">
          {prediction ? currentTask.instruction : "Choose a prediction to unlock the task control."}
        </p>
        {taskTouched && prediction && (
          <p role="status" className="mt-3 rounded-lg bg-emerald-50 p-3 text-xs leading-relaxed text-emerald-950 ring-1 ring-inset ring-emerald-200">
            <strong>What the model shows:</strong> {feedback}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2" aria-label="Pharmacokinetic presets">
        {Object.entries(PRESETS).map(([name, preset]) => (
          <button
            key={name}
            type="button"
            onClick={() => applyPreset(preset)}
            aria-pressed={activePreset === name}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${activePreset === name ? "border-blue-700 bg-blue-700 text-white" : "border-blue-200 bg-white text-blue-800 hover:border-blue-400 hover:bg-blue-50"}`}
          >
            {name}
          </button>
        ))}
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
        >
          <RotateCcw size={12} aria-hidden="true" />
          Reset all
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
          {visibleFields.map(({ key: fieldKey, ...field }) => (
            <RangeField
              key={fieldKey}
              {...field}
              value={inputs[fieldKey]}
              disabled={fieldKey === currentTask.key && prediction === null}
              onChange={(value) => updateInput(fieldKey, value)}
            />
          ))}
          <button
            type="button"
            onClick={() => setExploreFurther((current) => !current)}
            aria-expanded={exploreFurther}
            className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-extrabold text-slate-800 hover:border-slate-400"
          >
            {exploreFurther ? "Hide additional controls" : "Explore further"}
            <ChevronDown className={`h-4 w-4 transition-transform ${exploreFurther ? "rotate-180" : ""}`} aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
            <div className="mb-2 flex flex-wrap gap-4 text-[11px] font-bold text-slate-600" aria-hidden="true">
              <span className="flex items-center gap-1.5"><span className="h-0.5 w-5 bg-blue-600" />Current</span>
              <span className="flex items-center gap-1.5"><span className="w-5 border-t-2 border-dashed border-slate-400" />Baseline</span>
            </div>
            <svg
              viewBox="0 0 350 205"
              className="h-auto w-full"
              role="img"
              aria-label={`Current and baseline concentration-time curves. Current peak concentration ${model.current.cMax.toFixed(2)} milligrams per liter at ${model.current.tMax.toFixed(1)} hours.`}
            >
              <line x1="42" y1="174" x2="328" y2="174" className="stroke-slate-300 dark:stroke-slate-600" />
              <line x1="42" y1="40" x2="42" y2="174" className="stroke-slate-300 dark:stroke-slate-600" />
              <line x1="42" y1="107" x2="328" y2="107" className="stroke-slate-200 dark:stroke-slate-800" strokeDasharray="4 4" />
              <path d={model.baselinePath} fill="none" className="stroke-slate-400" strokeWidth="2" strokeDasharray="5 4" strokeLinecap="round" />
              <path d={model.currentPath} fill="none" className="stroke-blue-600 dark:stroke-blue-400" strokeWidth="3" strokeLinecap="round" />
              <circle
                cx={42 + (model.current.tMax / model.chartHours) * 286}
                cy={174 - (model.current.cMax / model.yMax) * 134}
                r="4"
                className="fill-blue-700 dark:fill-blue-300"
              />
              <text x="185" y="198" textAnchor="middle" className="fill-slate-600 text-[10px] font-bold">Time (hours)</text>
              <text x="18" y="108" textAnchor="middle" transform="rotate(-90 18 108)" className="fill-slate-600 text-[10px] font-bold">Concentration (mg/L)</text>
              <text x="42" y="188" textAnchor="middle" className="fill-slate-500 text-[9px]">0</text>
              <text x="328" y="188" textAnchor="middle" className="fill-slate-500 text-[9px]">{model.chartHours} h</text>
              <text x="37" y="44" textAnchor="end" className="fill-slate-500 text-[9px]">{model.yMax.toFixed(1)}</text>
            </svg>
          </div>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-live="polite">
            {metricCards.map((metric) => {
              const percentChange = ((metric.current - metric.baseline) / metric.baseline) * 100;
              return (
                <div key={metric.label} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
                  <dt className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500">{metric.label}</dt>
                  <dd className="mt-1 text-sm font-black text-slate-950">{metric.current.toFixed(metric.digits)} {metric.unit}</dd>
                  <dd className="mt-1 text-[10px] font-bold text-slate-500">
                    {Math.abs(percentChange) < 0.05 ? "No change" : `${percentChange > 0 ? "+" : ""}${percentChange.toFixed(0)}% vs baseline`}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>

      <p id="pk-model-note" className="rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-950 ring-1 ring-inset ring-amber-200">
        <strong>Model boundary:</strong> This is an educational, linear one-compartment oral model
        with first-order absorption and elimination. The curves are calculated teaching outputs, not
        patient data. The model omits distribution phases, saturation, repeated dosing, variability,
        and target-site exposure, so it must not be used to choose a clinical dose.
      </p>
    </section>
  );
}
