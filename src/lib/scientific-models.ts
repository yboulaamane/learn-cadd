/** Small, deterministic teaching-model calculations; not validated research models. */
export function angularDistanceDegrees(first: number, second: number): number {
  return Math.abs((((first - second) % 360 + 540) % 360) - 180);
}

export interface PkInputs {
  dose: number;
  bioavailability: number;
  absorptionRate: number;
  clearance: number;
  volume: number;
}

export function concentrationAt(time: number, inputs: PkInputs): number {
  const fractionAvailable = inputs.bioavailability / 100;
  const eliminationRate = inputs.clearance / inputs.volume;
  const scale = (fractionAvailable * inputs.dose) / inputs.volume;
  if (Math.abs(inputs.absorptionRate - eliminationRate) < 0.0001) {
    return scale * inputs.absorptionRate * time * Math.exp(-eliminationRate * time);
  }
  return scale * (inputs.absorptionRate / (inputs.absorptionRate - eliminationRate)) *
    (Math.exp(-eliminationRate * time) - Math.exp(-inputs.absorptionRate * time));
}

export function summarizePk(inputs: PkInputs) {
  const eliminationRate = inputs.clearance / inputs.volume;
  const halfLife = Math.log(2) / eliminationRate;
  const tMax = Math.abs(inputs.absorptionRate - eliminationRate) < 0.0001
    ? 1 / eliminationRate
    : Math.log(inputs.absorptionRate / eliminationRate) / (inputs.absorptionRate - eliminationRate);
  return {
    halfLife,
    terminalHalfLife: Math.log(2) / Math.min(inputs.absorptionRate, eliminationRate),
    tMax,
    cMax: concentrationAt(tMax, inputs),
    auc: ((inputs.bioavailability / 100) * inputs.dose) / inputs.clearance,
    suggestedHours: Math.max(12, Math.min(72, Math.ceil(Math.max(5 * halfLife, 2 * tMax)))),
  };
}

export function describePkChange(inputs: PkInputs, baseline: PkInputs): string {
  const current = summarizePk(inputs);
  const original = summarizePk(baseline);
  const relativeChange = (current.auc / original.auc - 1) * 100;
  const direction = Math.abs(relativeChange) < 0.05 ? "unchanged" :
    relativeChange > 0 ? "increased" : "decreased";
  const change = direction === "unchanged" ? "" : ` by ${Math.abs(relativeChange).toFixed(1)}%`;
  return `With the current inputs, AUC is ${direction}${change}: ${original.auc.toFixed(1)} → ${current.auc.toFixed(1)} mg·h/L. AUC = F × dose / clearance; absorption rate and volume do not enter that formula in this linear model. Cmax is ${current.cMax.toFixed(2)} mg/L and Tmax is ${current.tMax.toFixed(1)} h. Elimination half-life is ${current.halfLife.toFixed(1)} h.` +
    (inputs.absorptionRate < inputs.clearance / inputs.volume
      ? " Absorption is slower than elimination: the oral terminal slope is absorption-limited (flip-flop kinetics), not the elimination half-life."
      : "");
}

export function hasFunctionalEvidence(perturbation: number): boolean {
  // Human genetics can strengthen a hypothesis; its absence is not automatic invalidation.
  return perturbation >= 2;
}

export function passesLipinski(compound: { mw: number; logp: number; hbd: number; hba: number }): boolean {
  return [compound.mw > 500, compound.logp > 5, compound.hbd > 5, compound.hba > 10]
    .filter(Boolean).length <= 1;
}

export function isPoseEligible(severeClashes: number, rejectClashes: boolean): boolean {
  return !rejectClashes || severeClashes === 0;
}
