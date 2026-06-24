"use client";

import React, { useState } from "react";
import { 
  Zap, 
  Layers, 
  FlaskConical, 
  Activity, 
  TrendingDown, 
  Award,
  Play,
  RotateCcw,
  ArrowRight,
  Compass,
  Flame
} from "lucide-react";

export default function IntroToDrugDiscoveryPage() {
  const [activeStage, setActiveStage] = useState(0);
  const [started, setStarted] = useState(false);
  const [compounds, setCompounds] = useState(10000);

  const stages = [
    {
      title: "1. Target Identification & Validation",
      compounds: "10,000+",
      desc: "Identify a biological target (e.g. protein, receptor) associated with a disease, and validate that modifying it treats the condition.",
      caddRole: "Using bioinformatics, genomics, and pathway analysis to check target druggability and structural feasibility.",
      reduction: 10000,
    },
    {
      title: "2. Hit Identification",
      compounds: "500",
      desc: "Identify small molecules ('hits') that interact with the target in screening assays with measurable biological activity.",
      caddRole: "High-Throughput Screening (HTS) or Virtual Screening (docking millions of compounds in silico) to identify binders.",
      reduction: 500,
    },
    {
      title: "3. Lead Generation & Optimization",
      compounds: "50",
      desc: "Refine hits to improve potency, selectivity, pharmacokinetics (ADME), and safety, establishing Structure-Activity Relationships (SAR).",
      caddRole: "Ligand-based design, bioisosteric replacements, scaffold hopping, and ADMET prediction modeling.",
      reduction: 50,
    },
    {
      title: "4. Preclinical Development",
      compounds: "5",
      desc: "Rigorous testing of the optimized lead compounds in vitro and in vivo (animal models) to evaluate safety, toxicity, and dosing.",
      caddRole: "Predicting off-target interactions, metabolic pathways, and toxicological profiles using computational pharmacology.",
      reduction: 5,
    },
    {
      title: "5. Clinical Trials (Phases I - III)",
      compounds: "1 (Approved Drug)",
      desc: "Testing in humans to assess safety (Phase I), efficacy and dosing (Phase II), and comparative effectiveness vs standard of care (Phase III).",
      caddRole: "Monitoring clinical biomarkers and analyzing pharmacogenomic differences in patient responses.",
      reduction: 1,
    },
  ];

  const handleNextStage = () => {
    if (!started) {
      setStarted(true);
      setActiveStage(0);
      setCompounds(10000);
      return;
    }
    if (activeStage < stages.length - 1) {
      const nextIndex = activeStage + 1;
      setActiveStage(nextIndex);
      setCompounds(stages[nextIndex].reduction);
    }
  };

  const resetPipeline = () => {
    setStarted(false);
    setActiveStage(0);
    setCompounds(10000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1>Module 1: Introduction to Drug Discovery</h1>
        <p className="lead text-slate-600">
          Explore the stages of the drug discovery pipeline, learn to distinguish key compound classes, and understand how Computer-Aided Drug Design (CADD) accelerates the transition from biological idea to medicine.
        </p>
      </div>

      <hr className="border-slate-100 dark:border-slate-900" />

      {/* Section 1: Overview */}
      <section className="space-y-4">
        <h2>1. The Drug Discovery and Development Pipeline</h2>
        <p>
          Bringing a new drug to the market is a highly complex, multi-stage, interdisciplinary process. Historically, it requires <strong>10–12 years</strong> and upwards of <strong>$2.6 billion</strong>, with an extremely high rate of attrition. For every 10,000 compounds screened at the outset, typically only <strong>one</strong> receives regulatory approval.
        </p>
        <p>
          The pipeline acts as a funnel, filtering compounds through successive hurdles of affinity, selectivity, pharmacokinetics, and safety. Computational chemistry and biology (CADD) have become vital tools to cut costs and time by early filtering and rational design.
        </p>
      </section>

      {/* Interactive Widget: The Pipeline Funnel */}
      <section className="p-5 rounded-xl bg-slate-50/50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-900 space-y-4">
        <div className="flex items-center gap-2">
          <Layers size={16} />
          <h3 className="font-bold text-sm">Interactive Playground: R&D Funnel Simulation</h3>
        </div>
        <p className="text-sm text-slate-650">
          Click "Advance Pipeline" to simulate compound screening through the five major stages of the drug discovery pipeline. Notice the scale of attrition at each barrier.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-white dark:bg-slate-950 p-5 rounded-lg border border-slate-100 dark:border-slate-900">
          
          {/* Visual Funnel Representation */}
          <div className="md:col-span-5 flex flex-col items-center justify-center space-y-4">
            <div className="relative w-full max-w-[180px] flex flex-col items-center">
              {stages.map((stage, idx) => {
                const isSelected = started && activeStage === idx;
                const isPassed = started && activeStage > idx;
                // Generate funnel shape segments using dynamic width classes
                const widthClasses = [
                  "w-full h-7",
                  "w-[85%] h-7",
                  "w-[70%] h-7",
                  "w-[55%] h-7",
                  "w-[40%] h-7",
                ];
                return (
                  <div
                    key={idx}
                    className={`${widthClasses[idx]} rounded border text-xs font-bold flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? "bg-slate-900 border-slate-900 text-white dark:bg-slate-100 dark:border-slate-100 dark:text-slate-900 scale-102 font-bold"
                        : isPassed
                        ? "bg-slate-200/50 border-slate-300 dark:bg-slate-900/60 dark:border-slate-800 text-slate-500"
                        : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700"
                    }`}
                  >
                    {started && activeStage >= idx ? stage.compounds : `Stage ${idx + 1}`}
                  </div>
                );
              })}
            </div>

            <div className="text-center space-y-0.5">
              <span className="text-xs text-slate-600 font-bold uppercase tracking-wider">Remaining Pool</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {compounds.toLocaleString()} <span className="text-sm font-medium text-slate-600">compounds</span>
              </p>
            </div>
          </div>

          {/* Details Column */}
          <div className="md:col-span-7 space-y-4 not-prose">
            {!started ? (
              <div className="h-44 flex flex-col items-center justify-center text-center space-y-3">
                <FlaskConical size={32} className="text-slate-400" />
                <p className="text-sm font-medium text-slate-600">Ready to begin the R&D pipeline simulations</p>
                <button
                  onClick={handleNextStage}
                  className="px-4 py-2.5 rounded-lg bg-accent text-white font-semibold text-sm transition-colors hover:bg-accent-dark shadow-sm"
                >
                  Start Simulation
                </button>
              </div>
            ) : (
              <div className="space-y-4 min-h-[11rem] flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="font-bold text-foreground text-sm">
                    {stages[activeStage].title}
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-700">
                    {stages[activeStage].desc}
                  </p>
                  <div className="p-3 bg-slate-50 border border-border rounded-lg mt-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      CADD Contribution:
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed mt-1">
                      {stages[activeStage].caddRole}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-border">
                  {activeStage < stages.length - 1 ? (
                    <button
                      onClick={handleNextStage}
                      className="px-4 py-2 rounded-lg bg-accent text-white font-semibold text-sm transition-colors hover:bg-accent-dark flex items-center gap-1"
                    >
                      Advance Pipeline <ArrowRight size={12} />
                    </button>
                  ) : (
                    <div className="text-foreground text-sm font-bold flex items-center gap-1.5 py-1">
                      <Award size={16} className="text-accent" /> Drug Approved for Market Release!
                    </div>
                  )}
                  <button
                    onClick={resetPipeline}
                    className="px-4 py-2 rounded-lg bg-slate-150 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 2: Key Definitions */}
      <section className="space-y-4">
        <h2>2. Key Definitions in the Screening Funnel</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stage A</div>
            <h3 className="font-bold text-sm text-foreground">Hit Compound</h3>
            <p className="text-sm text-slate-650 leading-relaxed">
              A molecule that shows reproducible, verified activity in a bioassay. It must possess validated structure/purity, novelty, and chemical tractability.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-white space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stage B</div>
            <h3 className="font-bold text-sm text-foreground">Lead Compound</h3>
            <p className="text-sm text-slate-650 leading-relaxed">
              An optimized hit showing activity <em>in vivo</em>, clear Structure-Activity Relationships (SAR), no reactive groups, and clean cardiotoxicity markers.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-white space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stage C</div>
            <h3 className="font-bold text-sm text-foreground">Drug Candidate</h3>
            <p className="text-sm text-slate-650 leading-relaxed">
              A fully optimized lead structure with robust preclinical safety profiles, ready for Investigational New Drug application and clinical trials.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Strategies */}
      <section className="space-y-4">
        <h2>3. Strategies for Identifying Active Hits</h2>
        
        <div className="space-y-3.5">
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5 p-1.5 rounded bg-slate-150 dark:bg-slate-900 text-slate-800 dark:text-slate-200 h-7 w-7 flex items-center justify-center font-bold text-xs border border-slate-200 dark:border-slate-800">
              1
            </div>
            <div>
              <h3 className="font-bold text-sm !mt-0">High-Throughput Screening (HTS)</h3>
              <p className="text-sm text-slate-650 leading-relaxed mt-1">
                Automated robotic testing of chemical libraries containing millions of synthesized compounds. Highly robust and unbiased, but extremely costly to configure.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5 p-1.5 rounded bg-slate-150 dark:bg-slate-900 text-slate-800 dark:text-slate-200 h-7 w-7 flex items-center justify-center font-bold text-xs border border-slate-200 dark:border-slate-800">
              2
            </div>
            <div>
              <h3 className="font-bold text-sm !mt-0">Exploitation of Biological Information</h3>
              <p className="text-sm text-slate-650 leading-relaxed mt-1">
                Repurposing existing drugs based on unexpected clinical observation of side effects (e.g. sildenafil) or traditional medicine extracts.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5 p-1.5 rounded bg-slate-150 dark:bg-slate-900 text-slate-800 dark:text-slate-200 h-7 w-7 flex items-center justify-center font-bold text-xs border border-slate-200 dark:border-slate-800">
              3
            </div>
            <div>
              <h3 className="font-bold text-sm !mt-0">Rational Drug Design</h3>
              <p className="text-sm text-slate-650 leading-relaxed mt-1">
                Using structural knowledge of the target protein (structure-based) or active ligands (ligand-based) to construct compounds atom-by-atom.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Targeting the Undruggable Proteome */}
      <section className="space-y-4">
        <h2>4. Targeting the "Undruggable" Proteome</h2>
        <p>
          For decades, drug discovery focused on target-based design against deep, well-defined active pockets (e.g. enzyme ATP-binding clefts). However, over <strong>80% of disease-driving proteins</strong> lack such cavities, including transcription factors, intrinsically disordered proteins (IDPs), and flat protein-protein interaction (PPI) interfaces.
        </p>
        <p>
          Once considered "undruggable," breakthroughs in biotechnology and CADD are opening these targets to therapeutic intervention via novel modalities:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5"><Layers size={14} className="text-accent" /> Targeted Degradation (PROTACs)</h3>
            <p className="text-xs text-slate-650 leading-relaxed">
              Bifunctional molecules that bind the target protein on one end and recruit an E3 ubiquitin ligase on the other, tagging the target for destruction by the proteasome rather than merely inhibiting it.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5"><Compass size={14} className="text-accent" /> PPI Inhibitors & glues</h3>
            <p className="text-xs text-slate-655 leading-relaxed">
              Targeting flat, solvent-exposed protein-protein interfaces. Drugs like <strong>Venetoclax</strong> target the BCL-2 interface, while molecular glues stabilize target complexes to drive degradation.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5"><Flame size={14} className="text-accent" /> Drug Repurposing</h3>
            <p className="text-xs text-slate-655 leading-relaxed">
              Finding new clinical indications for FDA-approved drugs (e.g., sildenafil, aspirin). This bypasses phase I safety barriers, accounting for nearly one-third of recent approvals.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
