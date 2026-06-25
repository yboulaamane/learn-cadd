"use client";

import React, { useState } from "react";
import { 
  Zap, 
  Info, 
  Sliders, 
  CheckCircle, 
  AlertTriangle, 
  ShieldAlert, 
  Award, 
  BarChart3, 
  Activity, 
  Settings,
  Sparkles
} from "lucide-react";
import { Quiz } from "@/components/Quiz";
import { CollapsibleCode } from "@/components/CollapsibleCode";

interface CompoundToxData {
  name: string;
  smiles: string;
  cardioProb: number;
  hepatoProb: number;
  mutagenProb: number;
  properties: {
    mw: number;
    logP: number;
    basicNitrogens: number;
  };
  shapFeatures: {
    feature: string;
    impact: number; // positive = toxic force, negative = safety force
    description: string;
  }[];
}

const COMPOUNDS_DATABASE: CompoundToxData[] = [
  {
    name: "Terfenadine",
    smiles: "CC(C)(C)C1=CC=C(C=C1)C(O)CCCN2CCC(CC2)C(O)(C3=CC=CC=C3)C4=CC=CC=C4",
    cardioProb: 0.94,
    hepatoProb: 0.58,
    mutagenProb: 0.05,
    properties: {
      mw: 471.7,
      logP: 6.2,
      basicNitrogens: 1
    },
    shapFeatures: [
      { feature: "Basic Tertiary Amine", impact: 0.45, description: "Fits the hERG channel electrostatic cavity, triggering severe block risk." },
      { feature: "High Lipophilicity (LogP > 5)", impact: 0.25, description: "Promotes non-specific membrane accumulation and off-target bindings." },
      { feature: "Hydrophobic Phenyl Rings", impact: 0.15, description: "Forms stable hydrophobic interactions with aromatic residues inside the hERG vestibule." },
      { feature: "No Electrophilic Alerts", impact: -0.10, description: "Reduces mutagenicity/DNA-alkylating potential close to zero." }
    ]
  },
  {
    name: "Acetaminophen (Paracetamol)",
    smiles: "CC(=O)NC1=CC=C(O)C=C1",
    cardioProb: 0.08,
    hepatoProb: 0.82,
    mutagenProb: 0.12,
    properties: {
      mw: 151.2,
      logP: 0.46,
      basicNitrogens: 0
    },
    shapFeatures: [
      { feature: "Quinone-Imine Precursor", impact: 0.55, description: "Metabolic oxidation yields highly reactive NAPQI, causing cellular oxidative stress and DILI." },
      { feature: "Phenol Hydroxyl Group", impact: 0.20, description: "Subject to phase-II conjugation but also direct oxidation paths generating free radical intermediates." },
      { feature: "Low Lipophilicity", impact: -0.15, description: "Prevents hERG channel binding and membrane toxicity." },
      { feature: "Small Molecular Size", impact: -0.10, description: "Facilitates rapid clearance pathways in healthy liver tissue." }
    ]
  },
  {
    name: "Aspirin (Acetylsalicylic Acid)",
    smiles: "CC(=O)OC1=CC=CC=C1C(=O)O",
    cardioProb: 0.04,
    hepatoProb: 0.15,
    mutagenProb: 0.02,
    properties: {
      mw: 180.2,
      logP: 1.19,
      basicNitrogens: 0
    },
    shapFeatures: [
      { feature: "Ester Cleavage Site", impact: -0.25, description: "Rapidly hydrolyzed in vivo to salicylate, preventing accumulation and reactive metabolism." },
      { feature: "Polar Carboxylate Group", impact: -0.20, description: "Charged state at physiological pH minimizes cellular membrane penetration and off-target cardiotoxicity." },
      { feature: "Salicylate Core", impact: 0.05, description: "Weak acidic profile with low liver toxicity at standard dosage." },
      { feature: "No Reactive Elements", impact: -0.15, description: "Reduces overall mutagenicity profile to background levels." }
    ]
  }
];

export default function InSilicoToxicologyPage() {
  const [selectedComp, setSelectedComp] = useState<CompoundToxData>(COMPOUNDS_DATABASE[0]);
  const [informationGain, setInformationGain] = useState<number>(65); // Slider representing information added by Cell Painting

  // DeLong test calculations based on slider
  const modelAAuc = 0.72; // Morgan fingerprints baseline
  const modelBAuc = 0.72 + (informationGain / 400); // Consensus with Cell Painting
  
  // Calculate DeLong statistics
  const getDeLongStats = () => {
    // Correlated model predictions have covariance
    const varianceA = 0.0012;
    const varianceB = 0.0010 - (informationGain * 0.000004);
    const covariance = 0.0006;
    
    const diff = modelBAuc - modelAAuc;
    const standardError = Math.sqrt(varianceA + varianceB - 2 * covariance);
    const zScore = diff / standardError;
    
    // Normal distribution p-value approximation
    const pValue = 2 * (1 - pNorm(Math.abs(zScore)));
    
    return {
      aucA: modelAAuc.toFixed(3),
      aucB: modelBAuc.toFixed(3),
      z: zScore.toFixed(2),
      p: pValue < 0.0001 ? "< 0.0001" : pValue.toFixed(4),
      significant: pValue < 0.05
    };
  };

  // Helper function: Normal CDF approximation
  function pNorm(z: number) {
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp(-z * z / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.7814779 + t * (-1.821256 + t * 1.330274))));
    return z > 0 ? 1 - p : p;
  }

  const stats = getDeLongStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1>Module 10: In Silico Toxicology &amp; Safety Assessment</h1>
        <p className="lead text-slate-600">
          Identify and predict drug safety endpoints using machine learning. Explore cardiotoxicity, hepatotoxicity, and mutagenicity, compare models with DeLong's test, and interpret alerts using SHAP values.
        </p>
      </div>

      <hr className="border-slate-100 dark:border-slate-900" />

      {/* Section 1: Predictive Toxicology */}
      <section className="space-y-4">
        <h2>1. Critical Safety Endpoints in Drug Discovery</h2>
        <p>
          Up to <strong>30% of drug candidates fail</strong> in clinical trials due to safety and toxicity issues. Discovery toxicology leverages in silico models to predict hazard profiles early, filtering out toxic compounds before they reach animal or human testing. Three primary endpoints dominate chemical safety screening:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-2">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4 text-red-500" />
              Cardiotoxicity (hERG)
            </h4>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              Blockade of the potassium voltage-gated channel <strong>hERG</strong> delays cardiac repolarization, causing QT interval prolongation and potentially fatal arrhythmias. Models predict structural binding affinity to hERG using regression or classification.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-white space-y-2">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Hepatotoxicity (DILI)
            </h4>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              <strong>Drug-Induced Liver Injury (DILI)</strong> is a leading cause of drug withdrawals. Hepatotoxicity arises from metabolic activation (e.g. generating reactive quinone-imines), mitochondrial dysfunction, or bile duct obstruction, modeled using binary classifiers.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-white space-y-2">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-indigo-500" />
              Mutagenicity (Ames Test)
            </h4>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              Mutagenic compounds react with DNA, causing genetic lesions that lead to carcinogenicity. In silico models identify structural electrophilic alerts (e.g. aromatic nitro groups, alkyl halides) that correlate with a positive bacterial Ames test.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Explainable AI and SHAP */}
      <section className="space-y-4 border-t border-border pt-8">
        <h2>2. Explainable AI: Demystifying Toxicophores with SHAP</h2>
        <p>
          Historically, machine learning models in toxicology were viewed as black boxes. Modern regulatory bodies require model predictions to be interpretable. <strong>SHAP (SHapley Additive exPlanations)</strong>, derived from cooperative game theory, provides a solution by assigning each molecular descriptor a value that quantifies its contribution to the final prediction.
        </p>
        <p>
          In cooperative game theory, Shapley values distribute a total payoff fairly among players based on their marginal contributions. In machine learning, the "payoff" is the model prediction, and the "players" are the individual molecular features. The Shapley value for a feature <span className="font-semibold">i</span> is defined as:
        </p>
        <div className="my-3 font-mono text-center text-xs bg-slate-50 py-2 rounded text-slate-805 font-bold border border-slate-200">
          {"φ_i = Σ [ (|S|! × (|F| - |S| - 1)!) / |F|! ] × [ f(S ∪ {i}) - f(S) ]"}
        </div>
        <p className="text-sm text-slate-800 leading-relaxed font-medium">
          Where <span className="font-semibold">F</span> is the set of all features, <span className="font-semibold">S</span> is a subset of features excluding feature <span className="font-semibold">i</span>, and <span className="font-semibold">f(S)</span> is the prediction function. This checks every possible permutation of features to isolate the independent effect of a single chemical bit. In chemoinformatics, SHAP analysis maps these values back onto a molecule's 2D structure, highlighting exactly which chemical bits increase the probability of toxicity (toxicophores) and which structural fragments lower the risk.
        </p>
      </section>

      {/* Section 3: User Friendly Code Block */}
      <section className="space-y-4 border-t border-border pt-8">
        <h2>3. Step-by-Step Toxicology Modeling &amp; SHAP Interpretation</h2>
        <p>
          Below is a highly documented Python implementation using RDKit, Scikit-learn, and SHAP to train a toxicity classifier, compute model applicability domains, and extract chemical explanations:
        </p>

        {/* Detailed Annotations */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm space-y-4">
          <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
            <Info className="h-4.5 w-4.5 text-blue-600" />
            Code Architecture Explained:
          </h4>
          <ul className="list-disc pl-5 space-y-2.5 text-xs text-slate-800 font-medium">
            <li>
              <strong>Lines 1–18 (Data Setup &amp; Fingerprints)</strong>: RDKit parses SMILES strings into connection tables. It calculates circular <strong>Morgan Fingerprints</strong> (radius=2, equivalent to ECFP4) to represent the structure as a binary array of active substructural bits.
            </li>
            <li>
              <strong>Lines 20–23 (Random Forest Training)</strong>: Scikit-learn fits an ensemble classifier containing 100 decision trees. The model learns to establish non-linear relationships between molecular fragments and toxicity.
            </li>
            <li>
              <strong>Lines 25–29 (Model Explainer)</strong>: The tree-based explainer analyzes decision trees to compute Shapley values.
            </li>
            <li>
              <strong>Lines 31–38 (SHAP Value Calculation)</strong>: Shapley values are calculated. A positive SHAP value indicates a fragment that increases toxicity risk, whereas a negative value indicates a protective or stabilizing fragment.
            </li>
          </ul>
        </div>

        <CollapsibleCode
          title="Python Toxicity Prediction &amp; SHAP Explainability Script"
          code={`# =====================================================================
# STEP 1: IMPORT CHEMISTRY AND MACHINE LEARNING LIBRARIES
# =====================================================================
from rdkit import Chem
from rdkit.Chem import AllChem
from sklearn.ensemble import RandomForestClassifier
import shap
import numpy as np

# =====================================================================
# STEP 2: LOAD MOLECULES AND GENERATE CIRCULAR FINGERPRINTS
# =====================================================================
# We parse raw chemical SMILES into 3D-aware connection objects
smiles_list = ["CC(=O)OC1=CC=CC=C1C(=O)O", "CN1C=NC2=C1C(=O)N(C(=O)N2C)C"] # Aspirin, Caffeine
labels = [0, 1]  # 0 = Safe/Non-Toxic, 1 = Toxic Alert

mols = [Chem.MolFromSmiles(s) for s in smiles_list]
fingerprints = []

for mol in mols:
    if mol:
        # Generate 2048-bit Morgan Fingerprint (radius=2 represents local 2D fragments)
        fp = AllChem.GetMorganFingerprintAsBitVect(mol, radius=2, nBits=2048)
        arr = np.zeros((0,), dtype=np.int8)
        Chem.DataStructs.ConvertToNumpyArray(fp, arr)
        fingerprints.append(arr)

# Combine chemical features and target outcomes into numpy arrays
X_data = np.vstack(fingerprints)
y_data = np.array(labels)

# =====================================================================
# STEP 3: TRAIN THE ENSEMBLE RANDOM FOREST CLASSIFIER
# =====================================================================
# Set a random seed to guarantee reproducible decision tree boundaries
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_data, y_data)

# =====================================================================
# STEP 4: INSTANTIATE TREE SHAP EXPLAINABLE AI
# =====================================================================
# TreeExplainer calculates exact Shapley values by traversing the tree ensemble
explainer = shap.TreeExplainer(clf)
shap_values = explainer.shap_values(X_data)

# Extract predictions and explain the active fragments for the first compound
first_comp_pred = clf.predict_proba(X_data[0:1])[0]
first_comp_shap = shap_values[0] # List of 2048 contributions

# Shape is (n_samples, n_features, n_classes). We pull index 1 for toxic class contributions
print("Compound 0 Toxic Class Probability: " + str(first_comp_pred[1]))
print("Toxicity-driving fragment SHAP value: " + str(np.max(first_comp_shap[:, 1])))`}
        />
      </section>

      {/* Section 4: Interactive Playground */}
      <section className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-6">
        <div className="flex items-center gap-2">
          <Settings size={18} className="text-slate-900" />
          <h3 className="font-bold text-base text-slate-900">Interactive Playground: Discovery Toxicology Sandbox</h3>
        </div>
        <p className="text-sm text-slate-800">
          Analyze chemical toxicophores, inspect interactive SHAP feature contributions, and compute DeLong's test statistics to validate superior predictive performance.
        </p>

        {/* Sandbox Component 1: SHAP Explainer */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h4 className="font-bold text-sm text-slate-900">1. Interactive SHAP Structural Profiler</h4>
              <p className="text-xs text-slate-500 font-medium">Select a compound to analyze the positive (toxic) and negative (safe) Shapley contributions.</p>
            </div>
            <div className="flex gap-2">
              {COMPOUNDS_DATABASE.map((comp) => (
                <button
                  key={comp.name}
                  onClick={() => setSelectedComp(comp)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    selectedComp.name === comp.name
                      ? "bg-indigo-650 border-indigo-650 text-white"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {comp.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
            {/* Left side: Molecule properties */}
            <div className="md:col-span-5 p-4 rounded-xl border border-slate-150 bg-slate-50/50 space-y-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SMILES</span>
                <code className="text-[10px] font-mono text-slate-800 break-all leading-normal">{selectedComp.smiles}</code>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">MW</span>
                  <span className="text-xs font-bold text-slate-900">{selectedComp.properties.mw}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">LogP</span>
                  <span className="text-xs font-bold text-slate-900">{selectedComp.properties.logP}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Basic N</span>
                  <span className="text-xs font-bold text-slate-900">{selectedComp.properties.basicNitrogens}</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Predicted Safety Probabilities</span>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between items-center bg-white px-2 py-1 rounded border border-slate-200">
                    <span className="font-semibold text-slate-700">hERG Cardiotox:</span>
                    <span className={`font-bold ${selectedComp.cardioProb > 0.5 ? "text-red-650" : "text-emerald-650"}`}>
                      {(selectedComp.cardioProb * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-white px-2 py-1 rounded border border-slate-200">
                    <span className="font-semibold text-slate-700">DILI Hepatotox:</span>
                    <span className={`font-bold ${selectedComp.hepatoProb > 0.5 ? "text-red-650" : "text-emerald-650"}`}>
                      {(selectedComp.hepatoProb * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-white px-2 py-1 rounded border border-slate-200">
                    <span className="font-semibold text-slate-700">Ames Mutagenicity:</span>
                    <span className={`font-bold ${selectedComp.mutagenProb > 0.5 ? "text-red-650" : "text-emerald-650"}`}>
                      {(selectedComp.mutagenProb * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: SHAP Forces graph */}
            <div className="md:col-span-7 space-y-4">
              <span className="text-xs font-bold text-slate-700 block">SHAP Contribution Analysis (Toxicity Driving Forces)</span>
              
              <div className="space-y-2">
                {selectedComp.shapFeatures.map((f, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-800 font-bold">{f.feature}</span>
                      <span className={f.impact > 0 ? "text-red-600 font-bold" : "text-blue-600 font-bold"}>
                        {f.impact > 0 ? `+${f.impact.toFixed(2)}` : `${f.impact.toFixed(2)}`}
                      </span>
                    </div>
                    {/* Bar visualization */}
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                      {f.impact > 0 ? (
                        <>
                          <div className="h-full bg-slate-200" style={{ width: "50%" }} />
                          <div className="h-full bg-red-500" style={{ width: `${Math.min(f.impact * 100, 50)}%` }} />
                        </>
                      ) : (
                        <>
                          <div className="h-full bg-slate-100" style={{ width: `${Math.max(50 - Math.abs(f.impact) * 100, 0)}%` }} />
                          <div className="h-full bg-blue-500" style={{ width: `${Math.min(Math.abs(f.impact) * 100, 50)}%` }} />
                          <div className="h-full bg-slate-200" style={{ width: "50%" }} />
                        </>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight font-medium pl-1">{f.description}</p>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100 text-xs font-medium text-indigo-950 flex items-start gap-2">
                <Sparkles size={14} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                <p>
                  The red bars push the model towards a positive toxic classification. The blue bars pull the probability back down. An active basic tertiary nitrogen (Terfenadine) or a reactive quinone-imine metabolite (Acetaminophen) are massive positive forces pushing the compound into the high-risk region.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sandbox Component 2: DeLong model comparison */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-4">
          <div>
            <h4 className="font-bold text-sm text-slate-900">2. DeLong Model Comparison Calculator</h4>
            <p className="text-xs text-slate-500 font-medium">Compare the statistical performance of a pure chemical model against a hybrid biological-chemical model incorporating high-content Cell Painting.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
            {/* Controller slider */}
            <div className="md:col-span-5 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-800">
                  <span>Cell Painting Bio-Information:</span>
                  <span className="text-indigo-600 font-bold">{informationGain}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="95"
                  value={informationGain}
                  onChange={(e) => setInformationGain(Number(e.target.value))}
                  className="w-full accent-indigo-650"
                />
                <span className="text-[10px] text-slate-500 leading-normal block font-medium">
                  Adjusting this slider simulates generating richer biological profiles from cell phenotypic morphometry, which adds orthogonal, non-overlapping information to chemical fingerprints.
                </span>
              </div>

              <div className="space-y-1 text-xs border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-600 font-semibold">Model A AUC (2D Morgan):</span>
                  <span className="font-bold text-slate-900">{stats.aucA}</span>
                </div>
                <div className="flex justify-between py-0.5 border-t border-slate-100">
                  <span className="text-slate-600 font-semibold">Model B AUC (Morgan+Bio):</span>
                  <span className="font-bold text-indigo-700">{stats.aucB}</span>
                </div>
                <div className="flex justify-between py-0.5 border-t border-slate-100">
                  <span className="text-slate-600 font-semibold">DeLong Z-Score:</span>
                  <span className="font-bold text-slate-900">{stats.z}</span>
                </div>
                <div className="flex justify-between py-0.5 border-t border-slate-100">
                  <span className="text-slate-600 font-semibold">DeLong p-Value:</span>
                  <span className="font-bold text-slate-900">{stats.p}</span>
                </div>
              </div>
            </div>

            {/* Comparison results and validation display */}
            <div className="md:col-span-7 flex flex-col justify-center">
              <div className={`p-5 rounded-xl border flex flex-col items-center text-center space-y-3 ${
                stats.significant
                  ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                  : "bg-amber-50 border-amber-200 text-amber-950"
              }`}>
                {stats.significant ? (
                  <>
                    <Award className="h-10 w-10 text-emerald-600" />
                    <div>
                      <h5 className="font-bold text-sm">Model Superiority Confirmed (Statistically Significant)</h5>
                      <p className="text-xs text-emerald-800 leading-relaxed font-medium mt-1">
                        With a p-value of <strong>{stats.p}</strong> (which is &lt; 0.05), we reject the null hypothesis. The integration of high-content phenotypic Cell Painting features alongside chemical descriptors delivers a statistically superior cardiotoxicity prediction compared to chemical fingerprints alone.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-10 w-10 text-amber-600" />
                    <div>
                      <h5 className="font-bold text-sm">No Statistically Significant Difference</h5>
                      <p className="text-xs text-amber-800 leading-relaxed font-medium mt-1">
                        With a p-value of <strong>{stats.p}</strong> (which is &gt;= 0.05), we fail to reject the null hypothesis. The difference in model AUC is likely due to sample size constraints rather than a genuine biological predictive advantage.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <hr className="border-slate-200 my-8" />
      <Quiz 
        moduleTitle="Module 10: In Silico Toxicology &amp; Safety Assessment"
        questions={[
          {
            question: "Why is a basic tertiary nitrogen frequently flagged with a high positive SHAP value in predictive cardiotoxicity models?",
            options: [
              "Because basic tertiary nitrogens are highly electrophilic, reacting immediately with cellular DNA.",
              "Because basic tertiary nitrogens form strong electrostatic salt bridges with Acid 189 in the active site of metabolic kinase receptors.",
              "Because at physiological pH 7.4, the basic nitrogen is protonated and fits the hydrophobic/electrostatic inner cavity of the hERG channel, causing cardiotoxic blockade.",
              "Because it prevents phase-I oxidation pathways, leading to direct cell painting degradation."
            ],
            correctIndex: 2,
            explanation: "At physiological pH 7.4, basic tertiary nitrogens are protonated (positively charged). The hERG potassium channel possesses a large hydrophobic vestibule lined with negative electrostatic potential and aromatic residues (like Tyr652 and Phe656). The protonated nitrogen fits perfectly into this cavity, making it a critical toxicophore structural flag with massive positive SHAP impact in cardiotoxicity models."
          },
          {
            question: "When comparing two ROC curves on the same chemical database, why is DeLong's test preferred over a standard independent t-test for comparing AUC scores?",
            options: [
              "Because DeLong's test does not require the calculation of true positive or false positive rates.",
              "Because the predictions of two models tested on the exact same dataset are highly correlated (non-independent), requiring DeLong's z-score calculation to account for their covariance.",
              "Because DeLong's test operates on a logarithmic scale, reducing the leverage of extreme chemical outliers.",
              "Because DeLong's test is only valid for consensus models and cannot evaluate single Random Forests."
            ],
            correctIndex: 1,
            explanation: "When evaluating Model A and Model B on the exact same dataset, their prediction profiles are highly correlated because they are responding to the same chemical space. A standard t-test assumes independent distributions, which would lead to an incorrect (inflated) standard error. DeLong's method computes the covariance of the correlated AUC estimates to calculate a valid z-score and diagnostic p-value."
          },
          {
            question: "Which metabolic mechanism is primarily responsible for Acetaminophen (Paracetamol) hepatotoxicity, and how is it computationally classified?",
            options: [
              "Mutagenic DNA-alkylation, classified by searching for electrophilic aromatic nitro alerts in RDKit.",
              "Metabolic conversion by cytochrome P450 into the reactive quinone-imine metabolite NAPQI, classified by modeling DILI endpoints with Random Forests.",
              "hERG channel blockade, classified using support vector machine consensus regression.",
              "Phase-II glucuronidation conjugation, classified using Cell Painting morphometry."
            ],
            correctIndex: 1,
            explanation: "Acetaminophen is safe at standard therapeutic levels but at high concentrations, Cytochrome P450 enzymes oxidize it into NAPQI (N-acetyl-p-benzoquinone imine), a highly reactive quinone-imine that binds to liver proteins, generating toxic stress. DILI classifiers model this endpoint by identifying structural alerts linked to metabolic NAPQI formation and its subsequent hepatotoxicity."
          }
        ]}
      />
    </div>
  );
}
