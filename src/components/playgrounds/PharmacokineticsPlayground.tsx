"use client";

import { useMemo, useState } from "react";
import { Activity, RotateCcw } from "lucide-react";

interface PkInputs {
  dose: number;
  bioavailability: number;
  absorptionRate: number;
  clearance: number;
  volume: number;
}

const DEFAULT_INPUTS: PkInputs = {
  dose: 100,
  bioavailability: 70,
  absorptionRate: 1.2,
  clearance: 5,
  volume: 40,
};

const PRESETS: Record<string, PkInputs> = {
  "Fast clearance": {
    dose: 100,
    bioavailability: 70,
    absorptionRate: 1.2,
    clearance: 12,
    volume: 35,
  },
  "Slow absorption": {
    dose: 100,
    bioavailability: 70,
    absorptionRate: 0.3,
    clearance: 5,
    volume: 40,
  },
  "Low bioavailability": {
    dose: 100,
    bioavailability: 25,
    absorptionRate: 1.2,
    clearance: 5,
    volume: 40,
  },
};

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

function RangeField({
  id,
  label,
  value,
  displayValue,
  min,
  max,
  step,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  displayValue: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-4 text-xs font-bold text-slate-700">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id} className="font-mono text-slate-950">
          {displayValue}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-describedby="pk-model-note"
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
      />
    </div>
  );
}

export function PharmacokineticsPlayground() {
  const [inputs, setInputs] = useState<PkInputs>(DEFAULT_INPUTS);

  const model = useMemo(() => {
    const eliminationRate = inputs.clearance / inputs.volume;
    const halfLife = Math.log(2) / eliminationRate;
    const tMax =
      Math.abs(inputs.absorptionRate - eliminationRate) < 0.0001
        ? 1 / eliminationRate
        : Math.log(inputs.absorptionRate / eliminationRate) /
          (inputs.absorptionRate - eliminationRate);
    const chartHours = Math.max(12, Math.min(72, Math.ceil(Math.max(5 * halfLife, 2 * tMax))));
    const points = Array.from({ length: 121 }, (_, index) => {
      const time = (index / 120) * chartHours;
      return { time, concentration: Math.max(0, concentrationAt(time, inputs)) };
    });
    const cMax = concentrationAt(tMax, inputs);
    const auc = ((inputs.bioavailability / 100) * inputs.dose) / inputs.clearance;
    const yMax = Math.max(...points.map((point) => point.concentration), 0.01) * 1.12;
    const path = points
      .map((point, index) => {
        const x = 42 + (point.time / chartHours) * 286;
        const y = 174 - (point.concentration / yMax) * 134;
        return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ");

    return { eliminationRate, halfLife, tMax, cMax, auc, chartHours, yMax, path };
  }, [inputs]);

  const updateInput = (key: keyof PkInputs, value: number) => {
    setInputs((current) => ({ ...current, [key]: value }));
  };

  return (
    <section className="not-prose mb-10 space-y-5 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm dark:from-neutral-950 dark:to-black sm:p-6">
      <div className="flex items-start gap-3">
        <span className="rounded-lg bg-blue-600 p-2 text-white" aria-hidden="true">
          <Activity size={18} />
        </span>
        <div>
          <h2 className="text-base font-extrabold text-slate-950">Interactive PK exposure simulator</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">
            Explore how oral dose, bioavailability, absorption, clearance, and distribution shape a
            one-compartment concentration-time profile.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2" aria-label="Pharmacokinetic presets">
        {Object.entries(PRESETS).map(([name, preset]) => (
          <button
            key={name}
            type="button"
            onClick={() => setInputs(preset)}
            className="rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-800 transition hover:border-blue-400 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {name}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setInputs(DEFAULT_INPUTS)}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
        >
          <RotateCcw size={12} aria-hidden="true" />
          Reset
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
          <RangeField
            id="pk-dose"
            label="Oral dose"
            value={inputs.dose}
            displayValue={`${inputs.dose} mg`}
            min={10}
            max={500}
            step={10}
            onChange={(value) => updateInput("dose", value)}
          />
          <RangeField
            id="pk-bioavailability"
            label="Bioavailability (F)"
            value={inputs.bioavailability}
            displayValue={`${inputs.bioavailability}%`}
            min={10}
            max={100}
            step={5}
            onChange={(value) => updateInput("bioavailability", value)}
          />
          <RangeField
            id="pk-absorption"
            label="Absorption rate (ka)"
            value={inputs.absorptionRate}
            displayValue={`${inputs.absorptionRate.toFixed(1)} h⁻¹`}
            min={0.2}
            max={3}
            step={0.1}
            onChange={(value) => updateInput("absorptionRate", value)}
          />
          <RangeField
            id="pk-clearance"
            label="Clearance (CL)"
            value={inputs.clearance}
            displayValue={`${inputs.clearance.toFixed(1)} L/h`}
            min={0.5}
            max={20}
            step={0.5}
            onChange={(value) => updateInput("clearance", value)}
          />
          <RangeField
            id="pk-volume"
            label="Apparent volume (Vd)"
            value={inputs.volume}
            displayValue={`${inputs.volume} L`}
            min={5}
            max={100}
            step={5}
            onChange={(value) => updateInput("volume", value)}
          />
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
            <svg
              viewBox="0 0 350 205"
              className="h-auto w-full"
              role="img"
              aria-label={`Concentration-time curve. Peak concentration ${model.cMax.toFixed(2)} milligrams per liter at ${model.tMax.toFixed(1)} hours.`}
            >
              <line x1="42" y1="174" x2="328" y2="174" stroke="#cbd5e1" />
              <line x1="42" y1="40" x2="42" y2="174" stroke="#cbd5e1" />
              <line x1="42" y1="107" x2="328" y2="107" stroke="#e2e8f0" strokeDasharray="4 4" />
              <path d={model.path} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
              <circle
                cx={42 + (model.tMax / model.chartHours) * 286}
                cy={174 - (model.cMax / model.yMax) * 134}
                r="4"
                fill="#1d4ed8"
              />
              <text x="185" y="198" textAnchor="middle" className="fill-slate-600 text-[10px] font-bold">
                Time (hours)
              </text>
              <text x="18" y="108" textAnchor="middle" transform="rotate(-90 18 108)" className="fill-slate-600 text-[10px] font-bold">
                Concentration (mg/L)
              </text>
              <text x="42" y="188" textAnchor="middle" className="fill-slate-500 text-[9px]">0</text>
              <text x="328" y="188" textAnchor="middle" className="fill-slate-500 text-[9px]">{model.chartHours} h</text>
              <text x="37" y="44" textAnchor="end" className="fill-slate-500 text-[9px]">{model.yMax.toFixed(1)}</text>
            </svg>
          </div>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-live="polite">
            {[
              ["Cmax", `${model.cMax.toFixed(2)} mg/L`],
              ["Tmax", `${model.tMax.toFixed(1)} h`],
              ["AUC₀–∞", `${model.auc.toFixed(1)} mg·h/L`],
              ["Half-life", `${model.halfLife.toFixed(1)} h`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
                <dt className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500">{label}</dt>
                <dd className="mt-1 text-sm font-black text-slate-950">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <p id="pk-model-note" className="rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-950 ring-1 ring-inset ring-amber-200">
        <strong>Model boundary:</strong> This is an educational, linear one-compartment oral model
        with first-order absorption and elimination. It omits distribution phases, saturation,
        repeated dosing, variability, and target-site exposure, so it must not be used to choose a
        clinical dose.
      </p>
    </section>
  );
}
