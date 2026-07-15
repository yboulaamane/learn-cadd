"use client";

import React, { useState } from "react";
import {
  Crosshair,
  Info,
  Sliders,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Dna,
  Search,
} from "lucide-react";
import { Quiz } from "@/components/Quiz";
import { CollapsibleCode } from "@/components/CollapsibleCode";

// Pocket descriptor presets for the druggability playground.
// Values chosen to reproduce the classic SiteMap classifications.
const POCKET_PRESETS: Record<string, { n: number; e: number; p: number; note: string }> = {
  "Kinase ATP site": { n: 100, e: 0.78, p: 0.65, note: "Deep, enclosed, largely hydrophobic — the archetypal druggable pocket." },
  "GPCR orthosteric": { n: 85, e: 0.72, p: 0.72, note: "Buried inside the 7-TM helical bundle; comfortably druggable." },
  "Shallow allosteric": { n: 70, e: 0.6, p: 0.95, note: "Borderline: real pocket, but shallow and fairly polar." },
  "Flat PPI interface": { n: 60, e: 0.45, p: 1.1, note: "Large but flat and solvent-exposed — the classic 'undruggable' surface." },
};

export default function TargetIdentificationPage() {
  const [pick, setPick] = useState<string>("Kinase ATP site");
  const [n, setN] = useState<number>(POCKET_PRESETS["Kinase ATP site"].n);
  const [e, setE] = useState<number>(POCKET_PRESETS["Kinase ATP site"].e);
  const [p, setP] = useState<number>(POCKET_PRESETS["Kinase ATP site"].p);

  const applyPreset = (name: string) => {
    const preset = POCKET_PRESETS[name];
    if (!preset) return;
    setPick(name);
    setN(preset.n);
    setE(preset.e);
    setP(preset.p);
  };

  // SiteMap scoring functions (Halgren, J. Chem. Inf. Model. 2009, 49, 377-389).
  // n = number of site points, e = enclosure, p = hydrophilic character.
  // n is capped at 100 in both; p is capped at 1.0 in SiteScore but NOT in Dscore.
  const nCapped = Math.min(n, 100);
  const siteScore = 0.0733 * Math.sqrt(nCapped) + 0.6688 * e - 0.2 * Math.min(p, 1.0);
  const dScore = 0.094 * Math.sqrt(nCapped) + 0.6 * e - 0.324 * p;

  const verdict =
    dScore >= 0.98
      ? { label: "Druggable", tone: "emerald", icon: CheckCircle, text: "A small molecule with drug-like properties should be able to bind here with high affinity." }
      : dScore >= 0.83
      ? { label: "Difficult", tone: "amber", icon: AlertTriangle, text: "Bindable, but expect to fight for affinity. Often needs fragment-based approaches or covalent strategies." }
      : { label: "Undruggable", tone: "rose", icon: XCircle, text: "Too shallow, too polar, or too solvent-exposed for a conventional small molecule. Consider a different modality (PROTAC, molecular glue, biologic)." };

  const isRealSite = siteScore >= 0.8;
  const VerdictIcon = verdict.icon;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1>Module 2: Target Identification, Validation &amp; Druggability</h1>
        <p className="lead text-slate-800">
          Every other module in this course assumes you already have a target. This one asks the question that comes first — and is the single highest-leverage decision in the entire pipeline: <em>which protein should we drug at all?</em>
        </p>
      </div>

      <hr className="border-slate-200" />

      {/* Section 1: What is a target */}
      <section className="space-y-4">
        <h2>1. What Is a Therapeutic Target?</h2>
        <p>
          A <strong>therapeutic target</strong> is a biomolecule — almost always a protein — whose activity can be modulated by a drug to produce a desired clinical effect. To be a genuine target it must satisfy three independent conditions, and failing any one of them is fatal:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900">1. Disease-linked</h4>
            <p className="text-sm text-slate-800 leading-relaxed">
              Modulating it must actually change the disease. This is a question about <em>biology</em>, and it is where most drugs die.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900">2. Druggable</h4>
            <p className="text-sm text-slate-800 leading-relaxed">
              It must have a binding site that a drug-like molecule can actually occupy with high affinity. This is a question about <em>structure</em> — and it is what the rest of this module measures.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900">3. Safely modulable</h4>
            <p className="text-sm text-slate-800 leading-relaxed">
              Hitting it must not cause unacceptable harm — which depends on where else it is expressed and what else the drug touches (Module 12).
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Why it matters */}
      <section className="space-y-4">
        <h2>2. Why Target Selection Dominates Everything Downstream</h2>
        <p>
          The numbers are sobering. The human genome encodes roughly <strong>20,000 proteins</strong>, but only about <strong>4,500</strong> are considered druggable at all — and every drug ever approved acts on just <strong>716 distinct targets</strong>. The universe of proven targets is startlingly small.
        </p>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { v: "~20,000", l: "protein-coding genes", s: "the whole proteome" },
            { v: "~4,500", l: "considered druggable", s: "≈ 22% of the proteome" },
            { v: "716", l: "targets of all approved drugs", s: "≈ 3.6% of the proteome" },
          ].map((k) => (
            <div key={k.l} className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center">
              <p className="text-2xl font-bold text-slate-950 font-mono">{k.v}</p>
              <p className="text-xs font-bold text-slate-900 mt-1">{k.l}</p>
              <p className="text-[11px] text-slate-600 mt-0.5">{k.s}</p>
            </div>
          ))}
        </div>

        <div className="p-4 border-l-4 border-rose-500 bg-rose-50/50 rounded-r-xl space-y-1.5 text-sm">
          <strong className="text-slate-900 block">The uncomfortable truth about attrition</strong>
          <p className="text-slate-800 leading-relaxed">
            The dominant cause of Phase II failure is <strong>lack of efficacy</strong> — not toxicity, not pharmacokinetics. A compound that fails for lack of efficacy usually did nothing wrong chemically: it bound its target beautifully. <em>The target was simply the wrong one.</em> No amount of docking, QSAR, or MD later in this course can rescue a badly chosen target. That is why this module comes before the methods.
          </p>
        </div>
      </section>

      {/* Section 3: Target classes */}
      <section className="space-y-4">
        <h2>3. Target Classes</h2>
        <p>
          Approved drugs cluster heavily into a handful of protein families, largely because those families happen to have well-formed binding pockets. Knowing the class tells you a great deal about which method to reach for.
        </p>
        <div className="overflow-x-auto not-prose border border-slate-200 rounded-lg">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left font-bold text-slate-900">Class</th>
                <th className="px-3 py-2 text-left font-bold text-slate-900">Why it's druggable</th>
                <th className="px-3 py-2 text-left font-bold text-slate-900">Typical approach</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-slate-800">
              <tr>
                <td className="px-3 py-2 font-semibold">Enzymes (esp. kinases, proteases)</td>
                <td className="px-3 py-2">Deep, enclosed catalytic/cofactor pockets evolved to bind small molecules</td>
                <td className="px-3 py-2">Structure-based docking; competitive inhibition</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">GPCRs</td>
                <td className="px-3 py-2">Orthosteric site buried in the 7-TM helical bundle</td>
                <td className="px-3 py-2">Historically ligand-based (few structures); now structure-based</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Ion channels</td>
                <td className="px-3 py-2">Pore and gating sites; but selectivity across the family is hard</td>
                <td className="px-3 py-2">Often ligand-based; heavy off-target screening (see hERG, Module 12)</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Nuclear receptors</td>
                <td className="px-3 py-2">Buried hydrophobic ligand-binding domain</td>
                <td className="px-3 py-2">Structure-based (see the estradiol pharmacophore, Module 7)</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Transporters</td>
                <td className="px-3 py-2">Substrate sites, but large conformational cycles</td>
                <td className="px-3 py-2">Ensemble/state-specific modelling</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">PPIs &amp; transcription factors</td>
                <td className="px-3 py-2"><strong>Usually not</strong> — flat, extended, solvent-exposed interfaces</td>
                <td className="px-3 py-2">Fragment-based, stabilizers/glues, or degradation (Module 6)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 4: Validation */}
      <section className="space-y-4">
        <h2>4. Target Validation: Building an Evidence Chain</h2>
        <p>
          Validation asks: <em>if I modulate this target, does the disease change?</em> No single experiment settles it. Confidence comes from stacking independent, orthogonal lines of evidence — the more independent the sources, the lower the risk.
        </p>

        <div className="space-y-3 not-prose">
          {[
            { n: 1, t: "Human genetic evidence", d: "The strongest signal available. GWAS hits, rare loss-of-function variants, and Mendelian disease genes tie the target to human biology directly — not to a mouse. Targets with supporting human genetic evidence succeed in the clinic roughly twice as often, which is why genetics-led target selection has reshaped the industry.", icon: Dna },
            { n: 2, t: "Genetic perturbation in models", d: "Knockout/knockdown (CRISPR, RNAi) shows whether removing the protein produces the desired phenotype. Caveat: removing a protein is not the same as inhibiting it — a knockout also deletes scaffolding functions a drug would leave intact.", icon: Dna },
            { n: 3, t: "Chemical/pharmacological evidence", d: "A selective tool compound reproduces the phenotype. This is the closest proxy for what a drug will actually do — but only if the tool is genuinely selective. A promiscuous 'tool' validates nothing.", icon: Search },
            { n: 4, t: "Clinical/translational precedent", d: "Human data: an existing drug on the same pathway, or a biomarker that tracks target engagement in patients.", icon: CheckCircle },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.n} className="flex gap-3 p-4 rounded-lg border border-border bg-white">
                <span className="h-6 w-6 text-xs font-bold bg-slate-100 border border-border rounded flex items-center justify-center flex-shrink-0 text-slate-900">{s.n}</span>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <Icon className="h-4 w-4 text-slate-500" />
                    {s.t}
                  </h4>
                  <p className="text-sm text-slate-800 mt-1 leading-relaxed">{s.d}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 font-medium">
          <span className="font-bold text-slate-900">Target engagement vs. efficacy.</span> These are different claims and conflating them is a classic error. Proving your compound <em>binds the target in cells</em> (e.g. by a thermal shift/CETSA assay) is necessary but not sufficient. A compound can engage its target completely and still do nothing to the disease — which is, precisely, target invalidation.
        </div>
      </section>

      {/* Section 5: Druggability */}
      <section className="space-y-4">
        <h2>5. Druggability: Can a Small Molecule Actually Bind?</h2>
        <p>
          A validated target is worthless if nothing drug-like can bind it. <strong>Druggability</strong> is a structural property of the pocket, and — unlike biological validation — it can be computed directly from a 3D structure before a single compound is made.
        </p>
        <p>
          The first step is finding the pocket at all. Tools fall into three families:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900">Geometric</h4>
            <p className="text-sm text-slate-800 leading-relaxed">
              Find concave cavities purely from shape, e.g. by rolling a probe sphere over the surface (<strong>fpocket</strong>, PockDrug). Fast and structure-only.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900">Energetic / probe-based</h4>
            <p className="text-sm text-slate-800 leading-relaxed">
              Computationally flood the surface with small organic probes and find where they cluster — "hot spots" (<strong>FTMap</strong>, SiteMap). Captures chemistry, not just shape.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900">Knowledge-based / ML</h4>
            <p className="text-sm text-slate-800 leading-relaxed">
              Learn what real ligand-binding sites look like from the PDB and predict new ones. Increasingly the default for large-scale proteome-wide assessment.
            </p>
          </div>
        </div>

        <p>
          Once you have a pocket, you score it. The best-known scheme is <strong>SiteMap</strong> (Halgren, 2009), which reduces a pocket to three numbers and combines them linearly:
        </p>
        <div className="flex flex-col items-center justify-center p-5 bg-slate-50 border border-slate-200 rounded-xl select-none my-2 not-prose">
          <div className="text-base sm:text-xl font-mono font-bold tracking-wide text-slate-900 text-center">
            Dscore = 0.094·√n + 0.60·e − 0.324·p
          </div>
          <div className="text-xs text-slate-800 font-bold uppercase tracking-widest mt-2 text-center">
            SiteMap Druggability Score
          </div>
        </div>
        <p className="text-sm text-slate-800 leading-relaxed">
          Where <strong>n</strong> is the number of site points (pocket size), <strong>e</strong> is <strong>enclosure</strong> (how buried the pocket is, 0–1), and <strong>p</strong> is <strong>hydrophilic character</strong>. Read the signs: size and enclosure <em>help</em>, polarity <em>hurts</em>. That single equation explains the entire druggable proteome — and why protein-protein interfaces are so brutally hard.
        </p>
      </section>

      {/* Interactive Playground */}
      <section className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2">
          <Sliders size={18} className="text-slate-900" />
          <h3 className="font-bold text-base text-slate-900">Interactive Playground: Druggability Scorecard</h3>
        </div>
        <p className="text-sm text-slate-800 leading-normal">
          Load a real pocket type or shape your own, and watch the actual <strong>SiteMap</strong> equations classify it. Try the key experiment: load the <strong>Flat PPI interface</strong>, then drag <em>enclosure</em> upward while changing nothing else — and watch an "undruggable" target become druggable. That single slider is the difference between a kinase and a protein-protein interface.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-5 rounded-lg border border-slate-200">
          {/* Controls */}
          <div className="md:col-span-7 space-y-4">
            <div className="space-y-1.5">
              <span className="text-sm text-slate-800 font-bold">Pocket type</span>
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(POCKET_PRESETS).map((name) => (
                  <button
                    key={name}
                    onClick={() => applyPreset(name)}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold border transition-colors ${
                      pick === name
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-800 border-slate-300 hover:border-slate-500"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-600 font-medium pt-1 leading-snug">
                {POCKET_PRESETS[pick]?.note ?? "Custom pocket — you've moved away from the presets."}
              </p>
            </div>

            {[
              { label: "n — site points (pocket size)", val: n, set: setN, min: 10, max: 150, step: 1, fmt: (v: number) => v.toFixed(0), hint: "Capped at 100 by the scoring function." },
              { label: "e — enclosure (how buried)", val: e, set: setE, min: 0, max: 1, step: 0.01, fmt: (v: number) => v.toFixed(2), hint: "0 = flat open surface, 1 = fully enclosed cavity." },
              { label: "p — hydrophilic character", val: p, set: setP, min: 0, max: 1.5, step: 0.01, fmt: (v: number) => v.toFixed(2), hint: "Higher = more polar/solvent-friendly = worse for binding." },
            ].map((s) => (
              <div key={s.label} className="space-y-1" onMouseDown={() => setPick("Custom")} onTouchStart={() => setPick("Custom")}>
                <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                  <span>{s.label}</span>
                  <span className="font-mono text-slate-900">{s.fmt(s.val)}</span>
                </div>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={s.val}
                  onChange={(ev) => s.set(parseFloat(ev.target.value))}
                  className="w-full h-1.5 rounded appearance-none cursor-pointer accent-slate-900 bg-slate-100"
                />
                <p className="text-[10px] text-slate-500 font-medium">{s.hint}</p>
              </div>
            ))}
          </div>

          {/* Scorecard */}
          <div className="md:col-span-5 space-y-3">
            <div
              className={`p-4 rounded-lg border ${
                verdict.tone === "emerald"
                  ? "bg-emerald-50 border-emerald-200"
                  : verdict.tone === "amber"
                  ? "bg-amber-50 border-amber-200"
                  : "bg-rose-50 border-rose-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">Verdict</span>
                <span
                  className={`flex items-center gap-1 text-xs font-bold ${
                    verdict.tone === "emerald" ? "text-emerald-700" : verdict.tone === "amber" ? "text-amber-700" : "text-rose-700"
                  }`}
                >
                  <VerdictIcon className="h-4 w-4" /> {verdict.label}
                </span>
              </div>
              <p className="text-3xl font-bold font-mono text-slate-950 mt-2">{dScore.toFixed(2)}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Dscore</p>
              <p className="text-[11px] text-slate-700 font-semibold mt-2 leading-snug">{verdict.text}</p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-slate-800">SiteScore</span>
                <span className={isRealSite ? "text-emerald-700 font-bold" : "text-slate-500"}>{siteScore.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-slate-600 font-medium leading-snug">
                {isRealSite
                  ? "≥ 0.80 — this looks like a genuine ligand-binding site, not an incidental surface dent."
                  : "< 0.80 — probably not a real binding site at all."}
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">Dscore thresholds</span>
              {[
                { r: "≥ 0.98", l: "Druggable", active: dScore >= 0.98 },
                { r: "0.83 – 0.98", l: "Difficult", active: dScore >= 0.83 && dScore < 0.98 },
                { r: "< 0.83", l: "Undruggable", active: dScore < 0.83 },
              ].map((t) => (
                <div key={t.l} className={`flex items-center justify-between text-xs font-mono ${t.active ? "font-bold text-slate-900" : "text-slate-400"}`}>
                  <span>{t.active ? "▶" : "  "} {t.l}</span>
                  <span>{t.r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs font-semibold text-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Info className="h-4 w-4 text-blue-600" /> What the equation is telling you
          </span>
          <p className="leading-relaxed font-medium">
            Because enclosure carries a <strong>+0.60</strong> coefficient and hydrophilicity a <strong>−0.324</strong> one, a pocket earns its druggability mainly by being <em>buried and greasy</em>. A PPI interface fails not because it is small — it is usually enormous — but because it is <strong>flat and wet</strong>. This is exactly why the field invented PROTACs and molecular glues (Modules 1 and 6): if you cannot win the binding-site argument, change the modality so you no longer need a deep pocket.
          </p>
        </div>
      </section>

      {/* Section 6: Polypharmacology */}
      <section className="space-y-4">
        <h2>6. The Inverse Problem: Target Fishing &amp; Polypharmacology</h2>
        <p>
          So far we have gone <em>target → molecule</em>. The reverse question is just as important: given a molecule, <strong>what does it hit?</strong> This is <strong>target prediction</strong> (or "target fishing"), and it matters for three reasons:
        </p>
        <ul>
          <li><strong>Phenotypic hits need deconvolution.</strong> If a compound cures cells in a screen but you do not know its target, you cannot optimize it rationally.</li>
          <li><strong>Off-targets cause toxicity.</strong> Predicting secondary targets early feeds directly into the safety work in Module 12.</li>
          <li><strong>Polypharmacology is sometimes the point.</strong> Many effective drugs — notably kinase inhibitors and most CNS drugs — work <em>because</em> they hit several targets. Perfect selectivity is not always the goal.</li>
        </ul>
        <p className="text-sm text-slate-800 leading-relaxed">
          The dominant computational approach rests on the <strong>similar property principle</strong> you will meet in Module 5: if your molecule is highly similar to a compound with a known target, it probably shares that target. This turns target prediction into a fingerprint similarity search against annotated bioactivity databases such as ChEMBL.
        </p>

        <CollapsibleCode
          title="Ligand-Based Target Prediction by Similarity Search"
          code={`from rdkit import Chem
from rdkit.Chem import AllChem, DataStructs
from collections import defaultdict

# A tiny stand-in for an annotated bioactivity database (in practice: ChEMBL).
# Each entry: (name, SMILES, known target)
REFERENCE_LIGANDS = [
    ("imatinib-like",  "Cc1ccc(NC(=O)c2ccc(CN3CCN(C)CC3)cc2)cc1Nc1nccc(-c2cccnc2)n1", "ABL1 kinase"),
    ("dopamine",       "NCCc1ccc(O)c(O)c1",                                          "Dopamine receptor"),
    ("adrenaline",     "CNC[C@H](O)c1ccc(O)c(O)c1",                                  "Adrenergic receptor"),
    ("ibuprofen",      "CC(C)Cc1ccc(C(C)C(=O)O)cc1",                                 "COX-1 / COX-2"),
    ("naproxen",       "COc1ccc2cc(C(C)C(=O)O)ccc2c1",                               "COX-1 / COX-2"),
]

def fp(smiles):
    mol = Chem.MolFromSmiles(smiles)
    return AllChem.GetMorganFingerprintAsBitVect(mol, radius=2, nBits=2048)

def predict_targets(query_smiles, threshold=0.35):
    """Rank likely targets for a query molecule by nearest-neighbour similarity."""
    query_fp = fp(query_smiles)
    hits = defaultdict(float)

    for name, smiles, target in REFERENCE_LIGANDS:
        tc = DataStructs.TanimotoSimilarity(query_fp, fp(smiles))
        # Keep the single best (max) similarity supporting each target
        if tc > hits[target]:
            hits[target] = tc

    ranked = sorted(hits.items(), key=lambda kv: kv[1], reverse=True)
    return [(t, round(s, 3)) for t, s in ranked if s >= threshold]

# Query: a molecule structurally close to the NSAIDs above
print(predict_targets("CC(C)Cc1ccc(C(C)C(=O)O)cc1"))
# -> [('COX-1 / COX-2', 1.0), ...]  the query IS ibuprofen, so COX comes top

# IMPORTANT CAVEAT:
# This only ever rediscovers targets already in your reference set. It cannot
# propose a novel target, and it inherits every bias in the annotation data --
# well-studied targets (kinases!) are over-represented simply because they
# have been assayed more, not because they are more likely.`}
        />
      </section>

      {/* Quiz */}
      <Quiz
        moduleTitle="Module 2: Target Identification, Validation & Druggability"
        questions={[
          {
            question:
              "A protein-protein interaction interface has a very large surface area, yet SiteMap classifies it as undruggable. Why?",
            options: [
              "Because large pockets always score poorly — the Dscore penalizes pocket size.",
              "Because the Dscore rewards enclosure (+0.60) and penalizes hydrophilic character (−0.324); a PPI interface is flat and solvent-exposed, so it loses on both despite its size.",
              "Because SiteMap can only evaluate enzyme active sites.",
              "Because protein-protein interfaces contain no hydrophobic residues at all.",
            ],
            correctIndex: 1,
            explanation:
              "Size actually helps the Dscore — the +0.094·√n term is positive. PPI interfaces fail on the other two terms: they are flat (low enclosure e, which carries the large +0.60 weight) and solvent-exposed/polar (high p, penalized at −0.324). This is why the field turned to alternative modalities such as PROTACs and molecular glues for these targets, rather than trying harder to find a conventional inhibitor.",
          },
          {
            question:
              "A CETSA assay confirms your compound engages its target inside cells, but the compound shows no effect on disease phenotype in a validated animal model. What has most likely happened?",
            options: [
              "The compound has poor solubility.",
              "The assay must be wrong, since target engagement guarantees efficacy.",
              "The target has been invalidated: engagement was achieved, but modulating this target does not change the disease.",
              "The compound is hitting too many off-targets.",
            ],
            correctIndex: 2,
            explanation:
              "Target engagement and efficacy are different claims. Engagement proves the chemistry worked — the compound found and bound its target. If the phenotype is still unchanged, the failure is biological, not chemical: the target itself does not drive the disease. This is precisely the failure mode behind 'lack of efficacy' Phase II attrition, and no amount of downstream medicinal chemistry can rescue it.",
          },
          {
            question:
              "Why is human genetic evidence considered the strongest single form of target validation?",
            options: [
              "Because it proves the target has a druggable binding pocket.",
              "Because genetic experiments are cheaper than chemical ones.",
              "Because it links the target to human disease biology directly, rather than relying on a model organism — and targets with human genetic support succeed in the clinic roughly twice as often.",
              "Because it guarantees the compound will be safe.",
            ],
            correctIndex: 2,
            explanation:
              "Human genetics ties the target to the actual species you intend to treat, sidestepping the translation gap that kills so many mouse-validated targets. Note it says nothing about druggability — a genetically bulletproof target can still be an undruggable flat surface, which is exactly why validation (biology) and druggability (structure) are separate, independent conditions.",
          },
        ]}
      />
    </div>
  );
}
