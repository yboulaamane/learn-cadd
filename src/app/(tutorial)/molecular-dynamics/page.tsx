"use client";

import React, { useState, useEffect } from "react";
import { 
  Activity, 
  Layers, 
  Play, 
  Pause, 
  RotateCcw, 
  Flame, 
  Compass, 
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Cpu,
  Info
} from "lucide-react";
import { Quiz } from "@/components/Quiz";
import { CollapsibleCode } from "@/components/CollapsibleCode";

interface SystemData {
  id: string;
  name: string;
  ligand: string;
  target: string;
  freeEnergy: string; // MM/GBSA value
  desc: string;
  rmsd: number[];
  rmsf: number[];
  hBonds: number[];
  rg: number[];
  sasa: number[];
}

const systems: Record<string, SystemData> = {
  egfr: {
    id: "egfr",
    name: "EGFR Kinase Domain",
    ligand: "Erlotinib",
    target: "Epidermal Growth Factor Receptor",
    freeEnergy: "-42.5 kcal/mol",
    desc: "Simulating EGFR kinase bound to Erlotinib. Notice how the activation loop stabilizes and the hydrogen bond with Met793 is maintained.",
    rmsd: [0.5, 0.9, 1.2, 1.4, 1.7, 1.9, 2.1, 2.0, 2.1, 2.2, 2.1, 2.2, 2.3, 2.2, 2.1, 2.2, 2.2, 2.3, 2.2, 2.3],
    rmsf: [0.8, 1.1, 2.4, 3.2, 1.5, 0.9, 0.6, 0.5, 0.6, 0.8, 2.2, 3.5, 1.8, 1.0, 0.7, 0.6, 0.8, 1.5, 2.6, 1.2],
    hBonds: [2, 2, 3, 2, 3, 3, 2, 3, 3, 2, 2, 3, 3, 3, 3, 2, 3, 2, 3, 3],
    rg: [18.2, 18.15, 18.1, 18.08, 18.05, 18.02, 18.01, 18.02, 18.0, 18.01, 18.0, 17.99, 18.0, 18.01, 17.99, 18.0, 18.01, 18.02, 18.01, 18.0],
    sasa: [245, 242, 238, 235, 230, 228, 225, 224, 221, 222, 220, 219, 221, 223, 220, 218, 222, 224, 221, 220]
  },
  cov2: {
    id: "cov2",
    name: "SARS-CoV-2 Mpro",
    ligand: "Nirmatrelvir",
    target: "Main Protease (Mpro)",
    freeEnergy: "-49.8 kcal/mol",
    desc: "Simulating SARS-CoV-2 main protease bound to Nirmatrelvir. The system reaches equilibration quickly, showing a rigid catalytic pocket.",
    rmsd: [0.4, 0.7, 1.0, 1.2, 1.3, 1.4, 1.4, 1.5, 1.5, 1.6, 1.5, 1.6, 1.6, 1.5, 1.6, 1.6, 1.5, 1.6, 1.6, 1.5],
    rmsf: [0.6, 0.8, 1.5, 1.9, 0.9, 0.7, 0.5, 0.4, 0.5, 0.6, 1.3, 2.1, 1.1, 0.7, 0.5, 0.4, 0.5, 1.0, 1.8, 0.9],
    hBonds: [3, 4, 4, 3, 4, 4, 4, 3, 4, 4, 4, 4, 3, 4, 4, 4, 4, 3, 4, 4],
    rg: [17.5, 17.48, 17.45, 17.43, 17.42, 17.41, 17.4, 17.41, 17.4, 17.39, 17.4, 17.39, 17.4, 17.41, 17.39, 17.4, 17.41, 17.42, 17.41, 17.4],
    sasa: [210, 208, 205, 203, 199, 198, 195, 196, 193, 194, 192, 191, 193, 195, 192, 190, 194, 196, 193, 192]
  }
};

export default function MolecularDynamicsPage() {
  const [selectedSystem, setSelectedSystem] = useState<string>("egfr");
  const [frame, setFrame] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("rmsd");

  const system = systems[selectedSystem];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setFrame((prev) => (prev < 19 ? prev + 1 : 0));
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleReset = () => {
    setFrame(0);
    setIsPlaying(false);
  };

  // Trajectory graphics parameters
  const getProteinPath = () => {
    // Generate protein secondary structure line that moves with frames
    const points = [];
    const amplitude = 3 + Math.sin(frame * 0.5) * 1.5;
    for (let x = 10; x <= 190; x += 15) {
      const y = 80 + Math.sin((x + frame * 10) / 20) * amplitude;
      points.push(`${x},${y}`);
    }
    return `M ${points.join(" L ")}`;
  };

  const getLigandCoords = () => {
    // Ligand moves closer and stays in pocket
    const t = frame / 19;
    const startX = 150;
    const startY = 20;
    const pocketX = 100 + Math.sin(frame * 0.3) * 1.5;
    const pocketY = 82 + Math.cos(frame * 0.3) * 1.5;
    
    // interpolate
    const x = startX + (pocketX - startX) * Math.min(t * 2, 1);
    const y = startY + (pocketY - startY) * Math.min(t * 2, 1);
    return { x, y };
  };

  const ligand = getLigandCoords();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1>Module 8: Molecular Dynamics &amp; Trajectory Analysis</h1>
        <p className="lead text-slate-600">
          Learn how to simulate the physical movements of atoms and molecules over time. Explore classical force fields, equilibration stages, and trajectory analysis metrics.
        </p>
      </div>

      <hr className="border-slate-100 dark:border-slate-900" />

      {/* Section 1: Overview */}
      <section className="space-y-4">
        <h2>1. Why Simulate Motion?</h2>
        <p>
          While experimental methods like X-ray crystallography or NMR yield high-resolution static 3D structures, they represent frozen states. In reality, biological systems are highly dynamic: proteins "breathe," side chains rotate, and ligands undergo conformational changes to enter active site cavities.
        </p>
        <p>
          <strong>Molecular Dynamics (MD)</strong> simulations solve Newton's classical equations of motion step-by-step for thousands of atoms over time, turning structural snapshots into interactive molecular trajectories.
        </p>
      </section>

      {/* Section 2: MD Simulation Workflow */}
      <section className="space-y-4">
        <h2>2. Standard MD Simulation Pipeline</h2>
        <p>
          Before running a production MD simulation, the raw target-ligand complex must undergo careful preparation:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 not-prose">
          <div className="p-3.5 rounded-lg border border-border bg-white space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Stage 1</span>
            <h4 className="font-bold text-sm text-foreground">System Prep</h4>
            <p className="text-xs text-slate-655 leading-relaxed">
              Standardizes nomenclature, assigns Histidine protonation states, adds hydrogens, and optimizes hydrogen bond networks.
            </p>
          </div>
          <div className="p-3.5 rounded-lg border border-border bg-white space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Stage 2</span>
            <h4 className="font-bold text-sm text-foreground">Solvation</h4>
            <p className="text-xs text-slate-655 leading-relaxed">
              Places the complex in a water box (cubic/orthorhombic) with a 10 Å water buffer, using models like TIP3P or SPC.
            </p>
          </div>
          <div className="p-3.5 rounded-lg border border-border bg-white space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Stage 3</span>
            <h4 className="font-bold text-sm text-foreground">Minimization</h4>
            <p className="text-xs text-slate-655 leading-relaxed">
              Uses steepest descent or conjugate gradient minimization to resolve steric clashes and correct bond distortions.
            </p>
          </div>
          <div className="p-3.5 rounded-lg border border-border bg-white space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Stage 4</span>
            <h4 className="font-bold text-sm text-foreground">Equilibration</h4>
            <p className="text-xs text-slate-655 leading-relaxed">
              NVT phase heats the solvent to 310 K. NPT phase applies a barostat to stabilize pressure fluctuations to 1 atm.
            </p>
          </div>
          <div className="p-3.5 rounded-lg border border-border bg-white space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Stage 5</span>
            <h4 className="font-bold text-sm text-foreground">Production</h4>
            <p className="text-xs text-slate-655 leading-relaxed">
              The system runs unconstrained. Snapshots are recorded at intervals (e.g. every 10 ps) to form a trajectory file.
            </p>
          </div>
        </div>

        {/* Explicit vs Implicit Solvation Models */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-4 space-y-3">
          <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
            <Info className="h-4 w-4 text-indigo-650" /> Solvation Models: Explicit vs. Implicit
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed">
            Biomolecules function in aqueous environments. MD simulations must account for water-solvent interactions using one of two representations:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
              <h5 className="font-bold text-xs text-slate-805">Explicit Solvation (e.g. TIP3P, TIP4P, OPC)</h5>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Surrounds the solute with thousands of individual, rigid physical water molecules. It accurately models hydrogen bond networks, solvent shells, and hydrophobic effects, but increases the calculation time exponentially because water-water interactions must be calculated.
              </p>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
              <h5 className="font-bold text-xs text-slate-805">Implicit Solvation (e.g. GB/SA, PB/SA)</h5>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Treats water as a continuous, dielectric medium (or continuum) rather than individual atoms. It uses the <strong>Poisson-Boltzmann (PB)</strong> or <strong>Generalized Born (GB)</strong> equations paired with Surface Area (SA) approximations to estimate solvation energies quickly, ideal for fast free-energy calculations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Widget: Advanced MD Trajectory Dashboard */}
      <section className="p-5 rounded-xl bg-slate-50/50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-900 space-y-4">
        <div className="flex items-center gap-2">
          <Activity size={16} />
          <h3 className="font-bold text-sm">Interactive Playground: MD Trajectory Analysis Dashboard</h3>
        </div>
        <p className="text-sm text-slate-655 leading-normal">
          Select a system and click "Play Trajectory" to run the 100 ns simulation. Move the frame slider to inspect real-time shifts in RMSD, RMSF, Hydrogen Bonds, and Solvent Exposure.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white dark:bg-slate-950 p-5 rounded-lg border border-slate-100 dark:border-slate-900 not-prose">
          
          {/* Column 1: System Config & SVG Simulator */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Trajectory Viewer</span>
              <select 
                value={selectedSystem}
                onChange={(e) => {
                  setSelectedSystem(e.target.value);
                  handleReset();
                }}
                className="text-xs border border-border rounded p-1 bg-white"
              >
                <option value="egfr">EGFR - Erlotinib</option>
                <option value="cov2">SARS-CoV-2 Mpro - Nirmatrelvir</option>
              </select>
            </div>

            {/* Simulated Frame Screen */}
            <div className="relative aspect-video w-full border border-slate-200 rounded-lg bg-slate-50 overflow-hidden flex flex-col justify-between p-3.5 select-none">
              
              {/* Simulated physical layout */}
              <div className="relative flex-1">
                <svg viewBox="0 0 200 120" className="w-full h-full">
                  {/* Solvation Water Box Boundary */}
                  <rect x="5" y="5" width="190" height="110" rx="3" fill="none" stroke="currentColor" className="text-slate-200" strokeWidth="0.8" strokeDasharray="3,3" />
                  
                  {/* Static active pocket indicator */}
                  <path d="M 85 95 Q 100 65 115 95" fill="none" stroke="currentColor" className="text-slate-350" strokeWidth="1.5" strokeDasharray="2,2" />
                  <text x="100" y="112" textAnchor="middle" className="text-[6px] font-bold fill-slate-400 uppercase">Catalytic Pocket</text>

                  {/* Solvation water dots (randomized floating offsets) */}
                  <circle cx={20 + Math.sin(frame * 0.8) * 1.5} cy={30 + Math.cos(frame * 0.5) * 1.5} r="1" fill="#3b82f6" opacity="0.3" />
                  <circle cx={40 + Math.cos(frame * 0.4) * 2} cy={20 + Math.sin(frame * 0.6) * 1} r="1" fill="#3b82f6" opacity="0.3" />
                  <circle cx={170 + Math.sin(frame * 0.5) * 1} cy={90 + Math.cos(frame * 0.7) * 2} r="1" fill="#3b82f6" opacity="0.3" />
                  <circle cx={180 + Math.cos(frame * 0.9) * 1.5} cy={40 + Math.sin(frame * 0.3) * 1.5} r="1" fill="#3b82f6" opacity="0.3" />

                  {/* Flexible Protein chain */}
                  <path 
                    d={getProteinPath()} 
                    fill="none" 
                    stroke="currentColor" 
                    className="text-slate-700" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                  />
                  {/* Catalytic residue key points */}
                  <circle cx="100" cy="80" r="2" fill="currentColor" className="text-red-500" />
                  <text x="100" y="74" textAnchor="middle" className="text-[5.5px] font-mono fill-slate-700">Met793/Glu166</text>

                  {/* Dynamic Ligand */}
                  <g transform={`translate(${ligand.x}, ${ligand.y})`}>
                    <polygon points="0,-4 3.5,2 -3.5,2" fill="currentColor" className="text-accent" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="0" cy="0" r="1.5" fill="currentColor" className="text-slate-900" />
                  </g>
                  
                  {/* Hydrogen bond connection line inside active pocket */}
                  {frame >= 10 && (
                    <line 
                      x1="100" y1="80" 
                      x2={ligand.x} y2={ligand.y} 
                      stroke="#ef4444" 
                      strokeWidth="1.2" 
                      strokeDasharray="2,2" 
                      className="animate-pulse" 
                    />
                  )}
                </svg>
              </div>

              {/* Water Box label */}
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase border-t border-slate-100 pt-2 mt-1">
                <span>Solvent: Aqueous TIP3P</span>
                <span>T = 310 K | P = 1 atm</span>
              </div>
            </div>

            {/* Animation Controls */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-650">
                <span className="font-semibold">Trajectory Timeline</span>
                <span className="font-mono">Frame {frame + 1} / 20 ({((frame + 1) * 5).toFixed(0)} ns)</span>
              </div>
              
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-2 rounded-lg text-white transition-colors ${
                    isPlaying ? "bg-amber-600 hover:bg-amber-700" : "bg-accent hover:bg-accent-dark"
                  }`}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button
                  onClick={handleReset}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  <RotateCcw size={14} />
                </button>
                <input
                  type="range"
                  min="0"
                  max="19"
                  value={frame}
                  onChange={(e) => {
                    setFrame(parseInt(e.target.value));
                    setIsPlaying(false);
                  }}
                  className="flex-1 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>
            </div>

            {/* Quick metrics readouts */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 font-bold block uppercase mb-0.5">MM/GBSA ΔG</span>
                <span className="text-sm font-extrabold text-slate-900">{system.freeEnergy}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 font-bold block uppercase mb-0.5">Pocket H-Bonds</span>
                <span className="text-sm font-extrabold text-red-650">{system.hBonds[frame]} active</span>
              </div>
            </div>

          </div>

          {/* Column 2: Dashboard Charts */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            
            {/* Chart selection tabs */}
            <div className="flex border-b border-border text-xs font-semibold">
              {["rmsd", "rmsf", "hBonds", "sasa"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2.5 px-3 capitalize border-b-2 transition-colors ${
                    activeTab === tab 
                      ? "border-accent text-accent font-bold" 
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tab === "hBonds" ? "H-Bonds" : tab === "sasa" ? "SASA / Solvent" : tab.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Trajectory Plot SVG Graph */}
            <div className="relative flex-1 py-4 flex flex-col justify-center items-center">
              <div className="w-full h-44 bg-slate-50 border border-slate-200 rounded-lg p-2.5 relative flex flex-col justify-between">
                <svg viewBox="0 0 240 100" className="w-full h-full">
                  {/* Grid lines */}
                  <line x1="25" y1="10" x2="230" y2="10" stroke="#f1f5f9" strokeWidth="0.8" />
                  <line x1="25" y1="50" x2="230" y2="50" stroke="#f1f5f9" strokeWidth="0.8" />
                  <line x1="25" y1="80" x2="230" y2="80" stroke="#cbd5e1" strokeWidth="0.8" />
                  <line x1="25" y1="10" x2="25" y2="80" stroke="#cbd5e1" strokeWidth="0.8" />

                  {/* Y Axis labels */}
                  {activeTab === "rmsd" && (
                    <>
                      <text x="5" y="14" className="text-[6.5px] fill-slate-500 font-mono">3.0 Å</text>
                      <text x="5" y="52" className="text-[6.5px] fill-slate-500 font-mono">1.5 Å</text>
                      <text x="5" y="82" className="text-[6.5px] fill-slate-500 font-mono">0.0 Å</text>
                    </>
                  )}
                  {activeTab === "rmsf" && (
                    <>
                      <text x="5" y="14" className="text-[6.5px] fill-slate-500 font-mono">4.0 Å</text>
                      <text x="5" y="52" className="text-[6.5px] fill-slate-500 font-mono">2.0 Å</text>
                      <text x="5" y="82" className="text-[6.5px] fill-slate-500 font-mono">0.0 Å</text>
                    </>
                  )}
                  {activeTab === "hBonds" && (
                    <>
                      <text x="8" y="14" className="text-[6.5px] fill-slate-500 font-mono">4</text>
                      <text x="8" y="52" className="text-[6.5px] fill-slate-500 font-mono">2</text>
                      <text x="8" y="82" className="text-[6.5px] fill-slate-500 font-mono">0</text>
                    </>
                  )}
                  {activeTab === "sasa" && (
                    <>
                      <text x="2" y="14" className="text-[6.5px] fill-slate-500 font-mono">260 Å²</text>
                      <text x="2" y="52" className="text-[6.5px] fill-slate-500 font-mono">220 Å²</text>
                      <text x="2" y="82" className="text-[6.5px] fill-slate-500 font-mono">180 Å²</text>
                    </>
                  )}

                  {/* Draw trajectory curve */}
                  {(() => {
                    let dataList: number[] = [];
                    let maxVal = 1;
                    let minVal = 0;
                    if (activeTab === "rmsd") { dataList = system.rmsd; maxVal = 3.0; }
                    if (activeTab === "rmsf") { dataList = system.rmsf; maxVal = 4.0; }
                    if (activeTab === "hBonds") { dataList = system.hBonds; maxVal = 4; }
                    if (activeTab === "sasa") { dataList = system.sasa; maxVal = 260; minVal = 180; }

                    const points = dataList.map((val, idx) => {
                      const x = 25 + (idx / 19) * 205;
                      const y = 80 - ((val - minVal) / (maxVal - minVal)) * 70;
                      return `${x},${y}`;
                    });

                    const currentX = 25 + (frame / 19) * 205;
                    const currentY = 80 - ((dataList[frame] - minVal) / (maxVal - minVal)) * 70;

                    return (
                      <g>
                        {/* Trajectory plot path */}
                        <path d={`M ${points.join(" L ")}`} fill="none" stroke="currentColor" className="text-slate-800" strokeWidth="1.5" />
                        {/* Time indicator vertical line */}
                        <line x1={currentX} y1="10" x2={currentX} y2="80" stroke="currentColor" className="text-slate-350" strokeWidth="0.8" strokeDasharray="2,2" />
                        {/* Current point node */}
                        <circle cx={currentX} cy={currentY} r="3.5" fill="currentColor" className="text-accent" stroke="white" strokeWidth="1" />
                      </g>
                    );
                  })()}
                </svg>

                {/* X Axis title */}
                <div className="flex justify-between items-center text-[9px] text-slate-500 font-semibold px-6 border-t border-slate-200 pt-1">
                  <span>0 ns</span>
                  <span>{activeTab === "rmsf" ? "Protein Residue Sequence (1 - 20)" : "Simulation Time (ns)"}</span>
                  <span>100 ns</span>
                </div>
              </div>
            </div>

            {/* Text description explaining the selected metric tab */}
            <div className="text-xs text-slate-655 bg-slate-50 border border-slate-200 rounded-lg p-3 leading-relaxed">
              {activeTab === "rmsd" ? (
                <span><strong>Root-Mean-Square Deviation (RMSD):</strong> Measures structural changes compared to the starting frame. A stable EGFR system plateaus around <strong>2.0–2.3 Å</strong> (at ~50 ns), indicating complete structural equilibration.</span>
              ) : activeTab === "rmsf" ? (
                <span><strong>Root-Mean-Square Fluctuation (RMSF):</strong> Measures per-residue dynamic displacements over the entire trajectory. High peaks represent highly flexible loops, while sharp valleys indicate the rigid binding pocket.</span>
              ) : activeTab === "hBonds" ? (
                <span><strong>Hydrogen Bond Analysis:</strong> Counts intermolecular H-bond counts between Erlotinib and Met793. High occupancy (active in {Math.round(system.hBonds.filter(b=>b>=3).length/20*100)}% of frames) validates robust thermodynamic stability.</span>
              ) : (
                <span><strong>Solvent Accessible Surface Area (SASA):</strong> Quantifies pocket exposure to bulk solvent. The drop from 245 to 220 Å² as Erlotinib docks reveals hydrophobic desolvation, displacing water to gain favorable solvent entropy (+TΔS).</span>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* Section 3: Trajectory Analysis Metrics */}
      <section className="space-y-4">
        <h2>3. Assessing Simulation Length & Convergence</h2>
        <p>
          Once a trajectory file contains coordinate snapshots, computational chemists run validation calculations to evaluate when the system has reached thermodynamic and structural equilibrium. Drawing conclusions from under-converged simulations yields unreliable results.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900">Key Convergence Observables</h4>
            <ul className="list-disc pl-5 text-xs text-slate-850 space-y-1.5 leading-relaxed font-semibold">
              <li><strong>Backbone RMSD:</strong> Tracks coordinate deviation relative to the starting frame. A flat plateau (typically &lt; 2.5 Å) signifies that the structure has successfully equilibrated.</li>
              <li><strong>Secondary Structure Content:</strong> Tracks persistence of alpha-helices and beta-sheets. Rapid shifts signal structural denaturation.</li>
              <li><strong>Interaction Fingerprints:</strong> Tracks the persistence (occupancy percentage) of key hydrogen bonds, salt bridges, or pi-pi stacking contacts.</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900">Standard Simulation Timeframes</h4>
            <ul className="list-disc pl-5 text-xs text-slate-850 space-y-1.5 leading-relaxed font-semibold">
              <li><strong>50–100 ns:</strong> Standard for evaluating initial ligand pose stability in relatively rigid binding pockets.</li>
              <li><strong>100–200 ns:</strong> Standard for analyzing loop reorganizations, induced fit transitions, and side-chain rotamers.</li>
              <li><strong>200–500 ns:</strong> Necessary to observe slower events, such as domain-level hinge shifts and partial unbinding.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Mathematical Trajectory Analysis Formulations */}
      <section className="space-y-4 border-t border-slate-200 pt-6">
        <h3>Mathematical Definitions of RMSD and RMSF</h3>
        <p className="text-sm text-slate-800 leading-relaxed">
          To evaluate structural drifts and residue fluctuations quantitatively during trajectory analysis, researchers calculate two related but distinct mathematical metrics:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
            <h4 className="font-bold text-sm text-slate-900">Root-Mean-Square Deviation (RMSD)</h4>
            <p className="text-xs text-slate-755 leading-relaxed">
              Measures the average distance deviation between a set of atoms (usually the protein backbone) in a snapshot at time <em>t</em> compared to their positions in a reference coordinate set:
            </p>
            <div className="my-2 font-mono text-center text-xs bg-slate-50 py-2.5 rounded text-slate-805 font-bold border border-slate-200">
              {"RMSD(t) = √[ (1/N) * Σ || r_i(t) - r_i,ref ||² ]"}
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Where <em>N</em> is the number of atoms, <em>r_i(t)</em> is the Cartesian coordinates of atom <em>i</em> at time <em>t</em>, and <em>r_i,ref</em> is its coordinates in the reference structure (typically the crystal structure or first frame).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
            <h4 className="font-bold text-sm text-slate-900">Root-Mean-Square Fluctuation (RMSF)</h4>
            <p className="text-xs text-slate-755 leading-relaxed">
              Measures the fluctuation of a single atom (or residue <em>i</em>) around its time-averaged coordinate position over the entire trajectory:
            </p>
            <div className="my-2 font-mono text-center text-xs bg-slate-50 py-2.5 rounded text-slate-805 font-bold border border-slate-200">
              {"RMSF_i = √[ ⟨ || r_i(t) - ⟨r_i⟩ ||² ⟩ ]"}
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Where <em>r_i(t)</em> is the coordinates of residue <em>i</em> at time <em>t</em>, and <em>⟨r_i⟩</em> is the average position of that residue over all simulated frames. The brackets <em>⟨...⟩</em> represent the time average.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Pitfall Mitigation Checklist */}
      <section className="space-y-4">
        <h2>4. Ten Critical Pitfalls in Molecular Dynamics & Mitigation</h2>
        <p>
          Molecular Dynamics simulations solve classical equations of motion step-by-step for thousands of atoms over time. Minor preparation mistakes do not always cause the simulation to crash; instead, they yield silent, physically invalid trajectories.
        </p>

        <div className="overflow-x-auto not-prose border border-slate-200 rounded-lg">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-slate-900 font-bold">
              <tr>
                <th className="px-4 py-2 text-left">Methodological Pitfall</th>
                <th className="px-4 py-2 text-left">Typical Consequence</th>
                <th className="px-4 py-2 text-left">Mitigation Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-slate-850">
              <tr>
                <td className="px-4 py-2 font-bold">1. Poor Initial Coordinates</td>
                <td className="px-4 py-2 text-red-650">Steric clashes, missing loops collapse.</td>
                <td className="px-4 py-2">Model loops, fix clashes, evaluate pH-dependent Histidine protonation (PropKa/H++).</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold">2. Water Model Mismatches</td>
                <td className="px-4 py-2 text-red-650">Inaccurate densities, distorted diffusion.</td>
                <td className="px-4 py-2">Always use the exact water model (e.g. TIP3P, OPC) the force field was parameterized on.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold">3. Automated Topology Bias</td>
                <td className="px-4 py-2 text-red-650">Inaccurate ligand partial charges.</td>
                <td className="px-4 py-2">Treat automated charges as drafts. Check charge penalties and validate with QM calculations.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold">4. Insufficient Equilibration</td>
                <td className="px-4 py-2 text-red-650">Instabilities and structural distortion.</td>
                <td className="px-4 py-2">Equilibrate system density and potential energy during distinct NVT and NPT cycles.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold">5. PBC Boundary Splitting</td>
                <td className="px-4 py-2 text-red-650">Analytical errors (broken RMSD/Rg plots).</td>
                <td className="px-4 py-2">Post-process trajectories to re-center the solute and unwrap periodic boundaries (<code>gmx trjconv</code>).</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold">6. Single Trajectory Bias</td>
                <td className="px-4 py-2 text-red-650">Mistaking rare stochastic events for trends.</td>
                <td className="px-4 py-2">Conduct replicate simulations (3–5 runs) using different random starting seeds.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 5: Advanced Enhanced Sampling REMD */}
      <section className="space-y-4">
        <h2>5. Advanced Enhanced Sampling: Temperature Replica Exchange (T-REMD)</h2>
        <p>
          Standard MD simulations routinely get trapped in local energy minima on rugged conformational landscapes. To bypass these energy barriers, researchers use <strong>Temperature Replica Exchange Molecular Dynamics (T-REMD)</strong>.
        </p>
        <p>
          The protocol launches <em>N</em> parallel replicas of the system, each evolving at a slightly different temperature (e.g., 300 K to 370 K). At specified intervals, adjacent replicas attempt to swap coordinates. The swaps are accepted or rejected based on the Metropolis criterion:
        </p>
        <blockquote>
          <strong>Metropolis Acceptance Probability:</strong>
          <div className="my-3 font-mono text-center text-xs bg-slate-50 py-2 rounded text-slate-900 font-bold">
            {"P = min(1, exp[( (1/Ti) - (1/Tj) ) * (Ej - Ei)])"}
          </div>
          Where <span className="font-semibold">Ti, Tj</span> represent the temperatures and <span className="font-semibold">Ei, Ej</span> are the potential energies of the respective replicas. High-temperature replicas cross boundaries readily, and swapping coordinates transfers this broad sampling back to the physiological replica (e.g. 300 K).
        </blockquote>

        <div className="my-4">
          <CollapsibleCode
            title="GROMACS T-REMD Command Workflow"
            code={`# =====================================================================
# STEP 1: COMPILE INPUT FILES FOR EACH SIMULATION TEMPERATURE REPLICA
# =====================================================================
# gmx grompp compiles coordinate (.gro), topology (.top), and parameter (.mdp) files 
# into a binary run input file (.tpr).
#
# Flags:
# -f: Input parameter file (defines timestep, boundary conditions, temperature)
# -o: Output binary run file (.tpr)
# -c: Input coordinate structure file (atoms coordinates)
# -p: Input topology file (force field parameters and molecular structures)
# -maxwarn 1: Allows compilation to proceed with one minor warning (e.g. charge mismatch)

gmx grompp -f md_300.mdp -o topol_300.tpr -c conf.gro -p topol.top -maxwarn 1
gmx grompp -f md_310.mdp -o topol_310.tpr -c conf.gro -p topol.top -maxwarn 1

# =====================================================================
# STEP 2: LAUNCH PARALLEL SWAPPING SIMULATIONS (T-REMD)
# =====================================================================
# mpirun launches parallel processes using Message Passing Interface (MPI).
#
# Flags:
# -np 8: Spawns 8 parallel processes (cores)
# mdrun -multi 8: Run 8 separate replicas (one process/core per replica)
# -replex 1000: Attempt coordinate swapping between adjacent temperatures every 1000 steps
# -s topol_.tpr: Base name of the input files (GROMACS automatically appends indices 0 to 7)
# -deffnm remd: Default prefix for output logs, trajectories, and energies (remd.log, remd.xtc)

mpirun -np 8 gmx_mpi mdrun -multi 8 -replex 1000 -s topol_.tpr -deffnm remd`}
          />
        </div>
      </section>

      {/* Section 6: Software Packages */}
      <section className="space-y-4">
        <h2>6. High-Performance MD Engines</h2>
        <p>
          Simulating a 100,000 atom water box at femtosecond steps requires high-performance parallel computing. The leading engines used by researchers are:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-foreground">GROMACS</h4>
            <p className="text-xs text-slate-850 leading-relaxed font-semibold">
              Highly optimized open-source engine. Outstanding GPU-acceleration features make it the industry benchmark for standard biomolecular simulations.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-foreground">AMBER</h4>
            <p className="text-xs text-slate-850 leading-relaxed font-semibold">
              A comprehensive suite of programs combined with highly calibrated biomolecular and GAFF2 force fields for nucleic acids and organic ligands.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-foreground">Desmond</h4>
            <p className="text-xs text-slate-850 leading-relaxed font-semibold">
              Developed by DE Shaw Research. Known for extreme parallel scaling speed. Integrated natively within Schrödinger's Maestro GUI for drug discovery workflows.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-foreground">NAMD</h4>
            <p className="text-xs text-slate-850 leading-relaxed font-semibold">
              Developed by UIUC. Designed for extreme scaling on high-performance supercomputing clusters simulating massive molecular structures.
            </p>
          </div>
        </div>
      </section>

      {/* Section 7: Advanced Simulations */}
      <section className="space-y-4">
        <h2>7. Advanced Multiscale Simulations: QM/MM & Gaussian Accelerated MD</h2>
        <p>
          Classical force fields (Molecular Mechanics, MM) treat bonds as harmonic springs, meaning bond connectivity is fixed. Consequently, classical MD cannot simulate chemical reactions, such as the formation of covalent bonds during catalytic steps or the binding of covalent inhibitors. To study these dynamic electronic processes, advanced simulation techniques are utilized:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900">Quantum Mechanics / Molecular Mechanics (QM/MM)</h4>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              QM/MM is a multiscale approach that divides the system into two distinct regions:
            </p>
            <ul className="list-disc pl-5 text-xs text-slate-850 space-y-1 font-semibold leading-relaxed">
              <li><strong>QM Region (Active Site):</strong> The catalytic residues, reacting atoms, and covalent ligand head are modeled using quantum mechanics (DFT or semi-empirical methods), solving Schrödinger's equation to capture bond breaking, formation, and electronic polarization.</li>
              <li><strong>MM Region (Bulk Environment):</strong> The rest of the protein and the surrounding solvent water box are modeled using fast classical force fields (like AMBER or CHARMM) to compute electrostatic and steric boundary forces.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900">Gaussian Accelerated MD (GaMD)</h4>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              Enhanced sampling methods like Replica Exchange (T-REMD) require massive computing resources because they run multiple parallel replicas. <strong>Gaussian Accelerated Molecular Dynamics (GaMD)</strong> provides a highly efficient alternative running on a <strong>single replica</strong>:
            </p>
            <ul className="list-disc pl-5 text-xs text-slate-850 space-y-1 font-semibold leading-relaxed">
              <li>It applies a continuous, harmonic boost potential to smooth the potential energy surface.</li>
              <li>The boost energy is automatically calculated from the statistics (variance and mean, following a Gaussian distribution) of the system's potential energy.</li>
              <li>This lowers transition barriers, allowing the simulation to escape deep local energy wells and capture millisecond-scale conformational changes using standard nanosecond simulation times.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 8: Enhanced Sampling Methods */}
      <section className="space-y-4 border-t border-border pt-8">
        <h2>8. Enhanced Sampling: Umbrella Sampling, Metadynamics, &amp; Steered MD</h2>
        <p>
          Classical molecular dynamics simulations often get trapped in local energy minima, unable to cross high transition barriers (greater than standard thermal energy) within standard nanosecond-to-microsecond simulation times. To map entire free energy landscapes and compute binding pathways, computational biophysicists use <strong>enhanced sampling methods</strong>:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Umbrella Sampling
            </h4>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              Forces the system to sample states along a defined reaction coordinate (e.g. ligand egress). It runs a series of parallel simulations (windows) constrained by harmonic biasing potentials. The biased probability distributions are then reconstructed using the <strong>Weighted Histogram Analysis Method (WHAM)</strong> to compute the Potential of Mean Force (PMF).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              Metadynamics
            </h4>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              Adds a history-dependent biasing potential to a few collective variables (CVs). At regular steps, the simulation deposits small "Gaussian energy hills" at the currently visited coordinate. This "fills up" the local free energy wells, preventing the system from backtracking and forcing it to explore new conformations.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              Steered MD (SMD)
            </h4>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              Mimics atomic force microscopy (AFM). An external force (a virtual moving spring) pulls the ligand out of the binding pocket along a vector. By recording the force and displacement over time, researchers calculate the non-equilibrium work and estimate equilibrium free energy using <strong>Jarzynski's Equality</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <hr className="border-slate-200 my-8" />
      <Quiz 
        moduleTitle="Module 8: Molecular Dynamics & Trajectory Analysis"
        questions={[
          {
            question: "Why must raw MD trajectories undergo post-processing (unwrapping) before computing RMSD or Radius of Gyration (Rg)?",
            options: [
              "Because force field parameters are encrypted during the simulation run.",
              "To remove water molecules that would otherwise crash the plotting library.",
              "To correct Periodic Boundary Condition (PBC) wrapping artifacts that split molecules across box boundaries, which would yield artificially inflated deviations.",
              "To accelerate the GPU-rendering pipeline in Next.js."
            ],
            correctIndex: 2,
            explanation: "In PBC simulations, atoms that exit one side of the box re-enter from the opposite side. This can mathematically split a molecular chain across box boundaries. Calculating RMSD or Rg on wrapped coordinates yields massive errors; trajectories must be post-processed (unwrapped/re-centered using tools like `gmx trjconv`) beforehand."
          },
          {
            question: "How does Temperature Replica Exchange (T-REMD) help simulations escape local energy minima?",
            options: [
              "It runs a single copy at 300K but dynamically increases the time step to skip energy barriers.",
              "It runs N parallel replicas of the system at different temperatures, periodically swapping configurations using a Metropolis criteria to allow coordinates to traverse energy barriers.",
              "It freezes the side-chain rotamers so that only loops are permitted to move.",
              "It replaces explicit solvent models with implicit generalized Born approximations."
            ],
            correctIndex: 1,
            explanation: "T-REMD runs multiple parallel copies (replicas) of the same system at a range of temperatures. Higher temperature replicas can easily cross rugged energy barriers. By periodically swapping configurations based on Metropolis acceptance probability, the physiological (lower temperature) replica benefits from the conformational space sampled at higher temperatures."
          },
          {
            question: "Why is relying on a single production trajectory considered a methodological pitfall in MD studies?",
            options: [
              "MD runs are deterministic and running duplicates is redundant.",
              "Single trajectories fail to output the concordance correlation coefficients.",
              "Molecular dynamics is inherently stochastic; a single trajectory represents a single probabilistic pathway. Standard practice requires 3–5 replicates with different velocity seeds to confirm trends.",
              "Single runs are restricted to tip3p water models."
            ],
            correctIndex: 2,
            explanation: "Since molecular dynamics calculations contain stochastic elements (e.g. random starting velocity distributions), a single run might capture a rare, unrepresentative event. To establish statistical significance, researchers must conduct duplicate runs (typically 3–5 replicates) with different starting seeds."
          }
        ]}
      />
    </div>
  );
}
