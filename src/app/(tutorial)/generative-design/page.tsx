"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Info,
  Sliders,
  Compass,
  Layers,
  Cpu,
  AlertTriangle,
} from "lucide-react";
import { Quiz } from "@/components/Quiz";

interface Candidate {
  id: string;
  sa: number; // synthetic accessibility, higher = easier to make
  pot: number; // predicted potency (pIC50), higher = better
}

// A virtual design batch. Both axes are "higher is better".
const CANDIDATES: Candidate[] = [
  { id: "A", sa: 9.2, pot: 5.8 },
  { id: "B", sa: 8.0, pot: 7.0 },
  { id: "C", sa: 6.5, pot: 8.2 },
  { id: "D", sa: 4.8, pot: 9.0 },
  { id: "E", sa: 3.0, pot: 9.5 },
  { id: "F", sa: 8.5, pot: 5.2 },
  { id: "G", sa: 7.0, pot: 6.0 },
  { id: "H", sa: 6.0, pot: 6.5 },
  { id: "I", sa: 5.0, pot: 7.0 },
  { id: "J", sa: 4.0, pot: 7.5 },
  { id: "K", sa: 3.5, pot: 8.0 },
  { id: "L", sa: 2.5, pot: 8.5 },
  { id: "M", sa: 7.5, pot: 6.2 },
  { id: "N", sa: 5.5, pot: 7.8 },
  { id: "O", sa: 2.0, pot: 9.0 },
  { id: "P", sa: 6.0, pot: 8.0 },
];

export default function GenerativeDesignPage() {
  const [weight, setWeight] = useState(0.5); // weight on potency in the scalarized score

  // A candidate is dominated if another is at least as good on BOTH axes and
  // strictly better on at least one.
  const isDominated = (c: Candidate) =>
    CANDIDATES.some(
      (o) => o.sa >= c.sa && o.pot >= c.pot && (o.sa > c.sa || o.pot > c.pot)
    );
  const front = CANDIDATES.filter((c) => !isDominated(c)).sort((a, b) => a.sa - b.sa);

  // Linear scalarization over min-max normalized objectives
  const saVals = CANDIDATES.map((c) => c.sa);
  const potVals = CANDIDATES.map((c) => c.pot);
  const saMin = Math.min(...saVals), saMax = Math.max(...saVals);
  const potMin = Math.min(...potVals), potMax = Math.max(...potVals);
  const norm = (v: number, lo: number, hi: number) => (v - lo) / (hi - lo);
  const scoreOf = (c: Candidate) =>
    weight * norm(c.pot, potMin, potMax) + (1 - weight) * norm(c.sa, saMin, saMax);
  const winner = CANDIDATES.reduce((a, b) => (scoreOf(b) > scoreOf(a) ? b : a));

  // Plot geometry (viewBox 300 x 200)
  const px = (sa: number) => 40 + ((sa - 1.5) / 8.2) * 235;
  const py = (pot: number) => 165 - ((pot - 4.8) / 5.2) * 145;
  const frontPath = front.map((c, i) => `${i === 0 ? "M" : "L"}${px(c.sa).toFixed(1)},${py(c.pot).toFixed(1)}`).join(" ");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1>Module 11: De Novo &amp; Generative Molecular Design</h1>
        <p className="lead text-slate-800">
          Every method so far has been a way of <em>searching</em> for molecules that already exist. This module inverts the question: instead of asking which compound to screen next, we ask <strong>which compound should we make next</strong> — and let the computer design it.
        </p>
      </div>

      <hr className="border-slate-200" />

      {/* Section 1: paradigm */}
      <section className="space-y-4">
        <h2>1. From Searching to Designing</h2>
        <p>
          Virtual screening (Module 8) is fundamentally a <strong>lookup</strong>: you enumerate a catalogue and rank it. That caps you at what vendors happen to stock — perhaps 10¹⁰ molecules in the largest make-on-demand libraries. But drug-like chemical space is estimated at around <strong>10⁶⁰</strong> molecules. Screening explores a rounding error of the possible.
        </p>
        <p>
          <strong>Generative design</strong> constructs molecules from scratch, which reframes drug discovery from <em>&quot;what do we have?&quot;</em> to <em>&quot;what should we make?&quot;</em> — and slots directly into the <strong>Design–Make–Test–Analyse (DMTA)</strong> cycle that governs real medicinal chemistry projects.
        </p>

        <div className="p-4 border-l-4 border-amber-500 bg-amber-50/50 rounded-r-xl space-y-1.5 text-sm">
          <strong className="text-slate-900 block">Chemical space is vast — but it is also full of holes</strong>
          <p className="text-slate-800 leading-relaxed">
            The 10⁶⁰ figure is seductive and slightly misleading. Chemical space is <strong>discontinuous</strong>: a great many structures you can draw on a computer cannot be synthesised, and some cannot physically exist at all. A generative model that ignores this will happily hand you a beautiful, high-scoring, entirely unmakeable molecule. Everything in this module is, in one way or another, a defence against that failure.
          </p>
        </div>
      </section>

      {/* Section 2: the three pillars */}
      <section className="space-y-4">
        <h2>2. The Three Pillars</h2>
        <p>
          Strip away the branding and every generative design system — from a 1990s rule-based grower to a 2026 diffusion model — is built from the same three components, resting on a cheminformatics foundation (Module 5):
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose">
          {[
            { icon: Layers, t: "Construction", q: "How do we build a molecule?", d: "The set of legal moves for assembling or modifying a structure — atom by atom, fragment by fragment, or reaction by reaction." },
            { icon: Compass, t: "Scoring", q: "How good is this molecule?", d: "The function that collapses a chemical structure into a number to be optimized. Get this wrong and the search will optimize the wrong thing, perfectly." },
            { icon: Cpu, t: "Search", q: "Where do we look next?", d: "The strategy for traversing an astronomically large space you can never enumerate — balancing exploration against exploitation." },
          ].map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.t} className="p-4 rounded-xl border border-border bg-white space-y-1.5">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Icon className="h-4 w-4 text-slate-500" /> {p.t}
                </h4>
                <p className="text-xs font-bold text-blue-700 italic">{p.q}</p>
                <p className="text-sm text-slate-800 leading-relaxed">{p.d}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: construction */}
      <section className="space-y-4">
        <h2>3. Construction: The Control ↔ Synthesizability Spectrum</h2>
        <p>
          The three construction strategies are not competing methods so much as points on a single trade-off. <strong>Every step you take toward control costs you synthesizability, and vice versa.</strong>
        </p>

        <div className="not-prose space-y-3">
          {[
            {
              t: "Atom-based",
              tone: "rose",
              control: "Maximum control",
              synth: "Minimum synthesizability",
              d: "Add, delete, or substitute one atom or bond at a time on the molecular graph. The entire periodic table is available and you can place anything anywhere — which is exactly the problem. Nothing constrains the result to be makeable, and every edit must be chased with valence bookkeeping (add a methyl to benzene and you must also delete a hydrogen, or you have created pentavalent carbon).",
            },
            {
              t: "Fragment-based",
              tone: "amber",
              control: "Moderate control",
              synth: "Moderate synthesizability",
              d: "Assemble molecules from a library of building blocks — rings, linkers, and side-chain decorators — usually harvested by fragmenting known drugs. Three macro-strategies: growing (extend a fragment into unoccupied pocket space), linking (join two fragments bound in adjacent subpockets), and merging (fuse two fragments that share a common substructure). The building blocks are real, but nothing guarantees the assembled product is.",
            },
            {
              t: "Reaction-based",
              tone: "emerald",
              control: "Least control",
              synth: "Maximum synthesizability",
              d: "Build molecules only by applying encoded reaction transformations (SMIRKS, Module 5) to real available building blocks — an amide coupling, a Suzuki, a reductive amination. You cannot place a halogen on a strained ring just because you want to, because no transformation will do it. In exchange, the output arrives with a synthetic route attached.",
            },
          ].map((c) => (
            <div key={c.t} className={`p-4 rounded-xl border-l-4 bg-white border border-border ${c.tone === "rose" ? "border-l-rose-500" : c.tone === "amber" ? "border-l-amber-500" : "border-l-emerald-500"}`}>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h4 className="font-bold text-sm text-slate-900">{c.t}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{c.control}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{c.synth}</span>
              </div>
              <p className="text-sm text-slate-800 leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 font-medium">
          <span className="font-bold text-slate-900">The closed loop.</span> Reaction-based design has a property the others lack: it connects back to the lab. Chemists run reactions and record them in electronic lab notebooks; those reactions are mined into transformation templates; the templates design new molecules; chemists make them and record the results. The design system gets better precisely because the chemistry it proposes is the chemistry people actually do.
        </div>
      </section>

      {/* Section 4: scoring */}
      <section className="space-y-4">
        <h2>4. Scoring: Explicit, Implicit, and the Trap of Optimizing One Number</h2>
        <p>
          Scoring is the hardest pillar, because it is where the chemistry and biology of your project must be compressed into a number that a search algorithm will relentlessly maximize. Scores split into two kinds:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900">Explicit scores</h4>
            <p className="text-sm text-slate-800 leading-relaxed">
              Anything you can compute: a docking score (Module 6), an MM/GBSA or FEP free energy (Module 10), a QSAR prediction (Module 9), logP, TPSA, a QED drug-likeness score. Objective, reproducible, and cheap to state precisely.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              <strong>Receptor-based</strong> (needs the target structure) vs <strong>ligand-based</strong> (descriptors and pharmacophores only).
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900">Implicit scores</h4>
            <p className="text-sm text-slate-800 leading-relaxed">
              The medicinal chemist&apos;s judgement — &quot;I don&apos;t like that group&quot;, &quot;we&apos;ll never make that&quot;, &quot;that will be a metabolic liability&quot;. Subjective, hard to encode, and routinely the thing that decides whether a designed molecule is ever synthesised.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              Two molecules can share an identical calculated logP of 2.64 and be worlds apart in whether a chemist would touch them.
            </p>
          </div>
        </div>

        <div className="p-4 border-l-4 border-rose-500 bg-rose-50/50 rounded-r-xl space-y-1.5 text-sm">
          <strong className="text-slate-900 block">Generative models are ruthless reward hackers</strong>
          <p className="text-slate-800 leading-relaxed">
            If you optimize a single objective, you will get it — and nothing else. Optimize docking score alone and the model will hand you enormous greasy molecules that score beautifully and dissolve in nothing, because more atoms means more favourable contacts. The score was not wrong; it was <em>incomplete</em>. This is why real design is always <strong>multi-objective</strong>.
          </p>
        </div>
      </section>

      {/* Interactive Playground: Pareto */}
      <section className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2">
          <Sliders size={18} className="text-slate-900" />
          <h3 className="font-bold text-base text-slate-900">Interactive Playground: The Pareto Frontier</h3>
        </div>
        <p className="text-sm text-slate-800 leading-normal">
          A batch of 16 designed molecules, scored on two objectives that genuinely fight each other: <strong>potency</strong> and <strong>synthesizability</strong>. Slide the weight to change what your project cares about, and watch which molecule wins. The lesson is in what <em>never</em> wins.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-5 rounded-lg border border-slate-200">
          {/* Plot */}
          <div className="md:col-span-7">
            <svg viewBox="0 0 300 200" className="w-full">
              {/* axes */}
              <line x1="40" y1="165" x2="288" y2="165" stroke="currentColor" className="text-slate-300" strokeWidth="1" />
              <line x1="40" y1="12" x2="40" y2="165" stroke="currentColor" className="text-slate-300" strokeWidth="1" />
              <text x="164" y="185" textAnchor="middle" fontSize="8" className="fill-slate-600 font-bold">Synthesizability (easier →)</text>
              <text x="12" y="88" fontSize="8" className="fill-slate-600 font-bold" transform="rotate(-90 12 88)" textAnchor="middle">Potency (pIC₅₀) →</text>

              {/* Pareto frontier line */}
              <path d={frontPath} fill="none" stroke="currentColor" className="text-emerald-500" strokeWidth="1.5" strokeDasharray="4,3" />
              <text x={px(front[0]?.sa ?? 3) - 4} y={py(front[0]?.pot ?? 9) - 8} fontSize="7" className="fill-emerald-700 font-bold">Pareto frontier</text>

              {/* candidates */}
              {CANDIDATES.map((c) => {
                const dom = isDominated(c);
                const isWin = c.id === winner.id;
                return (
                  <g key={c.id}>
                    <circle
                      cx={px(c.sa)}
                      cy={py(c.pot)}
                      r={isWin ? 7 : dom ? 3.5 : 5}
                      className={
                        isWin
                          ? "fill-blue-600 stroke-white"
                          : dom
                          ? "fill-slate-300"
                          : "fill-emerald-500 stroke-white"
                      }
                      strokeWidth={isWin || !dom ? 1.5 : 0}
                    />
                    {(!dom || isWin) && (
                      <text x={px(c.sa)} y={py(c.pot) - 9} textAnchor="middle" fontSize="7" className={isWin ? "fill-blue-700 font-bold" : "fill-slate-600 font-bold"}>
                        {c.id}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
            <div className="flex flex-wrap gap-3 justify-center text-[10px] font-bold mt-1">
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" /> Non-dominated (on the frontier)</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-slate-300 inline-block" /> Dominated</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-blue-600 inline-block" /> Current winner</span>
            </div>
          </div>

          {/* Controls */}
          <div className="md:col-span-5 space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                <span>Weight on potency</span>
                <span className="font-mono text-slate-900">{weight.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                className="w-full h-1.5 rounded appearance-none cursor-pointer accent-slate-900 bg-slate-100"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>all synthesizability</span>
                <span>all potency</span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-blue-200 bg-blue-50">
              <span className="text-[10px] text-slate-700 font-bold uppercase tracking-wider block">Molecule the search would pick</span>
              <p className="text-2xl font-bold font-mono text-blue-700 mt-0.5">{winner.id}</p>
              <div className="text-[11px] font-mono text-slate-700 mt-1 space-y-0.5">
                <div className="flex justify-between"><span>potency</span><span className="font-bold">{winner.pot.toFixed(1)}</span></div>
                <div className="flex justify-between"><span>synthesizability</span><span className="font-bold">{winner.sa.toFixed(1)}</span></div>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-700 leading-snug space-y-1.5">
              <p>
                <span className="font-bold text-slate-900">{front.length} of {CANDIDATES.length}</span> molecules are non-dominated. Sweep the weight from 0 to 1 and you will find the winner is <strong>always</strong> one of them.
              </p>
              <p>
                The other <span className="font-bold text-slate-900">{CANDIDATES.length - front.length}</span> are dominated — some other molecule is at least as potent <em>and</em> at least as makeable. <strong>No weighting will ever select them.</strong> Synthesising one is strictly wasted effort.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs font-semibold text-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Info className="h-4 w-4 text-blue-600" /> What the frontier is actually telling you
          </span>
          <ul className="list-disc pl-5 space-y-1 font-medium leading-relaxed">
            <li><strong>Multi-objective optimization does not return an answer — it returns a menu.</strong> The frontier is the set of rational choices; picking a point on it is a <em>project decision</em> (how much potency will you trade for a route your chemists can actually run?), not a computation.</li>
            <li><strong>Dominated molecules are the real output of a bad scoring function.</strong> They are not merely suboptimal, they are never optimal for any preference whatsoever.</li>
            <li><strong>Collapsing objectives into one weighted number hides the trade-off.</strong> Fix the weight at 0.5 and you would only ever see molecule <span className="font-mono">{CANDIDATES.reduce((a, b) => (0.5 * norm(b.pot, potMin, potMax) + 0.5 * norm(b.sa, saMin, saMax) > 0.5 * norm(a.pot, potMin, potMax) + 0.5 * norm(a.sa, saMin, saMax) ? b : a)).id}</span> — and never learn that a slightly different preference buys you a very different molecule.</li>
          </ul>
        </div>
      </section>

      {/* Section 5: search */}
      <section className="space-y-4">
        <h2>5. Search: Exploration vs. Exploitation</h2>
        <p>
          Search is what makes the space tractable. Consider reaction-based design with ~4,500 available transformations: a mere four-step synthesis already implies on the order of 4,500⁴ ≈ 4 × 10¹⁴ possible trajectories. Exhaustive enumeration is not slow — it is impossible. Every search algorithm is therefore a policy for <strong>sampling</strong>, and each one answers the same question differently:
        </p>
        <p className="text-sm text-slate-800 leading-relaxed font-semibold bg-slate-50 border border-slate-200 rounded-lg p-3">
          Do I <em>exploit</em> — refine the best thing I have found so far — or do I <em>explore</em> — try something unfamiliar that might be better, or might waste the step?
        </p>

        <div className="overflow-x-auto not-prose border border-slate-200 rounded-lg">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left font-bold text-slate-900">Strategy</th>
                <th className="px-3 py-2 text-left font-bold text-slate-900">How it decides</th>
                <th className="px-3 py-2 text-left font-bold text-slate-900">Character</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-slate-800">
              <tr><td className="px-3 py-2 font-semibold">Systematic enumeration</td><td className="px-3 py-2">Try every legal move in order</td><td className="px-3 py-2">Fully deterministic; only viable for tiny spaces</td></tr>
              <tr><td className="px-3 py-2 font-semibold">Monte Carlo</td><td className="px-3 py-2">Pick moves at random; accept good ones, accept bad ones occasionally (Module 6)</td><td className="px-3 py-2">Stochastic; escapes local optima by design</td></tr>
              <tr><td className="px-3 py-2 font-semibold">Genetic algorithm</td><td className="px-3 py-2">Keep a population; crossover and mutate the fittest molecules</td><td className="px-3 py-2">Stochastic; good at recombining partial solutions</td></tr>
              <tr><td className="px-3 py-2 font-semibold">ε-greedy</td><td className="px-3 py-2">Take the best-known move with probability 1−ε, a random one with probability ε</td><td className="px-3 py-2">The simplest explicit exploration/exploitation dial</td></tr>
              <tr><td className="px-3 py-2 font-semibold">Monte Carlo Tree Search</td><td className="px-3 py-2">Build a tree of moves, expanding branches that look promising <em>and</em> under-explored</td><td className="px-3 py-2">Balances the trade-off adaptively; strong for multi-step synthesis</td></tr>
              <tr><td className="px-3 py-2 font-semibold">Reinforcement learning</td><td className="px-3 py-2">Train a generator so that high scores become more probable outputs</td><td className="px-3 py-2">The scoring function reshapes the generator itself</td></tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 border-l-4 border-amber-500 bg-amber-50/50 rounded-r-xl space-y-1.5 text-sm">
          <strong className="text-slate-900 block flex items-center gap-1.5"><AlertTriangle className="h-4 w-4 text-amber-600" />Mode collapse</strong>
          <p className="text-slate-800 leading-relaxed">
            Push exploitation too hard — especially with reinforcement learning — and the generator discovers one high-scoring scaffold and produces it forever, in thousands of trivial variations. The score goes up; the chemistry goes nowhere. Diversity is not a nice-to-have in generative design, it is a constraint you must actively defend.
          </p>
        </div>
      </section>

      {/* Section 6: 3D diffusion */}
      <section className="space-y-4">
        <h2>6. 3D Pocket-Conditioned Diffusion</h2>
        <p>
          The most powerful structure-based generators do not build a SMILES string and dock it afterwards — they generate <strong>directly inside the pocket in 3D</strong>. Models such as Pocket2Mol and DiffSBDD treat the protein pocket coordinates as boundary conditions and iteratively denoise a random cloud of atoms into a molecule.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900">Continuous denoising diffusion</h4>
            <p className="text-sm text-slate-800 leading-relaxed">
              Start from a random swarm of atoms in the pocket. Over many denoising steps the model refines their Cartesian coordinates and atom identities (C, N, O…) toward a chemically sensible, electrostatically complementary structure — then infers the bonds.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1">
            <h4 className="font-bold text-sm text-slate-900">Why 3D conditioning helps</h4>
            <p className="text-sm text-slate-800 leading-relaxed">
              Designing in the pocket means hydrogen bonds, hydrophobic surfaces, and steric walls are satisfied <em>during</em> generation rather than checked afterwards. It fuses the construction and scoring pillars into a single learned step.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 font-medium">
          <span className="font-bold text-slate-900">Map it back to the three pillars.</span> A diffusion model is not a fourth thing — it is an <em>atom-based constructor</em> (it places atoms directly, with all the freedom that implies), with scoring folded into the learned denoiser, and search replaced by sampling from the model. Which means it inherits the atom-based weakness exactly as the spectrum predicts: <strong>the molecules can be gorgeous and unmakeable.</strong> This is why pocket-conditioned generators are almost always paired with a downstream synthetic-accessibility filter — a reaction-based sanity check bolted onto an atom-based generator.
        </div>
      </section>

      {/* Quiz */}
      <Quiz
        moduleTitle="Module 11: De Novo & Generative Molecular Design"
        questions={[
          {
            question:
              "Your generative model optimizes docking score alone and returns very large, highly lipophilic molecules with superb predicted affinity. What went wrong?",
            options: [
              "The docking scoring function is buggy and must be replaced.",
              "The search algorithm collapsed into a local minimum.",
              "Nothing is wrong with the score — it is incomplete. Docking scores generally improve with more atoms making more contacts, so single-objective optimization drives molecular size upward. The fix is multi-objective scoring that also penalizes size, lipophilicity and synthetic difficulty.",
              "The construction method must have been reaction-based.",
            ],
            correctIndex: 2,
            explanation:
              "This is the classic reward-hacking failure. The model did exactly what you asked: it maximized the number you gave it. Because docking scores tend to reward additional favourable contacts, 'more atoms' is a legitimate strategy for maximizing that one objective. The generator is not broken — the objective was under-specified. Real design requires balancing several objectives simultaneously, which is why the Pareto frontier matters.",
          },
          {
            question:
              "In the Pareto playground, molecule H (synthesizability 6.0, potency 6.5) is dominated. What does that mean practically?",
            options: [
              "H is the second-best molecule and should be kept as a backup.",
              "H would be selected if you weighted synthesizability highly enough.",
              "At least one other molecule is as good or better on BOTH objectives, so no weighting of potency vs synthesizability could ever make H the optimal choice — synthesising it is strictly wasted effort.",
              "H is dominated only because the scoring function is inaccurate.",
            ],
            correctIndex: 2,
            explanation:
              "Domination is absolute, not a matter of preference. Molecule C (6.5, 8.2) beats H on both axes — it is easier to make AND more potent. There is no set of weights, no project priority, no trade-off under which H is the right answer. That is what makes the Pareto frontier so useful: it discards options that are irrational under every preference, leaving only genuine trade-offs.",
          },
          {
            question:
              "Why are atom-based construction and 3D pocket-conditioned diffusion models prone to the same weakness?",
            options: [
              "Both are too slow to be used in practice.",
              "Both place atoms directly with essentially unconstrained freedom, so nothing in the generation process requires the result to be synthesisable — which is why both are typically paired with a downstream synthetic-accessibility filter.",
              "Both can only generate molecules that already exist in the training set.",
              "Both require a known protein structure to work at all.",
            ],
            correctIndex: 1,
            explanation:
              "A diffusion model is an atom-based constructor wearing a neural network. It positions atoms wherever the denoiser wants them, which grants maximum control over the chemistry and — by the control/synthesizability spectrum — minimum guarantee that a chemist can make the result. Reaction-based methods avoid this by construction, since they can only ever apply transformations that real chemists actually run.",
          },
        ]}
      />
    </div>
  );
}
