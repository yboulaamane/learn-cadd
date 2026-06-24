"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Activity, 
  Layers, 
  Flame,
  Link2,
  Move,
  Info,
  RefreshCw,
  Zap
} from "lucide-react";
import { Quiz } from "@/components/Quiz";

export default function LigandReceptorInteractionsPage() {
  // Widget 1 state
  const [distance, setDistance] = useState(3.5); 
  const [desolvate, setDesolvate] = useState(false);

  // Widget 3: Supramolecular Sandbox state
  const [ligandPos, setLigandPos] = useState({ x: 130, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartOffset = useRef({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Fixed receptor partner atom coordinates
  const aspPos = { x: 60, y: 50 };     // Asp189 carboxylate oxygen
  const hisPos = { x: 140, y: 155 };   // His41 imidazole nitrogen
  const phePos = { x: 230, y: 75 };    // Phe140 phenyl ring center

  // Ligand branch tip offsets relative to ligand center (when centered at (130, 95))
  // We offset them slightly so that they don't all align perfectly at a single point, 
  // introducing "conformational fit strain" which represents true drug design challenges.
  const amineOffset = { dx: -65, dy: -40 };  // Amine group
  const hydroxylOffset = { dx: 15, dy: 50 };  // Hydroxyl group
  const phenylOffset = { dx: 85, dy: -20 };   // Phenyl ring

  const aminePos = { x: ligandPos.x + amineOffset.dx, y: ligandPos.y + amineOffset.dy };
  const hydroxylPos = { x: ligandPos.x + hydroxylOffset.dx, y: ligandPos.y + hydroxylOffset.dy };
  const phenylPos = { x: ligandPos.x + phenylOffset.dx, y: ligandPos.y + phenylOffset.dy };

  // Scale: 20 pixels = 1 Ångstrom
  const pxToAngstrom = 20;

  const dAmine = Math.sqrt(Math.pow(aminePos.x - aspPos.x, 2) + Math.pow(aminePos.y - aspPos.y, 2)) / pxToAngstrom;
  const dHydroxyl = Math.sqrt(Math.pow(hydroxylPos.x - hisPos.x, 2) + Math.pow(hydroxylPos.y - hisPos.y, 2)) / pxToAngstrom;
  const dPhenyl = Math.sqrt(Math.pow(phenylPos.x - phePos.x, 2) + Math.pow(phenylPos.y - phePos.y, 2)) / pxToAngstrom;

  // Energy functions (kcal/mol)
  // Salt bridge (Amine - Asp189)
  const getSaltBridgeEnergy = (d: number) => {
    if (d < 1.8) return 15; // steric clash
    if (d < 5.0) {
      // Morse-like potential representing electrostatic + short-range repulsion
      const val = -6.0 * Math.exp(-Math.pow(d - 2.8, 2) / 0.8);
      return val;
    }
    return 0;
  };

  // Hydrogen bond (Hydroxyl - His41)
  const getHbondEnergy = (d: number) => {
    if (d < 1.6) return 12; // steric clash
    if (d < 4.0) {
      const val = -3.5 * Math.exp(-Math.pow(d - 2.9, 2) / 0.3);
      return val;
    }
    return 0;
  };

  // pi-pi Stacking (Phenyl - Phe140)
  const getPiStackingEnergy = (d: number) => {
    if (d < 2.8) return 10; // steric clash
    if (d < 5.5) {
      const val = -2.2 * Math.exp(-Math.pow(d - 3.8, 2) / 0.5);
      return val;
    }
    return 0;
  };

  const eAmine = getSaltBridgeEnergy(dAmine);
  const eHydroxyl = getHbondEnergy(dHydroxyl);
  const ePhenyl = getPiStackingEnergy(dPhenyl);

  // Steric Clashes check
  const clashAmine = dAmine < 1.8;
  const clashHydroxyl = dHydroxyl < 1.6;
  const clashPhenyl = dPhenyl < 2.8;
  const hasClash = clashAmine || clashHydroxyl || clashPhenyl;

  // Total Enthalpy (dH)
  const dH = eAmine + eHydroxyl + ePhenyl;

  // Entropy calculations
  // Fixed conformational penalty for freezing rotatable bonds
  const dSconf = 2.5; // kcal/mol equivalent (+TdS penalty)
  
  // Hydrophobic desolvation boost (favorable entropy -TdS when phenyl interacts with Phe140 pocket)
  const dSdesolv = dPhenyl < 4.5 ? -3.0 * Math.exp(-Math.pow(dPhenyl - 3.8, 2) / 1.5) : 0;

  const totalTdS = dSconf + dSdesolv;

  // Gibbs Free Energy: dG = dH - TdS (here totalTdS is positive for penalties, negative for boosts)
  const dG = dH + totalTdS;

  // Binding Affinity Kd calculation (RT = 0.593 kcal/mol at 298K)
  const getKdText = (dgVal: number) => {
    if (hasClash) return "No Binding (Steric Clash)";
    if (dgVal >= 0) return "No Binding (ΔG ≥ 0)";
    const kdM = Math.exp(dgVal / 0.593); // Kd in M
    if (kdM < 1e-9) {
      return `${(kdM * 1e12).toFixed(1)} pM (Picomolar)`;
    } else if (kdM < 1e-6) {
      return `${(kdM * 1e9).toFixed(1)} nM (Nanomolar)`;
    } else if (kdM < 1e-3) {
      return `${(kdM * 1e6).toFixed(1)} µM (Micromolar)`;
    } else {
      return `${(kdM * 1e3).toFixed(1)} mM (Millimolar)`;
    }
  };

  // Drag and drop handlers
  const handleMouseDown = (e: React.MouseEvent<SVGCircleElement | SVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    // Calculate mouse position relative to SVG coordinates
    const mouseX = ((e.clientX - rect.left) / rect.width) * 300;
    const mouseY = ((e.clientY - rect.top) / rect.height) * 200;
    
    dragStartOffset.current = {
      x: mouseX - ligandPos.x,
      y: mouseY - ligandPos.y
    };
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement> | MouseEvent) => {
    if (!isDragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = 'clientX' in e ? e.clientX : (e as MouseEvent).clientX;
    const clientY = 'clientY' in e ? e.clientY : (e as MouseEvent).clientY;
    
    const mouseX = ((clientX - rect.left) / rect.width) * 300;
    const mouseY = ((clientY - rect.top) / rect.height) * 200;

    let newX = mouseX - dragStartOffset.current.x;
    let newY = mouseY - dragStartOffset.current.y;

    // Constrain within visible viewport boundaries
    newX = Math.min(Math.max(newX, 70), 190);
    newY = Math.min(Math.max(newY, 50), 150);

    setLigandPos({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for mobile devices
  const handleTouchStart = (e: React.TouchEvent<SVGCircleElement | SVGElement>) => {
    if (!svgRef.current || e.touches.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const mouseX = ((touch.clientX - rect.left) / rect.width) * 300;
    const mouseY = ((touch.clientY - rect.top) / rect.height) * 200;
    
    dragStartOffset.current = {
      x: mouseX - ligandPos.x,
      y: mouseY - ligandPos.y
    };
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!isDragging || !svgRef.current || e.touches.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const mouseX = ((touch.clientX - rect.left) / rect.width) * 300;
    const mouseY = ((touch.clientY - rect.top) / rect.height) * 200;

    let newX = mouseX - dragStartOffset.current.x;
    let newY = mouseY - dragStartOffset.current.y;

    newX = Math.min(Math.max(newX, 70), 190);
    newY = Math.min(Math.max(newY, 50), 150);

    setLigandPos({ x: newX, y: newY });
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDragging]);

  const calculateEnergy = (r: number) => {
    if (r < 2.0) return 40; 
    const r0 = 2.9;
    const depth = -4.0;
    const term12 = Math.pow(r0 / r, 12);
    const term6 = Math.pow(r0 / r, 6) * 2; 
    const energy = depth * (term12 - term6);
    return Math.min(Math.max(energy, -5), 20);
  };

  const currentEnergy = calculateEnergy(distance);

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
        <h1>Module 2: Thermodynamics &amp; Chemical Forces</h1>
        <p className="lead text-slate-800">
          Analyze the energetic drivers behind ligand binding. Explore Gibbs free energy, calculate potential energy curves, and inspect the structural basis of the hydrophobic effect.
        </p>
      </div>

      <hr className="border-slate-200" />

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
            ΔG = R * T * ln(K_d)
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
            <tbody className="divide-y divide-slate-200 bg-white text-slate-850">
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
          <Link2 size={16} className="text-slate-900" />
          <h3 className="font-bold text-sm text-slate-900">Interactive Playground: H-Bond Potential Energy Curve</h3>
        </div>
        <p className="text-sm text-slate-800">
          Adjust the distance slider to bring the Hydrogen Bond donor atom closer to the acceptor. Watch the energy shift along the potential curve.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-white p-5 rounded-lg border border-slate-200">
          
          {/* Slider & Meter */}
          <div className="md:col-span-5 space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center text-sm text-slate-800 font-bold">
                <span>Distance (Å)</span>
                <span className="font-bold text-slate-900">{distance.toFixed(2)} Å</span>
              </div>
              <input
                type="range"
                min="1.8"
                max="5.5"
                step="0.05"
                value={distance}
                onChange={(e) => setDistance(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded appearance-none cursor-pointer accent-slate-900"
              />
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
              <span className="text-sm text-slate-800 font-bold uppercase tracking-wider block">Calculated Energy</span>
              <p className="text-xl font-bold text-slate-950">
                {currentEnergy.toFixed(2)}
                <span className="text-sm text-slate-800 font-medium ml-1">kcal/mol</span>
              </p>
              <div className="text-sm leading-normal text-slate-800">
                {distance < 2.3 ? (
                  <span className="text-red-700 font-bold">Steric Clashes: Atoms are too close (repulsion)!</span>
                ) : distance >= 2.7 && distance <= 3.2 ? (
                  <span className="text-emerald-700 font-bold">Optimal Hydrogen Bond formed! (Stable Enthalpy)</span>
                ) : (
                  <span>Weak interaction. Atoms are too far apart.</span>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Graph SVG */}
          <div className="md:col-span-7 flex justify-center">
            <div className="w-full max-w-[280px] aspect-square relative bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
              
              <div className="relative flex-1">
                <svg viewBox="0 0 300 200" className="w-full h-full">
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
                Lennard-Jones Interaction Potential Chart
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Non-covalent Interactions */}
      <section className="space-y-4">
        <h2>3. Types of Non-Covalent Interactions</h2>
        
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
        </div>
      </section>

      {/* Interactive Widget 2: Desolvation Cage */}
      <section className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-slate-900" />
          <h3 className="font-bold text-sm text-slate-900">Interactive Playground: Hydrophobic Effect & Desolvation</h3>
        </div>
        <p className="text-sm text-slate-800">
          Toggle the "Bind Ligand" button to push a lipophilic compound into a hydrophobic pocket. Notice how ordered "water cages" (slate circles) are released into free solution, increasing entropy.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-white p-5 rounded-lg border border-slate-200">
          
          {/* Simulation Viewport */}
          <div className="md:col-span-6 flex justify-center">
            <div className="w-full max-w-[240px] aspect-square relative bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-center items-center">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M10,20 L30,20 C35,45 65,45 70,20 L90,20 L90,80 L10,80 Z" fill="currentColor" className="text-slate-200" stroke="currentColor" strokeWidth="1" />
                <text x="50" y="70" textAnchor="middle" fill="currentColor" className="text-slate-800 font-bold" fontSize="5" fontWeight="semibold">HYDROPHOBIC POCKET</text>

                {/* Structured Water molecules around pocket when NOT bound */}
                {!desolvate && (
                  <>
                    <circle cx="35" cy="30" r="2" fill="currentColor" className="text-slate-400" />
                    <circle cx="45" cy="35" r="2" fill="currentColor" className="text-slate-400" />
                    <circle cx="55" cy="35" r="2" fill="currentColor" className="text-slate-400" />
                    <circle cx="65" cy="30" r="2" fill="currentColor" className="text-slate-400" />
                  </>
                )}

                {/* Ligand */}
                <g className="transition-transform duration-500 ease-in-out" style={{ transform: desolvate ? 'translate(0px, 15px)' : 'translate(0px, -20px)' }}>
                  <polygon points="50,22 55,30 45,30" fill="currentColor" className="text-slate-800" stroke="currentColor" strokeWidth="0.8" />
                  <circle cx="50" cy="22" r="2" fill="currentColor" className="text-slate-900" />
                  
                  {/* Structured Water around Ligand when unbound */}
                  {!desolvate && (
                    <>
                      <circle cx="42" cy="18" r="1.5" fill="currentColor" className="text-slate-400" />
                      <circle cx="58" cy="18" r="1.5" fill="currentColor" className="text-slate-400" />
                      <circle cx="50" cy="12" r="1.5" fill="currentColor" className="text-slate-400" />
                    </>
                  )}
                </g>

                {/* Disordered water molecules floating away when bound */}
                {desolvate && (
                  <>
                    <circle cx="20" cy="15" r="2" fill="currentColor" className="text-slate-400" opacity="0.4" />
                    <circle cx="80" cy="15" r="2" fill="currentColor" className="text-slate-400" opacity="0.4" />
                    <circle cx="15" cy="35" r="2" fill="currentColor" className="text-slate-400" opacity="0.4" />
                    <circle cx="85" cy="35" r="2" fill="currentColor" className="text-slate-400" opacity="0.4" />
                  </>
                )}
              </svg>
            </div>
          </div>

          <div className="md:col-span-6 space-y-4 not-prose">
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">Thermodynamic Analysis</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-white border border-border rounded-lg">
                  <span className="text-xs text-slate-800 font-bold block uppercase">Conformational Entropy</span>
                  <span className="text-sm font-semibold text-slate-900">-TΔS (Unfavorable)</span>
                </div>
                <div className="p-2.5 bg-white border border-border rounded-lg">
                  <span className="text-xs text-slate-800 font-bold block uppercase">Solvent Entropy</span>
                  <span className={`text-sm font-bold ${desolvate ? "text-slate-900 animate-pulse" : "text-slate-800"}`}>
                    {desolvate ? "+TΔS (Favorable!)" : "0 (Water Caged)"}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-800 leading-relaxed">
              {desolvate 
                ? "The non-polar surfaces of both the pocket and the ligand associate. The rigid hydration shell collapses, and ordered water molecules are returned to the bulk solution. This gains considerable entropy, driving the binding process." 
                : "Both the hydrophobic pocket and the lipophilic ligand are surrounded by highly organized, 'caged' water structures. This localized structure is translationally and rotationally restricted, resulting in low system entropy."}
            </p>

            <button
              onClick={() => setDesolvate(!desolvate)}
              className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-white font-semibold text-sm transition-colors w-full text-center shadow-sm"
            >
              {desolvate ? "Unbind Ligand (Reset)" : "Bind Ligand (Release Caged Waters)"}
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Widget 3: The Supramolecular Binding Sandbox */}
      <section className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-slate-900" />
          <h3 className="font-bold text-base text-slate-900">Interactive Playground: The Supramolecular Binding Sandbox</h3>
        </div>
        <p className="text-sm text-slate-800">
          In physical drug discovery, binding affinity depends on matching multiple functional groups simultaneously. 
          <strong> Drag the central ligand core</strong> (or use the coordinates sliders) to align the three chemical arms with their target pocket residues. Watch the Gibbs Free Energy update live. 
          <em> Note: Aligning all three perfectly is restricted by scaffold geometry; you must resolve the conformational strain trade-off to minimize ΔG!</em>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-5 rounded-lg border border-slate-200">
          
          {/* Interactive SVG Sandbox */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full relative bg-slate-100 border border-slate-200 rounded-lg p-2 overflow-hidden select-none">
              <svg 
                ref={svgRef}
                viewBox="0 0 300 200" 
                className="w-full h-auto cursor-default"
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
              >
                {/* Pocket Residues */}
                {/* 1. Asp189 Carboxylate */}
                <g transform={`translate(${aspPos.x}, ${aspPos.y})`}>
                  <circle r="20" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5" />
                  <circle r="4" fill="#ef4444" />
                  <text y="-25" textAnchor="middle" fill="#991b1b" className="text-[7.5px] font-bold">Asp189 (COO⁻)</text>
                  <text y="3" textAnchor="middle" fill="#ef4444" className="text-[9px] font-extrabold font-mono">-</text>
                </g>

                {/* 2. His41 Nitrogen */}
                <g transform={`translate(${hisPos.x}, ${hisPos.y})`}>
                  <circle r="20" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
                  <circle r="4" fill="#0284c7" />
                  <text y="28" textAnchor="middle" fill="#0369a1" className="text-[7.5px] font-bold">His41 (Imidazole-NH)</text>
                </g>

                {/* 3. Phe140 Stacking Pocket */}
                <g transform={`translate(${phePos.x}, ${phePos.y})`}>
                  <circle r="22" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3,2" />
                  <polygon points="230,67 241,71 241,80 230,84 219,80 219,71" fill="#e2e8f0" stroke="#475569" strokeWidth="1" transform={`translate(-${phePos.x}, -${phePos.y})`} />
                  <text y="-27" textAnchor="middle" fill="#334155" className="text-[7.5px] font-bold">Phe140 (Benzene Pi)</text>
                </g>

                {/* Interaction Lines */}
                {/* Amine - Asp189 interaction (dashed electrostatic) */}
                {dAmine < 5.0 && !clashAmine && (
                  <line 
                    x1={aminePos.x} y1={aminePos.y} 
                    x2={aspPos.x} y2={aspPos.y} 
                    stroke="#ef4444" 
                    strokeWidth="1.5" 
                    strokeDasharray="3,3" 
                  />
                )}
                {/* Hydroxyl - His41 interaction (dashed H-bond) */}
                {dHydroxyl < 4.0 && !clashHydroxyl && (
                  <line 
                    x1={hydroxylPos.x} y1={hydroxylPos.y} 
                    x2={hisPos.x} y2={hisPos.y} 
                    stroke="#0284c7" 
                    strokeWidth="1.5" 
                    strokeDasharray="4,2" 
                  />
                )}
                {/* Phenyl - Phe140 interaction (parallel stacking lines) */}
                {dPhenyl < 5.5 && !clashPhenyl && (
                  <g>
                    <line 
                      x1={phenylPos.x - 6} y1={phenylPos.y + 4} 
                      x2={phePos.x - 6} y2={phePos.y + 4} 
                      stroke="#10b981" 
                      strokeWidth="1" 
                    />
                    <line 
                      x1={phenylPos.x + 6} y1={phenylPos.y - 4} 
                      x2={phePos.x + 6} y2={phePos.y - 4} 
                      stroke="#10b981" 
                      strokeWidth="1" 
                    />
                  </g>
                )}

                {/* Ligand Drawing */}
                {/* Center connector lines */}
                <line x1={ligandPos.x} y1={ligandPos.y} x2={aminePos.x} y2={aminePos.y} stroke="#1e293b" strokeWidth="2.5" />
                <line x1={ligandPos.x} y1={ligandPos.y} x2={hydroxylPos.x} y2={hydroxylPos.y} stroke="#1e293b" strokeWidth="2.5" />
                <line x1={ligandPos.x} y1={ligandPos.y} x2={phenylPos.x} y2={phenylPos.y} stroke="#1e293b" strokeWidth="2.5" />

                {/* 1. Amine tip (-NH3+) */}
                <g transform={`translate(${aminePos.x}, ${aminePos.y})`}>
                  <circle r="12" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
                  <text y="3.5" textAnchor="middle" fill="#1d4ed8" className="text-[7px] font-extrabold font-mono">+NH₃⁺</text>
                  {clashAmine && <circle r="12" fill="none" stroke="#ef4444" strokeWidth="2" className="animate-ping" />}
                </g>

                {/* 2. Hydroxyl tip (-OH) */}
                <g transform={`translate(${hydroxylPos.x}, ${hydroxylPos.y})`}>
                  <circle r="12" fill="#ffe4e6" stroke="#e11d48" strokeWidth="1.5" />
                  <text y="3" textAnchor="middle" fill="#be123c" className="text-[8px] font-extrabold font-mono">OH</text>
                  {clashHydroxyl && <circle r="12" fill="none" stroke="#ef4444" strokeWidth="2" className="animate-ping" />}
                </g>

                {/* 3. Phenyl tip */}
                <g transform={`translate(${phenylPos.x}, ${phenylPos.y})`}>
                  <circle r="14" fill="#ecfdf5" stroke="#059669" strokeWidth="1.5" />
                  {/* Hexagon icon */}
                  <polygon points="0,-8 7,-4 7,4 0,8 -7,4 -7,-4" fill="none" stroke="#059669" strokeWidth="1" />
                  <circle r="3" fill="none" stroke="#059669" strokeWidth="0.5" />
                  {clashPhenyl && <circle r="14" fill="none" stroke="#ef4444" strokeWidth="2" className="animate-ping" />}
                </g>

                {/* Core drag handle */}
                <circle 
                  cx={ligandPos.x} 
                  cy={ligandPos.y} 
                  r="12" 
                  fill="#0f172a" 
                  stroke="#334155" 
                  strokeWidth="2" 
                  className="cursor-grab active:cursor-grabbing hover:fill-slate-800"
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                />
                <circle 
                  cx={ligandPos.x} 
                  cy={ligandPos.y} 
                  r="5" 
                  fill="#ffffff" 
                  opacity="0.7"
                  className="pointer-events-none"
                />
                <text x={ligandPos.x} y={ligandPos.y - 16} textAnchor="middle" fill="#0f172a" className="text-[7px] font-extrabold bg-white p-0.5 rounded pointer-events-none">DRAG CORE</text>
              </svg>
              
              <div className="absolute bottom-2 left-2 right-2 flex justify-between bg-white/90 px-3 py-1.5 rounded border border-slate-200/50 text-[10px] text-slate-850 font-bold select-none backdrop-blur-sm">
                <span>Amine-Asp: <strong>{dAmine.toFixed(2)} Å</strong></span>
                <span>Hydroxyl-His: <strong>{dHydroxyl.toFixed(2)} Å</strong></span>
                <span>Phenyl-Phe: <strong>{dPhenyl.toFixed(2)} Å</strong></span>
              </div>
            </div>

            {/* Fallback Position Sliders for fine-tuning & accessibility */}
            <div className="w-full mt-4 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Ligand Core X Offset</span>
                  <span>{ligandPos.x.toFixed(0)}</span>
                </div>
                <input 
                  type="range"
                  min="70"
                  max="190"
                  value={ligandPos.x}
                  onChange={(e) => setLigandPos({ ...ligandPos, x: parseInt(e.target.value) })}
                  className="w-full h-1 bg-slate-200 rounded appearance-none cursor-pointer accent-slate-900"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Ligand Core Y Offset</span>
                  <span>{ligandPos.y.toFixed(0)}</span>
                </div>
                <input 
                  type="range"
                  min="50"
                  max="150"
                  value={ligandPos.y}
                  onChange={(e) => setLigandPos({ ...ligandPos, y: parseInt(e.target.value) })}
                  className="w-full h-1 bg-slate-200 rounded appearance-none cursor-pointer accent-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Thermodynamic Calculations Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            {/* Thermodynamic Parameters List */}
            <div className="space-y-3.5">
              <h4 className="font-extrabold text-sm uppercase tracking-wider text-slate-900 border-b pb-1.5 border-slate-200">
                Thermodynamic Calculations
              </h4>
              
              <div className="space-y-2.5 text-xs">
                {/* Salt Bridge readout */}
                <div className="flex justify-between items-center py-0.5">
                  <span className="font-semibold text-slate-850">1. Salt Bridge (Amine ⋯ Asp189)</span>
                  <span className={`font-mono font-bold ${clashAmine ? "text-red-700" : eAmine < -2.0 ? "text-emerald-700" : "text-slate-800"}`}>
                    {clashAmine ? "Steric Clash! (+15.0)" : `${eAmine.toFixed(2)} kcal/mol`}
                  </span>
                </div>

                {/* H-Bond readout */}
                <div className="flex justify-between items-center py-0.5">
                  <span className="font-semibold text-slate-850">2. Hydrogen Bond (OH ⋯ His41)</span>
                  <span className={`font-mono font-bold ${clashHydroxyl ? "text-red-700" : eHydroxyl < -1.5 ? "text-emerald-700" : "text-slate-800"}`}>
                    {clashHydroxyl ? "Steric Clash! (+12.0)" : `${eHydroxyl.toFixed(2)} kcal/mol`}
                  </span>
                </div>

                {/* Stacking readout */}
                <div className="flex justify-between items-center py-0.5">
                  <span className="font-semibold text-slate-850">3. π-π Stacking (Phenyl ⋯ Phe140)</span>
                  <span className={`font-mono font-bold ${clashPhenyl ? "text-red-700" : ePhenyl < -0.8 ? "text-emerald-700" : "text-slate-800"}`}>
                    {clashPhenyl ? "Steric Clash! (+10.0)" : `${ePhenyl.toFixed(2)} kcal/mol`}
                  </span>
                </div>

                {/* Enthalpy dH sum */}
                <div className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-200 font-bold text-slate-900">
                  <span>Net Enthalpy Change (ΔH)</span>
                  <span className="font-mono">{clashAmine || clashHydroxyl || clashPhenyl ? "Steric Strain (High)" : `${dH.toFixed(2)} kcal/mol`}</span>
                </div>

                {/* Conformational Entropy cost */}
                <div className="flex justify-between items-center py-0.5">
                  <span className="font-semibold text-slate-850">4. Conformational Entropy Cost (-TΔS_conf)</span>
                  <span className="font-mono font-bold text-red-650">+{dSconf.toFixed(2)} kcal/mol</span>
                </div>

                {/* Desolvation entropy boost */}
                <div className="flex justify-between items-center py-0.5">
                  <span className="font-semibold text-slate-850">5. Hydrophobic Desolvation (-TΔS_desolv)</span>
                  <span className={`font-mono font-bold ${dSdesolv < -0.5 ? "text-emerald-700" : "text-slate-800"}`}>
                    {dSdesolv.toFixed(2)} kcal/mol
                  </span>
                </div>

                {/* Net Entropy Change */}
                <div className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-200 font-bold text-slate-900">
                  <span>Net Entropy Contribution (-TΔS)</span>
                  <span className="font-mono">{totalTdS.toFixed(2)} kcal/mol</span>
                </div>
              </div>
            </div>

            {/* Final Outcome Panel */}
            <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Gibbs Free Energy</span>
                <span className={`text-base font-black tracking-wide font-mono ${hasClash ? "text-red-400" : dG < -3.0 ? "text-emerald-400" : "text-slate-200"}`}>
                  {hasClash ? "STERIC CLASH" : `${dG.toFixed(2)} kcal/mol`}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-800 pt-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Binding Constant (K_d)</span>
                <span className={`text-base font-black font-mono ${hasClash ? "text-red-400" : dG < -4.0 ? "text-emerald-400" : "text-slate-200"}`}>
                  {getKdText(dG)}
                </span>
              </div>
              
              <div className="text-[11px] leading-relaxed text-slate-350 font-medium pt-1.5 border-t border-slate-800">
                {hasClash ? (
                  <span className="text-red-400 font-bold">WARNING: Steric strain prevents complex formation. Pull ligand core away from the clashing residues.</span>
                ) : dG < -6.0 ? (
                  <span className="text-emerald-400 font-bold">SUCCESS: Excellent complementarity! High affinity binding (nM/pM). You have formed robust ionic, hydrogen, and aromatic interactions!</span>
                ) : dG < -2.0 ? (
                  <span className="text-amber-400 font-semibold">MODERATE BINDING: The interactions compensate for the rotational entropy penalty, but adjusting core position could optimize the fit.</span>
                ) : (
                  <span>NO BINDING: The chemical groups are too far to form robust contacts or have not overcome the entropy barrier.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <hr className="border-slate-200 my-8" />
      <Quiz 
        moduleTitle="Module 2: Thermodynamics & Chemical Forces"
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
            explanation: "Free ligand molecules in solution have high conformational entropy due to rotation about single bonds. When the ligand binds to the receptor, these rotational bonds are locked into a single active conformation. Freeizing these degrees of freedom costs conformational entropy, which acts as a thermodynamic barrier (+TΔS penalty) to binding."
          },
          {
            question: "How does the hydrophobic effect drive ligand binding thermodynamically?",
            options: [
              "By releasing structured, caged water molecules from lipophilic surfaces into bulk solution, gaining favorable solvent entropy.",
              "By forming strong hydrogen bonds between the ligand's non-polar groups and target water molecules.",
              "By increasing the enthalpy of the system through hydrophobic dipole interactions.",
              "By rigidifying target side chains to lower conformational entropy barriers."
            ],
            correctIndex: 0,
            explanation: "Hydrophobic surfaces (on the ligand and target pocket) cannot form hydrogen bonds with water, forcing surrounding water molecules to organize into a rigid, low-entropy 'cage' structure. When these hydrophobic surfaces associate during binding, the caged water molecules are expelled into bulk solution, where they are free and disordered. This increase in solvent entropy (-TΔS becomes highly negative and favorable) is the primary driver of the hydrophobic effect."
          }
        ]}
      />
    </div>
  );
}
