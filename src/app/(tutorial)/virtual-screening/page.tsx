"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Zap, 
  Layers, 
  BarChart2,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  Activity,
  Info
} from "lucide-react";
import { Quiz } from "@/components/Quiz";
import { CollapsibleCode } from "@/components/CollapsibleCode";

interface Compound {
  id: string;
  name: string;
  mw: number;
  logp: number;
  hbd: number;
  hba: number;
  pains: string | null;
  score: number; // kcal/mol (lower/more negative is better)
}

const compoundLibrary: Compound[] = [
  { id: "C01", name: "Nirmatrelvir (Mpro Lead)", mw: 499, logp: 2.2, hbd: 3, hba: 7, pains: null, score: -9.5 },
  { id: "C02", name: "Catechol Scaffold", mw: 240, logp: 1.5, hbd: 2, hba: 3, pains: "Catechol Group", score: -7.8 },
  { id: "C03", name: "EGFR Inhibitor Core", mw: 540, logp: 5.2, hbd: 2, hba: 7, pains: null, score: -9.2 },
  { id: "C04", name: "Benzimidazole Fragment", mw: 210, logp: 2.1, hbd: 1, hba: 3, pains: null, score: -5.8 },
  { id: "C05", name: "Rhodanine Dye Scaffold", mw: 380, logp: 3.4, hbd: 1, hba: 4, pains: "Rhodanine Scaffold", score: -8.7 },
  { id: "C06", name: "Primary Sulfonamide", mw: 310, logp: 1.4, hbd: 2, hba: 4, pains: null, score: -7.2 },
  { id: "C07", name: "Covalent Peptidomimetic", mw: 590, logp: 4.8, hbd: 4, hba: 8, pains: null, score: -9.8 },
  { id: "C08", name: "Aminopyridine Fragment", mw: 150, logp: 0.9, hbd: 1, hba: 2, pains: null, score: -4.5 },
  { id: "C09", name: "Quinone Reactive Hit", mw: 260, logp: 2.5, hbd: 0, hba: 2, pains: "Quinone Ring", score: -8.0 },
  { id: "C10", name: "Benzothiazole Hit", mw: 315, logp: 3.1, hbd: 1, hba: 3, pains: null, score: -7.9 },
  { id: "C11", name: "Hydrazone Core", mw: 335, logp: 3.5, hbd: 1, hba: 3, pains: "Hydrazone Linkage", score: -7.6 },
  { id: "C12", name: "FDA Repurposed Candidate", mw: 450, logp: 3.8, hbd: 2, hba: 6, pains: null, score: -8.6 },
  { id: "C13", name: "Pyrazole Fragment", mw: 180, logp: 1.6, hbd: 1, hba: 2, pains: null, score: -5.1 },
  { id: "C14", name: "Enone Michael Acceptor", mw: 370, logp: 3.2, hbd: 2, hba: 6, pains: "Enone System", score: -8.4 },
  { id: "C15", name: "Tetrahydroquinoline Core", mw: 320, logp: 2.9, hbd: 1, hba: 3, pains: null, score: -7.4 },
  { id: "C16", name: "Indole Kinase Inhibitor", mw: 395, logp: 3.7, hbd: 1, hba: 4, pains: null, score: -8.8 },
  { id: "C17", name: "Polyphenolic Fragment", mw: 480, logp: 2.1, hbd: 6, hba: 9, pains: "Catechol Group", score: -8.9 },
  { id: "C18", name: "High-MW Macrocycle", mw: 620, logp: 5.6, hbd: 5, hba: 10, pains: null, score: -10.2 },
  { id: "C19", name: "Fluorinated Benzene", mw: 195, logp: 2.3, hbd: 0, hba: 1, pains: null, score: -4.8 },
  { id: "C20", name: "Triazole Fragment", mw: 285, logp: 1.8, hbd: 1, hba: 4, pains: null, score: -6.4 },
  { id: "C21", name: "Dihydropyridine Core", mw: 345, logp: 2.7, hbd: 1, hba: 4, pains: null, score: -7.7 },
  { id: "C22", name: "Coumarin Derivative", mw: 290, logp: 2.4, hbd: 0, hba: 3, pains: null, score: -6.9 },
  { id: "C23", name: "Purine Antagonist", mw: 320, logp: 1.2, hbd: 2, hba: 5, pains: null, score: -8.1 },
  { id: "C24", name: "Tricyclic Core Hit", mw: 410, logp: 4.2, hbd: 1, hba: 3, pains: null, score: -8.5 },
  { id: "C25", name: "Rhodanine Analogue 2", mw: 420, logp: 4.1, hbd: 1, hba: 5, pains: "Rhodanine Scaffold", score: -9.1 },
  { id: "C26", name: "Piperazine Scaffold", mw: 360, logp: 2.0, hbd: 1, hba: 4, pains: null, score: -8.3 },
  { id: "C27", name: "Highly Lipophilic Lead", mw: 470, logp: 5.8, hbd: 1, hba: 3, pains: null, score: -8.9 },
  { id: "C28", name: "Imidazopyridine Core", mw: 330, logp: 2.6, hbd: 1, hba: 4, pains: null, score: -8.0 },
  { id: "C29", name: "Quinone Derivative 2", mw: 310, logp: 3.0, hbd: 0, hba: 3, pains: "Quinone Ring", score: -7.5 },
  { id: "C30", name: "Oxadiazole Fragment", mw: 295, logp: 1.9, hbd: 0, hba: 4, pains: null, score: -6.7 },
  { id: "C31", name: "Spirocyclic Lead", mw: 385, logp: 3.3, hbd: 1, hba: 4, pains: null, score: -8.2 },
  { id: "C32", name: "Fused Pyrimidine Ring", mw: 430, logp: 3.6, hbd: 2, hba: 5, pains: null, score: -8.9 },
  { id: "C33", name: "Hydrazone Analogue 2", mw: 365, logp: 3.2, hbd: 1, hba: 4, pains: "Hydrazone Linkage", score: -7.9 },
  { id: "C34", name: "Carbonyl Fragment", mw: 130, logp: 0.8, hbd: 0, hba: 2, pains: null, score: -4.0 },
  { id: "C35", name: "Chiral Pyrrolidine Core", mw: 340, logp: 2.2, hbd: 2, hba: 4, pains: null, score: -8.2 },
  { id: "C36", name: "Chlorinated Lead Core", mw: 375, logp: 3.9, hbd: 1, hba: 3, pains: null, score: -8.6 }
];

export default function VirtualScreeningPage() {
  const [enrichmentLevel, setEnrichmentLevel] = useState(80); // Quality (0 - 100)

  // Simulator states
  const [filterLipinski, setFilterLipinski] = useState(true);
  const [filterPains, setFilterPains] = useState(true);
  const [filterDocking, setFilterDocking] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(200); // ms per compound
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Evaluate single compound
  const evaluateCompound = (c: Compound) => {
    const passLipinski = !filterLipinski || (c.mw <= 500 && c.logp <= 5.0 && c.hbd <= 5 && c.hba <= 10);
    const passPains = !filterPains || (c.pains === null);
    const passDocking = !filterDocking || (c.score <= -7.5);
    const passed = passLipinski && passPains && passDocking;
    return { passLipinski, passPains, passDocking, passed };
  };

  // Run screen loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= compoundLibrary.length - 1) {
            setIsRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return prev + 1;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, speed]);

  const handleStart = () => {
    if (currentIndex >= compoundLibrary.length) {
      setCurrentIndex(0);
    } else if (currentIndex === -1) {
      setCurrentIndex(0);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentIndex(-1);
  };

  // Active statistics calculated from screened library
  const screenedCount = Math.min(currentIndex + 1, compoundLibrary.length);
  const screenedList = compoundLibrary.slice(0, screenedCount);
  
  let passedLipinskiCount = 0;
  let passedPainsCount = 0;
  let passedDockingCount = 0;
  let hitsCount = 0;

  screenedList.forEach(c => {
    const { passLipinski, passPains, passDocking, passed } = evaluateCompound(c);
    if (passLipinski) passedLipinskiCount++;
    if (passPains) passedPainsCount++;
    if (passDocking) passedDockingCount++;
    if (passed) hitsCount++;
  });

  const hitRate = screenedCount > 0 ? (hitsCount / screenedCount) * 100 : 0;

  const currentComp = currentIndex >= 0 && currentIndex < compoundLibrary.length ? compoundLibrary[currentIndex] : null;
  const currentEvaluation = currentComp ? evaluateCompound(currentComp) : null;

  const generateRocPath = () => {
    let path = "M 40 160"; 
    const factor = enrichmentLevel / 100;
    
    for (let t = 0; t <= 10; t++) {
      const fpr = t / 10;
      const tpr = Math.min(Math.pow(fpr, 1 - factor), 1.0);
      
      const x = 40 + fpr * 120; 
      const y = 160 - tpr * 120; 
      path += ` L ${x} ${y}`;
    }
    return path;
  };

  const factor = enrichmentLevel / 100;
  const auc = 0.5 + (enrichmentLevel / 200);
  // EF at 5% = fraction of actives retrieved in top 5% (TPR at FPR = 0.05) divided by 0.05
  const tprAt5 = Math.min(Math.pow(0.05, 1 - factor), 1.0);
  const ef5 = (tprAt5 / 0.05).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1>Module 6: Virtual Screening Strategies</h1>
        <p className="lead text-slate-800">
          Learn how to search massive chemical databases in silico to discover novel hits. Master ligand-based (LBVS) and structure-based (SBVS) pipelines and metric evaluations.
        </p>
      </div>

      <hr className="border-slate-200" />

      {/* Section 1: Overview */}
      <section className="space-y-4">
        <h2>1. What is Virtual Screening (VS)?</h2>
        <p>
          Virtual Screening is the computational counterpart of experimental High-Throughput Screening (HTS). 
        </p>
        <p>
          Instead of physically preparing and testing millions of compounds in a robotic assay, virtual screening uses computer models to scan virtual chemical databases (e.g. ZINC, ChEMBL, PubChem, Enamine REAL). The primary goal is to <strong>enrich</strong> the selection of compounds submitted for final experimental validation.
        </p>
      </section>

      {/* Section 2: LBVS vs. SBVS */}
      <section className="space-y-4">
        <h2>2. Ligand-Based vs. Structure-Based Screening</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h3 className="font-bold text-sm text-slate-900">Ligand-Based VS (LBVS)</h3>
            <p className="text-sm text-slate-800 leading-relaxed">
              Relies on the <strong>similarity principle</strong> (similar molecules show similar activity). Uses 2D ECFP4 fingerprints or 3D shape overlaps of active templates to screen databases.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h3 className="font-bold text-sm text-slate-900">Structure-Based VS (SBVS)</h3>
            <p className="text-sm text-slate-800 leading-relaxed">
              Uses the <strong>3D structure of the target receptor</strong>. Employs molecular docking to fit virtual database molecules into the active site, estimating binding affinities via scoring.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Widget: ROC Curve Playground */}
      <section className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2">
          <BarChart2 size={16} className="text-slate-900" />
          <h3 className="font-bold text-sm text-slate-900">Interactive Playground: ROC Curve & Enrichment Factor</h3>
        </div>
        <p className="text-sm text-slate-800 leading-normal">
          Adjust the "Model Screening Accuracy" slider to see how model refinement changes the ROC curve and the Enrichment Factor (EF) at 5% of the database.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-white p-5 rounded-lg border border-slate-200">
          
          {/* Slider & Metrics */}
          <div className="md:col-span-5 space-y-5">
            <div className="space-y-1">
              <div className="flex justify-between items-center text-sm text-slate-800 font-bold">
                <span>Model Accuracy</span>
                <span className="font-bold text-slate-900">{enrichmentLevel}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="98"
                value={enrichmentLevel}
                onChange={(e) => setEnrichmentLevel(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded appearance-none cursor-pointer accent-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-0.5">
                <span className="text-xs text-slate-800 font-bold block uppercase">ROC-AUC</span>
                <span className="text-lg font-extrabold text-slate-900">{auc.toFixed(2)}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-0.5">
                <span className="text-xs text-slate-800 font-bold block uppercase">EF at 5%</span>
                <span className="text-lg font-extrabold text-slate-900">{ef5}x</span>
              </div>
            </div>

            <p className="text-sm text-slate-800 leading-normal">
              {enrichmentLevel < 30 ? (
                <span>Low Accuracy: The model behaves almost like random screening (diagonal ROC line). Little to no enrichment.</span>
              ) : enrichmentLevel < 70 ? (
                <span>Moderate Accuracy: Standard performance of basic virtual screening docking. Useful, but requires high decoy screening budgets.</span>
              ) : (
                <span className="font-semibold text-slate-800">High Accuracy: Excellent consensus virtual screening performance. Combines filters to enrich the hit rate significantly!</span>
              )}
            </p>
          </div>

          {/* Graph Display */}
          <div className="md:col-span-7 flex justify-center">
            <div className="w-full max-w-[240px] aspect-square relative bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
              <div className="relative flex-1">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <line x1="40" y1="160" x2="160" y2="160" stroke="currentColor" className="text-slate-300" strokeWidth="0.8" />
                  <line x1="40" y1="40" x2="40" y2="160" stroke="currentColor" className="text-slate-300" strokeWidth="0.8" />

                  {/* Diagonal random line (AUC = 0.5) */}
                  <line x1="40" y1="160" x2="160" y2="40" stroke="currentColor" className="text-slate-200" strokeWidth="0.5" strokeDasharray="3,3" />

                  {/* Dynamic ROC Path */}
                  <path d={generateRocPath()} fill="none" stroke="currentColor" className="text-slate-900" strokeWidth="2" />

                  {/* Annotations */}
                  <text x="100" y="178" textAnchor="middle" fill="#1e293b" className="text-[7.5px] font-bold fill-slate-800">FPR (1 - Specificity)</text>
                  <text x="20" y="100" textAnchor="middle" fill="#1e293b" className="text-[7.5px] font-bold fill-slate-800" transform="rotate(-90 20 100)">TPR (Sensitivity)</text>
                  <text x="135" y="155" fill="#1e293b" className="text-[7px] font-bold fill-slate-800">Random</text>
                  <text x="45" y="55" fill="currentColor" className="text-slate-900" fontSize="7" fontWeight="bold">Model</text>
                </svg>
              </div>
              <div className="text-xs text-center text-slate-800 mt-2 font-bold">
                ROC Performance Analysis (TPR vs FPR)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mathematical Screening Metrics Section */}
      <section className="space-y-4 border-t border-slate-200 pt-6">
        <h3>Mathematical Screening Metrics: EF and BEDROC</h3>
        <p className="text-sm text-slate-800 leading-relaxed">
          While ROC-AUC measures the overall ability of a model to distinguish active compounds from inactive decoys across the entire dataset, virtual screening pipelines are highly sensitive to the <strong>early recognition problem</strong>. Since researchers typically only synthesize or test the top-ranked fraction of candidates, we require metrics focused on early enrichment:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
            <h4 className="font-bold text-sm text-slate-900">Enrichment Factor (EF)</h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              Measures the density of active compounds in the top-ranked fraction (e.g. 1% or 5%) of the database compared to the average density across the whole database:
            </p>
            <div className="my-2 font-mono text-center text-xs bg-slate-50 py-2.5 rounded text-slate-800 font-bold border border-slate-200">
              {"EF_χ = (N_actives,χ / N_total,χ) / (N_actives,total / N_total)"}
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Where <em>χ</em> is the fraction screened (e.g., 0.01 for 1%). <strong>Limitation:</strong> It does not distinguish between a model that puts all active molecules at the very top (rank 1–10) vs. at the bottom of the active slice (rank 90–100).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
            <h4 className="font-bold text-sm text-slate-900">BEDROC Metric</h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              Boltzmann-Enhanced Discrimination of ROC (BEDROC) resolves the early recognition problem by applying an exponential weighting function to ranks:
            </p>
            <div className="my-2 font-mono text-center text-[10px] bg-slate-50 py-2 px-1 rounded text-slate-800 font-bold border border-slate-200 overflow-x-auto">
              {"BEDROC = Σ [ exp(-α × r_i / N) ] / Z"}
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Where <em>r_i</em> is the rank of the <em>i</em>-th active compound, <em>N</em> is total compounds, <em>α</em> is the exponential scaling parameter (usually set to 20 or 160.9 to prioritize the top 8% or 1%), and <em>Z</em> is a normalization factor.
            </p>
          </div>
        </div>
      </section>

      {/* Active Learning & Bayesian Optimization Subsection */}
      <section className="space-y-4 border-t border-slate-200 pt-6">
        <h3>Active Learning &amp; Bayesian Optimization Loops</h3>
        <p className="text-sm text-slate-800 leading-relaxed">
          Traditional virtual screening screens the entire database linearly. However, screening billions of compounds (like the Enamine REAL space) with heavy docking or quantum chemistry is computationally impossible. Modern discovery uses <strong>Active Learning</strong> (a branch of machine learning) to search these spaces dynamically:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
            <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              1. The Surrogate Model
            </h4>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              A fast machine learning model (e.g., Gaussian Processes or Random Forests) is trained on a small, initial subset of docked or assayed compounds. It predicts the activity (or docking score) of unscreened compounds and crucially predicts its own <strong>uncertainty</strong> (standard deviation).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
            <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              2. The Acquisition Function
            </h4>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              Balances exploration (testing high-uncertainty regions to improve the model) and exploitation (testing high-activity regions to find hits). Common functions include <strong>Expected Improvement (EI)</strong> and <strong>Upper Confidence Bound (UCB)</strong>:
            </p>
            <div className="my-1.5 font-mono text-center text-[10px] bg-slate-50 py-1.5 rounded text-slate-800 font-bold border border-slate-200">
              {"UCB(x) = μ(x) + β * σ(x)"}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
            <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              3. The Closed-Loop Cycle
            </h4>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              The acquisition function ranks all unscreened compounds. A batch of the top-ranked candidates is screened (e.g. docked), their scores are added to the training set, the surrogate model is retrained, and the loop repeats, discovering hits after screening only 1% to 2% of the library.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Databases */}
      <section className="space-y-4">
        <h2>3. Database Sources & Preparation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900">Library Databases</h4>
            <p className="text-sm text-slate-800 leading-relaxed">
              Include ChEMBL (bioactivity values), ZINC (millions of commercially purchaseable structures), and Enamine REAL (containing billions of make-on-demand molecules).
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900">Preparation Steps</h4>
            <p className="text-sm text-slate-800 leading-relaxed">
               Includes salt stripping (removing counterions), stereoisomer/tautomer generation, protonation state assignment (usually at pH 7.4), and 3D coordinate minimization.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Hybrid screening */}
      <section className="space-y-4">
        <h2>4. Hybrid/Multi-Stage Virtual Screening</h2>
        <p>
          To optimize computing resources, virtual screening is conducted in sequential, multi-stage cascading filters:
        </p>
        <div className="p-5 rounded-xl border border-border bg-slate-50 font-medium">
          <ol className="space-y-2 leading-relaxed text-slate-800">
            <li><strong>Physicochemical Pre-filtering:</strong> Eliminate structures violating Lipinski's or Veber's drug-likeness rules.</li>
            <li><strong>Ultra-fast Similarity Search:</strong> Apply 2D ECFP4 fingerprint similarity searching to reduce a database of 100M+ structures down to 100k.</li>
            <li><strong>Pharmacophore Query:</strong> Screen spatial configurations of the remaining 100k structures to keep only 5k matching candidates.</li>
            <li><strong>Molecular Docking:</strong> Perform detailed molecular docking simulations on the 5k candidates to rank them.</li>
            <li><strong>Consensus and MD:</strong> Re-score top dockings with Molecular Dynamics (MD) or free energy calculators (MM-GBSA) to select 20 compounds for chemical synthesis and biological testing.</li>
          </ol>
        </div>

        <h3 className="font-bold text-foreground text-base pt-2">Physicochemical Filters: Drug-Likeness Rules Beyond Lipinski</h3>
        <p>
          While Lipinski's Rule of 5 is the most famous historical filter, computational chemists rely on more comprehensive rules to assess oral bioavailability, membrane absorption, and synthetically targetable properties:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Veber Rules (Flexibility &amp; PSA)
            </h4>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              Determined by GSK. Too many rotatable bonds decrease oral bioavailability due to conformational entropy. Rules: Rotatable bonds &le; 10, Polar Surface Area (PSA) &le; 140 Å² (or H-bond donor + acceptor count &le; 12).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              Egan Rules (Permeability)
            </h4>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              Predicts human intestinal absorption based on lipophilicity and TPSA (polar surface area). Rules: WLOGP &le; 5.88, TPSA &le; 131.6 Å². Focuses on passive membrane permeability.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              Ghose Filters (Pharma-Like)
            </h4>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              Based on databases of clinical candidates. Defines drug-likeness as: logP between -0.4 and 5.6, molecular weight between 160 and 480 Da, molar refractivity between 40 and 130, and total atom count between 20 and 70.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Widget 2: High-Throughput Screen Simulator */}
      <section className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-slate-900" />
          <h3 className="font-bold text-base text-slate-900">Interactive Playground: Live High-Throughput Virtual Screen Simulator</h3>
        </div>
        <p className="text-sm text-slate-800">
          Experience a multi-stage virtual screening pipeline in action. Configure filters, kick off the automated screen, and watch the compound library get filtered in real time. Plotted on the live scatter chart are the Molecular Weight (MW) vs. Docking Score for all analyzed compounds.
        </p>

        {/* Configurations Banner */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-5 rounded-lg border border-slate-200">
          
          {/* Controls & Statistics */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm uppercase tracking-wider text-slate-900 border-b pb-1">Pipeline Filters</h4>
              
              {/* Checkboxes */}
              <div className="space-y-2 text-sm font-bold text-slate-800">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={filterLipinski} 
                    onChange={(e) => setFilterLipinski(e.target.checked)}
                    disabled={isRunning}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                  <span>1. Lipinski's Rule of 5 (MW ≤ 500)</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={filterPains} 
                    onChange={(e) => setFilterPains(e.target.checked)}
                    disabled={isRunning}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                  <span>2. PAINS Reactive Filter (Excludes Quinone/Rhodanine)</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={filterDocking} 
                    onChange={(e) => setFilterDocking(e.target.checked)}
                    disabled={isRunning}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                  <span>3. Mpro Docking Score Threshold (≤ -7.5 kcal/mol)</span>
                </label>
              </div>

              {/* Speed Controller */}
              <div className="space-y-1.5 pt-2">
                <span className="text-xs text-slate-800 font-bold uppercase tracking-wider block">Screening Speed</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSpeed(600)} 
                    className={`flex-1 text-xs py-1 rounded font-bold border transition-colors ${speed === 600 ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"}`}
                  >
                    Slow
                  </button>
                  <button 
                    onClick={() => setSpeed(200)} 
                    className={`flex-1 text-xs py-1 rounded font-bold border transition-colors ${speed === 200 ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"}`}
                  >
                    Medium
                  </button>
                  <button 
                    onClick={() => setSpeed(50)} 
                    className={`flex-1 text-xs py-1 rounded font-bold border transition-colors ${speed === 50 ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"}`}
                  >
                    Fast
                  </button>
                </div>
              </div>
            </div>

            {/* Run Action Buttons */}
            <div className="flex gap-2">
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white py-2 px-4 rounded-lg font-bold text-sm shadow-sm transition-colors"
                >
                  <Play size={14} /> Start Screening
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg font-bold text-sm shadow-sm transition-colors"
                >
                  Pause
                </button>
              )}
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-1.5 border border-slate-300 hover:bg-slate-50 text-slate-800 py-2 px-3 rounded-lg font-bold text-sm transition-colors"
              >
                <RotateCcw size={14} /> Reset
              </button>
            </div>

            {/* Diagnostics Stats */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
              <span className="text-xs text-slate-800 font-extrabold uppercase tracking-wider block">Live Screen Stats</span>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-800">
                <div>Compounds Screened: <span className="font-mono font-black text-slate-950">{screenedCount} / 36</span></div>
                <div>Passed Lipinski: <span className="font-mono text-slate-950">{passedLipinskiCount}</span></div>
                <div>Passed PAINS: <span className="font-mono text-slate-950">{passedPainsCount}</span></div>
                <div>Passed Docking: <span className="font-mono text-slate-950">{passedDockingCount}</span></div>
                <div className="col-span-2 border-t border-slate-200/60 pt-1.5 flex justify-between text-sm text-slate-950">
                  <span>Hits Identified: <strong className="text-emerald-700 font-black">{hitsCount}</strong></span>
                  <span>Hit Rate: <strong className="font-black">{hitRate.toFixed(1)}%</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Screen Scatter Plot */}
          <div className="md:col-span-7 flex flex-col items-center justify-between space-y-4">
            
            {/* SVG Scatter Chart */}
            <div className="w-full relative bg-slate-100 border border-slate-200 rounded-lg p-4 select-none">
              
              <svg viewBox="0 0 300 200" className="w-full h-auto">
                {/* Grid Lines */}
                {/* Horizontal grid lines for Docking Score (-4 to -10) */}
                {[ -5, -6, -7, -8, -9, -10 ].map((scoreVal) => {
                  const y = 30 + (scoreVal - (-4)) * (-25); // -4 is top, -10 is bottom, scale 25px per unit
                  return (
                    <g key={scoreVal}>
                      <line x1="30" y1={y} x2="280" y2={y} stroke="#e2e8f0" strokeWidth="0.5" />
                      <text x="25" y={y + 3} textAnchor="end" fill="#475569" className="text-[6.5px] font-bold">{scoreVal}</text>
                    </g>
                  );
                })}
                {/* Vertical grid lines for Molecular Weight (100 to 600) */}
                {[ 200, 300, 400, 500, 600 ].map((mwVal) => {
                  const x = 30 + (mwVal - 100) * 0.5; // 100 is left, 600 is right, scale 0.5px per unit
                  return (
                    <g key={mwVal}>
                      <line x1={x} y1="10" x2={x} y2="180" stroke="#e2e8f0" strokeWidth="0.5" />
                      <text x={x} y="188" textAnchor="middle" fill="#475569" className="text-[6.5px] font-bold">{mwVal}</text>
                    </g>
                  );
                })}

                {/* X and Y axes */}
                <line x1="30" y1="180" x2="280" y2="180" stroke="#475569" strokeWidth="1" />
                <line x1="30" y1="10" x2="30" y2="180" stroke="#475569" strokeWidth="1" />

                {/* Axis Labels */}
                <text x="155" y="197" textAnchor="middle" fill="#1e293b" className="text-[8px] font-bold">Molecular Weight (MW, Da)</text>
                <text x="10" y="95" textAnchor="middle" fill="#1e293b" className="text-[8px] font-bold" transform="rotate(-90 10 95)">Docking Score (kcal/mol)</text>

                {/* Threshold Boundary Lines (if filters active) */}
                {/* 1. Lipinski MW threshold (500 Da) */}
                {filterLipinski && (
                  <g>
                    <line x1={30 + (500 - 100) * 0.5} y1="10" x2={30 + (500 - 100) * 0.5} y2="180" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" />
                    <text x={30 + (500 - 100) * 0.5 - 4} y="16" textAnchor="end" fill="#991b1b" className="text-[6px] font-bold">MW Limit (500)</text>
                  </g>
                )}
                {/* 2. Docking Score threshold (-7.5 kcal/mol) */}
                {filterDocking && (
                  <g>
                    <line x1="30" y1={30 + (-7.5 - (-4)) * (-25)} x2="280" y2={30 + (-7.5 - (-4)) * (-25)} stroke="#3b82f6" strokeWidth="1" strokeDasharray="3,3" />
                    <text x="276" y={30 + (-7.5 - (-4)) * (-25) - 3} textAnchor="end" fill="#1d4ed8" className="text-[6px] font-bold">Score Limit (-7.5)</text>
                  </g>
                )}

                {/* Plot Compounds */}
                {screenedList.map((c, idx) => {
                  const x = 30 + (c.mw - 100) * 0.5;
                  const y = 30 + (c.score - (-4)) * (-25);
                  const isCurrent = idx === currentIndex;
                  const { passed } = evaluateCompound(c);

                  return (
                    <g key={c.id}>
                      <circle 
                        cx={x} 
                        cy={y} 
                        r={isCurrent ? "5.5" : "3.5"} 
                        fill={passed ? "#10b981" : "#ef4444"} 
                        stroke={isCurrent ? "#f59e0b" : "#ffffff"} 
                        strokeWidth={isCurrent ? "1.8" : "0.6"} 
                        className={isCurrent ? "animate-pulse" : ""}
                      />
                      {isCurrent && (
                        <text x={x} y={y - 7} textAnchor="middle" fill="#0f172a" className="text-[5.5px] font-black bg-white px-0.5 rounded border border-slate-300">
                          {c.id}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Display processing status details */}
            <div className="w-full bg-white p-3 border border-slate-200 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
              {currentComp ? (
                <>
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-block px-1.5 py-0.5 text-[8.5px] font-extrabold bg-slate-900 text-white rounded">
                        {currentComp.id}
                      </span>
                      <strong className="text-xs text-slate-950 font-bold leading-none">{currentComp.name}</strong>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-[10px] text-slate-800 pt-1.5 font-bold">
                      <span>MW: <strong>{currentComp.mw} Da</strong></span>
                      <span>LogP: <strong>{currentComp.logp}</strong></span>
                      <span>PAINS: <strong className={currentComp.pains ? "text-red-700" : "text-emerald-700"}>{currentComp.pains || "None"}</strong></span>
                      <span>Score: <strong className="font-mono">{currentComp.score.toFixed(1)}</strong></span>
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="flex gap-3 text-[10px] font-extrabold shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-slate-200">
                    <div className="flex items-center gap-1">
                      {currentEvaluation?.passLipinski ? <CheckCircle size={12} className="text-emerald-600" /> : <XCircle size={12} className="text-red-600" />}
                      <span className="text-slate-800">Lipinski</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {currentEvaluation?.passPains ? <CheckCircle size={12} className="text-emerald-600" /> : <XCircle size={12} className="text-red-600" />}
                      <span className="text-slate-800">PAINS</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {currentEvaluation?.passDocking ? <CheckCircle size={12} className="text-emerald-600" /> : <XCircle size={12} className="text-red-600" />}
                      <span className="text-slate-800">Docking</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-xs font-bold text-slate-800 text-center py-2 w-full">
                  {currentIndex >= compoundLibrary.length 
                    ? "✓ Screen Complete! Review the identified hits in the database." 
                    : "Ready. Click 'Start Screening' to process the 36-compound library."}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Statistical Validation */}
      <section className="space-y-4">
        <h2>5. Statistical Validation: DeLong's Test and AUC Confidence Intervals</h2>
        <p>
          Evaluating virtual screening performance using the Area Under the ROC Curve (AUC) yields a <strong>point estimate</strong>. However, if the external validation set is small (e.g., 50 compounds), the calculated AUC is highly sensitive to random fluctuation. A model might achieve an apparent AUC of 0.82 purely by chance, while its true generalizable performance is closer to 0.70.
        </p>
        <p>
          To verify if a model's screening performance is robust, and to prove if one docking classifier is statistically superior to another, computational chemists use <strong>DeLong's Test</strong>. This non-parametric method calculates:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900">AUC Confidence Intervals (CIs)</h4>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              DeLong's method calculates the mathematical variance of the Mann-Whitney U-statistic underlying the AUC. This allows us to construct a 95% Confidence Interval (e.g., AUC = 0.78 +/- 0.06). If the interval crosses 0.50, the model is not statistically better than random guessing.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900">Pairwise Statistical Superiority</h4>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              When comparing two models on the same test set, their predictions are correlated. DeLong's method computes the <strong>covariance</strong> of their AUC estimates. This enables a z-test to calculate a p-value: if <em>p</em> &lt; 0.05, we reject the null hypothesis and confirm one model is statistically superior.
            </p>
          </div>
        </div>

        <p>
          Below is a fast, matrix-based Python implementation of DeLong's variance and test (adapted from Pat Walters and Srijit Seal's tutorials) to calculate the AUC variance:
        </p>

        {/* User-Friendly Explanations Callout */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-semibold text-slate-800 space-y-2 mt-4">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Info className="h-4 w-4 text-blue-600" /> Statistical Concepts in the Script:
          </span>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Mann-Whitney Kernel expectations:</strong> Compares active predictions pairwise against decoy predictions. For each active, it counts how many decoys have a lower predicted score.</li>
            <li><strong>AUC Calculation:</strong> The mean of the kernel expectation is the Area Under the Curve (AUC) of the Receiver Operating Characteristic (ROC).</li>
            <li><strong>Variance Computation:</strong> DeLong's method computes the variance of these expectations, taking into account correlations, to establish a z-test.</li>
          </ul>
        </div>

        <CollapsibleCode
          title="Python Fast DeLong ROC Variance Script"
          code={`import numpy as np

def fast_delong_roc_variance(ground_truth, predictions):
    # =====================================================================
    # STEP 1: SPLIT PREDICTIONS BY ACTIVE VS. DECOY LABELS
    # =====================================================================
    # Filter predictions based on ground truth array (1 = active, 0 = decoy)
    pos = predictions[ground_truth == 1]
    neg = predictions[ground_truth == 0]
    
    m = len(pos) # Number of positive compounds
    n = len(neg) # Number of negative compounds
    
    # Initialize structural arrays to hold Wilcoxon/Mann-Whitney kernel values
    tx = np.zeros(m)
    ty = np.zeros(n)
    
    # =====================================================================
    # STEP 2: CALCULATE MANN-WHITNEY KERNEL EXPECTATIONS
    # =====================================================================
    # For each active compound, calculate the proportion of decoys that it
    # correctly scores higher. Half credit (+0.5) is given for ties.
    for i in range(m):
        tx[i] = np.sum(pos[i] > neg) + 0.5 * np.sum(pos[i] == neg)
    for j in range(n):
        ty[j] = np.sum(pos > neg[j]) + 0.5 * np.sum(pos == neg[j])
        
    tx = tx / n # Standardize by decoy count
    ty = ty / m # Standardize by active count
    
    # The mean of structural components corresponds to the empirical AUC score
    auc = np.mean(tx)
    
    # =====================================================================
    # STEP 3: COMPUTE DELONG VARIANCE ENVELOPE
    # =====================================================================
    # Calculate sample variance of kernel outputs with Bessel's correction (ddof=1)
    var_tx = np.var(tx, ddof=1) / m
    var_ty = np.var(ty, ddof=1) / n
    
    # Sum structural variances to compute the total asymptotic variance of AUC
    auc_variance = var_tx + var_ty
    
    return auc, auc_variance`}
        />
      </section>

      {/* Quiz Section */}
      <hr className="border-slate-200 my-8" />
      <Quiz 
        moduleTitle="Module 6: Virtual Screening Strategies"
        questions={[
          {
            question: "Why are Lipinski's Rule of 5 and other physiochemical filters applied at the very start of a virtual screen cascade rather than after docking?",
            options: [
              "Because molecules that violate Lipinski's rules will dock incorrectly in the binding pocket.",
              "Because docking is computationally expensive (seconds/minutes per molecule), whereas calculating molecular descriptors takes milliseconds, allowing rapid discard of 90%+ of the library.",
              "Because the docking scoring functions already include Lipinski filters in their calculations.",
              "Because it is required to prevent covalent binders from reacting with the pocket."
            ],
            correctIndex: 1,
            explanation: "Molecular docking requires expensive conformational search algorithms, taking significant CPU time per molecule. By contrast, calculating MW or logP is instantaneous. Screening libraries can contain millions or billions of structures; filtering out non-drug-like compounds beforehand saves enormous computational budgets by avoiding docking molecules that will ultimately fail downstream filters."
          },
          {
            question: "What does the term PAINS (Pan-Assay Interference Compounds) represent in virtual screening, and why must they be excluded?",
            options: [
              "Compounds that cause pain when administered during clinical trials.",
              "Molecules with high conformational flexibility that fail to orient properly in receptor cavities.",
              "Chemical groups that show false-positive biological activity due to reactivity, metal chelation, or fluorescence, rather than specific target binding.",
              "Ligands with poor cell membrane permeability."
            ],
            correctIndex: 2,
            explanation: "PAINS are structural motifs (e.g. catechols, rhodanines) that yield false positives in biological assays. They do this by covalently reacting, chelating metals, aggregating, or interfering with optical assay readouts. Filtering them out in-silico saves researchers from wasting resources validating false-positive hits."
          },
          {
            question: "Why is a simple point-estimate of ROC-AUC alone insufficient when comparing the performance of two different virtual screening models on a small test library?",
            options: [
              "Because ROC-AUC cannot be calculated on small datasets.",
              "Because small test sets carry high statistical variance. An apparent difference in AUC (e.g., 0.80 vs. 0.76) could be due to random sample noise rather than actual superiority, requiring a significance test like DeLong's test to compute covariance and p-value.",
              "Because point-estimates of AUC ignore the molecular weight filters of the ligands.",
              "Because docking scores must be normalized by rotatable bonds before computing the AUC."
            ],
            correctIndex: 1,
            explanation: "When test set sizes are small, the variance in AUC is very high, which means sample noise can easily inflate or deflate the score. To compare two models reliably, you must compute the confidence intervals of the AUC and run a statistical significance test (such as DeLong's test, which accounts for the correlation between predictions on the same set) to see if the p-value is below 0.05."
          }
        ]}
      />
    </div>
  );
}
