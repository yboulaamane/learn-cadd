"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Cpu,
  Info,
  Sliders,
  Compass,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { Quiz } from "@/components/Quiz";
import { CollapsibleCode } from "@/components/CollapsibleCode";

export default function QsarModelingPage() {
  // Widget 1 state (Decision Tree)
  const [logP, setLogP] = useState(3.2); // Lipophilicity
  const [mw, setMw] = useState(380); // Molecular Weight
  const [hbd, setHbd] = useState(2); // H-Bond Donors

  const step1Passed = logP <= 4.0;
  const step2Passed = step1Passed ? mw <= 450 : hbd >= 3;
  const resultActive = step1Passed ? step2Passed : !step2Passed;

  // Widget 2 state (PCA Applicability Domain)
  const [pc1, setPc1] = useState(0.8);
  const [pc2, setPc2] = useState(-0.3);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // SVG dimensions: 300 x 200. Center (0, 0) is at (150, 100)
  // Scale: 1 PC1 unit = 30 px, 1 PC2 unit = 25 px
  const centerX = 150;
  const centerY = 100;
  const scaleX = 30;
  const scaleY = 25;

  const testX = centerX + pc1 * scaleX;
  const testY = centerY - pc2 * scaleY; // Inverted Y-axis in SVG

  // Static training set coordinate points (safely inside applicability ellipse)
  const trainingPoints = [
    { x: centerX + 0.2 * scaleX, y: centerY - 0.1 * scaleY },
    { x: centerX - 0.5 * scaleX, y: centerY - 0.3 * scaleY },
    { x: centerX + 0.8 * scaleX, y: centerY + 0.2 * scaleY },
    { x: centerX - 0.8 * scaleX, y: centerY + 0.4 * scaleY },
    { x: centerX + 1.2 * scaleX, y: centerY - 0.2 * scaleY },
    { x: centerX - 1.1 * scaleX, y: centerY - 0.5 * scaleY },
    { x: centerX + 0.1 * scaleX, y: centerY + 0.6 * scaleY },
    { x: centerX - 0.2 * scaleX, y: centerY - 0.7 * scaleY },
    { x: centerX + 0.5 * scaleX, y: centerY - 0.5 * scaleY },
    { x: centerX - 0.6 * scaleX, y: centerY + 0.1 * scaleY },
    { x: centerX + 1.0 * scaleX, y: centerY + 0.3 * scaleY },
    { x: centerX - 0.3 * scaleX, y: centerY + 0.5 * scaleY },
    { x: centerX + 1.4 * scaleX, y: centerY - 0.1 * scaleY },
    { x: centerX - 1.3 * scaleX, y: centerY + 0.2 * scaleY },
    { x: centerX + 0.6 * scaleX, y: centerY + 0.5 * scaleY },
    { x: centerX - 0.9 * scaleX, y: centerY - 0.2 * scaleY },
    { x: centerX + 0.3 * scaleX, y: centerY - 0.8 * scaleY },
    { x: centerX - 0.1 * scaleX, y: centerY + 0.8 * scaleY },
    { x: centerX + 1.5 * scaleX, y: centerY + 0.1 * scaleY },
    { x: centerX - 1.4 * scaleX, y: centerY - 0.4 * scaleY }
  ];

  // Ellipse radii in Principal Component units: a = 2.0 (PC1), b = 1.2 (PC2)
  const a = 2.0;
  const b = 1.2;

  // Hotelling T2 metric equivalent: distance = (pc1/a)^2 + (pc2/b)^2
  const distanceSq = Math.pow(pc1 / a, 2) + Math.pow(pc2 / b, 2);
  
  // Calculate Leverage h
  // Leverage formula: h = (1 / n) + d_sq / sum(d_sq)
  // For training set size n=20, let's map leverage to a clean educational value:
  const n = 20;
  const h = (1 / n) + 0.15 * distanceSq;
  
  // Critical leverage threshold h* (boundary of the ellipse)
  // When distanceSq = 1.0 (on ellipse boundary), h = 0.05 + 0.15 = 0.20
  const hStar = 0.20;
  const insideDomain = h <= hStar;

  // Mouse / Touch handlers for dragging the Test Compound
  const updatePosition = (clientX: number, clientY: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = ((clientX - rect.left) / rect.width) * 300;
    const mouseY = ((clientY - rect.top) / rect.height) * 200;

    // Convert SVG pixels back to PC units
    let newPc1 = (mouseX - centerX) / scaleX;
    let newPc2 = (centerY - mouseY) / scaleY;

    // Constrain to visible graph limits (-4 to 4, -3.5 to 3.5)
    newPc1 = Math.min(Math.max(newPc1, -4), 4);
    newPc2 = Math.min(Math.max(newPc2, -3.5), 3.5);

    setPc1(newPc1);
    setPc2(newPc2);
  };

  const handleMouseDown = (e: React.MouseEvent<SVGElement>) => {
    setIsDragging(true);
    updatePosition(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement> | MouseEvent) => {
    if (!isDragging) return;
    const clientX = 'clientX' in e ? e.clientX : (e as MouseEvent).clientX;
    const clientY = 'clientY' in e ? e.clientY : (e as MouseEvent).clientY;
    updatePosition(clientX, clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<SVGElement>) => {
    if (e.touches.length === 0) return;
    setIsDragging(true);
    updatePosition(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!isDragging || e.touches.length === 0) return;
    updatePosition(e.touches[0].clientX, e.touches[0].clientY);
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1>Module 7: QSAR Modeling &amp; AI Interpretation</h1>
        <p className="lead text-slate-800">
          Explore Quantitative Structure-Activity Relationship (QSAR) machine learning. Learn data curation, descriptor calculations, and tree-based model interpretations.
        </p>
      </div>

      <hr className="border-slate-200" />

      {/* Section 1: Introduction */}
      <section className="space-y-4">
        <h2>1. What is QSAR Modeling?</h2>
        <p>
          Quantitative Structure-Activity Relationship (QSAR) modeling is a computational method that attempts to build mathematical relationships between a set of chemical descriptors (structural properties) and a measured biological activity.
        </p>
        <p>
          QSAR models are built using machine learning regression or classification algorithms. Once trained and validated, they can predict the activity of virtual molecules, guide chemical modifications during lead optimization, and predict toxicology markers (ADMET).
        </p>
      </section>

      {/* Section 2: QSAR Workflow */}
      <section className="space-y-4">
        <h2>2. The QSAR Modeling Workflow</h2>
        
        <div className="space-y-3 not-prose">
          <div className="flex gap-3 p-3.5 rounded-lg border border-border bg-white">
            <span className="h-5 w-5 text-sm font-bold bg-slate-100 border border-border rounded flex items-center justify-center flex-shrink-0 text-slate-800">1</span>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Data Collection & Curation</h4>
              <p className="text-sm text-slate-855 mt-1 leading-relaxed">
                Bioactivity measurements are pulled from public databases (ChEMBL, PubChem). Structures are standardized by stripping salts, resolving stereocenters, and neutralizing molecules to match physiological pH.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3.5 rounded-lg border border-border bg-white">
            <span className="h-5 w-5 text-sm font-bold bg-slate-100 border border-border rounded flex items-center justify-center flex-shrink-0 text-slate-800">2</span>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Descriptor Calculation</h4>
              <p className="text-sm text-slate-855 mt-1 leading-relaxed">
                Molecules are translated into mathematical vectors. Descriptors range from 1D properties (molecular weight), to 2D topological properties (logP, polar surface area, circular <strong>ECFP4 fingerprints</strong> representing local environments), and 3D shapes.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3.5 rounded-lg border border-border bg-white">
            <span className="h-5 w-5 text-sm font-bold bg-slate-100 border border-border rounded flex items-center justify-center flex-shrink-0 text-slate-800">3</span>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Machine Learning Training</h4>
              <p className="text-sm text-slate-855 mt-1 leading-relaxed">
                Common algorithms include <strong>Decision Trees (DT)</strong>, <strong>Random Forests (RF)</strong> (ensembles of random trees), and <strong>Gradient Boosting Machines (GBM)</strong> (trees built sequentially).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expanded ML Algorithm Cards */}
      <section className="space-y-4">
        <h3 className="font-bold text-lg text-slate-900">Key Machine Learning Algorithms in QSAR</h3>
        <p>
          Beyond tree-based methods, QSAR practitioners deploy a diverse toolkit of algorithms. Each brings unique strengths depending on dataset size, descriptor type, and whether the task is classification or regression.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 font-semibold text-[10px] uppercase">Kernel Method</span>
            <h4 className="font-bold text-sm text-slate-900">Support Vector Machine (SVM)</h4>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              Constructs a hyperplane in high-dimensional descriptor space that maximally separates active from inactive compounds. Uses kernel functions (RBF, polynomial) to handle non-linearly separable data. The C parameter controls bias-variance tradeoff: higher C reduces training error but risks overfitting.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold text-[10px] uppercase">Gradient Boosting</span>
            <h4 className="font-bold text-sm text-slate-900">XGBoost</h4>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              Optimized gradient boosting with second-order Taylor expansion of the loss function. Features L1/L2 regularization, column subsampling, and learning rate shrinkage. Consistently wins cheminformatics benchmarks due to its ability to handle sparse fingerprint matrices and missing descriptors.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 font-semibold text-[10px] uppercase">Instance-Based</span>
            <h4 className="font-bold text-sm text-slate-900">K-Nearest Neighbors (KNN)</h4>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              Non-parametric, instance-based learner that classifies by majority vote of k nearest neighbors in descriptor space (using Tanimoto or Euclidean distance). Simple and interpretable but highly sensitive to dimensionality; performance degrades without prior feature selection or PCA reduction.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold text-[10px] uppercase">Probabilistic</span>
            <h4 className="font-bold text-sm text-slate-900">Gaussian Naive Bayes (GNB)</h4>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              Probabilistic classifier using Bayes&apos; theorem with a feature independence assumption. Works surprisingly well with high-dimensional fingerprints where the independence assumption approximately holds. Provides calibrated probability estimates useful for ranking and applicability domain assessment.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Widget: Decision Tree Simulator */}
      <section className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2">
          <Cpu size={18} className="text-slate-900" />
          <h3 className="font-bold text-base text-slate-900">Interactive Playground: Decision Tree Descriptor Classification</h3>
        </div>
        <p className="text-sm text-slate-800 leading-normal">
          Adjust the sliders to change the chemical descriptors of your test molecule. Watch how the molecule traverses the decision tree splits based on threshold rules to reach an "Active" or "Inactive" classification.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-white p-5 rounded-lg border border-slate-200">
          
          {/* Controls */}
          <div className="md:col-span-5 space-y-5">
            {/* LogP */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-sm text-slate-800 font-bold">
                <span>Lipophilicity (logP)</span>
                <span className="font-extrabold text-slate-900">{logP.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="6.0"
                step="0.1"
                value={logP}
                onChange={(e) => setLogP(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-slate-900"
              />
            </div>

            {/* MW */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-sm text-slate-800 font-bold">
                <span>Molecular Weight (Da)</span>
                <span className="font-extrabold text-slate-900">{mw} Da</span>
              </div>
              <input
                type="range"
                min="150"
                max="600"
                step="10"
                value={mw}
                onChange={(e) => setMw(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-slate-900"
              />
            </div>

            {/* HBD */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-sm text-slate-800 font-bold">
                <span>H-Bond Donors</span>
                <span className="font-extrabold text-slate-900">{hbd}</span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                step="1"
                value={hbd}
                onChange={(e) => setHbd(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-slate-900"
              />
            </div>

            <div className="p-3 bg-slate-50 border border-slate-250 rounded-lg space-y-0.5">
              <span className="text-xs text-slate-800 font-bold block uppercase">Predicted Class</span>
              <p className="text-lg font-black">
                {resultActive ? (
                  <span className="text-emerald-700">Active Compound</span>
                ) : (
                  <span className="text-red-700">Inactive / Toxic</span>
                )}
              </p>
            </div>
          </div>

          {/* Tree Visualization SVG */}
          <div className="md:col-span-7 flex justify-center">
            <div className="w-full max-w-[280px] aspect-square relative bg-slate-50 border border-slate-200 rounded-lg p-4">
              <svg viewBox="0 0 160 160" className="w-full h-full">
                
                {/* Node 1: Root */}
                <rect x="55" y="10" width="50" height="20" rx="3" fill="none" stroke="currentColor" className="text-slate-400" strokeWidth="1" />
                <text x="80" y="22" textAnchor="middle" fill="currentColor" className="text-slate-800 font-bold" fontSize="6.5" fontWeight="bold">logP &le; 4.0?</text>

                {/* Left/Right branches from Root */}
                <line x1="80" y1="30" x2="45" y2="60" stroke="currentColor" className={step1Passed ? "text-slate-200" : "text-slate-900"} strokeWidth={step1Passed ? "0.8" : "1.8"} />
                <line x1="80" y1="30" x2="115" y2="60" stroke="currentColor" className={step1Passed ? "text-slate-900" : "text-slate-200"} strokeWidth={step1Passed ? "1.8" : "0.8"} />
                <text x="50" y="45" fill="currentColor" className="text-slate-800 font-bold" fontSize="6.5">No</text>
                <text x="108" y="45" fill="currentColor" className="text-slate-800 font-bold" fontSize="6.5">Yes</text>

                {/* Node 2 Left: HBD */}
                <rect x="20" y="60" width="50" height="20" rx="3" fill="none" stroke="currentColor" className="text-slate-400" strokeWidth="1" />
                <text x="45" y="72" textAnchor="middle" fill="currentColor" className="text-slate-800 font-bold" fontSize="6.5" fontWeight="bold">HBD &ge; 3?</text>

                {/* Node 2 Right: MW */}
                <rect x="90" y="60" width="50" height="20" rx="3" fill="none" stroke="currentColor" className="text-slate-400" strokeWidth="1" />
                <text x="115" y="72" textAnchor="middle" fill="currentColor" className="text-slate-800 font-bold" fontSize="6.5" fontWeight="bold">MW &le; 450 Da?</text>

                {/* Leaves under Node 2 Left */}
                <line x1="45" y1="80" x2="25" y2="110" stroke="currentColor" className={!step1Passed && !step2Passed ? "text-slate-900" : "text-slate-200"} strokeWidth={!step1Passed && !step2Passed ? "1.8" : "0.8"} />
                <line x1="45" y1="80" x2="65" y2="110" stroke="currentColor" className={!step1Passed && step2Passed ? "text-slate-900" : "text-slate-200"} strokeWidth={!step1Passed && step2Passed ? "1.8" : "0.8"} />

                {/* Leaves under Node 2 Right */}
                <line x1="115" y1="80" x2="95" y2="110" stroke="currentColor" className={step1Passed && !step2Passed ? "text-slate-900" : "text-slate-200"} strokeWidth={step1Passed && !step2Passed ? "1.8" : "0.8"} />
                <line x1="115" y1="80" x2="135" y2="110" stroke="currentColor" className={step1Passed && step2Passed ? "text-slate-900" : "text-slate-200"} strokeWidth={step1Passed && step2Passed ? "1.8" : "0.8"} />

                {/* Leaf Labels */}
                <circle cx="25" cy="115" r="7" fill="currentColor" className={!step1Passed && !step2Passed ? "text-slate-900" : "text-slate-200"} />
                <text x="25" y="117" textAnchor="middle" fill="currentColor" className={!step1Passed && !step2Passed ? "text-white font-bold" : "text-slate-750 font-semibold"} fontSize="5.5" fontWeight="bold">Act</text>
                
                <circle cx="65" cy="115" r="7" fill="currentColor" className={!step1Passed && step2Passed ? "text-slate-900" : "text-slate-200"} />
                <text x="65" y="117" textAnchor="middle" fill="currentColor" className={!step1Passed && step2Passed ? "text-white font-bold" : "text-slate-750 font-semibold"} fontSize="5.5" fontWeight="bold">Ina</text>

                <circle cx="95" cy="115" r="7" fill="currentColor" className={step1Passed && !step2Passed ? "text-slate-900" : "text-slate-200"} />
                <text x="95" y="117" textAnchor="middle" fill="currentColor" className={step1Passed && !step2Passed ? "text-white font-bold" : "text-slate-750 font-semibold"} fontSize="5.5" fontWeight="bold">Ina</text>

                <circle cx="135" cy="115" r="7" fill="currentColor" className={step1Passed && step2Passed ? "text-slate-900" : "text-slate-200"} />
                <text x="135" y="117" textAnchor="middle" fill="currentColor" className={step1Passed && step2Passed ? "text-white font-bold" : "text-slate-750 font-semibold"} fontSize="5.5" fontWeight="bold">Act</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Model Curation / Validation Framework */}
      <section className="space-y-4">
        <h2>3. Three-Tier Model Validation Framework</h2>
        <p>
          Building a QSAR model is only half the job. Overfitted models routinely pass basic correlation checks but fail to predict active structures outside the training set. Establishing diagnostic parameters prevents this and validates predictive robustness.
        </p>

        <div className="overflow-x-auto not-prose border border-slate-200 rounded-lg my-4">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-slate-900 font-bold">
              <tr>
                <th className="px-4 py-2.5 text-left">Validation Tier</th>
                <th className="px-4 py-2.5 text-left">Key Metric & Symbol</th>
                <th className="px-4 py-2.5 text-left">Ideal Threshold</th>
                <th className="px-4 py-2.5 text-left">Scientific Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-slate-850">
              <tr>
                <td className="px-4 py-2 font-bold text-emerald-800 bg-emerald-50/20">1. Internal Validation</td>
                <td className="px-4 py-2 font-mono">R²_tr, R²_adj, CCC_tr</td>
                <td className="px-4 py-2 font-semibold">R²_tr ≥ 0.600, CCC_tr &gt; 0.800</td>
                <td className="px-4 py-2">Measures precision & accuracy fit. A large gap between R² and Adjusted R² indicates descriptor noise.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-blue-800 bg-blue-50/20">2. Cross-Validation</td>
                <td className="px-4 py-2 font-mono">Q²_loo, Q²_lmo, Y-Scrambling</td>
                <td className="px-4 py-2 font-semibold">Q² &gt; 0.500, R²_Yscr / Q²_Yscr → 0</td>
                <td className="px-4 py-2">Leave-Many-Out verifies generalizability. <strong>Y-Scrambling</strong> shuffles bio-activity relative to descriptors; metrics must collapse to 0 to verify structural integrity.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-amber-800 bg-amber-50/20">3. External Validation</td>
                <td className="px-4 py-2 font-mono">R²_ex, CCC_ex, RMSE_ex</td>
                <td className="px-4 py-2 font-semibold">R²_ex &gt; 0.600, CCC_ex &gt; 0.850</td>
                <td className="px-4 py-2">The gold standard. Evaluates model performance against a completely unseen test dataset.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900">Concordance Correlation Coefficient (CCC)</h4>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              Unlike normal R² which only measures regression slope correlation, CCC penalizes models that exhibit systematic vertical/horizontal prediction offsets, jointly assessing correlation precision and absolute accuracy.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900">Applicability Domain (AD)</h4>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              Defines the bounding multidimensional chemical descriptor space covered by the training compounds. If a virtual candidate molecule has descriptors falling outside this AD envelope, the model's predictions are extrapolation-prone and cannot be trusted.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 pt-3">
          <h4 className="font-bold text-sm text-slate-900">Validation Pitfall: Random Splitting & Performance Inflation</h4>
          <p className="text-xs text-slate-800 leading-relaxed font-semibold">
            Standard random train/test splitting is highly discouraged in QSAR. Because virtual screening libraries contain structural derivatives (series of compounds built on the same core scaffold), random splitting causes identical or highly similar scaffolds to leak into both training and testing sets. This leads to <strong>inflated performance metrics</strong> (highly optimistic test R² or AUC) while the model collapses when deployed on truly novel chemical scaffolds.
          </p>
          <p className="text-xs text-slate-800 leading-relaxed font-semibold">
            To prevent this structural leakage, computational chemists use advanced splitting protocols:
          </p>
          <ul className="list-disc pl-5 text-xs text-slate-800 space-y-2 font-medium leading-relaxed">
            <li>
              <strong>Bemis-Murcko Scaffold Splitting:</strong> Extracts the core carbon-ring skeletons from all molecules. Molecules sharing the same scaffold are grouped together and sent entirely to either train or test sets. This measures the model's capacity for <strong>scaffold hopping</strong> (extrapolating to new chemical cores).
            </li>
            <li>
              <strong>Butina Clustering &amp; Splitting (Deterministic):</strong> A centroid-based clustering algorithm specifically designed for chemical databases. It clusters molecules based on a Tanimoto similarity threshold. The algorithm counts neighbors for each molecule, sorts them in descending order of neighbor count, and assigns centroids starting from the most connected. Because it has no random initialization centroids, Butina clustering is fully <strong>deterministic</strong>; given the same similarity threshold and sorting, it yields identical clusters every time, making it ideal for reproducible diversity-based dataset splitting.
            </li>
            <li>
              <strong>Cluster-Based Splitting (UMAP + K-Means) (Stochastic):</strong> Compress the 2048-bit Morgan Fingerprints onto a 2D space using <strong>UMAP</strong> to retain global topology, and cluster the coordinate projections using <strong>K-Means</strong>. Entire clusters are held out exclusively as test sets. Unlike Butina, K-Means is a <strong>stochastic</strong> algorithm because its convergence depends on random centroid initialization (e.g. `k-means++` seed), which can yield slightly different clusters across runs if no random seed is locked.
            </li>
            <li>
              <strong>The Jaccard Index / Method:</strong> In mathematical literature, the Tanimoto coefficient applied to binary vectors (like ECFP4 fingerprints) is formally identical to the <strong>Jaccard Similarity</strong>. It measures the size of the intersection of features divided by the size of their union:
              <div className="my-1.5 font-mono text-center text-xs bg-slate-50 py-1.5 rounded text-slate-800 font-bold border border-slate-150">
                {"Jaccard(A, B) = |A ∩ B| / |A ∪ B| = Tanimoto(A, B)"}
              </div>
              Calculating the Jaccard distance (which is 1 minus the Jaccard similarity coefficient) between all pairs in the dataset is the foundation for both Butina clustering and similarity-based applicability domain mapping.
            </li>
          </ul>
        </div>

        {/* OECD Regulatory Framework Callout */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
          <h4 className="font-bold text-sm text-slate-900">OECD Regulatory Framework: 5 Principles for QSAR Validation</h4>
          <p className="text-sm text-slate-800 leading-relaxed font-medium">
            The Organisation for Economic Co-operation and Development (OECD) has established five mandatory principles for the regulatory acceptance of QSAR predictions:
          </p>
          <ol className="list-decimal pl-5 text-sm text-slate-800 space-y-1.5 font-medium leading-relaxed">
            <li><strong>A defined endpoint</strong>: the biological effect being predicted must be clearly specified (e.g., IC50 against hERG, LD50 in rats).</li>
            <li><strong>An unambiguous algorithm</strong>: the mathematical model and its parameters must be fully documented and reproducible.</li>
            <li><strong>A defined domain of applicability</strong>: the chemical space within which the model makes reliable predictions must be explicitly bounded.</li>
            <li><strong>Appropriate measures of goodness-of-fit, robustness, and predictivity</strong>: internal validation (R², Q²), cross-validation, and external test set metrics must all be reported.</li>
            <li><strong>A mechanistic interpretation, if possible</strong>: descriptors should relate to known physicochemical or biological mechanisms driving the activity.</li>
          </ol>
          <p className="text-xs text-amber-800 font-semibold mt-2">
            These principles are mandatory for regulatory acceptance of QSAR predictions in EU REACH chemical safety assessments and FDA submissions for pharmaceutical candidates.
          </p>
        </div>

        {/* Williams Plot Description */}
        <div className="p-4 rounded-xl border border-border bg-white space-y-2">
          <h4 className="font-bold text-sm text-slate-900">Williams Plot: Detecting Structural Outliers</h4>
          <p className="text-sm text-slate-800 leading-relaxed font-medium">
            The Williams Plot is a diagnostic scatter plot used to simultaneously identify structurally influential compounds and poorly predicted compounds. The <strong>X-axis</strong> represents the leverage (hat values, h_i), quantifying how far each compound lies from the centroid of the training set descriptor space. The <strong>Y-axis</strong> represents the standardized residuals (difference between predicted and observed values, scaled by standard deviation).
          </p>
          <p className="text-sm text-slate-800 leading-relaxed font-medium">
            Mathematically, the leverage <span className="font-semibold">h_i</span> of a query compound represented by descriptor vector <span className="font-mono">x_i</span> is calculated using the hat matrix diagonal:
          </p>
          <div className="my-2 font-mono text-center text-xs bg-slate-50 py-1.5 rounded text-slate-800 font-bold border border-slate-200">
            {"h_i = x_i × (X^T × X)^(-1) × x_i^T"}
          </div>
          <p className="text-sm text-slate-800 leading-relaxed font-medium">
            Where <span className="font-semibold">X</span> is the training set descriptor matrix. The critical warning limit is defined as <strong>h* = 3p/n</strong>, where p is the number of model parameters (descriptors) plus 1, and n is the number of training compounds. Compounds with h &gt; h* lie outside the applicability domain of the model, meaning predictions for them represent extrapolation rather than interpolation and are highly unreliable.
          </p>
        </div>

        {/* Classification Metrics Table */}
        <div className="space-y-2">
          <h4 className="font-bold text-sm text-slate-900">Classification Metrics for QSAR Models</h4>
          <div className="overflow-x-auto not-prose border border-slate-200 rounded-lg">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-slate-900 font-bold">
                <tr>
                  <th className="px-4 py-2.5 text-left">Metric</th>
                  <th className="px-4 py-2.5 text-left">Description</th>
                  <th className="px-4 py-2.5 text-left">Ideal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-slate-850">
                <tr>
                  <td className="px-4 py-2 font-bold">Sensitivity (Recall)</td>
                  <td className="px-4 py-2 font-mono text-xs">TP / (TP + FN)</td>
                  <td className="px-4 py-2 font-semibold">Approaches 1.0</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold">Specificity</td>
                  <td className="px-4 py-2 font-mono text-xs">TN / (TN + FP)</td>
                  <td className="px-4 py-2 font-semibold">Approaches 1.0</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold">Precision (PPV)</td>
                  <td className="px-4 py-2 font-mono text-xs">TP / (TP + FP)</td>
                  <td className="px-4 py-2 font-semibold">Approaches 1.0</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold">F1 Score</td>
                  <td className="px-4 py-2">Harmonic mean of Precision and Recall</td>
                  <td className="px-4 py-2 font-semibold">Approaches 1.0</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold">MCC</td>
                  <td className="px-4 py-2">Matthews Correlation Coefficient, range -1 to +1</td>
                  <td className="px-4 py-2 font-semibold">MCC &gt; 0.4</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold">Cohen&apos;s Kappa</td>
                  <td className="px-4 py-2">Agreement corrected for chance</td>
                  <td className="px-4 py-2 font-semibold">Kappa &gt; 0.6</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Regression Metrics Table */}
        <div className="space-y-2">
          <h4 className="font-bold text-sm text-slate-900">Regression Metrics for QSAR Models</h4>
          <div className="overflow-x-auto not-prose border border-slate-200 rounded-lg">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-slate-900 font-bold">
                <tr>
                  <th className="px-4 py-2.5 text-left">Metric</th>
                  <th className="px-4 py-2.5 text-left">Description</th>
                  <th className="px-4 py-2.5 text-left">Ideal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-slate-850">
                <tr>
                  <td className="px-4 py-2 font-bold">R-squared (R²)</td>
                  <td className="px-4 py-2">Proportion of variance explained by the model</td>
                  <td className="px-4 py-2 font-semibold">Approaches 1.0</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold">RMSE</td>
                  <td className="px-4 py-2">Root mean square error</td>
                  <td className="px-4 py-2 font-semibold">Approaches 0</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold">MAE</td>
                  <td className="px-4 py-2">Mean absolute error</td>
                  <td className="px-4 py-2 font-semibold">Approaches 0</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold">CCC</td>
                  <td className="px-4 py-2">Concordance Correlation Coefficient</td>
                  <td className="px-4 py-2 font-semibold">CCC &gt; 0.85</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Consensus Modeling & Probability-Based AD */}
        <div className="p-4 rounded-xl border border-border bg-white space-y-2">
          <h4 className="font-bold text-sm text-slate-900">Consensus Modeling &amp; Probability-Based Applicability Domain</h4>
          <p className="text-sm text-slate-800 leading-relaxed font-medium">
            Instead of relying on a single algorithm, consensus modeling combines predictions from multiple independently trained models (e.g., Random Forest, SVM, Gradient Boosting) on the same training data. For <strong>regression tasks</strong>, the final prediction is the average of individual model outputs. For <strong>classification tasks</strong>, majority voting determines the predicted class.
          </p>
          <p className="text-sm text-slate-800 leading-relaxed font-medium">
            <strong>Probability-based AD:</strong> For ensemble classifiers like Random Forest, the <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">predict_proba()</code> method returns class probabilities. If the maximum probability for any class falls below 0.80, the compound is considered outside the model&apos;s reliable prediction zone, an implicit applicability domain filter based on model confidence rather than chemical space distance.
          </p>
          <p className="text-sm text-slate-800 leading-relaxed font-medium">
            <strong>Feature importance:</strong> To interpret which descriptors drive predictions, <strong>permutation importance</strong> randomly shuffles each feature column and measures the resulting drop in model performance. Features causing the largest performance degradation are the most influential for the model&apos;s decisions.
          </p>
        </div>
      </section>

      {/* Interactive Widget 2: PCA Applicability Domain Sandbox */}
      <section className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2">
          <Compass size={18} className="text-slate-900" />
          <h3 className="font-bold text-base text-slate-900">Interactive Playground: PCA Chemical Space & Applicability Domain</h3>
        </div>
        <p className="text-sm text-slate-800">
          A machine learning model cannot make reliable predictions outside its training envelope. We compress multidimensional descriptors onto a 2D Principal Component Analysis (PCA) projection.
          <strong> Drag the yellow star (Test Compound)</strong> on the plot (or use the sliders) to see how its position relative to the 95% confidence boundary (the green shaded ellipse) dictates leverage (h) and prediction reliability!
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-5 rounded-lg border border-slate-200">
          
          {/* Interactive SVG PCA Chart */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full relative bg-slate-100 border border-slate-200 rounded-lg p-2 select-none overflow-hidden">
              <svg 
                ref={svgRef}
                viewBox="0 0 300 200" 
                className="w-full h-auto cursor-crosshair touch-none"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
              >
                {/* Center Axes (0, 0) */}
                <line x1="30" y1={centerY} x2="270" y2={centerY} stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2,2" />
                <line x1={centerX} y1="20" x2={centerX} y2="180" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2,2" />

                {/* Graph Axes Boundaries */}
                <line x1="30" y1="180" x2="270" y2="180" stroke="#475569" strokeWidth="1" />
                <line x1="30" y1="20" x2="30" y2="180" stroke="#475569" strokeWidth="1" />

                {/* Grid ticks for PC1 */}
                {[-3, -2, -1, 1, 2, 3].map((val) => {
                  const x = centerX + val * scaleX;
                  return (
                    <g key={val}>
                      <line x1={x} y1="177" x2={x} y2="180" stroke="#475569" strokeWidth="1" />
                      <text x={x} y="188" textAnchor="middle" fill="#475569" className="text-[6px] font-bold">{val}</text>
                    </g>
                  );
                })}
                {/* Grid ticks for PC2 */}
                {[-2, -1, 1, 2].map((val) => {
                  const y = centerY - val * scaleY;
                  return (
                    <g key={val}>
                      <line x1="30" y1={y} x2="33" y2={y} stroke="#475569" strokeWidth="1" />
                      <text x="25" y={y + 2} textAnchor="end" fill="#475569" className="text-[6px] font-bold">{val}</text>
                    </g>
                  );
                })}

                {/* Labels */}
                <text x="270" y="108" textAnchor="end" fill="#475569" className="text-[7px] font-black">PC1 (Lipophilicity & MW)</text>
                <text x="156" y="27" textAnchor="start" fill="#475569" className="text-[7px] font-black">PC2 (Polarity & H-Bonds)</text>

                {/* Shaded Applicability Domain Ellipse (95% CI Boundary) */}
                {/* PC units: a = 2.0 (rx = 60px), b = 1.2 (ry = 30px) */}
                <ellipse 
                  cx={centerX} 
                  cy={centerY} 
                  rx={a * scaleX} 
                  ry={b * scaleY} 
                  fill="#d1fae5" 
                  fillOpacity="0.45" 
                  stroke="#10b981" 
                  strokeWidth="1.5" 
                  strokeDasharray="4,2" 
                />
                
                {/* Ellipse Limit Label */}
                <text x={centerX + 1.2 * scaleX} y={centerY - 0.9 * scaleY} fill="#047857" className="text-[6.5px] font-extrabold">95% Applicability Envelope</text>

                {/* Plot Static Training Compounds */}
                {trainingPoints.map((pt, idx) => (
                  <circle 
                    key={idx} 
                    cx={pt.x} 
                    cy={pt.y} 
                    r="3" 
                    fill="#10b981" 
                    fillOpacity="0.75" 
                    stroke="#047857" 
                    strokeWidth="0.5" 
                  />
                ))}

                {/* Projection Lines for Test Compound */}
                <line x1={testX} y1={testY} x2={testX} y2={centerY} stroke="#64748b" strokeWidth="0.7" strokeDasharray="2,1" />
                <line x1={testX} y1={testY} x2={centerX} y2={testY} stroke="#64748b" strokeWidth="0.7" strokeDasharray="2,1" />

                {/* Interactive Test Compound Star */}
                <g transform={`translate(${testX}, ${testY})`}>
                  {/* Outer pulsating aura */}
                  <circle r="7" fill={insideDomain ? "#10b981" : "#ef4444"} fillOpacity="0.2" className="animate-ping" />
                  {/* Star shape path */}
                  <path 
                    d="M0,-6 L1.8,-1.8 L6.2,-1.8 L2.7,1.2 L4,5.4 L0,2.8 L-4,5.4 L-2.7,1.2 L-6.2,-1.8 L-1.8,-1.8 Z" 
                    fill="#eab308" 
                    stroke="#a16207" 
                    strokeWidth="1" 
                  />
                </g>
              </svg>
            </div>

            {/* Coordinate Fine-Tuning Sliders */}
            <div className="w-full grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>PC1 Coordinate</span>
                  <span className="font-mono">{pc1.toFixed(2)}</span>
                </div>
                <input 
                  type="range"
                  min="-3.5"
                  max="3.5"
                  step="0.05"
                  value={pc1}
                  onChange={(e) => setPc1(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded appearance-none cursor-pointer accent-slate-900"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>PC2 Coordinate</span>
                  <span className="font-mono">{pc2.toFixed(2)}</span>
                </div>
                <input 
                  type="range"
                  min="-3.0"
                  max="3.0"
                  step="0.05"
                  value={pc2}
                  onChange={(e) => setPc2(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded appearance-none cursor-pointer accent-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Diagnostics Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            <div className="space-y-3.5">
              <h4 className="font-extrabold text-sm uppercase tracking-wider text-slate-900 border-b pb-1.5 border-slate-200">
                Leverage & Domain Check
              </h4>

              <div className="space-y-2 text-xs font-bold text-slate-800">
                <div className="flex justify-between py-0.5">
                  <span>Calculated Mahalanobis Distance (d²):</span>
                  <span className="font-mono text-slate-950">{distanceSq.toFixed(3)}</span>
                </div>
                <div className="flex justify-between py-0.5 border-t border-slate-100 pt-1.5">
                  <span>Chemical Space State:</span>
                  <span className={insideDomain ? "text-emerald-700" : "text-red-700 font-extrabold animate-pulse"}>
                    {insideDomain ? "✓ INSIDE Envelope" : "⚠ OUTSIDE Envelope (Outlier)"}
                  </span>
                </div>
              </div>

              {/* Leverage Meter Visual */}
              <div className="space-y-1 pt-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Calculated Leverage (h) vs Limit (h*)</span>
                  <span>{h.toFixed(3)} / {hStar.toFixed(3)}</span>
                </div>
                {/* Slider visual representing scale */}
                <div className="w-full h-3.5 bg-slate-100 rounded border border-slate-200 relative overflow-hidden">
                  {/* Shaded domain portion (0.0 to 0.20) */}
                  <div className="absolute top-0 bottom-0 left-0 bg-emerald-100 border-r border-emerald-400" style={{ width: '60%' }} />
                  {/* Warning portion (0.20 to 0.33+) */}
                  <div className="absolute top-0 bottom-0 right-0 bg-red-50" style={{ width: '40%' }} />
                  {/* Critical leverage line marker */}
                  <div className="absolute top-0 bottom-0 border-l border-red-650 z-10" style={{ left: '60%' }} />
                  {/* Active Leverage marker pin */}
                  <div 
                    className="absolute top-0 bottom-0 w-2.5 bg-amber-500 border border-amber-600 rounded-sm z-20 transition-all duration-150"
                    style={{ left: `${Math.min((h / 0.33) * 100, 96)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-slate-800 font-extrabold pt-0.5">
                  <span>0.00 (Center)</span>
                  <span className="text-red-650 font-bold">Limit h* = 0.20</span>
                  <span>0.33+ (High Extrapol)</span>
                </div>
              </div>
            </div>

            {/* Reliability Status Box */}
            <div className={`p-4 rounded-xl border space-y-2 ${insideDomain ? "bg-emerald-50 border-emerald-200 text-emerald-950" : "bg-red-50 border-red-200 text-red-950"}`}>
              <div className="flex items-center gap-2">
                {insideDomain ? (
                  <CheckCircle size={16} className="text-emerald-700" />
                ) : (
                  <AlertTriangle size={16} className="text-red-700 animate-bounce" />
                )}
                <span className="font-extrabold text-sm">
                  {insideDomain ? "Prediction Confidence: HIGH" : "OUTLIER WARNING!"}
                </span>
              </div>
              <p className="text-xs leading-relaxed font-semibold">
                {insideDomain ? (
                  "The test compound coordinates lie within the applicability envelope. The ML algorithm can interpolate predictions reliably based on training coordinates. Estimated bioactivity (e.g. pIC50 = 6.3) is highly precise."
                ) : (
                  "The compound's leverage exceeds the warning limit (h > h*). It represents a chemical structure fundamentally different from the training set. The model's regression output is highly speculative and prone to extreme prediction errors."
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Evolution of Graph Neural Networks */}
      <section className="space-y-4">
        <h2>4. The Deep Learning Paradigm: Graph Neural Networks (GNNs)</h2>
        <p>
          While classical QSAR maps molecules to fixed binary fingerprints, modern drug discovery has migrated to Graph Neural Networks (GNNs). A small molecule is naturally represented as a graph where atoms are nodes and chemical bonds are edges.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2 not-prose">
          <div className="border border-border rounded-xl p-5 bg-white space-y-2">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[10px] uppercase">1D/2D Molecular Graphs</span>
            <p className="text-sm text-slate-900 font-bold">End-to-End Representation Learning</p>
            <p className="text-sm leading-relaxed text-slate-800">
              Instead of manual fingerprint templates, algorithms like Graph Convolutional Networks (GCN) or Message Passing Neural Networks (MPNN) iteratively propagate feature matrices along chemical bonds. Atoms learn from local neighboring shells, optimizing representations dynamically for solubility (logS) and toxicity endpoints.
            </p>
          </div>
          <div className="border border-border rounded-xl p-5 bg-white space-y-2">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px] uppercase">3D Protein-Ligand Interaction Graphs</span>
            <p className="text-sm text-slate-900 font-bold">Encoding the Receptor Environment</p>
            <p className="text-sm leading-relaxed text-slate-800">
              Modern GNNs merge ligand and protein coordinates into a unified spatial graph. Edge features carry precise 3D distances and physical interaction types (hydrogen bonds, pi-pi stacking, hydrophobic contacts). Attention weights (e.g. Graph Attention Networks - GAT) are learned to prioritize critical contacts.
            </p>
          </div>
        </div>

        <div className="p-4 border-l-4 border-slate-900 bg-blue-50/50 rounded-r-xl space-y-1.5 text-sm">
          <strong className="text-slate-950 block">Ensemble Poses & Multiple Instance Learning (ABMIL):</strong>
          <p className="text-slate-800 leading-relaxed font-semibold">
            Docking algorithms generate multiple pose conformers rather than a single static complex. To classify activity from this ensemble, advanced pipelines treat each docked pose as a distinct graph instance. An <strong>Attention-Based Multiple Instance Learning (ABMIL)</strong> layer then pools the pose embeddings, learning dynamically which pose conformation drives binding affinity and classifying the active pose automatically.
          </p>
        </div>

        {/* Additional Deep Learning Architecture Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-2 not-prose">
          <div className="border border-border rounded-xl p-5 bg-white space-y-2">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-semibold text-[10px] uppercase">Convolutional</span>
            <p className="text-sm text-slate-900 font-bold">Convolutional Neural Networks (CNNs)</p>
            <p className="text-sm leading-relaxed text-slate-800">
              Applied to SMILES-encoded or molecular image inputs. 1D convolutions extract local n-gram patterns from SMILES character strings, capturing substructural motifs without explicit fingerprint engineering. 2D CNNs can also process rendered molecular images for visual feature extraction.
            </p>
          </div>
          <div className="border border-border rounded-xl p-5 bg-white space-y-2">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 font-semibold text-[10px] uppercase">Feed-Forward</span>
            <p className="text-sm text-slate-900 font-bold">Multi-Layer Perceptrons (MLPs / ANNs)</p>
            <p className="text-sm leading-relaxed text-slate-800">
              Classic feed-forward networks with one or more hidden layers. Universal approximators for descriptor-to-activity mappings. Often used as baseline deep learning models, taking precomputed fingerprints or physicochemical descriptors as fixed-length input vectors.
            </p>
          </div>
          <div className="border border-border rounded-xl p-5 bg-white space-y-2">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 font-semibold text-[10px] uppercase">Sequential</span>
            <p className="text-sm text-slate-900 font-bold">Recurrent Neural Networks (RNNs / LSTMs)</p>
            <p className="text-sm leading-relaxed text-slate-800">
              Process SMILES strings character-by-character, capturing long-range dependencies in molecular syntax. LSTM (Long Short-Term Memory) variants prevent vanishing gradients. Widely used in generative chemistry frameworks like REINVENT to generate novel molecules with desired activity profiles.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: ADMET, SHAP, & Hybrid Modeling */}
      <section className="space-y-4">
        <h2>5. In Silico ADMET, Explainable AI, & Hybrid Phenotypic Modeling</h2>
        <p>
          While classical QSAR models general binding affinity, modern drug discovery requires optimization for Absorption, Distribution, Metabolism, Excretion, and Toxicity (ADMET) endpoints to prevent clinical trial failures.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900">Key ADMET Safety Targets</h4>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              Important clinical parameters modeled in modern pipelines include:
            </p>
            <ul className="list-disc pl-5 text-xs text-slate-800 space-y-1 font-medium">
              <li><strong>hERG Inhibition:</strong> Potassium channel block causing cardiotoxicity. Modeled using regression (IC<sub>50</sub> values).</li>
              <li><strong>Mitochondrial Toxicity:</strong> A major driver of drug-induced liver injury (DILI). Evaluated via binary classification.</li>
              <li><strong>Volume of Distribution (Vdss) & Clearance (CL):</strong> Pharmacokinetic parameters indicating tissue distribution and elimination rate.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900">Hybrid Phenotypic Modeling</h4>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              Rather than relying solely on 2D fingerprints, modern models integrate <strong>biological phenotypic descriptors</strong> derived from <strong>Cell Painting</strong> high-content screening. Morphological changes in cells treated with the drug are imaged, vectorized, and concatenated with chemical descriptors, boosting the prediction accuracy of clinical pharmacokinetic endpoints (like clearance and Vdss).
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <h4 className="font-bold text-sm text-slate-900">Explainable AI (XAI) using SHAP</h4>
          <p>
            Machine learning ensembles (like Random Forests or Gradient Boosting) are complex black boxes. To explain model predictions, chemists use <strong>SHAP (SHapley Additive exPlanations)</strong> values. SHAP decomposes a prediction into additive contributions from individual features. For a given molecule, it highlights which chemical fragments or functional groups (e.g. an aliphatic amine or halogen atom) positive-shift (increase toxicity) or negative-shift (improve clearance) the model's output.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <h4 className="font-bold text-sm text-slate-900">Coding Similarity-Based Applicability Domains</h4>
          <p>
            In addition to leverage-based applicability domains, models also use <strong>similarity-based applicability domains</strong>. This involves calculating the maximum Tanimoto similarity of a test compound against all compounds in the training set (`max_similarity_to_train`). If the similarity drops below a threshold (e.g., Tc &lt; 0.70), the model's error (RMSE) degrades significantly.
          </p>
          <p>
            Below is a Python RDKit code block showing how to calculate similarity metrics to define an applicability domain envelope:
          </p>
        </div>
             {/* User-Friendly Explanations Callout */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-semibold text-slate-800 space-y-2 my-2">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Info className="h-4 w-4 text-blue-600" /> Script Architecture Deep Dive:
          </span>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>AllChem.GetMorganFingerprintAsBitVect:</strong> Encodes the molecular topology into a 2048-bit structural fingerprint vector.</li>
            <li><strong>DataStructs.BulkTanimotoSimilarity:</strong> Computes the Tanimoto overlap coefficient (shared bits divided by total active bits) between the test molecule and all training set vectors in one highly optimized step.</li>
            <li><strong>max_similarity_to_train:</strong> Finds the single nearest neighbor in the training library. If the similarity is below 0.70, the compound is outside the model's safe interpolation domain.</li>
          </ul>
        </div>

        <CollapsibleCode
          title="Python Similarity-Based Applicability Domain Script"
          code={`from rdkit import Chem
from rdkit.Chem import AllChem
from rdkit import DataStructs
import numpy as np

def calculate_similarity_domain(test_smiles: str, training_smiles_list: list) -> dict:
    # -----------------------------------------------------------------
    # STEP 1: CONVERT TEST SMILES AND COMPUTE BIT VECTOR FINGERPRINT
    # -----------------------------------------------------------------
    test_mol = Chem.MolFromSmiles(test_smiles)
    test_fp = AllChem.GetMorganFingerprintAsBitVect(test_mol, radius=2, nBits=2048)
    
    # -----------------------------------------------------------------
    # STEP 2: COMPILE FINGERPRINTS FOR THE ENTIRE TRAINING ENVELOPE
    # -----------------------------------------------------------------
    train_fps = []
    for smiles in training_smiles_list:
        mol = Chem.MolFromSmiles(smiles)
        if mol:
            fp = AllChem.GetMorganFingerprintAsBitVect(mol, radius=2, nBits=2048)
            train_fps.append(fp)
            
    # -----------------------------------------------------------------
    # STEP 3: RUN BULK SIMILARITY MATCHES OVER TRAINING LIBRARY
    # -----------------------------------------------------------------
    # BulkTanimotoSimilarity compares test_fp against every entry in train_fps
    similarities = DataStructs.BulkTanimotoSimilarity(test_fp, train_fps)
    
    # Retrieve the highest individual similarity (nearest neighbor in training set)
    max_sim = max(similarities)
    
    # Calculate the average similarity of the top 3 nearest neighbors
    mean_top3_sim = np.mean(sorted(similarities, reverse=True)[:3])
    
    # -----------------------------------------------------------------
    # STEP 4: CHECK BOUNDARY CONDITIONS (THRESHOLD Tc >= 0.70)
    # -----------------------------------------------------------------
    # If the test compound is sufficiently similar to the training set,
    # it lies within the model's Applicability Domain (AD).
    in_domain = max_sim >= 0.70
    
    return {
        "max_similarity_to_train": max_sim,
        "mean_top3_similarity_to_train": mean_top3_sim,
        "in_applicability_domain": in_domain
    }`}
        />
      </section>

      {/* Quiz Section */}
      <hr className="border-slate-200 my-8" />
      <Quiz 
        moduleTitle="Module 7: QSAR Modeling & AI Interpretation"
        questions={[
          {
            question: "What is the primary scientific goal of running a Y-scrambling validation check?",
            options: [
              "To verify that the descriptors are normalized according to physical scaling laws.",
              "To randomly shuffle descriptor values to check for feature scaling errors.",
              "To randomly shuffle target bioactivity values against structural descriptors, confirming the model collapses to R² / Q² ≈ 0 and is not memorizing structural noise.",
              "To check whether the test dataset matches the applicability domain envelope."
            ],
            correctIndex: 2,
            explanation: "Y-scrambling randomly shuffles target bioactivity values relative to structural descriptors and retrains the model. If a model still achieves high correlation statistics after scrambling target variables, it is a red flag indicating the model is capturing database artifacts or noise rather than a physical structure-activity correlation."
          },
          {
            question: "Why is the Concordance Correlation Coefficient (CCC) considered a more diagnostic metric than R² for QSAR regression models?",
            options: [
              "CCC operates on a logarithmic scale, which stabilizes extreme outliers.",
              "R² only measures correlation slope, whereas CCC jointly measures precision and accuracy, penalizing models that are systematically offset or biased.",
              "CCC defines the multidimensional applicability domain boundaries.",
              "CCC requires leaving out large fractions of the dataset during training."
            ],
            correctIndex: 1,
            explanation: "The coefficient of determination (R²) only checks for linear correlation (regression slope). A model can be systematically biased (predicting everything 2 units too high) and still have a high R². The Concordance Correlation Coefficient (CCC) penalizes these offsets by jointly measuring both precision and absolute translation accuracy."
          },
          {
            question: "In modern graph neural networks, how does Multiple Instance Learning (ABMIL) solve the multi-pose docking challenge?",
            options: [
              "It runs molecular dynamics on all poses simultaneously and calculates the averaged RMSD.",
              "It filters out any poses with an RMSD > 2.0 Å before the graph model starts.",
              "It treats each docked pose as a separate graph instance, using learned attention weights to pool pose embeddings and identify the active binding conformation.",
              "It translates the 3D coordinates into 1D SMILES strings to run sequence transformers."
            ],
            correctIndex: 2,
            explanation: "Docking yields multiple pose hypotheses. Rather than picking one pose by arbitrary score, ABMIL represents each pose as a graph instance and passes them into the GNN. The attention mechanism dynamically weights each pose, learning which conformation matches the active footprint and aggregating them into a single compound-level prediction."
          }
        ]}
      />
    </div>
  );
}
