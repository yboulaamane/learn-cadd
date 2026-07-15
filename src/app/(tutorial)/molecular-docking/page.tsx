"use client";

import React, { useState } from "react";
import {
  RotateCcw,
  Compass,
  CheckCircle,
  AlertTriangle,
  Info,
  Sliders,
  Layers
} from "lucide-react";
import { Quiz } from "@/components/Quiz";

export default function MolecularDockingPage() {
  const [posX, setPosX] = useState(0); // Offset X (centered)
  const [posY, setPosY] = useState(-12); // Offset Y (in bulk solvent)
  const [rotation, setRotation] = useState(0); // Angle in degrees

  // --- PROTAC ternary complex simulator state ---
  const [protacConc, setProtacConc] = useState(-7); // Log10 concentration (M). -9 = 1nM, -7 = 100nM, -5 = 10uM
  const [linkerLength, setLinkerLength] = useState(10); // Carbon atoms (4 to 18)
  const [cooperativity, setCooperativity] = useState(2.0); // Alpha factor (0.1 to 10)

  const getConcText = (logVal: number) => {
    const val = Math.pow(10, logVal);
    if (val < 1e-9) return `${(val * 1e12).toFixed(0)} pM`;
    if (val < 1e-6) return `${(val * 1e9).toFixed(0)} nM`;
    if (val < 1e-3) return `${(val * 1e6).toFixed(0)} µM`;
    return `${(val * 1e3).toFixed(0)} mM`;
  };

  // Ternary complex yield [Target-PROTAC-E3]: bell-shaped on a log-concentration
  // axis because of the hook effect (binary saturation at high concentration).
  const calculateTernaryYield = (logConc: number, linker: number, alpha: number) => {
    const peakLogM = -7.0; // peak degradation typically around 100 nM

    // Linker length: too short -> steric clash; too long -> conformational entropy
    let linkerFactor = 1.0;
    if (linker < 8) {
      linkerFactor = Math.max(0.02, 1 - 0.25 * Math.pow(8 - linker, 2.0));
    } else if (linker > 11) {
      linkerFactor = Math.max(0.1, 1 - 0.08 * Math.pow(linker - 11, 1.5));
    }

    const coopFactor = alpha >= 1.0 ? 1.0 + 0.15 * Math.log(alpha) : Math.max(0.15, alpha);
    const rawCurve = Math.exp(-Math.pow(logConc - peakLogM, 2) / 1.8);
    return Math.min(Math.max(rawCurve * linkerFactor * coopFactor * 90, 0), 100);
  };

  const ternaryYield = calculateTernaryYield(protacConc, linkerLength, cooperativity);

  let stateStatus = "optimal";
  let statusText = "";
  if (linkerLength < 8) {
    stateStatus = "clash";
    statusText = "Steric Clash: The linker is too short. The E3 ligase and the target protein surfaces repel each other, preventing cooperative binding.";
  } else if (linkerLength > 13) {
    stateStatus = "entropy";
    statusText = "High Conformational Entropy: The linker is too long and flexible. The high degrees of rotational freedom destabilize the ternary interface.";
  } else if (protacConc > -5.5) {
    stateStatus = "hook";
    statusText = "The Hook Effect (Binary Saturation): At high concentrations, PROTAC molecules saturate the target and E3 proteins independently, forming inactive binary complexes and dismantling active ternary assemblies.";
  } else if (protacConc < -8.2) {
    stateStatus = "low";
    statusText = "Under-Saturation: The PROTAC concentration is too low to engage both receptors, leading to insufficient target degradation.";
  } else {
    stateStatus = "optimal";
    statusText = "Optimal Ternary Assembly: The linker distance and concentration are balanced, forming a stable Target-PROTAC-E3 complex that actively degrades target proteins.";
  }

  const generateTernaryCurve = () => {
    let path = "M";
    for (let c = -10.5; c <= -4.0; c += 0.1) {
      const x = 30 + ((c - -10.5) / 6.5) * 240;
      const y = 170 - (calculateTernaryYield(c, linkerLength, cooperativity) / 100) * 150;
      path += `${c === -10.5 ? "" : " L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }
    return path;
  };

  // Target coordinates for optimal docking: X = 15, Y = 14, Rotation = 22 deg
  const targetX = 15;
  const targetY = 14;
  const targetRot = 22;

  const dx = posX - targetX;
  const dy = posY - targetY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  let rotDiff = Math.abs((rotation % 360) - targetRot);
  if (rotDiff > 180) rotDiff = 360 - rotDiff;

  // Compute pocket cleft surface boundary
  const pocketY = (x: number) => {
    if (x < 35 || x > 70) return 20;
    // Quadratic curve defining the pocket cleft surface (symmetric from x=35 to x=70, peaking at 61.25)
    return -0.13469 * Math.pow(x - 52.5, 2) + 61.25;
  };

  const getVertices = (x: number, y: number, rot: number) => {
    const rad = (rot * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    // Scaled local vertices (factor 0.7) relative to rotation center (35, 35)
    const localVertices = [
      { x: -7, y: -7 },
      { x: 7, y: -7 },
      { x: 7, y: 7 },
      { x: 0, y: 7 },
      { x: 0, y: 0 },
      { x: -7, y: 0 }
    ];

    const cx = 35 + x;
    const cy = 35 + y;

    return localVertices.map(v => {
      const rx = v.x * cos - v.y * sin;
      const ry = v.x * sin + v.y * cos;
      return { x: cx + rx, y: cy + ry };
    });
  };

  const vertices = getVertices(posX, posY, rotation);
  let stericClash = 0;
  let clashReason = "";

  // Check each vertex for protein penetration
  for (let i = 0; i < vertices.length; i++) {
    const v = vertices[i];
    const surfaceY = pocketY(v.x);
    if (v.y > surfaceY) {
      // Determine the type of clash based on where the vertex is
      if (v.x < 35) {
        stericClash = 15;
        clashReason = "Steric Clash: Colliding with the left protein wall!";
        break;
      } else if (v.x > 70) {
        stericClash = 15;
        clashReason = "Steric Clash: Colliding with the right protein wall!";
        break;
      } else {
        // Inside the cleft
        if (surfaceY > 55) {
          stericClash = 15;
          clashReason = "Steric Clash: Colliding with pocket bottom residues!";
          break;
        } else {
          // Hitting side slopes
          stericClash = 12;
          clashReason = "Steric Clash: Wrong ligand orientation causes collision with pocket walls!";
          break;
        }
      }
    }
  }

  // Electrostatic/vdW score: attractive only near the binding site (short-range)
  // At dist=30 (bulk solvent): exp(-30/4) ≈ 0.00055 → score ≈ 0.00 kcal/mol
  const electrostatic = -11.0 * Math.exp(-dist / 4);

  // Orientation/Hydrophobic score (requires correct conformation & rotation)
  const orientationScore = -3.0 * Math.exp(-rotDiff / 20) * Math.exp(-dist / 4);

  // Desolvation penalty: peaks at pocket entry (~dist 10), zero in bulk and pocket core
  const desolvation = dist < 18 ? 1.5 * (dist / 10) * Math.exp(-(dist - 8) / 6) : 0;

  // Net score: ~0 in bulk solvent, slightly unfavorable at pocket entry, strongly negative deep inside
  const rawScore = electrostatic + orientationScore + desolvation + stericClash;
  const finalScore = Math.max(-14, Math.min(15, rawScore));
  
  // Docked state: strong binding energy and zero clashes
  const isDocked = stericClash === 0 && finalScore < -8.5;

  // Display score: clamp tiny near-zero values (bulk solvent) to exactly 0.00
  const displayScore = Math.abs(finalScore) < 0.05 ? 0 : finalScore;
  const isFarFromPocket = Math.abs(finalScore) < 0.5 && stericClash === 0;

  const resetDocking = () => {
    setPosX(0);
    setPosY(-12);
    setRotation(0);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1>Module 6: Molecular Docking</h1>
        <p className="lead text-slate-800">
          Understand how computer algorithms predict ligand binding configurations inside a receptor pocket. Explore conformational searches, scoring functions, and validation strategies.
        </p>
      </div>

      <hr className="border-slate-200" />

      {/* Section 1: Overview */}
      <section className="space-y-4">
        <h2>1. What is Molecular Docking?</h2>
        <p>
          Molecular docking is a computational simulation technique that models the interaction between a small molecule (ligand) and a macromolecular target (typically a protein). 
        </p>
        <p>
          The docking process has two primary components:
        </p>
        <ol>
          <li><strong>Search Algorithm:</strong> Explores the conformational space of the ligand inside the active site.</li>
          <li><strong>Scoring Function:</strong> Evaluates the binding energy of each generated pose to identify the most stable orientation.</li>
        </ol>
      </section>

      {/* Section 2: Search Algorithms */}
      <section className="space-y-4">
        <h2>2. Conformational Search Methods</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h3 className="font-bold text-sm text-slate-900">Systematic Search</h3>
            <p className="text-sm text-slate-800 leading-relaxed">
              Exhaustively rotates every rotatable bond by increments (e.g. 60°). It guarantees finding global minima but suffers from a combinatorial explosion.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h3 className="font-bold text-sm text-slate-900">Stochastic Search</h3>
            <p className="text-sm text-slate-800 leading-relaxed">
              Performs random conformational moves. Prominent algorithms include Monte Carlo and Genetic Algorithms, where coordinates mutate and cross over.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h3 className="font-bold text-sm text-slate-900">Incremental Construction</h3>
            <p className="text-sm text-slate-800 leading-relaxed">
              Splits the ligand into fragments. The anchor fragment is docked first, and the remaining segments are attached step-by-step.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Widget: Manual Docking Game */}
      <section className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2">
          <Compass size={18} className="text-slate-800" />
          <h3 className="font-bold text-base text-slate-900">Interactive Playground: Manual Pose Matcher</h3>
        </div>
        <p className="text-sm text-slate-800 leading-normal">
          Use the translation (X, Y) and rotation sliders to dock the ligand into the active site pocket. Align the positive charge (+) with the negative charge (-) to optimize the binding score.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-white p-5 rounded-lg border border-slate-200">
          
          {/* Simulation Display */}
          <div className="md:col-span-6 flex justify-center">
            <div className="w-full max-w-[240px] aspect-square relative bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-center items-center shadow-inner overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="proteinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f8fafc" />
                    <stop offset="100%" stopColor="#e2e8f0" />
                  </linearGradient>
                  <linearGradient id="receptorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#e2e8f0" />
                    <stop offset="100%" stopColor="#cbd5e1" />
                  </linearGradient>
                </defs>
                {/* Background grid */}
                <rect x="0" y="0" width="100" height="100" fill="url(#proteinGrad)" />
                
                {/* Receptor Protein pocket cleft */}
                <path d="M20,20 L35,20 C40,75 60,75 70,20 L85,20 L85,85 L20,85 Z" fill="url(#receptorGrad)" stroke="#94a3b8" strokeWidth="1" />
                
                {/* Target electrostatic center (-) */}
                <circle cx="50" cy="49" r="4.5" className="fill-red-500 stroke-white stroke-[0.75]" />
                <text x="50" y="50.8" textAnchor="middle" fill="#ffffff" className="font-black font-sans select-none" fontSize="6.5" fontWeight="bold">-</text>

                {/* Ligand container that translates and rotates */}
                <g 
                  className="transition-transform duration-100 ease-out" 
                  style={{ transform: `translate(${posX}px, ${posY}px) rotate(${rotation}deg)`, transformOrigin: "35px 35px" }}
                >
                  <path d="M28,28 L42,28 L42,42 L35,42 L35,35 L28,35 Z" fill="#3b82f6" fillOpacity="0.15" stroke="#2563eb" strokeWidth="1.5" strokeLinejoin="round" />
                  <circle cx="35" cy="35" r="3.5" className="fill-blue-600 stroke-white stroke-[0.75]" />
                  <text x="35" y="36.8" textAnchor="middle" fill="#ffffff" className="font-black font-sans select-none" fontSize="5.5" fontWeight="bold">+</text>
                </g>
              </svg>
            </div>
          </div>

          {/* Sliders and scoring */}
          <div className="md:col-span-6 space-y-4">
            
            {/* Real-time score card */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-800 font-bold uppercase tracking-wider block">Docking Score (ΔG)</span>
                {isDocked ? (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle size={14} /> Optimal Binding!
                  </span>
                ) : stericClash > 0 ? (
                  <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                    <AlertTriangle size={14} /> Steric Clash!
                  </span>
                ) : isFarFromPocket ? (
                  <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                    <Info size={14} /> In Bulk Solvent
                  </span>
                ) : (
                  <span className="text-xs text-amber-600 font-semibold">Approaching pocket...</span>
                )}
              </div>
              
              <p className="text-2xl font-black">
                <span className={isDocked ? "text-emerald-700" : stericClash > 0 ? "text-red-600" : isFarFromPocket ? "text-slate-400" : "text-amber-600"}>
                  {displayScore.toFixed(2)}
                </span>
                <span className="text-sm text-slate-800 font-semibold ml-1">kcal/mol</span>
              </p>

              {isFarFromPocket && (
                <p className="text-xs text-slate-500 mt-1 pt-1 border-t border-slate-200">
                  No significant binding. Drag the ligand into the pocket above.
                </p>
              )}

              {stericClash > 0 && (
                <p className="text-xs text-red-600 font-semibold mt-1 pt-1 border-t border-red-100">
                  {clashReason}
                </p>
              )}
            </div>

            {/* Translation X slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-sm text-slate-800">
                <span className="font-bold">Translate X</span>
                <span className="font-extrabold text-slate-900">{posX} px</span>
              </div>
              <input
                type="range"
                min="-15"
                max="30"
                value={posX}
                onChange={(e) => setPosX(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-slate-900"
              />
            </div>

            {/* Translation Y slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-sm text-slate-800">
                <span className="font-bold">Translate Y</span>
                <span className="font-extrabold text-slate-900">{posY} px</span>
              </div>
              <input
                type="range"
                min="-15"
                max="25"
                value={posY}
                onChange={(e) => setPosY(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-slate-900"
              />
            </div>

            {/* Rotation slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-sm text-slate-800">
                <span className="font-bold">Rotate Ligand</span>
                <span className="font-extrabold text-slate-900">{rotation}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-slate-900"
              />
            </div>

            <button
              onClick={resetDocking}
              className="px-3 py-2 rounded bg-slate-100 text-slate-900 font-extrabold text-sm hover:bg-slate-200 transition-colors w-full text-center border border-slate-200"
            >
              Reset Pose
            </button>
          </div>

        </div>
      </section>

      {/* Section 3: Choosing the Right PDB Structure */}
      <section className="space-y-4">
        <h2>3. Target Coordinate Selection: Navigating the PDB</h2>
        <p>
          Before running a docking simulation, researchers must select a protein target coordinate set. The Worldwide Protein Data Bank (PDB) houses hundreds of thousands of structures, but they are not created equal. Poor target coordinates will invalidate all downstream scoring.
        </p>
        
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 not-prose">
          <h4 className="font-bold text-slate-950 flex items-center gap-1.5 text-sm">
            <Info className="h-4 w-4 text-blue-600" />
            Checklist for Systematic PDB Selection:
          </h4>
          <ol className="list-decimal pl-5 space-y-2 text-slate-800 text-sm leading-relaxed">
            <li>
              <strong>Sequence Fidelity via UniProt:</strong> Search by UniProt accession ID, not common protein names, to filter out homologous species variants and ensure exact sequence identity.
            </li>
            <li>
              <strong>Experimental Method & Resolution:</strong> X-ray crystal structures are the default choice for docking as they represent frozen energy snapshots with defined coordinate densities. NMR provides structural ensembles that require complex ensemble docking. Resolution should ideally be below <strong>2.5 Å</strong>.
            </li>
            <li>
              <strong>Refinement Metrics:</strong> Inspect the structure's R-free (relative to R-work) and Ramachandran outlier percentages.
            </li>
            <li>
              <strong>Engineered Mutations:</strong> Crystallographers frequently introduce mutations to prompt crystallization. Ensure the active site loop residues are wild-type.
            </li>
            <li>
              <strong>Loop Completeness:</strong> Weak electron densities in flexible loops lead crystallographers to omit loops entirely. If gaps occur in the active site, loops must be modeled in using loop refinement tools before docking.
            </li>
            <li>
              <strong>Biological Assembly vs. Asymmetric Unit:</strong> Download the <em>biological assembly</em> (the functional form under physiological conditions), not the <em>asymmetric unit</em> (a mathematical crystallographic convenience). Extracting a monomer from a functional dimer exposes hydrophobic interfaces to solvent, causing artificial coordinate collapses.
            </li>
          </ol>
        </div>

        <div className="p-4 border-l-4 border-amber-500 bg-amber-50/50 rounded-r-xl space-y-1.5 text-sm">
          <strong className="text-slate-900 block">The mmCIF Format Transition:</strong>
          <p className="text-slate-800 leading-relaxed">
            The legacy <code>.pdb</code> file format (designed in the 1970s for punch cards) suffers from a hard limit of 99,999 atoms and 62 chains. In the era of cryo-EM macromolecular assemblies, the format breaks down. The PDB has formally deprecated it in favor of <strong>PDBx/mmCIF (<code>.cif</code>)</strong>. By mid-2027, new depositions will only receive 12-character IDs (e.g. <code>pdb_00002v5z</code>) and <code>.pdb</code> formats will no longer be generated. Modern pipelines should migrate to <code>.cif</code> inputs exclusively.
          </p>
        </div>

        {/* When Experimental Structures Are Unavailable */}
        <h3>When Experimental Structures Are Unavailable</h3>
        <p>
          Not every drug target has been resolved experimentally. When no crystal or cryo-EM structure exists, computational approaches can generate 3D coordinates suitable for docking.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-2">
            <h3 className="font-bold text-sm text-slate-900">AlphaFold2 / AlphaFold3</h3>
            <p className="text-sm text-slate-800 leading-relaxed">
              Deep learning structure prediction achieving near-experimental accuracy (median GDT &gt; 90). The AlphaFold Protein Structure Database provides ~200M predicted structures covering most known protein sequences.
            </p>
            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-sm text-slate-800 leading-relaxed space-y-1.5">
              <strong className="text-slate-900 block">Critical Caveat:</strong>
              <p>
                pLDDT confidence scores must always be checked before using predicted structures for docking. Regions with pLDDT &lt; 70 are unreliable and should not be used as docking targets without further refinement.
              </p>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed">
              <strong>AlphaFold3</strong> extends prediction to protein-ligand, protein-DNA, and protein-RNA complexes, enabling structure-based drug design even for multi-molecular assemblies.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-white space-y-2">
            <h3 className="font-bold text-sm text-slate-900">Classical Homology Modeling</h3>
            <p className="text-sm text-slate-800 leading-relaxed">
              Predicts a 3D model from one or more homologous templates of known structure. It works because <strong>3D structure is far more evolutionarily conserved than sequence</strong> — two proteins can retain the same fold long after their sequences have diverged.
            </p>
            <p className="text-sm text-slate-800 leading-relaxed">
              <strong>Tools:</strong> SWISS-MODEL, MODELLER, I-TASSER, HHpred.
            </p>
          </div>
        </div>

        {/* Homology Modeling: Feasibility & 8-step workflow */}
        <div className="mt-4 space-y-4">
          <div className="p-4 border-l-4 border-blue-500 bg-blue-50/50 rounded-r-xl space-y-1.5 text-sm">
            <strong className="text-slate-900 block">Feasibility Threshold</strong>
            <p className="text-slate-800 leading-relaxed">
              Homology modeling requires a template with meaningful sequence identity to the target. The classic empirical rule (Lesk &amp; Chothia, 1986) sets the bar at <strong>&gt; 25–30% sequence identity</strong> over the aligned region. Above ~50% identity, models are typically reliable enough for docking directly; the <strong>20–35% "twilight zone"</strong> demands careful, hand-corrected alignment and heavier validation; below ~20% ("midnight zone"), fold-recognition/threading methods or AlphaFold are safer choices than classical homology modeling.
            </p>
          </div>

          <h4 className="font-bold text-sm text-slate-900">The 8-Step Homology Modeling Workflow</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose">
            {[
              { n: 1, t: "Template recognition & initial alignment", d: "BLAST the target sequence against the PDB; the best-scoring hit above the identity threshold normally becomes the template." },
              { n: 2, t: "Alignment correction", d: "Manually shift gaps out of secondary-structure elements and conserved/functional (e.g. active-site) residues, using a multiple sequence alignment of related homologs for support." },
              { n: 3, t: "Backbone generation", d: "Copy the template's backbone coordinates onto the target wherever the alignment has no gap." },
              { n: 4, t: "Loop modeling", d: "Regions with insertions/deletions have no template backbone to copy. Build them from a database of known loop conformations (binned by length and end-to-end distance) or ab initio." },
              { n: 5, t: "Side-chain modeling", d: "Place side chains using rotamer libraries — statistically preferred conformations conditioned on the local backbone geometry." },
              { n: 6, t: "Model optimization", d: "Energy-minimize (and optionally run short MD on) the full model to relax clashes introduced by the copy-and-paste process." },
              { n: 7, t: "Model validation", d: "Score the model's stereochemistry and packing before trusting it (see below) — this step is not optional." },
              { n: 8, t: "Iteration", d: "If validation flags problems, revisit alignment, loops, or side chains and repeat. Homology modeling is inherently iterative." },
            ].map((s) => (
              <div key={s.n} className="flex gap-3 p-3.5 rounded-lg border border-border bg-white">
                <span className="h-5 w-5 text-xs font-bold bg-slate-100 border border-border rounded flex items-center justify-center flex-shrink-0 text-slate-900">{s.n}</span>
                <div>
                  <h5 className="font-bold text-sm text-slate-900">{s.t}</h5>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{s.d}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl border border-border bg-white space-y-2">
            <h4 className="font-bold text-sm text-slate-900">Validating a Homology Model Before Docking</h4>
            <p className="text-sm text-slate-800 leading-relaxed">
              A homology model is a prediction, not a measurement — it must be checked before it's trusted as a docking target, the same way an X-ray structure's R-free and Ramachandran outliers are checked above.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-800 leading-relaxed">
              <li><strong>Stereochemistry:</strong> a <strong>Ramachandran plot</strong> of backbone φ/ψ dihedral angles flags residues in disallowed conformations — the same check used on experimental structures, but essential here since nothing constrains the model to be physically reasonable except the modeling procedure itself.</li>
              <li><strong>Local accuracy:</strong> statistical potentials such as <strong>QMEAN</strong> compare per-residue packing and geometry against a database of high-resolution experimental structures, returning a normalized <strong>Z-score</strong> (near 0 = typical of real structures; strongly negative = likely modeling error) and a per-residue local error estimate.</li>
              <li><strong>Global quality:</strong> knowledge-based scores like DFire assess whether the overall fold is physically plausible.</li>
            </ul>
            <p className="text-sm text-slate-800 leading-relaxed">
              Only after a model passes these checks should its active site be used for docking — an unvalidated model can have a superficially reasonable overall fold while its binding pocket (often built from a poorly conserved loop) is badly wrong.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Ligand Charge Selection */}
      <section className="space-y-4">
        <h2>4. Ligand Coordinate Preparation: Electrostatic Charge Selection</h2>
        <p>
          To compute electrostatic interactions (like hydrogen bonds, salt bridges, and dipole-dipole contacts), docking scoring functions rely on ligand partial atomic charges. The choice of charge model propagates directly into the final binding scores.
        </p>

        <p>
          While full ab initio quantum mechanics methods (like <strong>RESP</strong>) are highly accurate, they are computationally prohibitive for virtual screening libraries. Semi-empirical charge models approximate this quality at a fraction of the cost:
        </p>

        <div className="overflow-x-auto not-prose border border-slate-200 rounded-lg">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left font-bold text-slate-900">Charge Model</th>
                <th className="px-4 py-2 text-left font-bold text-slate-900">Electrostatic Quality</th>
                <th className="px-4 py-2 text-left font-bold text-slate-900">Calculation Speed</th>
                <th className="px-4 py-2 text-left font-bold text-slate-900">Recommended Use Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-slate-800">
              <tr>
                <td className="px-4 py-2 font-mono font-bold text-blue-700">AM1-BCC</td>
                <td className="px-4 py-2">Very High (errors &lt; 0.1 e)</td>
                <td className="px-4 py-2 text-emerald-700 font-semibold">Fast</td>
                <td className="px-4 py-2"><strong>Default choice</strong> for general protein-ligand docking pipelines.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono font-bold text-indigo-700">PM6</td>
                <td className="px-4 py-2">High (improves H-bonding)</td>
                <td className="px-4 py-2 text-amber-700 font-semibold">Medium</td>
                <td className="px-4 py-2">Challenging systems requiring precise hydrogen-bonding parameters.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono font-bold text-slate-600">RESP</td>
                <td className="px-4 py-2 text-emerald-700 font-semibold">Excellent (Gold Standard)</td>
                <td className="px-4 py-2 text-red-600 font-semibold">Very Slow</td>
                <td className="px-4 py-2">Lead optimization and final pose verification. Too slow for screening.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono font-bold text-amber-600">Gasteiger</td>
                <td className="px-4 py-2 text-red-600 font-semibold">Poor</td>
                <td className="px-4 py-2 text-emerald-700 font-semibold">Extremely Fast</td>
                <td className="px-4 py-2">Quick initial pre-filtering or triage of massive compound libraries.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* PDBQT Format Subsection */}
        <div className="border-t border-slate-200 pt-6 mt-6 space-y-3">
          <h4 className="font-bold text-sm text-slate-900">The PDBQT Format: Charges and Atom Types</h4>
          <p className="text-xs text-slate-700 leading-relaxed">
            Standard PDB files from the Protein Data Bank contain only element symbols and Cartesian coordinates. For docking engines like AutoDock Vina to parse steric and electrostatic interactions, files must be pre-processed into the <strong>PDBQT</strong> format:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <h5 className="font-bold text-[11px] text-slate-800">Partial Charge (Q)</h5>
              <p className="text-[11px] text-slate-600 leading-normal">
                Appends a column representing the partial atomic charge (e.g., in electrons, calculated using AM1-BCC or Gasteiger models) to compute electrostatic potentials.
              </p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <h5 className="font-bold text-[11px] text-slate-800">AutoDock Atom Type (T)</h5>
              <p className="text-[11px] text-slate-600 leading-normal">
                Maps atoms to specific docking categories (e.g., <code>HD</code> for donor hydrogen, <code>A</code> for aromatic carbon, <code>OA</code> for acceptor oxygen) to look up force field parameters.
              </p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <h5 className="font-bold text-[11px] text-slate-800">Torsional Topology</h5>
              <p className="text-[11px] text-slate-600 leading-normal">
                Defines the molecule as a tree with <code>ROOT</code> and <code>BRANCH</code> statements, specifying which bonds are frozen and which can rotate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Scoring Functions */}
      <section className="space-y-4">
        <h2>5. Types of Scoring Functions</h2>
        
        <div className="space-y-3 not-prose">
          <div className="flex gap-3 p-3.5 rounded-lg border border-slate-200 bg-white">
            <span className="h-6 w-6 text-xs font-bold bg-slate-100 border border-slate-200 rounded flex items-center justify-center flex-shrink-0 text-slate-800">A</span>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Force-Field-Based Functions</h4>
              <p className="text-sm text-slate-800 mt-1 leading-relaxed">
                Calculate binding energy from electrostatics (Coulomb) and van der Waals interactions, using mechanical parameters. Examples: DOCK, GOLDScore.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3.5 rounded-lg border border-slate-200 bg-white">
            <span className="h-6 w-6 text-xs font-bold bg-slate-100 border border-slate-200 rounded flex items-center justify-center flex-shrink-0 text-slate-800">B</span>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Empirical Scoring Functions</h4>
              <p className="text-sm text-slate-800 mt-1 leading-relaxed">
                Sum of weighted terms (hydrogen bonds, contacts, rotatable bonds) parameterized using experimental binding affinities. Examples: ChemScore, GlideScore.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3.5 rounded-lg border border-slate-200 bg-white">
            <span className="h-6 w-6 text-xs font-bold bg-slate-100 border border-slate-200 rounded flex items-center justify-center flex-shrink-0 text-slate-800">C</span>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Knowledge-Based Functions</h4>
              <p className="text-sm text-slate-800 mt-1 leading-relaxed">
                Derived from statistical distributions of atom-atom contact pairs in structural databases. Favorable shapes yield lower potentials. Examples: PMF, DrugScore.
              </p>
            </div>
          </div>
        </div>

        {/* Empirical Scoring Equation Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-4 space-y-3">
          <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
            <Info className="h-4 w-4 text-blue-600" /> Empirical Scoring Function Formulation:
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed">
            Empirical scoring models (like the one used in AutoDock Vina) estimate the free energy of binding by summing distinct, weighted interaction contributions:
          </p>
          <div className="my-3 font-mono text-center text-xs bg-slate-100 py-3 px-4 rounded text-slate-800 font-bold border border-slate-200 overflow-x-auto leading-relaxed">
            {"ΔG_score = w_vdW × Σ vdW(r_ij) + w_hbond × Σ hbond(r_ij) + w_electro × Σ electro(r_ij) + w_desolv × Σ desolv(r_ij) + w_rotor × N_rot"}
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Where each contribution corresponds to a specific physical force:
          </p>
          <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
            <li><strong>vdW (van der Waals):</strong> Steric contacts modeled by attractive/repulsive Lennard-Jones terms based on interatomic distance (<em>r_ij</em>).</li>
            <li><strong>hbond (Hydrogen Bonding):</strong> Directional and distance-dependent interaction scoring for donor-acceptor atom pairs.</li>
            <li><strong>electro (Electrostatics):</strong> Coulombic attraction or repulsion calculated using partial charges and distance-dependent dielectric shielding.</li>
            <li><strong>desolv (Desolvation):</strong> Energy penalty for stripping away water molecules from polar groups as they enter hydrophobic pockets.</li>
            <li><strong>w_rotor × N_rot:</strong> Entropic penalty proportional to the number of rotatable bonds (<em>N_rot</em>) frozen upon binding, weighted by <em>w_rotor</em>.</li>
          </ul>
        </div>
      </section>

      {/* Section 5b: Docking Software Comparison */}
      <section className="space-y-4">
        <h3>Docking Software Comparison</h3>
        <p>
          Different docking programs employ distinct algorithms and scoring paradigms. The choice of software depends on the target system, licensing constraints, and screening scale.
        </p>

        <div className="overflow-x-auto not-prose border border-slate-200 rounded-lg">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left font-bold text-slate-900">Software</th>
                <th className="px-4 py-2 text-left font-bold text-slate-900">Algorithm</th>
                <th className="px-4 py-2 text-left font-bold text-slate-900">Scoring</th>
                <th className="px-4 py-2 text-left font-bold text-slate-900">License</th>
                <th className="px-4 py-2 text-left font-bold text-slate-900">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-slate-800">
              <tr>
                <td className="px-4 py-2 font-mono font-bold text-blue-700">AutoDock Vina</td>
                <td className="px-4 py-2">Iterated Local Search</td>
                <td className="px-4 py-2">Empirical hybrid</td>
                <td className="px-4 py-2 text-emerald-700 font-semibold">Open-source</td>
                <td className="px-4 py-2">Academic VS, large screens</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono font-bold text-indigo-700">Glide</td>
                <td className="px-4 py-2">Hierarchical HTVS/SP/XP</td>
                <td className="px-4 py-2">GlideScore</td>
                <td className="px-4 py-2 text-amber-700 font-semibold">Commercial</td>
                <td className="px-4 py-2">Pharma lead optimization</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono font-bold text-purple-700">GOLD</td>
                <td className="px-4 py-2">Genetic Algorithm</td>
                <td className="px-4 py-2">ChemScore, GoldScore</td>
                <td className="px-4 py-2 text-amber-700 font-semibold">Commercial (academic free)</td>
                <td className="px-4 py-2">Metalloenzymes, flexible</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono font-bold text-teal-700">FlexX</td>
                <td className="px-4 py-2">Incremental Construction</td>
                <td className="px-4 py-2">Bohm empirical</td>
                <td className="px-4 py-2 text-amber-700 font-semibold">Commercial</td>
                <td className="px-4 py-2">Fragment-based</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono font-bold text-rose-700">rDock</td>
                <td className="px-4 py-2">Cavity-based + GA</td>
                <td className="px-4 py-2">Empirical + vdW</td>
                <td className="px-4 py-2 text-emerald-700 font-semibold">Open-source</td>
                <td className="px-4 py-2">RNA-ligand docking</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 5c: Practical Docking Protocol */}
      <section className="space-y-4">
        <h3>Practical Docking Protocol</h3>
        <p>
          A systematic end-to-end docking workflow. Each step builds upon the previous one to ensure reliable, reproducible binding predictions.
        </p>

        <div className="space-y-3 not-prose">
          <div className="flex gap-3 p-3.5 rounded-lg border border-slate-200 bg-white">
            <span className="h-6 w-6 text-xs font-bold bg-slate-100 border border-slate-200 rounded flex items-center justify-center flex-shrink-0 text-slate-800">1</span>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Target Preparation</h4>
              <p className="text-sm text-slate-800 mt-1 leading-relaxed">
                Download the PDB structure, remove crystallographic waters (except conserved ones mediating key interactions), assign protonation states using PropKa or H++ at physiological pH, and add missing hydrogens.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3.5 rounded-lg border border-slate-200 bg-white">
            <span className="h-6 w-6 text-xs font-bold bg-slate-100 border border-slate-200 rounded flex items-center justify-center flex-shrink-0 text-slate-800">2</span>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Binding Site Definition</h4>
              <p className="text-sm text-slate-800 mt-1 leading-relaxed">
                Define a grid box centered on the co-crystallized ligand with 0.375 &#197; spacing and a 10&ndash;15 &#197; buffer around the binding pocket to allow full ligand exploration.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3.5 rounded-lg border border-slate-200 bg-white">
            <span className="h-6 w-6 text-xs font-bold bg-slate-100 border border-slate-200 rounded flex items-center justify-center flex-shrink-0 text-slate-800">3</span>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Ligand Preparation</h4>
              <p className="text-sm text-slate-800 mt-1 leading-relaxed">
                Generate 3D coordinates from SMILES, assign AM1-BCC partial charges, enumerate relevant tautomers at pH 7.4, and generate diverse low-energy conformers.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3.5 rounded-lg border border-slate-200 bg-white">
            <span className="h-6 w-6 text-xs font-bold bg-slate-100 border border-slate-200 rounded flex items-center justify-center flex-shrink-0 text-slate-800">4</span>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Docking Run</h4>
              <p className="text-sm text-slate-800 mt-1 leading-relaxed">
                Set the exhaustiveness parameter to control thoroughness: 8 for fast screening, 32 for thorough sampling, and 128 for exhaustive poses. Generate 9&ndash;20 poses per ligand for adequate conformational coverage.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3.5 rounded-lg border border-slate-200 bg-white">
            <span className="h-6 w-6 text-xs font-bold bg-slate-100 border border-slate-200 rounded flex items-center justify-center flex-shrink-0 text-slate-800">5</span>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Post-Processing</h4>
              <p className="text-sm text-slate-800 mt-1 leading-relaxed">
                Rank poses by docking score, filter candidates by interaction fingerprint similarity, visually inspect the top 20 hits for chemically sensible binding modes, and apply consensus scoring across multiple scoring functions to improve reliability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Covalent Docking */}
      <section className="space-y-4">
        <h2>6. Covalent Docking: Modeling Chemical Warheads</h2>
        <p>
          Traditional small-molecule drugs bind via reversible, non-covalent interactions. However, a major class of modern therapeutics consists of <strong>covalent inhibitors</strong> (e.g. Sotorasib targeting KRAS G12C, or Ibrutinib targeting Bruton's Tyrosine Kinase). These molecules contain a mildly electrophilic "warhead" that forms a permanent chemical bond with a nucleophilic amino acid residue in the binding pocket.
        </p>
        <p>
          Because standard docking scoring functions are parameterized only for non-covalent forces (electrostatics, van der Waals), simulating covalent binding requires specialized <strong>covalent docking protocols</strong>:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              1. Non-Covalent Fit
            </h4>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              The ligand first docks non-covalently. The scoring function evaluates whether the scaffolds fit the pocket topography and positions the reactive warhead (e.g. acrylamide, sulfonyl fluoride) within reaction distance (&lt; 3.5 Å) of the target residue.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              2. Chemical Linkage
            </h4>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              The algorithm forms a virtual covalent bond between the nucleophile (typically Cys, Ser, or Lys) and the electrophilic carbon. The system conformational search resolves the dihedral angles of the newly formed linkage.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              3. Complex Minimization
            </h4>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              The bound ligand-protein complex is energy-minimized. Scoring functions evaluate the local strain of the covalent linker alongside the remaining non-covalent interactions of the scaffold to rank candidate covalent hits.
            </p>
          </div>
        </div>
      </section>

      {/* Section 7: Ternary Complex Docking (PROTACs) */}
      <section className="space-y-4">
        <h2>7. Ternary Complex Docking: PROTACs &amp; Molecular Glues</h2>
        <p>
          Covalent docking bent the rules by adding a bond. <strong>Targeted Protein Degradation (TPD)</strong> breaks a deeper assumption: that docking means fitting <em>one</em> ligand into <em>one</em> pocket. Here you must dock a <strong>three-body complex</strong>.
        </p>
        <p>
          As Module 2 showed, most disease-driving proteins have no druggable pocket at all. TPD sidesteps the problem entirely: rather than <em>inhibiting</em> the target, it recruits the cell&apos;s own <strong>Ubiquitin-Proteasome System</strong> to destroy it. You no longer need a deep pocket — you only need a grip.
        </p>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 not-prose">
          <h4 className="font-bold text-sm text-slate-900">PROTACs vs. Molecular Glues</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold leading-relaxed text-slate-800">
            <div>
              <strong className="text-slate-900 block mb-1">PROTACs (Proteolysis Targeting Chimeras)</strong>
              Bifunctional molecules: one head binds the target, a flexible <strong>linker</strong> spans the gap, and the other head recruits an <strong>E3 ubiquitin ligase</strong> (Cereblon, VHL). The ligase tags the target with ubiquitin, marking it for proteasomal destruction.
            </div>
            <div>
              <strong className="text-slate-900 block mb-1">Molecular Glues</strong>
              Monovalent and compact. Rather than tethering two proteins like a leash, a glue sits <em>at the interface</em>, remodelling the E3 surface to create a composite pocket that captures the target.
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-white space-y-2">
          <h4 className="font-bold text-sm text-slate-900">Cooperativity (α) — why ternary docking is not just docking twice</h4>
          <p className="text-sm text-slate-800 leading-relaxed">
            The two binding events are <strong>not independent</strong>. Cooperativity relates the ternary dissociation constant (binding of the second protein to the binary complex) to the binary one (binding to the isolated protein):
          </p>
          <div className="my-2 font-mono text-center text-xs bg-slate-50 py-1.5 rounded text-slate-800 font-bold border border-slate-200">
            {"α = K_D(binary) / K_D(ternary)"}
          </div>
          <p className="text-sm text-slate-800 leading-relaxed">
            <strong>α &gt; 1</strong> is positive cooperativity: favourable protein-protein contacts induced by the PROTAC make the ternary complex <em>more</em> stable than either binary interaction predicts. <strong>α &lt; 1</strong> is negative cooperativity — the two protein surfaces clash. This is why a PROTAC built from two excellent binders can still fail completely: <em>the complex, not the compound, is the drug.</em>
          </p>
        </div>

        <div className="p-4 border-l-4 border-amber-500 bg-amber-50/50 rounded-r-xl space-y-1.5 text-sm">
          <strong className="text-slate-900 block">Why the whole toolkit strains here</strong>
          <p className="text-slate-800 leading-relaxed">
            Ternary docking breaks assumptions from three different modules at once. The <strong>search problem</strong> explodes: you sample two rigid-body placements plus a floppy linker with many rotatable bonds (Module 4). The <strong>scoring problem</strong> becomes protein-protein, not protein-ligand. And PROTACs sit far outside <strong>Lipinski space</strong> — routinely 800–1,100 Da — so the Rule of Five you meet in Module 12 simply does not apply. TPD is the clearest demonstration in this course that the standard methods are approximations with edges.
          </p>
        </div>
      </section>

      {/* Interactive Playground: PROTAC ternary assembly */}
      <section className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-slate-900" />
          <h3 className="font-bold text-base text-slate-900">Interactive Playground: PROTAC Ternary Assembly &amp; the Hook Effect</h3>
        </div>
        <p className="text-sm text-slate-800 leading-normal">
          Tune the linker, the cooperativity, and the dose. Then run the experiment that breaks everyone&apos;s intuition: set a good linker, then <strong>keep raising the concentration</strong>. Degradation collapses. More drug makes it work <em>worse</em> — the hook effect.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-5 rounded-lg border border-slate-200">
          {/* Controls */}
          <div className="md:col-span-5 space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                <span>PROTAC concentration</span>
                <span className="font-mono text-slate-900">{getConcText(protacConc)}</span>
              </div>
              <input
                type="range" min="-10.5" max="-4" step="0.1" value={protacConc}
                onChange={(e) => setProtacConc(parseFloat(e.target.value))}
                className="w-full h-1.5 rounded appearance-none cursor-pointer accent-slate-900 bg-slate-100"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                <span>Linker length</span>
                <span className="font-mono text-slate-900">{linkerLength} atoms</span>
              </div>
              <input
                type="range" min="4" max="18" step="1" value={linkerLength}
                onChange={(e) => setLinkerLength(parseFloat(e.target.value))}
                className="w-full h-1.5 rounded appearance-none cursor-pointer accent-slate-900 bg-slate-100"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                <span>Cooperativity α</span>
                <span className="font-mono text-slate-900">{cooperativity.toFixed(1)}</span>
              </div>
              <input
                type="range" min="0.1" max="10" step="0.1" value={cooperativity}
                onChange={(e) => setCooperativity(parseFloat(e.target.value))}
                className="w-full h-1.5 rounded appearance-none cursor-pointer accent-slate-900 bg-slate-100"
              />
              <p className="text-[10px] text-slate-500 font-medium">α &gt; 1 positive · α &lt; 1 negative (surfaces clash)</p>
            </div>

            <div className={`p-3 rounded-lg border ${
              stateStatus === "optimal" ? "bg-emerald-50 border-emerald-200"
              : stateStatus === "hook" ? "bg-rose-50 border-rose-200"
              : "bg-amber-50 border-amber-200"}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Ternary complex yield</span>
                {stateStatus === "optimal"
                  ? <CheckCircle className="h-4 w-4 text-emerald-600" />
                  : <AlertTriangle className="h-4 w-4 text-amber-600" />}
              </div>
              <p className="text-2xl font-bold font-mono text-slate-950">{ternaryYield.toFixed(1)}%</p>
              <p className="text-[11px] text-slate-700 font-semibold leading-snug mt-1">{statusText}</p>
            </div>
          </div>

          {/* Curve */}
          <div className="md:col-span-7">
            <svg viewBox="0 0 300 200" className="w-full">
              <line x1="30" y1="170" x2="285" y2="170" stroke="currentColor" className="text-slate-300" strokeWidth="1" />
              <line x1="30" y1="15" x2="30" y2="170" stroke="currentColor" className="text-slate-300" strokeWidth="1" />
              {[25, 50, 75, 100].map((v) => (
                <g key={v}>
                  <line x1="30" y1={170 - (v / 100) * 150} x2="285" y2={170 - (v / 100) * 150} stroke="currentColor" className="text-slate-200" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="26" y={170 - (v / 100) * 150 + 3} textAnchor="end" fontSize="7" className="fill-slate-400 font-mono">{v}</text>
                </g>
              ))}
              {[-10, -9, -8, -7, -6, -5, -4].map((c) => (
                <text key={c} x={30 + ((c - -10.5) / 6.5) * 240} y="182" textAnchor="middle" fontSize="7" className="fill-slate-500 font-mono">1e{c}</text>
              ))}
              <text x="157" y="196" textAnchor="middle" fontSize="7" className="fill-slate-600 font-bold">[PROTAC] (M, log scale)</text>
              <text x="10" y="95" fontSize="7" className="fill-slate-600 font-bold" transform="rotate(-90 10 95)" textAnchor="middle">ternary yield %</text>

              <path d={generateTernaryCurve()} fill="none" stroke="currentColor" className="text-slate-900" strokeWidth="1.8" />
              <circle
                cx={30 + ((protacConc - -10.5) / 6.5) * 240}
                cy={170 - (ternaryYield / 100) * 150}
                r="5"
                className={stateStatus === "hook" ? "fill-rose-500 stroke-white" : "fill-blue-600 stroke-white"}
                strokeWidth="1.5"
              />
              <text x="248" y="40" textAnchor="middle" fontSize="7" className="fill-rose-600 font-bold">hook effect →</text>
            </svg>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs font-semibold text-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Info className="h-4 w-4 text-blue-600" /> Why the curve turns over
          </span>
          <p className="leading-relaxed font-medium">
            At low dose there is too little PROTAC to bridge both proteins. At the optimum, each molecule links a target to an E3. But push the concentration high enough and <strong>every protein gets its own PROTAC molecule</strong> — target-PROTAC binaries and E3-PROTAC binaries — and none are bridged. The productive ternary complex is competed away by the drug itself. This is why a PROTAC dose-response is a <em>bell</em>, not a sigmoid, and why &quot;more drug&quot; is not a valid strategy for a degrader.
          </p>
        </div>
      </section>

      {/* Section 8: Validation */}
      <section className="space-y-4">
        <h2>8. Redocking Validation (RMSD)</h2>
        <p>
          Before trust is placed in docking scores, protocols must be validated. The standard validation method is <strong>self-docking</strong> (redocking):
        </p>
        <blockquote>
          <strong>Root Mean Square Deviation (RMSD):</strong> The measure of spatial distance between atoms of the predicted docking pose and the actual co-crystallized native structure in the crystal. A docking protocol is considered valid if the redocked ligand reproduces the experimental structure with an <strong>RMSD &le; 2.0 Å</strong>.
        </blockquote>
      </section>

      {/* Quiz Section */}
      <hr className="border-slate-200 my-8" />
      <Quiz 
        moduleTitle="Module 6: Molecular Docking"
        questions={[
          {
            question: "Why is the AM1-BCC charge model preferred over Gasteiger charges for final docking scoring?",
            options: [
              "AM1-BCC runs fully in ab initio HF/6-31G* quantum chemistry, which is faster.",
              "AM1-BCC applies bond charge corrections that accurately reproduce expensive RESP-quality electrostatic potentials at a low semi-empirical computational cost.",
              "Gasteiger charges are historically more accurate but take too long to compute.",
              "AM1-BCC ignores polarization effects, which makes the scoring function less complex."
            ],
            correctIndex: 1,
            explanation: "AM1-BCC runs a very fast semi-empirical AM1 quantum calculation and applies bond charge corrections to mimic ab initio RESP (fit to HF/6-31G*) charges. Gasteiger charges are extremely fast but lack the electrostatic fidelity needed for precise scoring."
          },
          {
            question: "What is a major risk of using a protein monomer extracted from an asymmetric unit instead of the biological assembly for molecular dynamics or docking?",
            options: [
              "The monomer will contain duplicate chain segments that break the force field parameters.",
              "It exposes hydrophobic interfaces (normally buried in the oligomeric assembly) to the bulk solvent, causing artificial conformations.",
              "The asymmetric unit format is incompatible with Next.js Turbopack compilers.",
              "NMR ensembles cannot represent monomer conformations."
            ],
            correctIndex: 1,
            explanation: "The biological assembly represents the functional oligomeric state. The asymmetric unit is a crystal lattice packing convenience. If a protein is natively a dimer, docking or running MD on a monomer extracted from the asymmetric unit exposes large hydrophobic surfaces to solvent, causing non-physical collapses."
          },
          {
            question: "By which year will new PDB depositions discontinue generating legacy .pdb files in favor of the mmCIF standard?",
            options: [
              "Mid-2026",
              "End of 2029",
              "Mid-2027",
              "Format transitions have already finished in 2024"
            ],
            correctIndex: 2,
            explanation: "By mid-2027, the Worldwide Protein Data Bank will strictly enforce the PDBx/mmCIF (.cif) format and 12-character alphanumeric IDs for all new depositions, deprecating the legacy .pdb columns system."
          }
        ]}
      />
    </div>
  );
}
