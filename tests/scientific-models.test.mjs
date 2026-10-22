import assert from "node:assert/strict";
import test from "node:test";
import { angularDistanceDegrees, concentrationAt, summarizePk, describePkChange,
  hasFunctionalEvidence, isPoseEligible, passesLipinski } from "../src/lib/scientific-models.ts";

const baseline = { dose: 100, bioavailability: 70, absorptionRate: 1.2, clearance: 5, volume: 40 };
const close = (actual, expected, tolerance = 1e-9) =>
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);

test("butane angle proximity matches the six named conformations", () => {
  for (const [angle, expected] of [[0, "syn"], [60, "gauche"], [120, "eclipsed"],
    [180, "anti"], [240, "eclipsed"], [300, "gauche"], [360, "syn"]]) {
    const near = (target) => angularDistanceDegrees(angle, target) <= 25;
    const actual = near(180) ? "anti" : near(60) || near(300) ? "gauche" :
      near(0) ? "syn" : near(120) || near(240) ? "eclipsed" : "rotating";
    assert.equal(actual, expected);
  }
  close(angularDistanceDegrees(-60, 300), 0);
  close(angularDistanceDegrees(1080, 0), 0);
  close(angularDistanceDegrees(359, 1), 2);
  close(angularDistanceDegrees(25, 0), 25);
});

test("PK clearance, F, dose, and absorption changes have the stated AUC effects", () => {
  const original = summarizePk(baseline);
  close(original.auc, 14);
  close(summarizePk({ ...baseline, clearance: 10 }).auc, original.auc / 2);
  close(summarizePk({ ...baseline, bioavailability: 35 }).auc, original.auc / 2);
  close(summarizePk({ ...baseline, dose: 200 }).auc, original.auc * 2);
  const slow = summarizePk({ ...baseline, absorptionRate: 0.4 });
  close(slow.auc, original.auc);
  assert.ok(slow.tMax > original.tMax);
  assert.ok(slow.cMax < original.cMax);
});

test("PK equal absorption/elimination limit and flip-flop behavior remain finite", () => {
  const equal = { ...baseline, absorptionRate: baseline.clearance / baseline.volume };
  const model = summarizePk(equal);
  close(model.tMax, 8);
  close(model.cMax, (0.7 * 100 / 40) * Math.exp(-1));
  close(concentrationAt(0, equal), 0);
  const flip = summarizePk({ ...baseline, clearance: 20, volume: 5, absorptionRate: 0.2 });
  assert.ok(flip.terminalHalfLife > flip.halfLife);
  assert.match(describePkChange({ ...baseline, clearance: 20, volume: 5, absorptionRate: 0.2 }, baseline), /absorption-limited/);
});

test("PK feedback describes current inputs, including multi-control changes", () => {
  assert.match(describePkChange({ ...baseline, clearance: 10 }, baseline), /decreased by 50.0%.*14.0 → 7.0/);
  assert.match(describePkChange({ ...baseline, clearance: 2.5 }, baseline), /increased by 100.0%/);
  assert.match(describePkChange({ ...baseline, absorptionRate: 0.4, dose: 200 }, baseline), /increased by 100.0%.*14.0 → 28.0/);
  assert.match(describePkChange({ ...baseline, clearance: 10, dose: 200 }, baseline), /unchanged/);
});

test("functional evidence does not require a human-genetics input", () => {
  assert.equal(hasFunctionalEvidence(0), false);
  assert.equal(hasFunctionalEvidence(1), false);
  assert.equal(hasFunctionalEvidence(2), true);
  assert.equal(hasFunctionalEvidence(3), true);
});

test("Lipinski heuristic permits one violation, rejects two, and includes boundaries", () => {
  const boundary = { mw: 500, logp: 5, hbd: 5, hba: 10 };
  assert.equal(passesLipinski(boundary), true);
  for (const key of Object.keys(boundary)) {
    assert.equal(passesLipinski({ ...boundary, [key]: boundary[key] + 1 }), true);
  }
  assert.equal(passesLipinski({ ...boundary, mw: 501, logp: 6 }), false);
  assert.equal(passesLipinski({ ...boundary, hbd: 6, hba: 11 }), false);
});

test("severe-clash rejection is a hard gate, not a compensable score", () => {
  for (const clashes of [1, 8, 100]) assert.equal(isPoseEligible(clashes, true), false);
  assert.equal(isPoseEligible(0, true), true);
  assert.equal(isPoseEligible(8, false), true);
});
