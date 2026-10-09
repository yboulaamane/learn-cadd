"use client";

import React, { useState } from "react";
import { 
  Activity, 
  Layers, 
  Flame
} from "lucide-react";
import { Quiz } from "@/components/Quiz";

const RT_KCAL = 0.592;

function formatConcentration(dg: number) {
  if (dg >= 0) return "≥ 1 M";
  const kdM = Math.exp(dg / RT_KCAL);
  if (kdM < 1e-9) return `${(kdM * 1e12).toFixed(1)} pM`;
  if (kdM < 1e-6) return `${(kdM * 1e9).toFixed(1)} nM`;
  if (kdM < 1e-3) return `${(kdM * 1e6).toFixed(0)} µM`;
  return `${(kdM * 1e3).toFixed(0)} mM`;
}

export default function LigandReceptorInteractionsPage() {
  const [distance, setDistance] = useState(2.9);
  const [angle, setAngle] = useState(180);
  const [nonpolarArea, setNonpolarArea] = useState(60);
  const [unmatchedPolar, setUnmatchedPolar] = useState(false);

  // Benzamidine–trypsin S1 ledger. Magnitudes are teaching values chosen so the
  // solvent-aware total lands near the measured Ki (~20 µM, about −6.4 kcal/mol).
  const [saltOn, setSaltOn] = useState(true);
  const [polarOn, setPolarOn] = useState(true);
  const [countSolvent, setCountSolvent] = useState(true);
  const [s1Area, setS1Area] = useState(72);
  const [frozenRotors, setFrozenRotors] = useState(0);

  const angularFactor = Math.cos(((180 - angle) * Math.PI) / 180) ** 2;

  const calculateEnergy = (r: number) => {
    const r0 = 2.9;
    const depth = 4.0;
    const repulsion = depth * Math.pow(r0 / r, 12);
    const attraction = depth * 2 * Math.pow(r0 / r, 6);
    const energy = repulsion - attraction * angularFactor;
    return Math.min(Math.max(energy, -depth), 8);
  };

  const currentEnergy = calculateEnergy(distance);

  const hydrophobicDg = -0.025 * nonpolarArea;
  const polarPenalty = unmatchedPolar ? 4.5 : 0;
  const solventDg = hydrophobicDg + polarPenalty;

  const saltAttraction = saltOn ? -6 : 0;
  const saltDesolv = saltOn && countSolvent ? 3 : 0;
  const polarAttraction = polarOn ? -3.5 : 0;
  const polarDesolv = polarOn && countSolvent ? 2 : 0;
  const hydrophobicBind = -0.025 * s1Area;
  const rotorPenalty = frozenRotors * 0.8;
  const ledgerG = saltAttraction + saltDesolv + polarAttraction + polarDesolv + hydrophobicBind + rotorPenalty;
  const naiveG = (saltOn ? -6 : 0) + (polarOn ? -3.5 : 0) + hydrophobicBind;

  const loadBenzamidine = () => {
    setSaltOn(true);
    setPolarOn(true);
    setCountSolvent(true);
    setS1Area(72);
    setFrozenRotors(0);
  };

  const generateCurvePath = () => {
    let path = "M";
    for (let r = 2.0; r <= 6.0; r += 0.05) {
      const x = 50 + (r - 2.0) * 60; 
      const energy = calculateEnergy(r);
      const y = 80 - energy * 10; 
      path += `${r === 2.0 ? "" : " L"}${x},${y}`;
    }
    return path;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1>Module 3: Fundamentals of Ligand-Receptor Interactions</h1>
        <p className="lead text-slate-800">
          Analyze the energetic drivers behind ligand binding. Explore Gibbs free energy, calculate potential energy curves, and inspect the structural basis of the hydrophobic effect.
        </p>
      </div>

      <hr className="border-slate-200" />

      {/* Learning outcomes */}
      <section className="rounded-xl border border-border bg-surface p-5 space-y-2">
        <h2 className="!mt-0 !text-base font-bold">Learning outcomes</h2>
        <ul className="list-disc pl-5 text-sm text-slate-800 space-y-1 leading-relaxed">
          <li>Decompose binding free energy into enthalpic and entropic contributions.</li>
          <li>Identify the major non-covalent interactions and their characteristic geometries.</li>
          <li>Explain the hydrophobic effect and why desolvation can dominate an affinity change.</li>
          <li>Use ligand efficiency and LLE to compare hits of different sizes and lipophilicities.</li>
          <li>Name the four ways the pairwise-contact picture of binding breaks down.</li>
        </ul>
      </section>

      {/* Section 1: Recognition Models */}
      <section className="space-y-4">
        <h2>1. Molecular Recognition Models</h2>
        <p>
          How do a drug molecule and its target protein recognize each other in a crowded biological environment? Two classical theories explain this process:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h3 className="font-bold text-sm text-slate-900">Lock-and-Key Model</h3>
            <p className="text-sm text-slate-800 leading-relaxed">
              Formulated by Emil Fischer in 1894. Suggests the receptor and ligand possess complementary, rigid geometries. It explains high specificity but fails to account for structural plasticity.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h3 className="font-bold text-sm text-slate-900">Induced-Fit Model</h3>
            <p className="text-sm text-slate-800 leading-relaxed">
              Proposed by Daniel Koshland in 1958. Proposes that ligand binding triggers conformational rearrangements in the receptor pocket to optimize contacts, matching thermodynamic realities.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Thermodynamics */}
      <section className="space-y-4">
        <h2>2. Thermodynamics of Binding</h2>
        <p>
          The affinity of a ligand for its receptor is defined by the change in Gibbs Free Energy (ΔG) upon complex formation. A more negative ΔG corresponds to tighter binding (higher affinity):
        </p>
        
        <div className="flex flex-col items-center justify-center p-5 bg-slate-50 border border-slate-200 rounded-xl select-none my-2 not-prose">
          <div className="text-2xl font-mono font-bold tracking-wider text-slate-900">
            ΔG = ΔH - TΔS
          </div>
          <div className="text-sm text-slate-800 font-bold uppercase tracking-widest mt-1">
             Gibbs Free Energy Equation
          </div>
        </div>

        <p className="pt-2">
          Gibbs Free Energy change is directly related to the binding dissociation constant (<em>K_d</em>) by the fundamental thermodynamic equilibrium equation:
        </p>

        <div className="flex flex-col items-center justify-center p-5 bg-slate-50 border border-slate-200 rounded-xl select-none my-2 not-prose">
          <div className="text-2xl font-mono font-bold tracking-wider text-slate-900">
            ΔG = R × T × ln(K_d)
          </div>
          <div className="text-sm text-slate-800 font-bold uppercase tracking-widest mt-1">
             Relationship to Equilibrium Dissociation Constant
          </div>
        </div>

        <p className="text-sm text-slate-800 leading-relaxed">
          Where <em>R</em> is the gas constant and <em>T</em> is the absolute temperature. Because of this logarithmic relationship, small, linear changes in Gibbs Free Energy translate into exponential improvements in binding affinity:
        </p>

        <div className="overflow-x-auto not-prose border border-slate-200 rounded-lg my-2">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left font-bold text-slate-900">ΔG (at 298 K)</th>
                <th className="px-4 py-2 text-left font-bold text-slate-900">Affinity Constant (K_d)</th>
                <th className="px-4 py-2 text-left font-bold text-slate-900">Qualitative Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-slate-800">
              <tr>
                <td className="px-4 py-2 font-mono font-semibold">-4.1 kcal/mol</td>
                <td className="px-4 py-2 font-mono">1.0 mM (Millimolar)</td>
                <td className="px-4 py-2 text-slate-600">Very weak binding, typical of small fragments.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono font-semibold">-8.2 kcal/mol</td>
                <td className="px-4 py-2 font-mono">1.0 µM (Micromolar)</td>
                <td className="px-4 py-2 text-indigo-700">Moderate binding, typical of high-throughput screen hits.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono font-semibold">-12.3 kcal/mol</td>
                <td className="px-4 py-2 font-mono">1.0 nM (Nanomolar)</td>
                <td className="px-4 py-2 text-emerald-700 font-semibold">Tightly bound drug candidate.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono font-semibold">-16.4 kcal/mol</td>
                <td className="px-4 py-2 font-mono">1.0 pM (Picomolar)</td>
                <td className="px-4 py-2 text-purple-700 font-semibold">Exceptional affinity binding, rare and highly optimized.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5"><Flame size={14} className="text-red-500" /> Enthalpy (ΔH)</h3>
            <p className="text-sm leading-relaxed text-slate-800">
              Refers to the release of heat resulting from the formation of specific, directional non-covalent contacts (hydrogen bonds, ionic pairs, van der Waals, and halogen bonds) between the ligand and target.
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5"><Activity size={14} className="text-blue-500" /> Entropy (-TΔS)</h3>
            <p className="text-sm leading-relaxed text-slate-800">
              Represents the change in disorder. Complexation restricts ligand and side-chain rotation, costing conformational entropy. However, this penalty is offset by the <strong>hydrophobic effect</strong>: water displacement from hydrophobic surfaces into bulk.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Widget 1: Bond energy curve */}
      <section className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-slate-900" />
          <h3 className="font-bold text-sm text-slate-900">Interactive Playground: Hydrogen-Bond Distance and Angle</h3>
        </div>
        <p className="text-sm text-slate-800">
          Leave the donor–acceptor distance at 2.9 Å and bend the angle. A hydrogen bond that looks right in distance can still be weak, because the attraction is directional. The curve is a model potential, not a measured enthalpy.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-white p-5 rounded-lg border border-slate-200">
          
          {/* Slider & Meter */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => { setDistance(2.9); setAngle(180); }}
                className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-800 hover:border-slate-500"
              >
                Linear, 2.9 Å
              </button>
              <button
                type="button"
                onClick={() => { setDistance(2.9); setAngle(120); }}
                className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-800 hover:border-slate-500"
              >
                Same distance, bent
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-sm text-slate-800 font-bold">
                <label htmlFor="hbond-distance">Donor–acceptor distance (Å)</label>
                <output htmlFor="hbond-distance" className="font-bold text-slate-900">{distance.toFixed(2)} Å</output>
              </div>
              <input
                id="hbond-distance"
                type="range"
                min="1.8"
                max="5.5"
                step="0.05"
                value={distance}
                onChange={(e) => setDistance(parseFloat(e.target.value))}
                aria-describedby="hbond-model-boundary"
                className="w-full h-1.5 bg-slate-100 rounded appearance-none cursor-pointer accent-slate-900"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-sm text-slate-800 font-bold">
                <label htmlFor="hbond-angle">D–H···A angle</label>
                <output htmlFor="hbond-angle" className="font-bold text-slate-900">{angle.toFixed(0)}°</output>
              </div>
              <input
                id="hbond-angle"
                type="range"
                min="90"
                max="180"
                step="1"
                value={angle}
                onChange={(e) => setAngle(parseFloat(e.target.value))}
                aria-describedby="hbond-model-boundary"
                className="w-full h-1.5 bg-slate-100 rounded appearance-none cursor-pointer accent-slate-900"
              />
              <p className="text-xs text-slate-600">180° is linear. The attractive term is scaled by cos² of the bend, now {(angularFactor * 100).toFixed(0)}% of a linear bond.</p>
            </div>

            <svg viewBox="0 0 180 90" role="img" aria-label={`Hydrogen-bond geometry at ${angle.toFixed(0)} degrees`} className="w-full max-w-[240px] rounded-lg border border-slate-200 bg-slate-50">
              <line x1="28" y1="68" x2="78" y2="68" stroke="#334155" strokeWidth="2" />
              <line
                x1="78"
                y1="68"
                x2={78 + 48 * Math.cos(((180 - angle) * Math.PI) / 180)}
                y2={68 - 48 * Math.sin(((180 - angle) * Math.PI) / 180)}
                stroke="#0284c7"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              <circle cx="28" cy="68" r="7" fill="#0f172a" />
              <circle cx="78" cy="68" r="5" fill="#e2e8f0" stroke="#334155" />
              <circle
                cx={78 + 48 * Math.cos(((180 - angle) * Math.PI) / 180)}
                cy={68 - 48 * Math.sin(((180 - angle) * Math.PI) / 180)}
                r="7"
                fill="#0284c7"
              />
              <text x="28" y="86" textAnchor="middle" fontSize="9" fill="#334155">donor</text>
              <text x="78" y="86" textAnchor="middle" fontSize="9" fill="#334155">H</text>
              <text x="150" y="16" fontSize="9" fill="#0369a1">acceptor</text>
            </svg>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
              <span className="text-sm text-slate-800 font-bold uppercase tracking-wider block">Model potential</span>
              <p className="text-xl font-bold text-slate-950">
                {currentEnergy.toFixed(2)}
                <span className="text-sm text-slate-800 font-medium ml-1">kcal/mol</span>
              </p>
              <div className="text-sm leading-normal text-slate-800">
                {distance < 2.4 ? (
                  <span className="text-red-700 font-bold">The heavy atoms are inside van der Waals contact. Repulsion dominates.</span>
                ) : distance >= 2.7 && distance <= 3.2 && angle >= 160 && currentEnergy < -1.5 ? (
                  <span className="text-emerald-700 font-bold">Distance and angle are both in the usual hydrogen-bond range.</span>
                ) : distance >= 2.7 && distance <= 3.2 && angle < 160 ? (
                  <span className="text-amber-800 font-bold">The distance still looks like a hydrogen bond. The bend has removed most of the attraction.</span>
                ) : (
                  <span>Outside the short hydrogen-bond well.</span>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Graph SVG */}
          <div className="md:col-span-7 flex justify-center">
            <div className="w-full max-w-[280px] aspect-square relative bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
              
              <div className="relative flex-1">
                <svg
                  viewBox="0 0 300 200"
                  className="w-full h-full"
                  role="img"
                  aria-label={`Illustrative hydrogen-bond distance potential at ${distance.toFixed(2)} angstroms and ${currentEnergy.toFixed(2)} kilocalories per mole`}
                >
                  <line x1="0" y1="80" x2="300" y2="80" stroke="currentColor" className="text-slate-300" strokeWidth="0.5" strokeDasharray="3,3" />
                  
                  {/* Energy Curve Path */}
                  <path d={generateCurvePath()} fill="none" stroke="currentColor" className="text-slate-900" strokeWidth="1.8" />
                  
                  {/* Active Point marker */}
                  {(() => {
                    const x = 50 + (distance - 2.0) * 60;
                    const y = 80 - currentEnergy * 10;
                    return (
                      <g>
                        <circle cx={x} cy={y} r="4" fill="currentColor" className="text-slate-900" stroke="currentColor" strokeWidth="1" />
                      </g>
                    );
                  })()}
                  
                  {/* Annotations */}
                  <text x="10" y="72" fill="#1e293b" className="text-sm font-bold fill-slate-800" fontSize="10">0 Energy (Unbound)</text>
                  <text x="230" y="92" fill="#1e293b" className="text-sm font-bold fill-slate-800" fontSize="10">Distance (r)</text>
                  <text x="10" y="20" fill="#1e293b" className="text-sm font-bold fill-slate-800" fontSize="10">Repulsion (+V)</text>
                  <text x="10" y="180" fill="#1e293b" className="text-sm font-bold fill-slate-800" fontSize="10">Attraction (-V)</text>
                </svg>
              </div>

              <div className="text-sm text-center text-slate-800 font-bold mt-1">
                Illustrative radial interaction potential
              </div>
            </div>
          </div>
        </div>
        <p id="hbond-model-boundary" className="text-xs leading-relaxed text-slate-600">
          The curve is a 12-6 well whose attraction is scaled by cos² of the bend away from 180°.
          It omits protonation, the competing hydrogen bond to water, and the rest of the
          electrostatic field. A negative value here is not an enthalpy.
        </p>
      </section>

      {/* Section 3: Medicinal-chemistry efficiency metrics */}
      <section className="space-y-4">
        <h2>3. From Affinity to Design Efficiency</h2>
        <p>
          Potency is essential, but it does not show what a molecule had to become to achieve that
          potency. Medicinal chemists use efficiency metrics and thermodynamic measurements to
          compare compounds while tracking size, lipophilicity, and binding mechanism.
        </p>

        <div className="overflow-x-auto not-prose rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-slate-900">Measure</th>
                <th className="px-4 py-3 text-left font-bold text-slate-900">What it adds</th>
                <th className="px-4 py-3 text-left font-bold text-slate-900">Important limit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              <tr>
                <td className="px-4 py-3 align-top font-bold text-slate-950">Ligand efficiency (LE)</td>
                <td className="px-4 py-3 align-top">Relates binding free energy to non-hydrogen atom count, helping compare differently sized hits.</td>
                <td className="px-4 py-3 align-top">Size normalization has known biases; compare related series and use the same affinity endpoint.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top font-bold text-slate-950">Lipophilic ligand efficiency (LLE or LipE)</td>
                <td className="px-4 py-3 align-top"><span className="font-mono">pActivity - logD</span> asks whether potency rises faster than lipophilicity.</td>
                <td className="px-4 py-3 align-top">State the assay endpoint, pH, and lipophilicity measure. The octanol-water reference is useful, not a universal measure of specificity.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top font-bold text-slate-950">Isothermal titration calorimetry (ITC)</td>
                <td className="px-4 py-3 align-top">A titration can estimate affinity, stoichiometry, and binding enthalpy; entropy is inferred from the free-energy relationship.</td>
                <td className="px-4 py-3 align-top">Buffer ionization, proton transfer, concentration accuracy, and coupled conformational changes can affect the observed heat.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="not-prose grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-950">Enthalpy-entropy compensation</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Two ligands can have similar affinity with different enthalpic and entropic profiles.
              Solvent reorganization, protonation, and conformational change couple the terms, so an
              apparently favorable enthalpy does not automatically identify a better lead.
            </p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-950">Water is part of the mechanism</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Displacing an unfavorable water can help binding, while disrupting a stable bridging
              network can hurt it. Inspect water networks and receptor state instead of treating every
              buried water release as an automatic gain.
            </p>
          </article>
        </div>

        <aside className="not-prose rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
          <strong>Use a panel, not a single winning metric:</strong> track potency, LE or LLE,
          solubility, permeability, clearance, selectivity, and assay quality together. Optimizing one
          composite score can hide trade-offs or amplify measurement noise.
        </aside>
      </section>

      {/* Section 4: Non-covalent Interactions */}
      <section className="space-y-4">
        <h2>4. Types of Non-Covalent Interactions</h2>

        <p className="text-sm text-slate-800 leading-relaxed">
          Each interaction below is a physical phenomenon first and a line of arithmetic second. Module 4 shows how a force field turns them into computable terms — hydrogen bonds and salt bridges fall out of the Coulomb term, dispersion and steric clash out of the Lennard-Jones term — and every docking score (Module 6) and free-energy estimate (Module 10) you meet later is built from exactly these contributions.
        </p>

        <div className="space-y-3 not-prose">
          <div className="flex gap-3 p-3.5 rounded-lg border border-border bg-white">
            <span className="h-5 w-5 text-sm font-bold bg-slate-100 border border-border rounded flex items-center justify-center flex-shrink-0 text-slate-900">1</span>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Hydrogen Bonds</h4>
              <p className="text-sm text-slate-800 mt-0.5 leading-relaxed">
                Formed between a hydrogen atom covalently bound to an electronegative atom (Donor: O-H, N-H) and another electronegative atom with lone pairs (Acceptor: O, N). Strong, highly directional, with typical optimal donor-acceptor distances of <strong>2.7–3.2 Å</strong> and bond angles close to <strong>180°</strong>.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3.5 rounded-lg border border-border bg-white">
            <span className="h-5 w-5 text-sm font-bold bg-slate-100 border border-border rounded flex items-center justify-center flex-shrink-0 text-slate-900">2</span>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Halogen Bonds (σ-Hole Interactions)</h4>
              <p className="text-sm text-slate-800 mt-0.5 leading-relaxed">
                An interaction between an electronegative atom and the electropositive region on the tip of a halogen atom (Cl, Br, or I) bound to carbon. This positive region, known as the <strong>σ-hole</strong>, renders halogen bonds highly directional.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3.5 rounded-lg border border-border bg-white">
            <span className="h-5 w-5 text-sm font-bold bg-slate-100 border border-border rounded flex items-center justify-center flex-shrink-0 text-slate-900">3</span>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Electrostatic Interactions</h4>
              <p className="text-sm text-slate-800 mt-0.5 leading-relaxed">
                Salt bridges formed between oppositely charged functional groups (e.g. protonated amine on ligand and carboxylate side-chain of Aspartate or Glutamate on receptor). These interactions are long-range (V ∝ 1/r).
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3.5 rounded-lg border border-border bg-white">
            <span className="h-5 w-5 text-sm font-bold bg-slate-100 border border-border rounded flex items-center justify-center flex-shrink-0 text-slate-900">4</span>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Cation-π Interactions</h4>
              <p className="text-sm text-slate-800 mt-0.5 leading-relaxed">
                A special ion-dipole interaction between a cation (e.g. a protonated amine, Lys-NH₃⁺, or Arg guanidinium) and the electron-rich π face of an aromatic ring. Because the effect depends on ring electron density, <strong>electron-donating</strong> substituents (e.g. -NH₂) strengthen it while <strong>electron-withdrawing</strong> groups (e.g. -CN) weaken it. This explains why electron-rich Trp and Tyr engage in cation-π contacts far more often than Phe.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3.5 rounded-lg border border-border bg-white">
            <span className="h-5 w-5 text-sm font-bold bg-slate-100 border border-border rounded flex items-center justify-center flex-shrink-0 text-slate-900">5</span>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Van der Waals / London Dispersion & π-π Stacking</h4>
              <p className="text-sm text-slate-800 mt-0.5 leading-relaxed">
                Weak (~0.5–1 kcal/mol each), short-range forces from transient, induced dipoles between all atoms in close contact. Individually negligible, but summed over a well-packed binding pocket they contribute substantially to affinity — this is the energetic basis of shape complementarity. <strong>π-π stacking</strong> between aromatic rings (parallel-displaced or T-shaped, ~3.5–4.0 Å) is a directional special case.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Widget 2: Desolvation */}
      <section className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-slate-900" />
          <h3 className="font-bold text-sm text-slate-900">Interactive Playground: What Burial Is Worth</h3>
        </div>
        <p className="text-sm text-slate-800">
          Bury nonpolar surface, then add one polar group that has no partner. The hydrophobic estimate is the old rule of thumb, about −25 cal/mol per Å² (−0.025 kcal/mol/Å²). An unmatched polar group costs more than that gain. The readout is a free-energy estimate, not a measured −TΔS: at room temperature the hydrophobic effect is often discussed as entropy, while many protein–ligand ITC profiles are enthalpic.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-5 rounded-lg border border-slate-200">
          <div className="md:col-span-7 space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-sm font-bold text-slate-800">
                <label htmlFor="nonpolar-area">Nonpolar surface buried</label>
                <output htmlFor="nonpolar-area">{nonpolarArea.toFixed(0)} Å²</output>
              </div>
              <input
                id="nonpolar-area"
                type="range"
                min="0"
                max="120"
                step="2"
                value={nonpolarArea}
                onChange={(e) => setNonpolarArea(parseFloat(e.target.value))}
                className="w-full h-1.5 rounded appearance-none cursor-pointer accent-slate-900 bg-slate-100"
              />
            </div>
            <label className="flex items-start gap-2 text-sm text-slate-800">
              <input
                type="checkbox"
                checked={unmatchedPolar}
                onChange={(e) => setUnmatchedPolar(e.target.checked)}
                className="mt-1 accent-slate-900"
              />
              <span>Also bury one carbonyl or hydroxyl with no hydrogen-bond partner (+4.5 kcal/mol).</span>
            </label>
            <svg viewBox="0 0 280 120" role="img" aria-label="Pocket cross-section showing buried nonpolar surface and an optional unmatched polar group" className="w-full rounded-lg border border-slate-200 bg-slate-50">
              <path d="M30 20 H160 Q200 20 200 55 V100 H30 Z" fill="#e2e8f0" stroke="#64748b" />
              <text x="40" y="112" fontSize="11" fill="#334155">pocket</text>
              <rect x="70" y="48" width={Math.max(12, nonpolarArea * 0.7)} height="22" rx="4" fill="#334155" />
              <text x="70" y="42" fontSize="11" fill="#334155">nonpolar contact</text>
              {unmatchedPolar && (
                <g>
                  <circle cx="230" cy="62" r="14" fill="#fee2e2" stroke="#dc2626" />
                  <text x="230" y="66" textAnchor="middle" fontSize="11" fontWeight="700" fill="#991b1b">C=O</text>
                  <text x="214" y="92" fontSize="11" fill="#991b1b">no partner</text>
                </g>
              )}
            </svg>
          </div>
          <div className="md:col-span-5 space-y-2 text-sm">
            <div className="flex justify-between rounded border border-slate-200 bg-slate-50 px-3 py-2">
              <span>Hydrophobic burial</span>
              <span className="font-mono font-bold">{hydrophobicDg.toFixed(2)} kcal/mol</span>
            </div>
            <div className="flex justify-between rounded border border-slate-200 bg-slate-50 px-3 py-2">
              <span>Unmatched polar group</span>
              <span className="font-mono font-bold">{polarPenalty === 0 ? "0.00" : `+${polarPenalty.toFixed(2)}`} kcal/mol</span>
            </div>
            <div className="flex justify-between rounded border border-slate-900 bg-slate-900 px-3 py-2 text-white">
              <span>Net estimate</span>
              <span className="font-mono font-bold">{solventDg.toFixed(2)} kcal/mol</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-700">
              {unmatchedPolar
                ? `The ${nonpolarArea.toFixed(0)} Å² of nonpolar burial is worth ${hydrophobicDg.toFixed(1)} kcal/mol. One unsatisfied polar contact (+4.5) outweighs it. This is why a hydrogen bond that looks good on a figure can still lose affinity: the desolvation was paid and the partner was not there.`
                : `At ${nonpolarArea.toFixed(0)} Å² the rule of thumb gives ${hydrophobicDg.toFixed(1)} kcal/mol. Turn on the unmatched carbonyl and watch that gain disappear.`}
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Widget 3: Benzamidine ledger */}
      <section className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2">
          <Flame size={18} className="text-slate-900" />
          <h3 className="font-bold text-base text-slate-900">Interactive Playground: Benzamidine in Trypsin</h3>
        </div>
        <p className="text-sm text-slate-800">
          Benzamidine binds the S1 pocket of trypsin. The amidinium faces Asp189, the ring fills the hydrophobic well, and the measured Ki is about 20 µM (near −6.4 kcal/mol). Build the same complex as a ledger. Switch desolvation off to see the nanomolar answer a pairwise contact sum invents.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-5 rounded-lg border border-slate-200">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={loadBenzamidine} className="rounded-md border border-slate-900 bg-slate-900 px-2.5 py-1 text-xs font-bold text-white">
                Measured-like balance
              </button>
              <button
                type="button"
                onClick={() => { loadBenzamidine(); setCountSolvent(false); }}
                className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-800"
              >
                Contacts only
              </button>
              <button
                type="button"
                onClick={() => { loadBenzamidine(); setFrozenRotors(4); }}
                className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-800"
              >
                Grow four rotors
              </button>
            </div>

            <svg viewBox="0 0 360 170" role="img" aria-label="Schematic of benzamidine in the trypsin S1 pocket, with the amidinium next to Asp189" className="w-full rounded-lg border border-slate-200 bg-slate-50">
              <text x="16" y="22" fontSize="13" fontWeight="700" fill="#0f172a">Trypsin S1</text>
              <path d="M24 40 H210 Q250 40 250 78 V150 H24 Z" fill="#f8fafc" stroke="#94a3b8" />
              <g opacity={saltOn ? 1 : 0.35}>
                <circle cx="58" cy="92" r="18" fill="#fee2e2" stroke="#dc2626" />
                <text x="58" y="96" textAnchor="middle" fontSize="12" fontWeight="700" fill="#991b1b">Asp</text>
                <text x="58" y="128" textAnchor="middle" fontSize="11" fill="#7f1d1d">Asp189</text>
              </g>
              {countSolvent && saltOn && (
                <g>
                  <circle cx="92" cy="58" r="6" fill="#bae6fd" stroke="#0284c7" />
                  <text x="104" y="62" fontSize="11" fill="#0369a1">water</text>
                </g>
              )}
              <polygon points="168,78 184,88 184,106 168,116 152,106 152,88" fill="#e2e8f0" stroke="#334155" strokeWidth="1.5" />
              <text x="168" y="140" textAnchor="middle" fontSize="11" fill="#334155">phenyl</text>
              <line x1="152" y1="97" x2="112" y2="92" stroke="#334155" strokeWidth="2" />
              <circle cx="104" cy="90" r="12" fill="#dbeafe" stroke="#1d4ed8" />
              <text x="104" y="94" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e3a8a">C⁺</text>
              {polarOn && (
                <g>
                  <line x1="184" y1="90" x2="230" y2="70" stroke="#0284c7" strokeDasharray="4 3" />
                  <text x="214" y="60" fontSize="11" fill="#0369a1">Ser190 / Gly219</text>
                </g>
              )}
            </svg>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm text-slate-800">
                <input type="checkbox" checked={saltOn} onChange={(e) => setSaltOn(e.target.checked)} className="accent-slate-900" />
                Amidinium–Asp189 salt bridge
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-800">
                <input type="checkbox" checked={polarOn} onChange={(e) => setPolarOn(e.target.checked)} className="accent-slate-900" />
                Polar contacts to Ser190 / Gly219
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-800">
                <input type="checkbox" checked={countSolvent} onChange={(e) => setCountSolvent(e.target.checked)} className="accent-slate-900" />
                Count desolvation of those polar groups
              </label>
              <div className="space-y-1">
                <div className="flex justify-between text-sm font-bold text-slate-800">
                  <label htmlFor="s1-area">Nonpolar surface buried in S1</label>
                  <output htmlFor="s1-area">{s1Area.toFixed(0)} Å²</output>
                </div>
                <input id="s1-area" type="range" min="0" max="120" step="2" value={s1Area} onChange={(e) => setS1Area(parseFloat(e.target.value))} className="w-full accent-slate-900" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm font-bold text-slate-800">
                  <label htmlFor="frozen-rotors">Extra rotatable bonds frozen on binding</label>
                  <output htmlFor="frozen-rotors">{frozenRotors}</output>
                </div>
                <input id="frozen-rotors" type="range" min="0" max="8" step="1" value={frozenRotors} onChange={(e) => setFrozenRotors(parseInt(e.target.value, 10))} className="w-full accent-slate-900" />
                <p className="text-xs text-slate-600">Benzamidine itself is rigid. Each extra rotor is charged 0.8 kcal/mol, a scoring-function estimate, not an ITC entropy.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-2 text-sm">
            {[
              ["Salt bridge, interaction", saltAttraction],
              ["Desolvation of the ion pair", saltDesolv],
              ["Polar contacts, interaction", polarAttraction],
              ["Desolvation of those contacts", polarDesolv],
              ["Nonpolar burial", hydrophobicBind],
              ["Frozen rotors", rotorPenalty],
            ].map(([label, value]) => (
              <div key={label as string} className="flex items-center justify-between gap-3 border-b border-slate-100 py-1">
                <span className="text-slate-700">{label}</span>
                <span className="font-mono font-bold text-slate-950">{(value as number) > 0 ? "+" : ""}{(value as number).toFixed(1)}</span>
              </div>
            ))}
            <div className="rounded-lg bg-slate-900 p-3 text-white">
              <div className="flex items-center justify-between">
                <span>Ledger total</span>
                <span className="font-mono text-lg font-bold">{ledgerG.toFixed(1)} kcal/mol</span>
              </div>
              <p className="mt-1 text-sm text-slate-200">
                Equivalent Kd if this ledger were a real standard free energy: {formatConcentration(ledgerG)}.
              </p>
            </div>
            <p className="leading-relaxed text-slate-700">
              {countSolvent
                ? `With desolvation included, the same contacts give ${ledgerG.toFixed(1)} kcal/mol (${formatConcentration(ledgerG)}). The contact-only sum is ${naiveG.toFixed(1)} kcal/mol (${formatConcentration(naiveG)}). Benzamidine’s measured Ki is about 20 µM, close to the solvent-aware ledger and far from the contact-only number.`
                : `Desolvation is off, so the ledger is just the contact sum: ${naiveG.toFixed(1)} kcal/mol, equivalent to ${formatConcentration(naiveG)}. Turn desolvation back on. The measured Ki is about 20 µM.`}
            </p>
            <p className="text-xs leading-relaxed text-slate-500">
              Interaction magnitudes are teaching numbers, chosen so the solvent-aware benzamidine case lands near experiment. They are not a force-field result, and the equivalent Kd is only a translation of the ledger through ΔG = RT ln(Kd).
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Where this model breaks */}
      <section className="space-y-4">
        <h2>5. Where This Picture Breaks Down</h2>
        <p>
          The ledger you just moved is a sum of pairwise contacts, with solvent written in or left out. That picture is useful enough to design against, and wrong in four specific ways that resurface throughout the course.
        </p>

        <div className="space-y-3 not-prose">
          <div className="p-4 rounded-lg border border-border bg-white space-y-1.5">
            <h4 className="font-bold text-sm text-slate-900">Interactions are not additive</h4>
            <p className="text-sm text-slate-800 leading-relaxed">
              Adding a hydrogen bond worth 2 kcal/mol to a ligand rarely buys 2 kcal/mol of affinity. The new contact may cost desolvation, restrict a rotatable bond, or strain the pose. Non-additivity is precisely why medicinal chemistry still requires synthesis rather than arithmetic — and why scoring functions (Module 6) fail in the way they do.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-white space-y-1.5">
            <h4 className="font-bold text-sm text-slate-900">The pocket is not rigid</h4>
            <p className="text-sm text-slate-800 leading-relaxed">
              Induced fit above is a cartoon of a much larger effect: side chains rotate, loops close, and some pockets do not exist until a ligand arrives. Anything computed on one fixed structure inherits that structure&apos;s assumptions (Modules 6 and 10).
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-white space-y-1.5">
            <h4 className="font-bold text-sm text-slate-900">Water is a participant, not a background</h4>
            <p className="text-sm text-slate-800 leading-relaxed">
              Every contact you form must first break a contact with water, and a few ordered waters in a pocket can be worth more than a whole substituent. Desolvation is the single most commonly underestimated term in this module.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-white space-y-1.5">
            <h4 className="font-bold text-sm text-slate-900">Affinity is not the objective</h4>
            <p className="text-sm text-slate-800 leading-relaxed">
              ΔG tells you how tightly a ligand binds its target — not whether it is selective, absorbed, metabolically stable, or safe. Ligand efficiency and LLE exist to keep potency honest, and Modules 12 and 15 supply the constraints that ultimately decide whether a tight binder becomes a drug.
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-700">
          Every one of these is a physical shortcoming of the pairwise model, and each is the reason a later technique exists. Module 4 turns these same interactions into computable energy terms; keep the four caveats in mind, because they explain most of what goes wrong afterwards.
        </p>
      </section>

      {/* Quiz Section */}
      <hr className="border-slate-200 my-8" />
      <section className="space-y-5">
        <h2>Knowledge check</h2>
        <Quiz 
          moduleTitle="Module 3: Fundamentals of Ligand-Receptor Interactions"
          questions={[
            {
              question: "Why does locking a highly flexible ligand into its binding site cost entropy?",
              options: [
                "Because the water molecules surrounding the ligand become more ordered.",
                "Because free rotations around single bonds are frozen upon complex formation, reducing the ligand's conformational degrees of freedom.",
                "Because the binding site undergoes a conformational transition to the induced-fit state.",
                "Because the ligand is forced to form electrostatic salt bridges."
              ],
              correctIndex: 1,
              explanation: "Free ligand molecules in solution have high conformational entropy due to rotation about single bonds. When the ligand binds to the receptor, these rotational bonds are locked into a single active conformation. Freezing these degrees of freedom costs conformational entropy, which acts as a thermodynamic barrier (+TΔS penalty) to binding."
            },
            {
              question: "How does the hydrophobic effect drive ligand binding thermodynamically?",
              options: [
                "By changing solvent organization when nonpolar surfaces are buried, which can release constrained interfacial water into bulk solution.",
                "By forming strong hydrogen bonds between the ligand's non-polar groups and target water molecules.",
                "By increasing the enthalpy of the system through hydrophobic dipole interactions.",
                "By rigidifying target side chains to lower conformational entropy barriers."
              ],
              correctIndex: 0,
              explanation: "Burying nonpolar surfaces changes the solvent-exposed area and the organization of nearby water. Releasing constrained interfacial waters can provide a favorable entropic contribution, but the magnitude depends on the local water network and pocket environment."
            },
            {
              question: "What does lipophilic ligand efficiency help reveal within a related series?",
              options: [
                "Whether potency is improving faster than lipophilicity",
                "Whether a protein contains alpha helices",
                "The exact binding pose",
                "The number of crystallographic waters"
              ],
              correctIndex: 0,
              explanation: "LLE or LipE relates pActivity to logD or logP. It helps detect potency gains that mainly come from adding lipophilicity, but the assay endpoint and lipophilicity convention must be consistent."
            },
            {
              question: "Why should an apparently favorable binding enthalpy not be optimized in isolation?",
              options: [
                "Enthalpy cannot be measured",
                "Affinity also reflects entropy, solvent, protonation, and conformational changes",
                "Only molecular weight affects affinity",
                "A favorable enthalpy always means lower selectivity"
              ],
              correctIndex: 1,
              explanation: "Binding terms are coupled. Enthalpy-entropy compensation and experimental conditions can produce similar affinity from different profiles, so the full evidence panel matters."
            }
          ]}
        />
      </section>
    </div>
  );
}
