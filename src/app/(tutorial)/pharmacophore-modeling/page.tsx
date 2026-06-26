"use client";

import React, { useState } from "react";
import { 
  Layers,
  CheckCircle,
  XCircle,
  HelpCircle,
  Sliders,
  ChevronRight,
  Info,
  Maximize2
} from "lucide-react";
import { Quiz } from "@/components/Quiz";

export default function PharmacophoreModelingPage() {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(["acceptor", "aromatic", "donor"]);
  const [tolerance, setTolerance] = useState(1.2); // Radius in Angstroms
  const [selectedMolecule, setSelectedMolecule] = useState<number>(0);
  const [screened, setScreened] = useState(false);
  const [activeInfoTab, setActiveInfoTab] = useState<string>("concept");
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  // Pharmacophore definitions and features
  const featuresList = [
    { id: "acceptor", name: "Hydrogen Bond Acceptor (HBA)", color: "stroke-red-500 fill-red-50/30 text-red-600 bg-red-50 border-red-200" },
    { id: "donor", name: "Hydrogen Bond Donor (HBD)", color: "stroke-blue-500 fill-blue-50/30 text-blue-600 bg-blue-50 border-blue-200" },
    { id: "aromatic", name: "Aromatic Ring Center (AR)", color: "stroke-amber-500 fill-amber-50/30 text-amber-600 bg-amber-50 border-amber-200" },
  ];

  // Target database of structures with features and coordinates
  const dbMolecules = [
    {
      id: 0,
      name: "Molecule A (Estradiol Analogue)",
      scaffold: "Steroidal",
      features: ["acceptor", "aromatic", "donor"],
      coords: {
        aromatic: { x: 125, y: 115, match: true },
        acceptor: { x: 75, y: 145, match: true },
        donor: { x: 320, y: 115, match: true }
      },
      desc: "An organic compound built on a four-ring steroidal skeleton. The phenolic A-ring acts as the aromatic center and H-bond acceptor, while the cyclopentane D-ring hydroxyl acts as the H-bond donor. Both match the 3D distances perfectly.",
      chemicalFormula: "C₁₈H₂₄O₂",
      bindingAffinity: "K_d = 0.2 nM",
    },
    {
      id: 1,
      name: "Molecule B (Diethylstilbestrol)",
      scaffold: "Stilbene (Non-Steroidal)",
      features: ["acceptor", "aromatic", "donor"],
      coords: {
        aromatic: { x: 125, y: 115, match: true },
        acceptor: { x: 75, y: 145, match: true },
        donor: { x: 320, y: 115, match: true }
      },
      desc: "A synthetic, non-steroidal estrogen analogue. Chemically, it is a stilbene derivative. Despite having zero skeletal similarity to a steroid, its flexible ethyl chains allow it to adopt a conformation that places its two phenolic hydroxyl groups in the exact same 3D spatial points as Estradiol. This is a classic example of Scaffold Hopping.",
      chemicalFormula: "C₁₈H₂₀O₂",
      bindingAffinity: "K_d = 0.5 nM",
    },
    {
      id: 2,
      name: "Molecule C (Incompatible Regioisomer)",
      scaffold: "Benzene Derivative",
      features: ["aromatic", "acceptor"],
      coords: {
        aromatic: { x: 125, y: 115, match: true },
        acceptor: { x: 75, y: 145, match: true },
        donor: { x: 230, y: 210, match: false } // Too short/different direction
      },
      desc: "A smaller benzene derivative. While it contains an aromatic core and a matching H-bond acceptor, its aliphatic alcohol group is positioned on a different carbon atom, placing the H-bond donor center far outside the tolerance zone of the receptor's active site pharmacophore model.",
      chemicalFormula: "C₁₀H₁₄O₂",
      bindingAffinity: "K_d > 10,000 nM (Inactive)",
    },
  ];

  const currentMolecule = dbMolecules[selectedMolecule];

  // Distance calculations for the display
  const getDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    const rawDist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    // Scale pixel distance to Angstroms (e.g. 25 pixels = 1.0 Angstrom)
    return (rawDist / 25).toFixed(2);
  };

  // Check if a molecule feature matches based on spatial tolerance
  // Query center coordinates: AR(125, 115), HBA(75, 115), HBD(320, 115)
  const queryCoords = {
    aromatic: { x: 125, y: 115 },
    acceptor: { x: 75, y: 145 },
    donor: { x: 320, y: 115 }
  };

  const checkFeatureMatch = (featureId: "aromatic" | "acceptor" | "donor", mol: typeof dbMolecules[0]) => {
    if (!selectedFeatures.includes(featureId)) return true; // excluded features match by default
    if (!mol.features.includes(featureId)) return false;
    
    const molPt = mol.coords[featureId];
    const queryPt = queryCoords[featureId];
    const rawDist = Math.sqrt(Math.pow(molPt.x - queryPt.x, 2) + Math.pow(molPt.y - queryPt.y, 2));
    const angstromDist = rawDist / 25;
    return angstromDist <= tolerance;
  };

  const isMoleculeMatch = (mol: typeof dbMolecules[0]) => {
    return (
      (!selectedFeatures.includes("aromatic") || checkFeatureMatch("aromatic", mol)) &&
      (!selectedFeatures.includes("acceptor") || checkFeatureMatch("acceptor", mol)) &&
      (!selectedFeatures.includes("donor") || checkFeatureMatch("donor", mol))
    );
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1>Module 5: Pharmacophore Modeling</h1>
        <p className="lead text-slate-600 max-w-3xl">
          Learn how to extract the supramolecular electronic and steric footprint required for ligand binding. Explore ligand-based and structure-based techniques, and master the concept of scaffold hopping through an interactive alignment graph.
        </p>
      </div>

      {/* Concept navigation tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-6 text-sm font-medium">
          <button
            onClick={() => setActiveInfoTab("concept")}
            className={`pb-3 transition-colors ${
              activeInfoTab === "concept" ? "border-b-2 border-accent text-accent font-semibold" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Supramolecular Concepts
          </button>
          <button
            onClick={() => setActiveInfoTab("workflow")}
            className={`pb-3 transition-colors ${
              activeInfoTab === "workflow" ? "border-b-2 border-accent text-accent font-semibold" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Pharmacophore Workflows
          </button>
          <button
            onClick={() => setActiveInfoTab("scaffold")}
            className={`pb-3 transition-colors ${
              activeInfoTab === "scaffold" ? "border-b-2 border-accent text-accent font-semibold" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Scaffold Hopping Theory
          </button>
          <button
            onClick={() => setActiveInfoTab("pipeline")}
            className={`pb-3 transition-colors ${
              activeInfoTab === "pipeline" ? "border-b-2 border-accent text-accent font-semibold" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            PDB-to-Pharmacophore Pipeline
          </button>
        </nav>
      </div>

      {/* Tabs Content */}
      <div className="space-y-4">
        {activeInfoTab === "concept" && (
          <div className="space-y-4">
            <h2>The IUPAC Blueprint of Molecular Recognition</h2>
            <div className="bg-surface border border-border rounded-xl p-5 mb-4">
              <span className="block font-semibold text-xs text-accent uppercase tracking-wider mb-2">IUPAC Definition</span>
              <p className="italic text-foreground text-base font-serif leading-relaxed">
                &ldquo;A pharmacophore is the ensemble of steric and electronic features that is necessary to ensure the optimal supramolecular interaction with a specific biological target structure and to trigger (or block) its biological response.&rdquo;
              </p>
              <span className="block text-xs text-slate-500 text-right mt-2 font-bold font-mono">Pure Appl. Chem., Vol. 70 (1998)</span>
            </div>
            <p>
              In computer-aided drug design, a pharmacophore is <strong>not a chemical structure</strong> or a collection of atoms. Instead, it is an abstract skeleton of molecular recognition points. While a chemist looks at a molecule as rings, double bonds, and chains, a biological receptor experiences it as a spatial distribution of electrostatic potentials, hydrogen-bond directional vectors, and hydrophobic surfaces.
            </p>
            <p>
              By translating physical structures into abstract pharmacophoric features, computational chemists can screen billions of compounds without running full docking simulations, focusing solely on whether the key functional features are placed at the exact 3D coordinates required for binding.
            </p>
          </div>
        )}

        {activeInfoTab === "workflow" && (
          <div className="space-y-4">
            <h2>Ligand-Based vs. Structure-Based Pharmacophores</h2>
            <p>
              Depending on the availability of biological data, pharmacophore modeling follows one of two distinct methodologies:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2 not-prose">
              <div className="border border-border rounded-xl p-5 bg-white shadow-sm space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[10px] uppercase">Ligand-Based Models</span>
                <p className="text-sm text-foreground font-bold">Generating consensus hypotheses from active molecules</p>
                <p className="text-sm leading-relaxed text-slate-800">
                  Used when the target receptor's 3D structure is unknown (e.g. orphan GPCRs). Multiple active ligands are aligned in 3D space to identify overlapping functional properties. The common points that match distance matrices across all active conformations form a consensus pharmacophore.
                </p>
              </div>
              <div className="border border-border rounded-xl p-5 bg-white shadow-sm space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px] uppercase">Structure-Based Models</span>
                <p className="text-sm text-foreground font-bold">Mapping protein pockets directly</p>
                <p className="text-sm leading-relaxed text-slate-800">
                  Derived directly from the 3D crystal structure of the receptor. Computational grids scan the binding pocket, mapping H-bond donors on the protein to H-bond acceptor features in the model, acidic residues to positive ionizable features, and hydrophobic crevices to hydrophobic features.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeInfoTab === "scaffold" && (
          <div className="space-y-4">
            <h2>Scaffold Hopping: Breaking Structural Constraints</h2>
            <p>
              One of the most powerful applications of pharmacophores is <strong>scaffold hopping</strong>: the identification of structurally novel active compounds that possess completely different core architectures (scaffolds) from the starting molecules.
            </p>
            <p>
              Standard chemical searches rely on topological similarity (e.g. Tanimoto coefficient of molecular fingerprints), which will fail to find active molecules of another class. Pharmacophores bypass this restriction by prioritizing <strong>supramolecular function over structural topology</strong>.
            </p>
            <div className="border-l-2 border-accent pl-4 italic bg-accent/5 p-4 rounded-r-xl my-2 text-sm">
              <strong className="text-foreground block not-italic mb-1">Biological Equivalence:</strong>
              If Molecule A (steroidal core) and Molecule B (flexible alkyl core) present H-bond donor, acceptor, and aromatic groups at the same 3D spatial distances, they will trigger the same biological response at the receptor pocket, despite looking completely unrelated on paper.
            </div>
          </div>
        )}

        {activeInfoTab === "pipeline" && (
          <div className="space-y-4">
            <h2>Computational PDB-to-3D Pharmacophore Pipeline</h2>
            <p>
              When multiple crystal structures of a target protein bound to different ligands are available in the PDB, computational chemists run a 5-stage Python pipeline using open-source packages to extract an actionable consensus pharmacophore:
            </p>
            <div className="space-y-3.5 not-prose">
              <div className="flex gap-3.5 p-4 border border-border bg-white rounded-xl">
                <span className="h-6 w-6 font-mono font-bold text-xs bg-slate-100 border border-slate-200 rounded flex items-center justify-center flex-shrink-0 text-slate-800">1</span>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Database Mining (Biotite & RCSB API)</h4>
                  <p className="text-xs text-slate-850 mt-1 leading-relaxed">
                    Uses RCSB GraphQL queries to retrieve structures bound to active ligands with strict filters: resolved via X-ray crystallography, resolution ≤ 3.0 Å, and drug-like ligand size &gt; 100 Da.
                  </p>
                </div>
              </div>
              <div className="flex gap-3.5 p-4 border border-border bg-white rounded-xl">
                <span className="h-6 w-6 font-mono font-bold text-xs bg-slate-100 border border-slate-200 rounded flex items-center justify-center flex-shrink-0 text-slate-800">2</span>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Pocket Superposition (MDAnalysis)</h4>
                  <p className="text-xs text-slate-850 mt-1 leading-relaxed">
                    As structures exist in different crystallographic frames, the pipeline superposes all protein backbones (C-alpha atoms) onto a high-resolution template. This drags the co-crystallized ligands into a common 3D coordinate space inside the pocket.
                  </p>
                </div>
              </div>
              <div className="flex gap-3.5 p-4 border border-border bg-white rounded-xl">
                <span className="h-6 w-6 font-mono font-bold text-xs bg-slate-100 border border-slate-200 rounded flex items-center justify-center flex-shrink-0 text-slate-800">3</span>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Spatial Pocket Clustering (scikit-learn DBSCAN)</h4>
                  <p className="text-xs text-slate-850 mt-1 leading-relaxed">
                    Runs DBSCAN (Density-Based Spatial Clustering of Applications with Noise) on all aligned ligand atoms. This separates orthosteric binding groups from allosteric pockets and discards random solvent outliers.
                  </p>
                </div>
              </div>
              <div className="flex gap-3.5 p-4 border border-border bg-white rounded-xl">
                <span className="h-6 w-6 font-mono font-bold text-xs bg-slate-100 border border-slate-200 rounded flex items-center justify-center flex-shrink-0 text-slate-800">4</span>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Bond Correction & Feature Tagging (RDKit)</h4>
                  <p className="text-xs text-slate-850 mt-1 leading-relaxed">
                    PDB files do not store bond orders. The pipeline matches co-crystallized coords to 2D SMILES templates to correct bond orders. RDKit's Feature Factory then tags features (HB donors/acceptors, aromatics, hydrophobes) with their exact 3D coordinates.
                  </p>
                </div>
              </div>
              <div className="flex gap-3.5 p-4 border border-border bg-white rounded-xl">
                <span className="h-6 w-6 font-mono font-bold text-xs bg-slate-100 border border-slate-200 rounded flex items-center justify-center flex-shrink-0 text-slate-800">5</span>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Consensus Extraction (k-means)</h4>
                  <p className="text-xs text-slate-850 mt-1 leading-relaxed">
                    Groups coordinates of matching features (e.g. all HB donors) and clusters them using k-means. Centroids matching at least 50% of the active ligands are kept as a consensus blueprint for virtual screening.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Section */}
      <section className="widget-container">
        <div className="p-5 border-b border-border bg-surface flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Layers className="text-accent h-5 w-5" />
              <h3 className="font-bold text-foreground text-base">Interactive Graph: 3D-to-2D Pharmacophore Alignment</h3>
            </div>
            <p className="text-sm text-slate-800 font-medium">
              Select a compound to project its functional group coordinates onto the pharmacophore query. Change distance tolerance to alter feature spheres.
            </p>
          </div>
          
          <div className="flex gap-2">
            {dbMolecules.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setSelectedMolecule(m.id);
                  setScreened(false);
                }}
                className={`px-3 py-1.5 rounded-lg border text-sm font-semibold transition-all ${
                  selectedMolecule === m.id
                    ? "bg-accent border-accent text-white shadow-sm"
                    : "bg-white border-border text-slate-800 hover:text-slate-900 hover:bg-surface"
                }`}
              >
                {m.name.split(" (")[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 text-sm">
          
          {/* Left panel: Controls & Alignment Metrics */}
          <div className="lg:col-span-4 p-5 border-r border-border space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-2">1. Query Features</span>
                <div className="space-y-2">
                  {featuresList.map((f) => (
                    <label 
                      key={f.id} 
                      className={`flex items-center gap-3 p-2.5 rounded-lg border text-sm cursor-pointer select-none transition-colors ${
                      selectedFeatures.includes(f.id)
                        ? "bg-surface border-border text-foreground font-semibold"
                        : "border-transparent text-slate-800 opacity-70 hover:opacity-100"
                    }`}
                onMouseEnter={() => setHoveredFeature(f.id)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <input
                  type="checkbox"
                  checked={selectedFeatures.includes(f.id)}
                  onChange={() => {
                    if (selectedFeatures.includes(f.id)) {
                      setSelectedFeatures(selectedFeatures.filter((x) => x !== f.id));
                    } else {
                      setSelectedFeatures([...selectedFeatures, f.id]);
                    }
                    setScreened(false);
                  }}
                  className="rounded border-border text-accent focus:ring-accent"
                />
                <span className={`inline-block px-1.5 py-0.5 rounded text-xs border`}>
                  {f.id === "acceptor" ? "HBA" : f.id === "donor" ? "HBD" : "AR"}
                </span>
                <span>{f.name.split(" (")[0]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Slider for Spatial Tolerance */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm text-slate-850 font-bold">
            <span className="font-semibold text-foreground">2. Spatial Tolerance (Radius)</span>
            <span className="font-bold text-foreground bg-surface border border-border px-2 py-0.5 rounded font-mono text-xs">
              {tolerance.toFixed(2)} Å
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.1"
            value={tolerance}
            onChange={(e) => {
              setTolerance(parseFloat(e.target.value));
              setScreened(false);
            }}
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-accent"
          />
          <div className="flex justify-between text-sm text-slate-800 font-bold font-mono">
            <span>0.5 Å (Strict)</span>
            <span>2.5 Å (Permissive)</span>
          </div>
        </div>
            </div>

            {/* Match Validation Status */}
            <div className="space-y-3 pt-4 border-t border-border">
              <button
                onClick={() => setScreened(true)}
                className="w-full py-2.5 rounded-lg bg-accent text-white font-semibold text-sm transition-colors hover:bg-accent-dark shadow-sm flex items-center justify-center gap-1.5"
              >
                Validate Pharmacophore Fit
              </button>

              {screened && (
                <div className={`p-4 rounded-xl border flex gap-3 items-start animate-fade-in ${
                  isMoleculeMatch(currentMolecule)
                    ? "bg-emerald-50/50 border-emerald-200 text-emerald-800"
                    : "bg-rose-50/50 border-rose-200 text-rose-800"
                }`}>
                  <div className="mt-0.5">
                    {isMoleculeMatch(currentMolecule) ? (
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-rose-600" />
                    )}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-foreground">
                      {isMoleculeMatch(currentMolecule) ? "Supramolecular Match!" : "Validation Failed"}
                    </h5>
                    <p className="text-xs font-semibold leading-relaxed mt-1 opacity-90">
                      {isMoleculeMatch(currentMolecule) 
                        ? `${currentMolecule.name} satisfies all active distance constraints within the ${tolerance}Å tolerance boundaries.`
                        : `${currentMolecule.name} does not align. One or more active features lie outside the tolerance sphere coordinates.`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right panel: SVG Canvas */}
          <div className="lg:col-span-8 p-5 flex flex-col justify-between bg-surface/30 min-h-[360px] relative">
            
            {/* Absolute badge overlay */}
            <div className="absolute top-4 left-4 z-10 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">Selected Conformational Projection</span>
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-white border border-border font-mono text-xs font-semibold">
                Core: {currentMolecule.scaffold}
              </span>
            </div>

            {/* Molecule details drawer */}
            <div className="absolute top-4 right-4 z-10 hidden sm:block">
              <div className="bg-white/80 backdrop-blur border border-border rounded-lg p-2.5 max-w-[200px] text-xs space-y-1 shadow-sm">
                <div className="flex justify-between font-bold text-foreground">
                  <span className="truncate pr-2">{currentMolecule.name.split(" (")[0]}</span>
                  <span className="text-accent">{currentMolecule.chemicalFormula}</span>
                </div>
                <div className="text-xs text-slate-850 border-t border-border pt-1">
                  Affinity: <span className="font-semibold text-foreground">{currentMolecule.bindingAffinity}</span>
                </div>
              </div>
            </div>

            {/* SVG Visual Canvas */}
            <div className="flex-1 flex items-center justify-center p-2">
              <svg 
                viewBox="0 0 400 300" 
                className="w-full max-w-[420px] aspect-[4/3] bg-white rounded-xl border border-border shadow-inner"
              >
                {/* Distance Dimension Lines in background */}
                {selectedFeatures.includes("aromatic") && selectedFeatures.includes("acceptor") && (
                  <g className="opacity-60">
                    <line x1="125" y1="115" x2="75" y2="145" stroke="#475569" strokeWidth="1" strokeDasharray="3,3" />
                    <text x="100" y="125" fill="#334155" className="text-xs font-mono font-bold" textAnchor="middle">
                      {getDistance(queryCoords.aromatic, queryCoords.acceptor)} Å
                    </text>
                  </g>
                )}
                {selectedFeatures.includes("aromatic") && selectedFeatures.includes("donor") && (
                  <g className="opacity-60">
                    <line x1="125" y1="115" x2="320" y2="115" stroke="#475569" strokeWidth="1" strokeDasharray="3,3" />
                    <text x="222" y="105" fill="#334155" className="text-xs font-mono font-bold" textAnchor="middle">
                      {getDistance(queryCoords.aromatic, queryCoords.donor)} Å
                    </text>
                  </g>
                )}
                {selectedFeatures.includes("acceptor") && selectedFeatures.includes("donor") && (
                  <g className="opacity-60">
                    <line x1="75" y1="145" x2="320" y2="115" stroke="#475569" strokeWidth="1" strokeDasharray="3,3" />
                    <text x="197" y="142" fill="#334155" className="text-xs font-mono font-bold" textAnchor="middle">
                      {getDistance(queryCoords.acceptor, queryCoords.donor)} Å
                    </text>
                  </g>
                )}

                {/* Candidate Molecule Skeleton Overlay */}
                <g className="transition-all duration-300">

                  {/* Molecule A — Estradiol Analogue (4-ring steroidal backbone) */}
                  {selectedMolecule === 0 && (
                    <g strokeLinecap="round" strokeLinejoin="round">
                      {/* A-ring: phenol aromatic ring. Vertices:
                          C1=(150,130) C2=(125,145) C3=(100,130) C4=(100,100) C5=(125,85) C6=(150,100)
                          Center ≈ (125, 115). C3 = bottom-left vertex (100,130) bears the phenol –OH. */}
                      <polygon points="150,100 125,85 100,100 100,130 125,145 150,130"
                               stroke="#64748b" strokeWidth="2" fill="#fef9c3" fillOpacity="0.5" />
                      {/* Inscribed dashed circle = aromatic delocalization */}
                      <circle cx="125" cy="115" r="10"
                              stroke="#a16207" strokeWidth="1" fill="none" strokeDasharray="3,2" />
                      {/* B-ring (cyclohexane) */}
                      <polygon points="150,130 175,145 200,130 200,100 175,85 150,100"
                               stroke="#94a3b8" strokeWidth="2" fill="none" />
                      {/* C-ring (cyclohexane) */}
                      <polygon points="200,130 225,145 250,130 250,100 225,85 200,100"
                               stroke="#94a3b8" strokeWidth="2" fill="none" />
                      {/* D-ring (cyclopentane) */}
                      <polygon points="250,130 280,135 295,115 280,95 250,100"
                               stroke="#94a3b8" strokeWidth="2" fill="none" />

                      {/* C18 Angular Methyl group (typical for steroids) at C13 (C/D junction) */}
                      <line x1="250" y1="100" x2="250" y2="75" stroke="#94a3b8" strokeWidth="2" />

                      {/* C3 carbon atom — vertex where phenolic –OH is attached */}
                      <circle cx="100" cy="130" r="4.5" fill="#475569" stroke="white" strokeWidth="1.5" />

                      {/* C3–O bond (HBA: phenolic oxygen) */}
                      <line x1="100" y1="130" x2="75" y2="145" stroke="#ef4444" strokeWidth="2.5" />
                      {/* Oxygen atom circle + label */}
                      <circle cx="75" cy="145" r="8" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5" />
                      <text x="75" y="149" textAnchor="middle" fill="#dc2626"
                            fontSize="9" fontWeight="bold" fontFamily="sans-serif">O</text>

                      {/* C17 carbon atom — vertex on D-ring where aliphatic –OH is attached */}
                      <circle cx="295" cy="115" r="4.5" fill="#475569" stroke="white" strokeWidth="1.5" />

                      {/* C17–O bond (HBD: aliphatic hydroxyl) */}
                      <line x1="295" y1="115" x2="320" y2="115" stroke="#3b82f6" strokeWidth="2.5" />
                      {/* Oxygen atom circle + label */}
                      <circle cx="320" cy="115" r="8" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
                      <text x="320" y="119" textAnchor="middle" fill="#1d4ed8"
                            fontSize="9" fontWeight="bold" fontFamily="sans-serif">O</text>
                    </g>
                  )}

                  {/* Molecule B — Diethylstilbestrol (DES, non-steroidal stilbene) */}
                  {selectedMolecule === 1 && (
                    <g strokeLinecap="round" strokeLinejoin="round">
                      {/* Left phenol ring. Identical to Molecule A's A-ring for perfect alignment. */}
                      <polygon points="150,100 125,85 100,100 100,130 125,145 150,130"
                               stroke="#64748b" strokeWidth="2" fill="#fef9c3" fillOpacity="0.5" />
                      <circle cx="125" cy="115" r="10"
                              stroke="#a16207" strokeWidth="1" fill="none" strokeDasharray="3,2" />

                      {/* C3 carbon atom — where left phenol –OH attaches */}
                      <circle cx="100" cy="130" r="4.5" fill="#475569" stroke="white" strokeWidth="1.5" />

                      {/* C3–O bond (HBA phenolic oxygen) */}
                      <line x1="100" y1="130" x2="75" y2="145" stroke="#ef4444" strokeWidth="2.5" />
                      <circle cx="75" cy="145" r="8" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5" />
                      <text x="75" y="149" textAnchor="middle" fill="#dc2626"
                            fontSize="9" fontWeight="bold" fontFamily="sans-serif">O</text>

                      {/* C1 carbon atom — para vertex connecting to central (E)-alkene */}
                      <circle cx="150" cy="100" r="4.5" fill="#475569" stroke="white" strokeWidth="1.5" />

                      {/* Central (E)-C(Et)=C(Et)- linkage with accurate zig-zag trans geometry */}
                      {/* C1 → C_a */}
                      <line x1="150" y1="100" x2="185" y2="120" stroke="#94a3b8" strokeWidth="2" />
                      {/* Ethyl branch at C_a (CH2-CH3) pointing downward */}
                      <line x1="185" y1="120" x2="185" y2="145" stroke="#94a3b8" strokeWidth="2" />
                      <line x1="185" y1="145" x2="205" y2="157" stroke="#94a3b8" strokeWidth="2" />
                      
                      {/* C_a=C_b double bond */}
                      <line x1="185" y1="120" x2="215" y2="95" stroke="#64748b" strokeWidth="2.5" />
                      <line x1="190" y1="126" x2="220" y2="101" stroke="#94a3b8" strokeWidth="1.5" />

                      {/* Ethyl branch at C_b (CH2-CH3) pointing upward */}
                      <line x1="215" y1="95" x2="215" y2="70" stroke="#94a3b8" strokeWidth="2" />
                      <line x1="215" y1="70" x2="195" y2="58" stroke="#94a3b8" strokeWidth="2" />

                      {/* C_b → right ring leftmost vertex */}
                      <line x1="215" y1="95" x2="252" y2="115" stroke="#94a3b8" strokeWidth="2" />

                      {/* Right phenol ring. Vertices:
                          C1'=(252,115) C2'=(266,96) C3'=(292,96) C4'=(306,115) C5'=(292,134) C6'=(266,134)
                          C1'=(252,115) connects from chain. C4'=(306,115) bears phenol –OH (para). */}
                      <polygon points="306,115 292,96 266,96 252,115 266,134 292,134"
                               stroke="#64748b" strokeWidth="2" fill="#fef9c3" fillOpacity="0.5" />
                      <circle cx="279" cy="115" r="10"
                              stroke="#a16207" strokeWidth="1" fill="none" strokeDasharray="3,2" />

                      {/* C1' carbon atom — connects to chain */}
                      <circle cx="252" cy="115" r="4.5" fill="#475569" stroke="white" strokeWidth="1.5" />

                      {/* C4' carbon atom — where right phenol –OH attaches */}
                      <circle cx="306" cy="115" r="4.5" fill="#475569" stroke="white" strokeWidth="1.5" />

                      {/* C4'–O bond (HBD: right phenolic oxygen) */}
                      <line x1="306" y1="115" x2="320" y2="115" stroke="#3b82f6" strokeWidth="2.5" />
                      <circle cx="320" cy="115" r="8" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
                      <text x="320" y="119" textAnchor="middle" fill="#1d4ed8"
                            fontSize="9" fontWeight="bold" fontFamily="sans-serif">O</text>
                    </g>
                  )}

                  {/* Molecule C — Incompatible regioisomer (HBD in wrong position) */}
                  {selectedMolecule === 2 && (
                    <g strokeLinecap="round" strokeLinejoin="round">
                      {/* Benzene ring. Vertices identical to Mol A A-ring. */}
                      <polygon points="150,100 125,85 100,100 100,130 125,145 150,130"
                               stroke="#64748b" strokeWidth="2" fill="#fef9c3" fillOpacity="0.5" />
                      <circle cx="125" cy="115" r="10"
                              stroke="#a16207" strokeWidth="1" fill="none" strokeDasharray="3,2" />

                      {/* C3 carbon atom — bearing matching HBA oxygen */}
                      <circle cx="100" cy="130" r="4.5" fill="#475569" stroke="white" strokeWidth="1.5" />

                      {/* C3–O bond (HBA: matches pharmacophore query) */}
                      <line x1="100" y1="130" x2="75" y2="145" stroke="#ef4444" strokeWidth="2.5" />
                      <circle cx="75" cy="145" r="8" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5" />
                      <text x="75" y="149" textAnchor="middle" fill="#dc2626"
                            fontSize="9" fontWeight="bold" fontFamily="sans-serif">O</text>

                      {/* C5 carbon atom — where misplaced side chain branches off */}
                      <circle cx="125" cy="145" r="4.5" fill="#475569" stroke="white" strokeWidth="1.5" />

                      {/* Aliphatic side chain leading to the WRONG donor position */}
                      {/* Drawn with proper sp3 zig-zag geometry */}
                      <line x1="125" y1="145" x2="160" y2="170" stroke="#94a3b8" strokeWidth="2" />
                      <line x1="160" y1="170" x2="195" y2="185" stroke="#94a3b8" strokeWidth="2" />
                      <line x1="195" y1="185" x2="220" y2="205" stroke="#94a3b8" strokeWidth="2" />

                      {/* HBD oxygen at wrong regiochemical position */}
                      <circle cx="220" cy="205" r="8" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
                      <text x="220" y="209" textAnchor="middle" fill="#1d4ed8"
                            fontSize="9" fontWeight="bold" fontFamily="sans-serif">O</text>

                      {/* Dashed red indicator = outside tolerance zone */}
                      <line x1="228" y1="205" x2="255" y2="220" stroke="#f87171"
                            strokeDasharray="3,2" strokeWidth="1.5" />
                      <text x="262" y="225" fill="#dc2626" fontSize="10" fontWeight="bold"
                            fontFamily="sans-serif">✗</text>
                    </g>
                  )}
                </g>

                {/* Target Pharmacophore Tolerances (Query Points) */}
                {selectedFeatures.includes("aromatic") && (
                  <g className="transition-all duration-300">
                    <circle 
                      cx="125" 
                      cy="115" 
                      r={tolerance * 25} 
                      className={`stroke-amber-500 fill-amber-100/20 transition-all ${
                        hoveredFeature === "aromatic" ? "stroke-2" : "stroke-[1.5]"
                      }`}
                      strokeDasharray="4,2" 
                    />
                    <circle cx="125" cy="115" r="8" className="fill-amber-500 stroke-white stroke-2" />
                    <text x="125" y="95" className="text-xs font-bold fill-amber-800 text-center" textAnchor="middle">AR Center</text>
                  </g>
                )}

                {selectedFeatures.includes("acceptor") && (
                  <g className="transition-all duration-300">
                    <circle 
                      cx="75" 
                      cy="145" 
                      r={tolerance * 25} 
                      className={`stroke-red-500 fill-red-100/20 transition-all ${
                        hoveredFeature === "acceptor" ? "stroke-2" : "stroke-[1.5]"
                      }`}
                      strokeDasharray="4,2" 
                    />
                    <circle cx="75" cy="145" r="8" className="fill-red-500 stroke-white stroke-2" />
                    <text x="75" y="175" className="text-xs font-bold fill-red-800 text-center" textAnchor="middle">HBA Center</text>
                  </g>
                )}

                {selectedFeatures.includes("donor") && (
                  <g className="transition-all duration-300">
                    <circle 
                      cx="320" 
                      cy="115" 
                      r={tolerance * 25} 
                      className={`stroke-blue-500 fill-blue-100/20 transition-all ${
                        hoveredFeature === "donor" ? "stroke-2" : "stroke-[1.5]"
                      }`}
                      strokeDasharray="4,2" 
                    />
                    <circle cx="320" cy="115" r="8" className="fill-blue-500 stroke-white stroke-2" />
                    <text x="320" y="95" className="text-xs font-bold fill-blue-800 text-center" textAnchor="middle">HBD Center</text>
                  </g>
                )}
              </svg>
            </div>

            {/* Bottom details description */}
            <div className="bg-white border border-border rounded-xl p-4 mt-4 text-sm text-foreground leading-relaxed shadow-sm">
              <span className="font-bold text-foreground block mb-1">Backbone Conformation Analysis:</span>
              <p className="text-slate-900 font-medium mt-1 leading-relaxed">{currentMolecule.desc}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2>Common Pharmacophoric Feature Types</h2>
        <p>
          Modern screening tools use seven canonical features to capture ligand-receptor binding properties. Below is their biophysical classification:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          <div className="border border-border p-4 rounded-xl space-y-2 bg-white">
            <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Hydrogen Bond Acceptor (HBA)
            </h4>
            <p className="text-slate-855 leading-relaxed text-sm">
              Electronegative atoms (like nitrogen or oxygen) containing lone pairs that attract electron-deficient hydrogen atoms from the receptor. e.g. carbonyls, ethers, tertiary amines.
            </p>
          </div>
          <div className="border border-border p-4 rounded-xl space-y-2 bg-white">
            <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Hydrogen Bond Donor (HBD)
            </h4>
            <p className="text-slate-855 leading-relaxed text-sm">
              Hydrogen atoms attached to highly electronegative elements (like nitrogen, oxygen, or fluorine) that interact with lone pairs. e.g. hydroxyls, primary/secondary amines.
            </p>
          </div>
          <div className="border border-border p-4 rounded-xl space-y-2 bg-white">
            <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Aromatic Ring (AR)
            </h4>
            <p className="text-slate-855 leading-relaxed text-sm">
              Planar ring systems capable of forming stacking interactions (pi-pi staking) with phenylalanine, tyrosine, or tryptophan residues in the receptor.
            </p>
          </div>
          <div className="border border-border p-4 rounded-xl space-y-2 bg-white">
            <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Hydrophobic Center (HY)
            </h4>
            <p className="text-slate-855 leading-relaxed text-sm">
              Aliphatic chains or carbon networks that partition into hydrophobic protein cavities to drive target affinity via favorable entropy release. e.g. t-butyl, isopropyl groups.
            </p>
          </div>
        </div>
      </section>

      {/* Advanced Topic: 3D Pharmacophore Fingerprints */}
      <section className="space-y-4 border-t border-border pt-8">
        <h2>Advanced: 3D Pharmacophore Fingerprints &amp; Dynamic Pharmacophores</h2>
        <p>
          To accelerate screening, computers encode pharmacophores into 1D bit-strings called <strong>pharmacophore fingerprints</strong>. Instead of doing geometry alignments on the fly, molecules are represented as bins of distance pairs.
        </p>
        <div className="bg-surface border border-border p-5 rounded-xl text-sm space-y-3 not-prose">
          <p className="font-bold text-foreground flex items-center gap-1.5">
            <Info className="h-4 w-4 text-accent" />
            How Pharmacophore Fingerprints Are Calculated:
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-slate-800 leading-relaxed font-medium">
            <li>Identify all pharmacophoric features (e.g. HBA, HBD, AR) inside a molecule.</li>
            <li>For every unique combination of three features, calculate the distances between them, creating a 3D triangle.</li>
            <li>Assign each distance to a specific range bin (e.g., bin 1 = 2.0–3.0 Å, bin 2 = 3.0–4.5 Å).</li>
            <li>Set the bit at the calculated index in the fingerprint to <code className="bg-white px-1.5 py-0.5 rounded border border-border font-bold">1</code>.</li>
            <li>Compare candidate fingerprints to target templates using similarity metrics to identify matches in milliseconds.</li>
          </ol>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose pt-4">
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900">3D Pharmacophore Hashes</h4>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              A 3D pharmacophore hash represents a unique geometric descriptor that indexes the absolute configuration of pharmacophore points. It encodes feature types (e.g., Donor, Acceptor, Hydrophobic) and their spatial distances as a hashed integer or string. This enables databases like ZINC and PubChem to index 3D chemical conformers and perform exact spatial searches in microseconds without alignment.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900">Dynamic Pharmacophores from MD</h4>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              Static crystal structures do not account for protein flexibility. By running Molecular Dynamics (MD) simulations of a protein-ligand complex, chemists capture the dynamic fluctuations of the binding pocket. Extracting frames from the MD trajectory and calculating pocket-ligand interactions over time allows clustering of transient geometries. The centroid conformations represent the most stable, <strong>representative dynamic pharmacophores</strong> that exist in solution.
            </p>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <hr className="border-slate-200 my-8" />
      <Quiz 
        moduleTitle="Module 5: Pharmacophore Modeling"
        questions={[
          {
            question: "What is the scientific purpose of applying the DBSCAN clustering algorithm during 3D pocket extraction?",
            options: [
              "It calculates the binding free energy of co-crystallized complexes.",
              "It resolves crystallographic steric clashes and missing loops.",
              "It groups aligned ligand coordinates by spatial density to cleanly isolate orthosteric binding pockets from allosteric sites and noise.",
              "It assigns partial charges to raw PDB coordinates using semi-empirical Hamiltonians."
            ],
            correctIndex: 2,
            explanation: "DBSCAN is a density-based spatial clustering algorithm. It is used to group co-crystallized ligand atoms overlaying in 3D space, which allows the pipeline to separate the orthosteric active site from allosteric binding pockets and filter out sparse water or buffer artifacts without knowing the number of clusters in advance."
          },
          {
            question: "Why can you NOT feed raw ligand coordinates extracted directly from PDB files straight into RDKit for feature extraction?",
            options: [
              "PDB coordinates are encrypted by crystallographic symmetry.",
              "PDB formats do not store bond orders, which would render the chemical structures and downstream feature tagging silently incorrect.",
              "RDKit only parses line notations like SMILES or SELFIES.",
              "PDB files only support macromolecular residues and reject small organic ligands."
            ],
            correctIndex: 1,
            explanation: "PDB coordinates do not contain bond order metadata, resulting in all bonds returning as ambiguous single bonds. Downstream chemoinformatics libraries like RDKit need correct bond topologies to tag features accurately, which requires matching raw 3D coords against a 2D SMILES template to restore proper double bonds, aromatic rings, and carbonyls."
          },
          {
            question: "How is the final consensus pharmacophore query compiled from the clustered ligand feature points?",
            options: [
              "We select the single highest-resolution PDB structure and copy its ligand points exactly.",
              "All features from all input ligands are combined, generating a dense map of thousands of points.",
              "A k-means algorithm is run within each feature type, keeping only the centroids shared by at least 50% of active input ligands.",
              "The consensus model is derived using standard Tanimoto fingerprint similarities."
            ],
            correctIndex: 2,
            explanation: "To distill a clean geometric query from a cloud of thousands of points, features are grouped by class (e.g. all acceptors) and clustered using k-means. Centroids representing hotspots shared by a majority of active input ligands (>= 50%) are retained as the consensus pharmacophore query."
          }
        ]}
      />
    </div>
  );
}
