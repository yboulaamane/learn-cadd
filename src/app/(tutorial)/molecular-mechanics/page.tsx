"use client";

import React, { useState } from "react";
import { Atom, Info, Sliders, TrendingDown, Zap, AlertTriangle } from "lucide-react";
import { Quiz } from "@/components/Quiz";
import { CollapsibleCode } from "@/components/CollapsibleCode";

export default function MolecularMechanicsPage() {
  // Butane C-C-C-C torsion playground
  const [phi, setPhi] = useState<number>(180); // dihedral angle in degrees

  // OPLS-style Fourier torsion parameters for the butane C-C-C-C dihedral (kcal/mol)
  const V1 = 1.411;
  const V2 = -0.271;
  const V3 = 3.145;

  const torsionEnergy = (deg: number) => {
    const p = (deg * Math.PI) / 180;
    return (
      0.5 * V1 * (1 + Math.cos(p)) +
      0.5 * V2 * (1 - Math.cos(2 * p)) +
      0.5 * V3 * (1 + Math.cos(3 * p))
    );
  };

  const currentE = torsionEnergy(phi);

  // Boltzmann populations at 298 K (RT = 0.593 kcal/mol).
  // Butane has one anti well (180) and two equivalent gauche wells (+/-60).
  const RT = 0.593;
  const wAnti = Math.exp(-torsionEnergy(180) / RT);
  const wGauche = 2 * Math.exp(-torsionEnergy(60) / RT);
  const pAnti = (wAnti / (wAnti + wGauche)) * 100;
  const pGauche = (wGauche / (wAnti + wGauche)) * 100;

  // Conformer label for the current angle
  const norm = ((phi % 360) + 360) % 360;
  const near = (target: number, tol: number) => Math.abs(((norm - target + 540) % 360) - 180) > 180 - tol;
  const conformer = near(180, 25)
    ? { name: "Anti (global minimum)", tone: "emerald" }
    : near(60, 25) || near(300, 25)
    ? { name: "Gauche (local minimum)", tone: "emerald" }
    : near(0, 25)
    ? { name: "Syn — fully eclipsed CH₃/CH₃", tone: "rose" }
    : near(120, 25) || near(240, 25)
    ? { name: "Eclipsed CH₃/H", tone: "amber" }
    : { name: "Rotating…", tone: "slate" };

  // Energy curve path for the plot (viewBox 300 x 160; x: 0-360 deg, y: 0-5 kcal/mol)
  const xOf = (deg: number) => 30 + (deg / 360) * 250;
  const yOf = (en: number) => 140 - (en / 5) * 115;
  const curvePath = (() => {
    let d = "M";
    for (let a = 0; a <= 360; a += 2) {
      d += `${a === 0 ? "" : " L"}${xOf(a).toFixed(1)},${yOf(torsionEnergy(a)).toFixed(1)}`;
    }
    return d;
  })();

  // Newman projection geometry. Front carbon substituents at 90/210/330 deg;
  // rear carbon substituents rotated by the dihedral angle phi.
  const NC = { cx: 100, cy: 100, r: 42 };
  const polar = (angleDeg: number, radius: number) => ({
    x: NC.cx + radius * Math.cos((angleDeg * Math.PI) / 180),
    y: NC.cy - radius * Math.sin((angleDeg * Math.PI) / 180),
  });
  const frontSubs = [
    { a: 90, label: "CH₃", major: true },
    { a: 210, label: "H", major: false },
    { a: 330, label: "H", major: false },
  ];
  const rearSubs = [
    { a: 90 + phi, label: "CH₃", major: true },
    { a: 210 + phi, label: "H", major: false },
    { a: 330 + phi, label: "H", major: false },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1>Module 4: Molecular Mechanics &amp; Force Fields</h1>
        <p className="lead text-slate-800">
          Every method that follows — docking scores, MD trajectories, conformational searches — is ultimately calling the same function: a force field that turns a set of atomic coordinates into a single number, the energy. This module is that engine.
        </p>
      </div>

      <hr className="border-slate-200" />

      {/* Section 1 */}
      <section className="space-y-4">
        <h2>1. Atoms and Springs: The Central Approximation</h2>
        <p>
          <strong>Molecular mechanics (MM)</strong> treats a molecule as a set of point masses (atoms) connected by springs (bonds), governed entirely by <em>classical</em> physics. It throws away the electrons.
        </p>
        <p>
          That sounds like an outrageous simplification — and it is. Quantum mechanics gives the true energy, but its cost scales steeply with system size (formally <em>N</em>⁴ or worse for correlated methods), which puts a solvated protein permanently out of reach. MM scales roughly as <em>N</em>², so it can evaluate a 100,000-atom system in milliseconds. <strong>The entire field of computational drug discovery exists inside that trade-off.</strong>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900">What you buy</h4>
            <p className="text-sm text-slate-800 leading-relaxed">
              Speed — enough to score millions of docking poses (Module 8) or integrate a trajectory for microseconds (Module 10). Without MM, none of it is possible.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900">What you pay</h4>
            <p className="text-sm text-slate-800 leading-relaxed">
              No electrons means <strong>no bond breaking or forming</strong>, no charge transfer, and no polarization. A classical force field can never model a chemical reaction — which is why covalent docking and enzymology need QM/MM.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: The master equation */}
      <section className="space-y-4">
        <h2>2. The Force Field Energy Decomposition</h2>
        <p>
          A <strong>force field</strong> is two things: a set of <em>functional forms</em> for the energy, and the <em>parameters</em> that go in them. The total energy is a simple sum of independent terms:
        </p>

        <div className="flex flex-col items-center justify-center p-5 bg-slate-50 border border-slate-200 rounded-xl select-none my-2 not-prose overflow-x-auto">
          <div className="text-sm sm:text-lg font-mono font-bold tracking-tight text-slate-900 text-center whitespace-nowrap">
            E<sub>total</sub> = E<sub>bond</sub> + E<sub>angle</sub> + E<sub>torsion</sub> + E<sub>improper</sub> + E<sub>vdW</sub> + E<sub>electrostatic</sub>
          </div>
          <div className="text-xs text-slate-800 font-bold uppercase tracking-widest mt-2 text-center">
            bonded terms &nbsp;·&nbsp; non-bonded terms
          </div>
        </div>

        <p className="text-sm text-slate-800 leading-relaxed">
          The split matters enormously. <strong>Bonded</strong> terms involve atoms 1–4 bonds apart and describe a molecule&apos;s internal geometry. <strong>Non-bonded</strong> terms act between <em>all</em> remaining atom pairs — including atoms on entirely different molecules. <strong>Non-bonded terms are where drug binding lives:</strong> when a ligand meets a protein, no bonds change, so the entire interaction is vdW plus electrostatics. That is also why they dominate the cost — there are <em>N</em>² of them.
        </p>

        <h3>The Bonded Terms</h3>
        <div className="space-y-3 not-prose">
          {[
            { n: "Bond stretching", f: "E = k_b (r − r₀)²", d: "A harmonic (Hooke's law) spring. r₀ is the equilibrium bond length, k_b the stiffness. Because it is harmonic, the bond can never break — stretch it far enough and the energy just rises forever, quadratically." },
            { n: "Angle bending", f: "E = k_θ (θ − θ₀)²", d: "Also harmonic, penalizing deviation of a three-atom angle from its equilibrium value θ₀ (e.g. ~109.5° for sp³ carbon)." },
            { n: "Torsion (dihedral)", f: "E = Σ (Vₙ/2)[1 + cos(nφ − γ)]", d: "Periodic, not harmonic — because rotating a bond by 360° must return you to where you started. n is the periodicity (n = 3 for the three-fold barrier of an sp³–sp³ bond). This is the softest term and therefore the one that governs conformation." },
            { n: "Improper / out-of-plane", f: "E = k_ω (ω − ω₀)²", d: "A correction term with no direct physical bond behind it: it exists to keep groups planar that ought to be planar — aromatic rings, sp² centres, amide bonds — which the other three terms would otherwise allow to pucker." },
          ].map((t, i) => (
            <div key={t.n} className="flex gap-3 p-4 rounded-lg border border-border bg-white">
              <span className="h-6 w-6 text-xs font-bold bg-slate-100 border border-border rounded flex items-center justify-center flex-shrink-0 text-slate-900">{i + 1}</span>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-slate-900">{t.n}</h4>
                <code className="text-xs font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded inline-block my-1 break-all">{t.f}</code>
                <p className="text-sm text-slate-800 leading-relaxed">{t.d}</p>
              </div>
            </div>
          ))}
        </div>

        <h3>The Non-Bonded Terms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h4 className="font-bold text-sm text-slate-900">Van der Waals — Lennard-Jones 12-6</h4>
            <code className="text-xs font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded inline-block break-all">E = 4ε[(σ/r)¹² − (σ/r)⁶]</code>
            <p className="text-sm text-slate-800 leading-relaxed">
              You have already met this curve in Module 3: an <em>r</em>⁻⁶ attractive tail (London dispersion) against a brutally steep <em>r</em>⁻¹² repulsive wall (Pauli exclusion). The r⁻¹² term is why steric clashes are so catastrophically expensive — halve the distance and the penalty rises 4,096-fold.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h4 className="font-bold text-sm text-slate-900">Electrostatics — Coulomb</h4>
            <code className="text-xs font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded inline-block break-all">E = q_i·q_j / (4πε₀ε_r · r)</code>
            <p className="text-sm text-slate-800 leading-relaxed">
              Fixed <strong>partial charges</strong> on each atom, decaying only as 1/<em>r</em> — long-range, which is why it is the expensive term to compute properly. Because the charges are fixed, a standard force field cannot let a molecule <strong>polarize</strong> in response to its environment.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Playground: butane torsion */}
      <section className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2">
          <Sliders size={18} className="text-slate-900" />
          <h3 className="font-bold text-base text-slate-900">Interactive Playground: The Butane Torsional Profile</h3>
        </div>
        <p className="text-sm text-slate-800 leading-normal">
          The single most important curve in conformational analysis. Rotate the central <strong>C–C–C–C</strong> dihedral of butane and watch the Newman projection turn while the torsion term reports the energy. The numbers are not illustrative — this is a real OPLS Fourier torsion, and it reproduces butane&apos;s textbook profile.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-5 rounded-lg border border-slate-200">
          {/* Newman projection */}
          <div className="md:col-span-5 flex flex-col items-center">
            <svg viewBox="0 0 200 200" className="w-full max-w-[210px]">
              {/* rear atom bonds (drawn from circle edge outward) */}
              {rearSubs.map((s, i) => {
                const a = polar(s.a, NC.r);
                const b = polar(s.a, NC.r + 34);
                return (
                  <g key={`r${i}`}>
                    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#94a3b8" strokeWidth={s.major ? 3.5 : 2.5} strokeLinecap="round" />
                    <text x={polar(s.a, NC.r + 46).x} y={polar(s.a, NC.r + 46).y + 3} textAnchor="middle" fontSize="10" className="fill-slate-500 font-bold">{s.label}</text>
                  </g>
                );
              })}
              {/* the rear carbon circle */}
              <circle cx={NC.cx} cy={NC.cy} r={NC.r} fill="white" stroke="#64748b" strokeWidth="2.5" />
              {/* front atom bonds (drawn from centre to edge) */}
              {frontSubs.map((s, i) => {
                const b = polar(s.a, NC.r);
                return (
                  <g key={`f${i}`}>
                    <line x1={NC.cx} y1={NC.cy} x2={b.x} y2={b.y} stroke="#0f172a" strokeWidth={s.major ? 4 : 3} strokeLinecap="round" />
                    <text x={polar(s.a, NC.r + 14).x} y={polar(s.a, NC.r + 14).y + 3} textAnchor="middle" fontSize="10" className="fill-slate-900 font-bold">{s.label}</text>
                  </g>
                );
              })}
              <circle cx={NC.cx} cy={NC.cy} r="3.5" fill="#0f172a" />
            </svg>
            <div className="text-[10px] text-slate-600 font-bold text-center mt-1 leading-snug">
              Newman projection down C2–C3<br />
              <span className="text-slate-900">dark</span> = front carbon · <span className="text-slate-400">grey</span> = rear carbon
            </div>
          </div>

          {/* Controls + energy plot */}
          <div className="md:col-span-7 space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                <span>Dihedral angle φ</span>
                <span className="font-mono text-slate-900">{phi.toFixed(0)}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                value={phi}
                onChange={(e) => setPhi(parseFloat(e.target.value))}
                className="w-full h-1.5 rounded appearance-none cursor-pointer accent-slate-900 bg-slate-100"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-500 px-0.5">
                <span>0° syn</span><span>60° g</span><span>120°</span><span>180° anti</span><span>240°</span><span>300° g</span><span>360°</span>
              </div>
            </div>

            {/* Energy curve */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-1">
              <svg viewBox="0 0 300 160" className="w-full">
                {/* axes */}
                <line x1="30" y1="140" x2="288" y2="140" stroke="currentColor" className="text-slate-300" strokeWidth="1" />
                <line x1="30" y1="15" x2="30" y2="140" stroke="currentColor" className="text-slate-300" strokeWidth="1" />
                {/* gridlines at each kcal */}
                {[1, 2, 3, 4, 5].map((k) => (
                  <g key={k}>
                    <line x1="30" y1={yOf(k)} x2="288" y2={yOf(k)} stroke="currentColor" className="text-slate-200" strokeWidth="0.5" strokeDasharray="2,2" />
                    <text x="26" y={yOf(k) + 3} textAnchor="end" fontSize="7" className="fill-slate-400 font-mono">{k}</text>
                  </g>
                ))}
                <text x="8" y="80" fontSize="7" className="fill-slate-500 font-bold" transform="rotate(-90 8 80)" textAnchor="middle">kcal/mol</text>
                {/* minima markers */}
                {[180].map((a) => (
                  <line key={a} x1={xOf(a)} y1="15" x2={xOf(a)} y2="140" stroke="currentColor" className="text-emerald-300" strokeWidth="0.8" strokeDasharray="3,2" />
                ))}
                {/* the curve */}
                <path d={curvePath} fill="none" stroke="currentColor" className="text-slate-900" strokeWidth="1.8" />
                {/* current marker */}
                <circle cx={xOf(norm)} cy={yOf(currentE)} r="4.5" className="fill-blue-600 stroke-white" strokeWidth="1.5" />
                {/* labels */}
                <text x={xOf(180)} y="152" textAnchor="middle" fontSize="7" className="fill-emerald-700 font-bold">anti</text>
                <text x={xOf(60)} y="152" textAnchor="middle" fontSize="7" className="fill-slate-500 font-bold">gauche</text>
                <text x={xOf(300)} y="152" textAnchor="middle" fontSize="7" className="fill-slate-500 font-bold">gauche</text>
                <text x={xOf(0)} y="152" textAnchor="start" fontSize="7" className="fill-rose-600 font-bold">syn</text>
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className={`p-2.5 rounded-lg border text-center ${
                conformer.tone === "emerald" ? "bg-emerald-50 border-emerald-200"
                : conformer.tone === "amber" ? "bg-amber-50 border-amber-200"
                : conformer.tone === "rose" ? "bg-rose-50 border-rose-200"
                : "bg-slate-50 border-slate-200"}`}>
                <span className="text-[10px] text-slate-700 font-bold uppercase tracking-wider block">Torsional energy</span>
                <p className="text-lg font-bold font-mono text-slate-950">{currentE.toFixed(2)}</p>
                <p className="text-[10px] font-bold text-slate-700 leading-tight">{conformer.name}</p>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                <span className="text-[10px] text-slate-700 font-bold uppercase tracking-wider block text-center">Boltzmann mix @ 298 K</span>
                <div className="mt-1.5 space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="font-bold text-slate-800">anti</span>
                    <span className="text-slate-900">{pAnti.toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded overflow-hidden">
                    <div className="h-full bg-slate-900" style={{ width: `${pAnti}%` }} />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="font-bold text-slate-800">gauche (×2)</span>
                    <span className="text-slate-900">{pGauche.toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded overflow-hidden">
                    <div className="h-full bg-slate-400" style={{ width: `${pGauche}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs font-semibold text-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Info className="h-4 w-4 text-blue-600" /> Why this curve matters for drug design
          </span>
          <ul className="list-disc pl-5 space-y-1 font-medium leading-relaxed">
            <li><strong>Rotatable bonds are cheap to rotate.</strong> The barriers here are only ~3–5 kcal/mol — comparable to thermal energy — so at 298 K butane is constantly interconverting. That is precisely why a flexible ligand has so many conformers to search (Module 6) and why each rotatable bond costs entropy on binding (Module 3).</li>
            <li><strong>The bioactive conformation is rarely the global minimum.</strong> Anti dominates in solution (~{pAnti.toFixed(0)}%), but a receptor can pay a kcal or two to bind a gauche-like shape. A conformer search that only keeps the global minimum will miss it.</li>
            <li><strong>Note the two-to-one degeneracy.</strong> Gauche sits {torsionEnergy(60).toFixed(2)} kcal/mol <em>above</em> anti yet still accounts for ~{pGauche.toFixed(0)}% of molecules — because there are <em>two</em> gauche wells and only one anti. Energy alone never determines population; you must count states.</li>
          </ul>
        </div>
      </section>

      {/* Section: FF families */}
      <section className="space-y-4">
        <h2>3. Force Field Families</h2>
        <p>
          The functional forms above are nearly universal. What distinguishes force fields is their <strong>parameters</strong> and what they were fitted to reproduce.
        </p>
        <div className="overflow-x-auto not-prose border border-slate-200 rounded-lg">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left font-bold text-slate-900">Force field</th>
                <th className="px-3 py-2 text-left font-bold text-slate-900">Built for</th>
                <th className="px-3 py-2 text-left font-bold text-slate-900">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-slate-800">
              <tr><td className="px-3 py-2 font-semibold">AMBER</td><td className="px-3 py-2">Proteins, nucleic acids</td><td className="px-3 py-2">Charges fitted to reproduce the QM electrostatic potential (RESP). ff19SB is the current protein standard.</td></tr>
              <tr><td className="px-3 py-2 font-semibold">CHARMM</td><td className="px-3 py-2">Proteins, lipids, membranes</td><td className="px-3 py-2">CGenFF extends it to drug-like molecules. Strong lipid/membrane parameters.</td></tr>
              <tr><td className="px-3 py-2 font-semibold">OPLS</td><td className="px-3 py-2">Organic liquids, small molecules</td><td className="px-3 py-2">Parameterized against experimental liquid densities and heats of vaporization — the torsion you just used is OPLS-style.</td></tr>
              <tr><td className="px-3 py-2 font-semibold">GROMOS</td><td className="px-3 py-2">Biomolecular simulation</td><td className="px-3 py-2">Historically united-atom (hydrogens absorbed into heavy atoms) for speed.</td></tr>
              <tr><td className="px-3 py-2 font-semibold">GAFF</td><td className="px-3 py-2">Arbitrary drug-like ligands</td><td className="px-3 py-2">The general AMBER force field — the usual answer to &quot;my ligand has no parameters&quot;.</td></tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 border-l-4 border-amber-500 bg-amber-50/50 rounded-r-xl space-y-1.5 text-sm">
          <strong className="text-slate-900 block">The transferability assumption — and where it bites</strong>
          <p className="text-slate-800 leading-relaxed">
            Force fields assume an atom type behaves the same everywhere: a carbonyl carbon in one molecule is parameterized identically to a carbonyl carbon in another. Proteins are made of 20 repeating amino acids, so this works beautifully. <strong>Your ligand is the problem.</strong> It is a novel molecule nobody parameterized, so it gets assigned by analogy via GAFF/CGenFF — and unusual chemotypes get poor parameters. A meaningful fraction of &quot;the docking score was wrong&quot; is really &quot;the ligand parameters were wrong&quot;.
          </p>
        </div>
      </section>

      {/* Section: minimization */}
      <section className="space-y-4">
        <h2>4. Energy Minimization &amp; the Multiple-Minimum Problem</h2>
        <p>
          A force field gives energy as a function of coordinates — the <strong>potential energy surface (PES)</strong>. <strong>Minimization</strong> walks downhill on that surface to find a stable geometry, using the gradient (the forces):
        </p>
        <div className="space-y-3 not-prose">
          <div className="flex gap-3 p-4 rounded-lg border border-border bg-white">
            <TrendingDown className="h-5 w-5 text-slate-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-slate-900">Steepest descent</h4>
              <p className="text-sm text-slate-800 mt-1 leading-relaxed">Step directly downhill along the negative gradient. Robust and forgiving of terrible starting structures, but converges slowly near the minimum. The standard first pass for relieving clashes after adding hydrogens or building a homology model.</p>
            </div>
          </div>
          <div className="flex gap-3 p-4 rounded-lg border border-border bg-white">
            <TrendingDown className="h-5 w-5 text-slate-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-slate-900">Conjugate gradient / L-BFGS</h4>
              <p className="text-sm text-slate-800 mt-1 leading-relaxed">Use information from previous steps to choose smarter directions. Much faster convergence, but less tolerant of a bad start. The usual second pass.</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-l-4 border-rose-500 bg-rose-50/50 rounded-r-xl space-y-1.5 text-sm">
          <strong className="text-slate-900 block">Minimization only ever goes downhill</strong>
          <p className="text-slate-800 leading-relaxed">
            This is the defining limitation. Minimization finds the <em>nearest local</em> minimum — the bottom of whatever valley you happened to start in — and can never cross a barrier to find a better one. In the butane playground above, start at 150° and minimization will slide you to anti; start at 90° and it will trap you in gauche. It has no idea the other well exists.
          </p>
          <p className="text-slate-800 leading-relaxed">
            A drug-like molecule with 5 rotatable bonds has hundreds of local minima. Escaping them requires <em>sampling</em>, not minimization: systematic or stochastic conformer searches (Module 7), Monte Carlo and genetic algorithms (Module 6), or molecular dynamics with enough thermal energy to hop barriers (Module 10). <strong>Minimization is how you polish a structure; it is never how you find one.</strong>
          </p>
        </div>

        <CollapsibleCode
          title="Force Field Energy & Minimization with RDKit"
          code={`from rdkit import Chem
from rdkit.Chem import AllChem

# -----------------------------------------------------------------
# 1. BUILD A 3D STRUCTURE (SMILES carries no geometry -- Module 5)
# -----------------------------------------------------------------
mol = Chem.AddHs(Chem.MolFromSmiles('CCCC'))       # butane, with explicit Hs
AllChem.EmbedMolecule(mol, randomSeed=42)          # generate 3D coordinates

# -----------------------------------------------------------------
# 2. SET UP A FORCE FIELD AND READ THE ENERGY
# -----------------------------------------------------------------
# MMFF94 is a general-purpose small-molecule force field with the same
# bonded + non-bonded decomposition described above.
props = AllChem.MMFFGetMoleculeProperties(mol)
ff = AllChem.MMFFGetMoleculeForceField(mol, props)

print(f"Energy before minimization: {ff.CalcEnergy():.2f} kcal/mol")

# -----------------------------------------------------------------
# 3. MINIMIZE -- walks DOWNHILL to the NEAREST local minimum only
# -----------------------------------------------------------------
ff.Minimize(maxIts=2000)
print(f"Energy after  minimization: {ff.CalcEnergy():.2f} kcal/mol")

# -----------------------------------------------------------------
# 4. ESCAPE THE LOCAL MINIMUM: sample many starts, THEN minimize each
# -----------------------------------------------------------------
mol2 = Chem.AddHs(Chem.MolFromSmiles('CCCC'))
cids = AllChem.EmbedMultipleConfs(mol2, numConfs=50, randomSeed=42)
results = AllChem.MMFFOptimizeMoleculeConfs(mol2, maxIters=2000)
# results is a list of (converged_flag, energy) per conformer
energies = sorted(e for converged, e in results)
print(f"Lowest conformer:  {energies[0]:.2f} kcal/mol")
print(f"Highest conformer: {energies[-1]:.2f} kcal/mol")
print(f"Spread across {len(energies)} conformers: {energies[-1]-energies[0]:.2f} kcal/mol")
# The spread is the multiple-minimum problem made visible: every one of these
# is a valid minimized structure, but they are NOT the same molecule shape.`}
        />
      </section>

      {/* Section: limitations */}
      <section className="space-y-4">
        <h2>5. Where Classical Force Fields Break</h2>
        <p>
          Knowing the failure modes is what separates using a force field from trusting it blindly.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5"><AlertTriangle className="h-4 w-4 text-amber-500" />No reactivity</h4>
            <p className="text-sm text-slate-800 leading-relaxed">
              Harmonic bonds cannot break. Any covalent inhibitor, any enzyme mechanism, any proton transfer is outside the model. <strong>Fix:</strong> QM/MM — treat the reacting centre quantum-mechanically and the rest classically (Module 10).
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5"><Zap className="h-4 w-4 text-amber-500" />Fixed charges</h4>
            <p className="text-sm text-slate-800 leading-relaxed">
              A real molecule&apos;s electron density rearranges when it enters a charged pocket. Fixed point charges cannot. <strong>Fix:</strong> polarizable force fields (AMOEBA, Drude) — more accurate, considerably more expensive.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5"><Atom className="h-4 w-4 text-amber-500" />Parameter quality</h4>
            <p className="text-sm text-slate-800 leading-relaxed">
              The model is only as good as the numbers in it, and novel chemotypes get parameters by analogy. <strong>Fix:</strong> machine-learned force fields, which learn the PES from QM data directly instead of assuming a functional form — covered in Module 10.
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-800 leading-relaxed">
          Each of these limitations is the reason a later technique exists. Keep the master equation in mind for the rest of the course: when a docking score misleads you (Module 6) or a trajectory drifts (Module 10), the explanation is almost always hiding in one of these six terms.
        </p>
      </section>

      {/* Quiz */}
      <Quiz
        moduleTitle="Module 4: Molecular Mechanics & Force Fields"
        questions={[
          {
            question:
              "Why can a classical force field never model a covalent inhibitor forming its bond with a cysteine residue?",
            options: [
              "Because force fields ignore hydrogen atoms.",
              "Because bond stretching is modelled as a harmonic spring, whose energy rises quadratically forever — bonds can stretch but never break, since the model has no electrons to redistribute.",
              "Because the Lennard-Jones term prevents atoms from approaching each other.",
              "Because covalent bonds are too short for the non-bonded cutoff.",
            ],
            correctIndex: 1,
            explanation:
              "Molecular mechanics discards electrons and replaces each bond with a harmonic spring, E = k_b(r − r₀)². Stretch that spring and the energy simply keeps climbing — there is no dissociation limit, and no mechanism for making or breaking a bond. Modelling the reaction requires quantum mechanics for the reacting centre, which is exactly what QM/MM provides.",
          },
          {
            question:
              "In the butane profile, gauche sits ~0.86 kcal/mol above anti, yet roughly 30% of butane molecules are gauche at room temperature. Why is the gauche population so high?",
            options: [
              "Because the Boltzmann factor favours higher-energy states at 298 K.",
              "Because there are two equivalent gauche wells (+60° and −60°) but only one anti well, so gauche gets a factor-of-2 degeneracy that partly offsets its energy penalty.",
              "Because the torsional barrier is infinitely high, trapping molecules in gauche.",
              "Because gauche is actually the global minimum.",
            ],
            correctIndex: 1,
            explanation:
              "Population depends on both energy and the number of states. The Boltzmann factor exp(−0.86/0.593) ≈ 0.23 disfavours each gauche well, but there are two of them, giving 2 × 0.23 ≈ 0.47 against anti's 1.0 — roughly a 70:30 anti:gauche mix, which matches experiment. Counting states matters as much as computing energies; this same degeneracy logic underlies the entropy terms in Module 3.",
          },
          {
            question:
              "You minimize a flexible ligand with 5 rotatable bonds and obtain a converged structure. Why is it a mistake to treat this as 'the' conformation of the molecule?",
            options: [
              "Because minimization always fails to converge for flexible molecules.",
              "Because minimization only moves downhill, so it returns the nearest local minimum determined by your starting geometry — one of potentially hundreds — and cannot cross barriers to find the global minimum or the bioactive conformation.",
              "Because force fields cannot handle molecules with more than 3 rotatable bonds.",
              "Because the global minimum is always the bioactive conformation anyway.",
            ],
            correctIndex: 1,
            explanation:
              "Minimization is a downhill walk: it finds the bottom of whatever valley you started in and stops. With 5 rotatable bonds there are hundreds of valleys, and nothing about convergence tells you that you landed in the deepest one. Worse, the bioactive conformation — the shape the receptor actually binds — is frequently not the global minimum at all, since the protein can pay a few kcal/mol to distort the ligand. Finding conformations requires sampling (conformer generation, MC/GA, or MD), not minimization.",
          },
        ]}
      />
    </div>
  );
}
