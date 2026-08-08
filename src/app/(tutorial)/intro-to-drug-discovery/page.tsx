"use client";

import { useState } from "react";
import {
  Layers,
  FlaskConical,
  Award,
  ArrowRight,
  Compass,
  Flame,
  Target,
  Microscope
} from "lucide-react";
import { Quiz, type Question } from "@/components/Quiz";

const questions: Question[] = [
  {
    question: "What distinguishes a validated hit from an initial screening signal?",
    options: [
      "It has the most favorable docking score",
      "Its identity and activity are confirmed with repeat and orthogonal evidence",
      "It has already passed Phase III trials",
      "It contains no heteroatoms",
    ],
    correctIndex: 1,
    explanation:
      "A hit becomes credible only after its chemical identity, purity, and activity survive confirmation and relevant interference controls.",
  },
  {
    question: "What is the main role of CADD early in the discovery funnel?",
    options: [
      "Guarantee that one compound will become an approved drug",
      "Replace every biological experiment",
      "Prioritize hypotheses and compounds before expensive experiments",
      "Eliminate the need for target validation",
    ],
    correctIndex: 2,
    explanation:
      "CADD helps rank and test hypotheses efficiently, but its predictions still require experimental validation.",
  },
  {
    question: "Why can fragment screening cover chemical space efficiently?",
    options: [
      "Fragments are always potent drugs",
      "Small fragments represent many compact chemical motifs with relatively small libraries",
      "Fragments need no follow-up chemistry",
      "Every fragment binds selectively",
    ],
    correctIndex: 1,
    explanation:
      "Their small size lets a modest library sample many fundamental interaction patterns, after which weak hits must be grown, linked, or merged.",
  },
  {
    question: "A team has no experimental structure of their target but does have 40 compounds with measured IC50 values. Which family of methods applies?",
    options: [
      "Structure-based design, using the sequence in place of a structure",
      "Ligand-based design, inferring the target's requirements from the known actives",
      "Neither — no computational approach is possible without a structure",
      "Free-energy perturbation, which does not require a receptor",
    ],
    correctIndex: 1,
    explanation:
      "Ligand-based methods (similarity, pharmacophores, QSAR) infer what the target wants from what its known ligands share, so they need actives rather than a receptor. A predicted model could later enable structure-based work, but the 40 measured compounds are the asset in hand.",
  },
  {
    question: "Lack of efficacy causes roughly half of Phase II and III failures. What does this most often indicate?",
    options: [
      "The compound was not potent enough against its intended target",
      "The biological hypothesis was wrong — the target mattered less in humans than expected",
      "The formulation was unstable",
      "The clinical trial was too small to reach significance",
    ],
    correctIndex: 1,
    explanation:
      "Efficacy failures are usually target failures rather than potency failures: the molecule engaged its target as designed, but modulating that target did not change the disease. This is why target validation precedes any modelling, and why no amount of downstream optimization can rescue a wrong target.",
  },
  {
    question: "What does an undruggable target usually mean in this context?",
    options: [
      "The target has no biological function",
      "The target lacks an obvious conventional small-molecule pocket",
      "The target cannot be measured experimentally",
      "No therapeutic modality can ever affect it",
    ],
    correctIndex: 1,
    explanation:
      "The label usually describes limited conventional pocket tractability, not permanent impossibility. Alternative sites and modalities may still create a strategy.",
  },
];

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
      compounds: "1",
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
        <p className="text-sm text-slate-600">
          Click &quot;Advance Pipeline&quot; to simulate compound screening through the five major stages of the drug discovery pipeline. Notice the scale of attrition at each barrier.
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
                        ? "bg-slate-200/50 border-slate-300 dark:bg-slate-900/60 dark:border-slate-800 text-slate-500 dark:text-white"
                        : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-300 dark:text-white"
                    }`}
                  >
                    {started && activeStage >= idx ? stage.compounds : `Stage ${idx + 1}`}
                  </div>
                );
              })}
              {started && activeStage === stages.length - 1 && (
                <div className="mt-2 flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                  <Award size={13} aria-hidden="true" />
                  Approved drug
                </div>
              )}
            </div>

            <div className="text-center space-y-0.5">
              <span className="text-xs text-slate-600 font-bold uppercase tracking-wider">Remaining Pool</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {compounds.toLocaleString()} <span className="text-sm font-medium text-slate-600">{compounds === 1 ? "compound" : "compounds"}</span>
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
                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 2: What CADD actually does */}
      <section className="space-y-4">
        <h2>2. What CADD Actually Does</h2>
        <p>
          <strong>Computer-aided drug design</strong> is the use of computational models to decide which molecules are worth making and testing. That is the whole of it. CADD does not discover drugs; it changes the order in which you spend your experimental budget, and at the scale of the funnel above, ordering is worth an enormous amount.
        </p>
        <p>
          Everything in this course divides into two families, and the split depends on one question: <em>do you have a three-dimensional structure of the target?</em>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-2">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
              <Target size={14} className="text-accent" /> Structure-Based (SBDD)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              You have the receptor — from crystallography, cryo-EM, NMR, or a predicted model. You can reason directly about the pocket: its shape, its charges, which contacts a ligand could make. Docking, structure-based pharmacophores, and free-energy calculations all live here.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong>Fails when:</strong> the structure is wrong, the wrong conformation, or missing the loop that forms the pocket.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-2">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
              <Microscope size={14} className="text-accent" /> Ligand-Based (LBDD)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              You have no receptor, but you do have molecules known to work. You infer what the target wants from what its ligands have in common. Similarity searching, ligand-based pharmacophores, and QSAR all live here.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong>Fails when:</strong> the known actives are too few, too similar to each other, or measured in inconsistent assays.
            </p>
          </div>
        </div>

        <p>
          Real projects use both, and the boundary is softer than the labels suggest — a structure-based screen still needs ligand-based filters to stay tractable, and a ligand-based model is far easier to trust once a structure explains <em>why</em> it works.
        </p>

        <div className="border-l-2 border-accent pl-4 bg-accent/5 p-4 rounded-r-xl text-sm space-y-2">
          <strong className="text-foreground block">The honest framing</strong>
          <p className="text-slate-700 leading-relaxed">
            A computed number is a hypothesis, not a measurement. A docking score is not a binding affinity, a QSAR prediction is not an assay result, and a favourable ADMET profile is not safety. Used well, CADD raises the fraction of your experiments that are worth running. Used badly — trusted instead of tested — it produces confident, well-formatted, and entirely wrong answers. Every method in this course comes with a section on how it fails, and those sections matter more than the equations.
          </p>
        </div>
      </section>

      {/* Section 3: Key Definitions */}
      <section className="space-y-4">
        <h2>3. Key Definitions in the Screening Funnel</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stage A</div>
            <h3 className="font-bold text-sm text-foreground">Hit Compound</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              A molecule that shows reproducible, verified activity in a bioassay. It must possess validated structure/purity, novelty, and chemical tractability.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-white space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stage B</div>
            <h3 className="font-bold text-sm text-foreground">Lead Compound</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              An optimized hit showing activity <em>in vivo</em>, clear Structure-Activity Relationships (SAR), no reactive groups, and clean cardiotoxicity markers.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-white space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stage C</div>
            <h3 className="font-bold text-sm text-foreground">Drug Candidate</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              A fully optimized lead structure with robust preclinical safety profiles, ready for Investigational New Drug application and clinical trials.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Strategies */}
      <section className="space-y-4">
        <h2>4. Strategies for Identifying Active Hits</h2>

        <p>
          Before choosing a screening technology, a project makes a more fundamental choice: <strong>what counts as a hit?</strong>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h3 className="font-bold text-sm text-foreground">Target-based</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Pick a protein, assay compounds against it, and call a hit anything that binds or inhibits. The mechanism is known from the first day, so SAR, structural work, and everything in this course apply immediately — but only if the target was the right one. A beautifully optimized inhibitor of a protein that does not drive the disease is a wasted programme.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h3 className="font-bold text-sm text-foreground">Phenotypic</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Assay compounds against cells or an organism and call a hit anything that produces the desired biological outcome — regardless of how. You are guaranteed relevance in a living system, but you may not know what the compound hits, which makes optimization far harder and demands a separate effort to deconvolute the target.
            </p>
          </div>
        </div>

        <p>
          It is tempting to assume the rational, target-based route dominates. It does not. In a well-known survey of the 259 agents approved by the FDA between 1999 and 2008, 75 were first-in-class — and of the 50 first-in-class <em>small molecules</em>, <strong>28 came from phenotypic screening against 17 from target-based approaches</strong> (Swinney &amp; Anthony, <em>Nat Rev Drug Discov</em> 2011). Genuinely novel mechanisms have historically been found more often by asking biology an open question than by interrogating a protein we had already nominated.
        </p>
        <p>
          The lesson is not that computational, target-based work is misguided — the same survey shows target-based approaches dominating <em>follower</em> drugs, where the mechanism is already established, and CADD has grown enormously since 2008. The lesson is that the target hypothesis is the single riskiest assumption in the project, which is why <strong>Module 2</strong> is devoted entirely to interrogating it before any modelling begins.
        </p>

        <div className="space-y-3.5">
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5 p-1.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 h-7 w-7 flex items-center justify-center font-bold text-xs border border-slate-200 dark:border-slate-800">
              1
            </div>
            <div>
              <h3 className="font-bold text-sm !mt-0">High-Throughput Screening (HTS)</h3>
              <p className="text-sm text-slate-600 leading-relaxed mt-1">
                Automated robotic testing of chemical libraries containing millions of synthesized compounds. Highly robust and unbiased, but extremely costly to configure.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5 p-1.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 h-7 w-7 flex items-center justify-center font-bold text-xs border border-slate-200 dark:border-slate-800">
              2
            </div>
            <div>
              <h3 className="font-bold text-sm !mt-0">Exploitation of Biological Information</h3>
              <p className="text-sm text-slate-600 leading-relaxed mt-1">
                Repurposing existing drugs based on unexpected clinical observation of side effects (e.g. sildenafil) or traditional medicine extracts.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5 p-1.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 h-7 w-7 flex items-center justify-center font-bold text-xs border border-slate-200 dark:border-slate-800">
              3
            </div>
            <div>
              <h3 className="font-bold text-sm !mt-0">Rational Drug Design</h3>
              <p className="text-sm text-slate-600 leading-relaxed mt-1">
                Using structural knowledge of the target protein (structure-based) or active ligands (ligand-based) to construct compounds atom-by-atom.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5 p-1.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 h-7 w-7 flex items-center justify-center font-bold text-xs border border-slate-200 dark:border-slate-800">
              4
            </div>
            <div>
              <h3 className="font-bold text-sm !mt-0">Fragment-Based Screening</h3>
              <p className="text-sm text-slate-600 leading-relaxed mt-1">
                Screen very small compounds (&lt; 300 Da) that bind weakly (mM–µM) but with high <em>ligand efficiency</em>. Hits are then grown, linked, or merged into leads. Because fragments are small, a library of a few thousand samples chemical space far more efficiently than a million-compound HTS deck.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5 p-1.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 h-7 w-7 flex items-center justify-center font-bold text-xs border border-slate-200 dark:border-slate-800">
              5
            </div>
            <div>
              <h3 className="font-bold text-sm !mt-0">DNA-Encoded Libraries (DELs)</h3>
              <p className="text-sm text-slate-600 leading-relaxed mt-1">
                Each compound is built by split-and-pool synthesis and tagged with a DNA barcode recording its synthetic history. Billions of compounds can then be screened <em>in a single tube</em>: the pool is washed over immobilized target, non-binders are rinsed away, and the surviving barcodes are read by DNA sequencing. The scale is unmatched — but the readout is enrichment of a barcode, not a clean affinity, and hits must be re-synthesized without their DNA tag to be confirmed. DEL selection data has become a major training set for the machine learning models in Module 9.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Why compounds fail */}
      <section className="space-y-4">
        <h2>5. Why Compounds Fail</h2>
        <p>
          The funnel says roughly one candidate in ten that enters Phase I reaches approval. The more useful question is <em>why</em> the other nine die — because each cause of death corresponds to something a computational method is trying to prevent.
        </p>
        <p>
          Of the Phase II and Phase III failures reported between 2013 and 2015 with a stated reason, <strong>52% failed for lack of efficacy and 24% for safety</strong>, with the remainder falling to commercial and strategic decisions (Harrison, <em>Nat Rev Drug Discov</em> 2016).
        </p>

        <div className="space-y-3 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h3 className="font-bold text-sm text-foreground">Lack of efficacy — the dominant killer</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              The compound did what it was designed to do and the patient did not improve. Note what this usually is <em>not</em>: a potency failure. It is most often a <strong>target failure</strong> — the biological hypothesis was wrong, or the target mattered less in humans than in the model system. No amount of computational optimization rescues this, which is the entire argument for spending real effort on target validation (Module 2) and systems-level evidence (Module 17) before optimizing anything.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h3 className="font-bold text-sm text-foreground">Safety and toxicity</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Off-target activity, reactive metabolites, cardiac liabilities such as hERG block, or liver injury. These are the failures computational toxicology attacks most directly, because many are predictable from structure — and because a liability caught at the design stage costs a chemist an afternoon, while the same liability caught in Phase II costs years. Modules 12 and 15 cover this ground.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h3 className="font-bold text-sm text-foreground">Pharmacokinetics — the quiet one</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              A compound that never reaches its target at sufficient concentration cannot work, however potent it is <em>in vitro</em>. PK-driven attrition has fallen sharply since the 1990s, precisely because the field learned to screen for absorption and metabolism early rather than late. It is the clearest historical evidence that moving a filter earlier in the funnel actually works.
            </p>
          </div>
        </div>

        <p>
          Read the funnel backwards and you have the design of this course. Every module exists because something kills compounds at that stage, and the whole enterprise rests on one economic asymmetry: <strong>the cost of a mistake grows by orders of magnitude the later you find it</strong>. Computation is cheap; a failed Phase III is not.
        </p>
      </section>

      {/* Section 6: Targeting the Undruggable Proteome */}
      <section className="space-y-4">
        <h2>6. Targeting the &quot;Undruggable&quot; Proteome</h2>
        <p>
          For decades, drug discovery focused on target-based design against deep, well-defined active pockets (e.g. enzyme ATP-binding clefts). However, over <strong>80% of disease-driving proteins</strong> lack such cavities, including transcription factors, intrinsically disordered proteins (IDPs), and flat protein-protein interaction (PPI) interfaces.
        </p>
        <p>
          Once considered &quot;undruggable,&quot; breakthroughs in biotechnology and CADD are opening these targets to therapeutic intervention via novel modalities:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5"><Layers size={14} className="text-accent" /> Targeted Degradation (PROTACs)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bifunctional molecules that bind the target protein on one end and recruit an E3 ubiquitin ligase on the other, tagging the target for destruction by the proteasome rather than merely inhibiting it.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5"><Compass size={14} className="text-accent" /> PPI Inhibitors & glues</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Targeting flat, solvent-exposed protein-protein interfaces. Drugs like <strong>Venetoclax</strong> target the BCL-2 interface, while molecular glues stabilize target complexes to drive degradation.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5"><Flame size={14} className="text-accent" /> Drug Repurposing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Finding new clinical indications for FDA-approved drugs (e.g., sildenafil, aspirin). This bypasses phase I safety barriers, accounting for nearly one-third of recent approvals.
            </p>
          </div>
        </div>
      </section>

      {/* Section 7: Course roadmap */}
      <section className="space-y-4">
        <h2>7. How the Rest of This Course Maps onto the Funnel</h2>
        <p>
          The remaining modules are not a list of techniques; they follow the pipeline you just simulated. If you ever lose the thread, come back to this table and ask which stage you are standing in.
        </p>

        <div className="overflow-x-auto not-prose">
          <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr className="text-left">
                <th className="px-3 py-2 font-bold text-slate-900 dark:text-slate-100">Pipeline stage</th>
                <th className="px-3 py-2 font-bold text-slate-900 dark:text-slate-100">The question</th>
                <th className="px-3 py-2 font-bold text-slate-900 dark:text-slate-100">Modules</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-3 py-2 font-semibold">Target selection</td>
                <td className="px-3 py-2 text-slate-600">Is this protein worth attacking, and can anything bind it?</td>
                <td className="px-3 py-2 font-mono text-xs">2, 17</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Foundations</td>
                <td className="px-3 py-2 text-slate-600">Why do molecules stick together, and how do we compute that?</td>
                <td className="px-3 py-2 font-mono text-xs">3, 4</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Representation</td>
                <td className="px-3 py-2 text-slate-600">How do we store and compare molecules so a machine can reason about them?</td>
                <td className="px-3 py-2 font-mono text-xs">5, 13, 18</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Hit finding</td>
                <td className="px-3 py-2 text-slate-600">Which molecules, out of millions, deserve an assay?</td>
                <td className="px-3 py-2 font-mono text-xs">6, 7, 8</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Lead optimization</td>
                <td className="px-3 py-2 text-slate-600">How do we make this hit better without breaking something else?</td>
                <td className="px-3 py-2 font-mono text-xs">9, 10, 11</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Developability</td>
                <td className="px-3 py-2 text-slate-600">Will it be safe, absorbed, and eliminated sensibly?</td>
                <td className="px-3 py-2 font-mono text-xs">12, 15</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Beyond small molecules</td>
                <td className="px-3 py-2 text-slate-600">What if the modality is a protein rather than a drug-like ligand?</td>
                <td className="px-3 py-2 font-mono text-xs">16</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Doing it credibly</td>
                <td className="px-3 py-2 text-slate-600">Could someone else — including you, in a year — reproduce this?</td>
                <td className="px-3 py-2 font-mono text-xs">14</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm text-slate-600">
          Modules 1–12 form the core curriculum and are meant to be read in order. Modules 13–18 are shorter applied extensions covering the structural, computational, pharmacokinetic, biologics, and systems-level material a real project needs; take them in any order once the core is behind you.
        </p>
      </section>

      <section className="space-y-5">
        <h2>Knowledge check</h2>
        <Quiz moduleTitle="Introduction to Drug Discovery" questions={questions} />
      </section>
    </div>
  );
}
