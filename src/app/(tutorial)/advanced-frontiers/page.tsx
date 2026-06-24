"use client";

import React, { useState } from "react";
import { 
  Zap, 
  Layers, 
  Cpu, 
  Compass, 
  Info,
  Sliders,
  CheckCircle,
  AlertTriangle,
  Flame,
  Target
} from "lucide-react";
import { Quiz } from "@/components/Quiz";

export default function AdvancedFrontiersPage() {
  // PROTAC Simulator state
  const [protacConc, setProtacConc] = useState(-7); // Log10 concentration (M). -9 = 1nM, -7 = 100nM, -5 = 10uM
  const [linkerLength, setLinkerLength] = useState(10); // Carbon atoms (4 to 18)
  const [cooperativity, setCooperativity] = useState(2.0); // Alpha factor (0.1 to 10)

  // Convert log concentration to readable text
  const getConcText = (logVal: number) => {
    const val = Math.pow(10, logVal);
    if (val < 1e-9) {
      return `${(val * 1e12).toFixed(0)} pM`;
    } else if (val < 1e-6) {
      return `${(val * 1e9).toFixed(0)} nM`;
    } else if (val < 1e-3) {
      return `${(val * 1e6).toFixed(0)} µM`;
    } else {
      return `${(val * 1e3).toFixed(0)} mM`;
    }
  };

  const concentrationM = Math.pow(10, protacConc);

  // Math simulation for Ternary Complex Yield [Target - PROTAC - E3]
  // In pharmacology, ternary complex concentration is a bell-shaped curve on log scale (Hook Effect)
  const calculateTernaryYield = (logConc: number, linker: number, alpha: number) => {
    // Peak degradation is typically around 100 nM (-7.0 M)
    const peakLogM = -7.0; 
    
    // Linker length constraint: optimal is 10 carbons.
    // Too short (clash): yield collapses.
    // Too long (entropy): yield decreases due to flexibility.
    let linkerFactor = 1.0;
    if (linker < 8) {
      linkerFactor = Math.max(0.02, 1 - 0.25 * Math.pow(8 - linker, 2.0));
    } else if (linker > 11) {
      linkerFactor = Math.max(0.1, 1 - 0.08 * Math.pow(linker - 11, 1.5));
    }

    // Cooperativity constraint
    const coopFactor = alpha >= 1.0 ? 1.0 + 0.15 * Math.log(alpha) : Math.max(0.15, alpha);

    // Bell-shaped curve centered at peakLogM
    const distanceToPeak = logConc - peakLogM;
    const rawCurve = Math.exp(-Math.pow(distanceToPeak, 2) / 1.8);

    // Yield in percentage (0 - 100%)
    const yieldPct = rawCurve * linkerFactor * coopFactor * 90;
    return Math.min(Math.max(yieldPct, 0), 100);
  };

  const ternaryYield = calculateTernaryYield(protacConc, linkerLength, cooperativity);

  // Status diagnosis
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

  // Generate curve path for the live chart
  const generateCurvePath = () => {
    let path = "M";
    for (let c = -10.5; c <= -4.0; c += 0.1) {
      const x = 30 + ((c - (-10.5)) / 6.5) * 240; // scale log conc to X pixels
      const yVal = calculateTernaryYield(c, linkerLength, cooperativity);
      const y = 170 - (yVal / 100) * 150; // scale yield to Y pixels
      path += `${c === -10.5 ? "" : " L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }
    return path;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1>Module 9: Advanced Frontiers in Drug Discovery</h1>
        <p className="lead text-slate-850">
          Step into the state-of-the-art of 2026. Master de novo generative chemistry (3D diffusion), targeted protein degradation (PROTACs), and neural network machine learning force fields.
        </p>
      </div>

      <hr className="border-slate-200" />

      {/* Section 1: Generative Chemistry & 3D Diffusion */}
      <section className="space-y-4">
        <h2>1. The Paradigm Shift: Generative Chemistry & 3D Diffusion</h2>
        <p>
          Historically, computational drug discovery was limited to <strong>virtual screening</strong>: searching through library catalogs to find matching compounds. The breakthrough of 2025/2026 is <strong>Generative Chemistry</strong>, which designs novel molecules from scratch (*de novo* design).
        </p>
        <p>
          The gold standard for structure-based generation relies on <strong>3D Pocket-Conditioned Diffusion Models</strong> (e.g. Pocket2Mol, RFdiffusion). These models treat protein pocket coordinates as boundary conditions, iteratively removing noise from a cloud of point clouds to place atoms, assign atomic types, and connect bonds directly inside the pocket:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900">Continuous Denoising Diffusion</h4>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              The model begins with a random swarm of atoms in the pocket coordinates. Over multiple denoising steps, it shifts their Cartesian coordinates $(x,y,z)$ and atom identities (C, N, O) toward states of local chemical energy minimum and electrostatic complementarity.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900">Direct 3D Complementarity</h4>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              By designing directly within the 3D pocket environment, the model matches hydrogen bonds, hydrophobic boundaries, and steric walls automatically, bypassing the need to generate SMILES strings and calculate conformers downstream.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Targeted Protein Degradation */}
      <section className="space-y-4">
        <h2>2. Targeted Protein Degradation (TPD): PROTACs & Molecular Glues</h2>
        <p>
          Traditional small-molecule drugs function as inhibitors, meaning they must occupy the target active site continuously to block its function. However, over <strong>80% of the human proteome</strong> lacks defined active pockets (e.g. transcription factors) and is deemed "undruggable."
        </p>
        <p>
          <strong>Targeted Protein Degradation (TPD)</strong> bypasses this limitation. Instead of blocking a protein, TPD drugs redirect the cell's internal trash-disposal system, the <strong>Ubiquitin-Proteasome System (UPS)</strong>, to destroy the target protein:
        </p>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
          <h4 className="font-bold text-sm text-slate-900">PROTACs vs. Molecular Glues</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold leading-relaxed text-slate-800">
            <div>
              <strong className="text-slate-900 block mb-1">PROTACs (Proteolysis Targeting Chimeras)</strong>
              Bifunctional molecules containing two active binding heads connected by a flexible linker. One head binds the target protein, while the other head recruits an <strong>E3 Ubiquitin Ligase</strong> (e.g. Cereblon, VHL). By bringing them together, the ligase tags the target with ubiquitin molecules, marking it for degradation by the proteasome.
            </div>
            <div>
              <strong className="text-slate-900 block mb-1">Molecular Glues</strong>
              Monovalent, compact small molecules that bind directly at the interface of an E3 ligase and target protein. Instead of connecting them like a leash, a molecular glue sits between them, structurally remodeling the E3 surface to create a composite pocket that captures the target.
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Widget: PROTAC Simulator */}
      <section className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-slate-900" />
          <h3 className="font-bold text-base text-slate-900">Interactive Playground: PROTAC Ternary Assembly & Hook Effect</h3>
        </div>
        <p className="text-sm text-slate-800">
          PROTAC pharmacology is complex. If the linker is too short, protein surfaces collide. If it's too long, entropy drops binding affinity. Crucially, if PROTAC concentration is too high, the <strong>Hook Effect</strong> occurs: isolated binary complexes form separately, shutting down degradation.
          <strong> Adjust the sliders</strong> to assemble the ternary complex and maximize degradation yield.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-5 rounded-lg border border-slate-200">
          
          {/* Controls Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              
              {/* Slider 1: Log Concentration */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                  <span>PROTAC Concentration</span>
                  <span className="font-mono text-slate-950 bg-slate-100 px-1.5 py-0.5 rounded border">
                    {getConcText(protacConc)}
                  </span>
                </div>
                <input 
                  type="range"
                  min="-10.5"
                  max="-4.0"
                  step="0.1"
                  value={protacConc}
                  onChange={(e) => setProtacConc(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded appearance-none cursor-pointer accent-slate-900"
                />
              </div>

              {/* Slider 2: Linker Length */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                  <span>Linker Length (Carbon Atoms)</span>
                  <span className="font-mono text-slate-950 bg-slate-100 px-1.5 py-0.5 rounded border">
                    {linkerLength} Carbons
                  </span>
                </div>
                <input 
                  type="range"
                  min="4"
                  max="18"
                  step="1"
                  value={linkerLength}
                  onChange={(e) => setLinkerLength(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded appearance-none cursor-pointer accent-slate-900"
                />
              </div>

              {/* Slider 3: Cooperativity */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                  <span>Ternary Cooperativity (α)</span>
                  <span className="font-mono text-slate-950 bg-slate-100 px-1.5 py-0.5 rounded border">
                    {cooperativity.toFixed(1)}x
                  </span>
                </div>
                <input 
                  type="range"
                  min="0.1"
                  max="10.0"
                  step="0.1"
                  value={cooperativity}
                  onChange={(e) => setCooperativity(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded appearance-none cursor-pointer accent-slate-900"
                />
              </div>

            </div>

            {/* Abundance Gauge & Status Box */}
            <div className="space-y-3">
              <div className="bg-slate-900 text-white p-3.5 rounded-xl space-y-1.5 select-none">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Ternary Complex [T-P-E]</span>
                  <span className={`text-base font-black font-mono ${stateStatus === "optimal" ? "text-emerald-400" : "text-amber-400"}`}>
                    {ternaryYield.toFixed(1)}% Abundance
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div 
                    className={`h-full transition-all duration-150 ${stateStatus === "optimal" ? "bg-emerald-500" : "bg-amber-500"}`}
                    style={{ width: `${ternaryYield}%` }}
                  />
                </div>
              </div>

              {/* Dynamic Status message */}
              <div className={`p-3.5 rounded-xl border text-xs leading-relaxed font-semibold ${
                stateStatus === "optimal" 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-950" 
                  : stateStatus === "hook" || stateStatus === "clash"
                  ? "bg-red-50 border-red-200 text-red-950"
                  : "bg-amber-50 border-amber-200 text-amber-950"
              }`}>
                <div className="flex items-center gap-1.5 font-bold pb-1 text-sm">
                  {stateStatus === "optimal" ? (
                    <CheckCircle size={14} className="text-emerald-700" />
                  ) : (
                    <AlertTriangle size={14} className={stateStatus === "hook" || stateStatus === "clash" ? "text-red-700 animate-pulse" : "text-amber-700"} />
                  )}
                  <span>Status Details</span>
                </div>
                {statusText}
              </div>
            </div>

          </div>

          {/* SVG Complex assembly and Plot Graph */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* 1. SVG Assembly View */}
            <div className="w-full relative bg-slate-50 border border-slate-200 rounded-lg p-4 select-none">
              <svg viewBox="0 0 300 110" className="w-full h-auto">
                {/* Background water box */}
                <rect x="5" y="5" width="290" height="100" rx="3" fill="none" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="3,3" />

                {/* E3 ligase coordinates (fixed at left-center) */}
                <g transform="translate(60, 55)">
                  <circle r="25" fill="#fca5a5" stroke="#ef4444" strokeWidth="1.5" />
                  <text y="3" textAnchor="middle" fill="#991b1b" className="text-[7.5px] font-black">E3 LIGASE</text>
                  <text y="12" textAnchor="middle" fill="#dc2626" className="text-[6px] font-extrabold font-mono">Cereblon</text>
                </g>

                {/* Target protein coordinates (distance responds to linker length) */}
                {/* Visual distance in pixels: 120 + linker * 6 */}
                {(() => {
                  const targetX = 60 + 60 + linkerLength * 6.5;
                  const isOptimal = stateStatus === "optimal";
                  const isHook = stateStatus === "hook";
                  
                  return (
                    <g>
                      {/* Active complex: Single PROTAC molecule engaging both */}
                      {!isHook && (
                        <g>
                          {/* PROTAC linker curve */}
                          <path 
                            d={`M 60,55 Q ${(60 + targetX) / 2},${55 - (linkerLength - 3) * 2} ${targetX},55`} 
                            fill="none" 
                            stroke="#059669" 
                            strokeWidth="3" 
                            strokeLinecap="round" 
                            className="animate-pulse"
                          />
                          <circle cx="60" cy="55" r="4" fill="#059669" stroke="#ffffff" strokeWidth="1" />
                          <circle cx={targetX} cy="55" r="4" fill="#059669" stroke="#ffffff" strokeWidth="1" />
                          <text x={(60 + targetX) / 2} y={35 - (linkerLength - 8) * 1.5} textAnchor="middle" fill="#047857" className="text-[6px] font-bold">Linker</text>
                        </g>
                      )}

                      {/* Hook Effect: target has its own PROTAC, E3 has its own PROTAC, disconnected! */}
                      {isHook && (
                        <g>
                          {/* E3 bound to a PROTAC */}
                          <line x1="60" y1="55" x2="85" y2="40" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
                          <circle cx="60" cy="55" r="4" fill="#059669" stroke="#ffffff" strokeWidth="1" />
                          <circle cx="85" cy="40" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />

                          {/* Target bound to a separate PROTAC */}
                          <line x1={targetX} y1="55" x2={targetX - 25} y2="40" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
                          <circle cx={targetX} cy="55" r="4" fill="#059669" stroke="#ffffff" strokeWidth="1" />
                          <circle cx={targetX - 25} cy="40" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                          
                          <text x="150" y="25" textAnchor="middle" fill="#dc2626" className="text-[6.5px] font-black animate-pulse bg-red-100 px-1 py-0.5 rounded">HOOK SATURATION LIMIT</text>
                        </g>
                      )}

                      {/* Target Protein Sphere */}
                      <g transform={`translate(${targetX}, 55)`}>
                        <circle r="25" fill="#93c5fd" stroke="#2563eb" strokeWidth="1.5" />
                        <text y="3" textAnchor="middle" fill="#1d4ed8" className="text-[7.5px] font-black">TARGET</text>
                        <text y="12" textAnchor="middle" fill="#2563eb" className="text-[6px] font-extrabold font-mono">POK-Protein</text>
                      </g>

                      {/* Interface green glow ring (cooperativity) */}
                      {isOptimal && (
                        <ellipse cx={(60 + targetX)/2} cy="55" rx={(targetX - 60)/2.5} ry="22" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,2" className="animate-spin" />
                      )}
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* 2. Live Chart Plot */}
            <div className="w-full relative bg-slate-50 border border-slate-200 rounded-lg p-4 select-none">
              <svg viewBox="0 0 300 180" className="w-full h-auto">
                {/* Axes and Grid Lines */}
                {/* Horizontal y-axis grid (0 to 100% yield) */}
                {[20, 40, 60, 80, 100].map((val) => {
                  const y = 170 - (val / 100) * 150;
                  return (
                    <g key={val}>
                      <line x1="30" y1={y} x2="270" y2={y} stroke="#e2e8f0" strokeWidth="0.5" />
                      <text x="25" y={y + 2.5} textAnchor="end" fill="#475569" className="text-[6.5px] font-bold">{val}%</text>
                    </g>
                  );
                })}
                {/* Log10 Concentration ticks */}
                {[-10, -9, -8, -7, -6, -5, -4].map((conc) => {
                  const x = 30 + ((conc - (-10.5)) / 6.5) * 240;
                  return (
                    <g key={conc}>
                      <line x1={x} y1="10" x2={x} y2="170" stroke="#e2e8f0" strokeWidth="0.5" />
                      <text x={x} y="178" textAnchor="middle" fill="#475569" className="text-[6.5px] font-bold">10⁻{Math.abs(conc)}M</text>
                    </g>
                  );
                })}

                {/* X and Y axes */}
                <line x1="30" y1="170" x2="270" y2="170" stroke="#475569" strokeWidth="1" />
                <line x1="30" y1="10" x2="30" y2="170" stroke="#475569" strokeWidth="1" />

                {/* Labels */}
                <text x="150" y="188" textAnchor="middle" fill="#1e293b" className="text-[7.5px] font-black">PROTAC Concentration (Molar Log Scale)</text>
                <text x="8" y="90" textAnchor="middle" fill="#1e293b" className="text-[7.5px] font-black" transform="rotate(-90 8 90)">Ternary Complex Abundance</text>

                {/* Dynamic Curve Path */}
                <path d={generateCurvePath()} fill="none" stroke="#059669" strokeWidth="2.5" />

                {/* Active Indicator dot */}
                {(() => {
                  const activeX = 30 + ((protacConc - (-10.5)) / 6.5) * 240;
                  const activeY = 170 - (ternaryYield / 100) * 150;
                  return (
                    <g>
                      <line x1={activeX} y1={activeY} x2={activeX} y2="170" stroke="#64748b" strokeWidth="0.8" strokeDasharray="2,2" />
                      <line x1="30" y1={activeY} x2={activeX} y2={activeY} stroke="#64748b" strokeWidth="0.8" strokeDasharray="2,2" />
                      <circle cx={activeX} cy={activeY} r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" className="animate-pulse" />
                    </g>
                  );
                })()}
              </svg>
            </div>

          </div>

        </div>
      </section>

      {/* Section 3: Machine Learning Force Fields */}
      <section className="space-y-4">
        <h2>3. Neural Network Potentials & ML Force Fields (MLFFs)</h2>
        <p>
          Classical molecular dynamics (MM) models atoms as solid spheres connected by harmonic springs (force fields like AMBER, CHARMM). MM is fast but inaccurate, failing to model polarized chemical fields. Quantum mechanics (QM) models electronic wave functions accurately but is extremely slow.
        </p>
        <p>
          <strong>Machine Learning Force Fields (MLFFs)</strong> (e.g. MACE, ANI-1x, NequIP) bridge this gap. MLFFs use graph neural networks trained on quantum mechanics databases (DFT energy and force calculations) to compute potentials:
        </p>

        <div className="p-4 border-l-4 border-slate-900 bg-blue-50/50 rounded-r-xl space-y-2 text-sm leading-relaxed text-slate-800">
          <strong className="text-slate-950 block">Quantum Accuracy at Classical Speed:</strong>
          Unlike spring-like potentials, MLFF neural networks read the local chemical coordinates and predict atomic forces instantly with near-quantum accuracy. This permits microsecond-scale simulations of massive systems containing polarized covalent inhibitors or complex solvation spheres at classical computation speeds.
        </div>
      </section>

      {/* Section 4: DNA-Encoded Libraries (DELs) */}
      <section className="space-y-4">
        <h2>4. DNA-Encoded Libraries (DELs) & Machine Learning</h2>
        <p>
          QSAR modeling has historically been bottlenecked by the availability of high-quality active compounds in wet-lab databases. <strong>DNA-Encoded Libraries (DELs)</strong> resolve this by combining combinatorial synthesis and barcode sequencing:
        </p>
        
        <div className="overflow-x-auto not-prose border border-slate-200 rounded-lg">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-slate-900 font-bold">
              <tr>
                <th className="px-4 py-2 text-left">DEL Stage</th>
                <th className="px-4 py-2 text-left">Core Process</th>
                <th className="px-4 py-2 text-left">Chemoinformatics Integration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-slate-850">
              <tr>
                <td className="px-4 py-2 font-bold">1. Barcoded Synthesis</td>
                <td className="px-4 py-2">Compounds are synthesized in a split-and-pool scheme. Each building block addition is coupled with a specific DNA barcode sequence.</td>
                <td className="px-4 py-2">Translates billions of diverse structures into a single vial, where every molecule carries its own barcode tag.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold">2. Affinity Screening</td>
                <td className="px-4 py-2">The pooled mixture is incubated with a target protein. Non-binders are washed away.</td>
                <td className="px-4 py-2">Screens billions of molecules in parallel in a single tube without expensive robotic assays.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold">3. Sequencing & ML</td>
                <td className="px-4 py-2">The DNA tags of the remaining bound molecules are sequenced via high-throughput DNA sequencing.</td>
                <td className="px-4 py-2">Sequencing outputs massive binder/non-binder tables. This dataset is fed directly to <strong>deep QSAR models</strong>, training them on billions of structural examples.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Quiz Section */}
      <hr className="border-slate-200 my-8" />
      <Quiz 
        moduleTitle="Module 9: Advanced Frontiers in Drug Discovery"
        questions={[
          {
            question: "What is the primary cause of the Hook Effect in PROTAC targeted protein degradation pharmacology?",
            options: [
              "The linker is too long, causing the E3 ligase to wrap around the target protein.",
              "Excessively high concentrations of PROTAC molecules saturate target proteins and E3 ligases individually as binary complexes, competing with and dismantling the active ternary complexes.",
              "The E3 ligase is degraded by the proteasome before the target protein is ubiquitinated.",
              "The target protein becomes resistant to the E3 ligase recruitment."
            ],
            correctIndex: 1,
            explanation: "The Hook Effect is a three-component hook limit. At low concentrations, the PROTAC binds both E3 and target to assemble the active ternary [E3-PROTAC-Target] complex. At high concentrations, free PROTAC molecules saturate the binding pockets of E3 ligase and target proteins independently, forming separate [E3-PROTAC] and [Target-PROTAC] binary complexes. These binary complexes compete with ternary assembly, shutting down degradation."
          },
          {
            question: "Why do Machine Learning Force Fields (MLFFs) represent a major advancement over classical MD force fields?",
            options: [
              "MLFFs use explicit quantum calculations in real time, making them faster than classical springs.",
              "MLFFs use neural networks to predict atomic forces with near-QM accuracy based on training sets of DFT calculations, maintaining classical O(N) computation speeds.",
              "MLFFs remove the need for solvation water boxes during molecular dynamics.",
              "MLFFs prevent periodic boundary conditions from splitting molecules."
            ],
            correctIndex: 1,
            explanation: "Classical molecular dynamics is fast because it uses simple harmonic springs for bonds. However, it cannot model chemical reaction changes or electronic polarization. MLFFs use neural networks (typically Graph Neural Networks) trained on quantum mechanical databases (DFT) to map Cartesian coordinates directly to atomic forces. This enables QM-level accuracy at the speed of classical simulations."
          },
          {
            question: "How does de novo 3D pocket-conditioned diffusion generation differ from classical virtual screening?",
            options: [
              "Diffusion models generate molecules by searching ECFP4 fingerprint similarity lists.",
              "Diffusion models iteratively denoise Cartesian coordinates and atom types directly inside the 3D coordinates of the binding site, generating novel customized shapes from scratch rather than filtering pre-existing databases.",
              "Diffusion models require DNA sequencing of active binders to identify structures.",
              "Diffusion models rely on the Hook effect to evaluate binding affinity."
            ],
            correctIndex: 1,
            explanation: "Virtual screening filters pre-existing chemical databases to find active keys. Pocket-conditioned diffusion models generate new chemical structures from scratch. Beginning with a cloud of random points in the target pocket, the model runs a series of denoising steps that gradually assemble specific atoms (C, N, O) and coordinates to match the shape and chemical complement of the receptor."
          }
        ]}
      />
    </div>
  );
}
