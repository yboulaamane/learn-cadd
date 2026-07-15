"use client";

import React, { useState } from "react";
import { 
  GitBranch, 
  Binary, 
  HelpCircle,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
  RefreshCw,
  Info
} from "lucide-react";
import { Quiz } from "@/components/Quiz";
import { CollapsibleCode } from "@/components/CollapsibleCode";

interface MoleculeData {
  id: string;
  name: string;
  smiles: string;
  formula: string;
  desc: string;
  nodes: { id: number; label: string; x: number; y: number; element: string; charge?: string }[];
  edges: { source: number; target: number; type: string }[];
  fingerprint: number[]; // 32-bit ECFP illustration
}

const molecules: Record<string, MoleculeData> = {
  dopamine: {
    id: "dopamine",
    name: "Dopamine",
    smiles: "NCCc1ccc(O)c(O)c1",
    formula: "C₈H₁₁NO₂",
    desc: "An organic chemical of the catecholamine family that functions as a hormone and neurotransmitter in the brain.",
    nodes: [
      { id: 1, label: "C", x: 60, y: 70, element: "C" },
      { id: 2, label: "C", x: 90, y: 55, element: "C" },
      { id: 3, label: "C", x: 120, y: 70, element: "C" },
      { id: 4, label: "C", x: 120, y: 105, element: "C" },
      { id: 5, label: "C", x: 90, y: 120, element: "C" },
      { id: 6, label: "C", x: 60, y: 105, element: "C" },
      { id: 7, label: "O", x: 150, y: 55, element: "O" }, // 3-OH
      { id: 8, label: "O", x: 150, y: 120, element: "O" }, // 4-OH
      { id: 9, label: "C", x: 30, y: 55, element: "C" },  // beta-carbon
      { id: 10, label: "C", x: 0, y: 70, element: "C" },   // alpha-carbon
      { id: 11, label: "N", x: -30, y: 55, element: "N" }  // primary amine (neutral free base, matches SMILES + formula)
    ],
    edges: [
      { source: 1, target: 2, type: "double" },
      { source: 2, target: 3, type: "single" },
      { source: 3, target: 4, type: "double" },
      { source: 4, target: 5, type: "single" },
      { source: 5, target: 6, type: "double" },
      { source: 6, target: 1, type: "single" },
      { source: 3, target: 7, type: "single" },
      { source: 4, target: 8, type: "single" },
      { source: 1, target: 9, type: "single" },
      { source: 9, target: 10, type: "single" },
      { source: 10, target: 11, type: "single" }
    ],
    fingerprint: [1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1]
  },
  adrenaline: {
    id: "adrenaline",
    name: "Adrenaline",
    smiles: "CNC[C@H](O)C1=CC=C(O)C(O)=C1",
    formula: "C₉H₁₃NO₃",
    desc: "A hormone and neurotransmitter involved in the fight-or-flight response, structurally derived from dopamine with a beta-hydroxyl group and N-methyl group.",
    nodes: [
      { id: 1, label: "C", x: 60, y: 70, element: "C" },
      { id: 2, label: "C", x: 90, y: 55, element: "C" },
      { id: 3, label: "C", x: 120, y: 70, element: "C" },
      { id: 4, label: "C", x: 120, y: 105, element: "C" },
      { id: 5, label: "C", x: 90, y: 120, element: "C" },
      { id: 6, label: "C", x: 60, y: 105, element: "C" },
      { id: 7, label: "O", x: 150, y: 55, element: "O" }, // 3-OH
      { id: 8, label: "O", x: 150, y: 120, element: "O" }, // 4-OH
      { id: 9, label: "C", x: 30, y: 55, element: "C" },  // beta-carbon
      { id: 10, label: "O", x: 30, y: 25, element: "O" },  // beta-OH
      { id: 11, label: "C", x: 0, y: 70, element: "C" },   // alpha-carbon
      { id: 12, label: "N", x: -30, y: 55, element: "N" },  // amine
      { id: 13, label: "C", x: -60, y: 70, element: "C" }   // N-methyl
    ],
    edges: [
      { source: 1, target: 2, type: "double" },
      { source: 2, target: 3, type: "single" },
      { source: 3, target: 4, type: "double" },
      { source: 4, target: 5, type: "single" },
      { source: 5, target: 6, type: "double" },
      { source: 6, target: 1, type: "single" },
      { source: 3, target: 7, type: "single" },
      { source: 4, target: 8, type: "single" },
      { source: 1, target: 9, type: "single" },
      { source: 9, target: 10, type: "single" },
      { source: 9, target: 11, type: "single" },
      { source: 11, target: 12, type: "single" },
      { source: 12, target: 13, type: "single" }
    ],
    fingerprint: [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1]
  },
  ibuprofen: {
    id: "ibuprofen",
    name: "Ibuprofen",
    smiles: "CC(C)CC1=CC=C(C=C1)C(C)C(=O)O",
    formula: "C₁₃H₁₈O₂",
    desc: "A nonsteroidal anti-inflammatory drug (NSAID) containing an aromatic core with an isobutyl group and a propionic acid chain.",
    nodes: [
      { id: 1, label: "C", x: 60, y: 70, element: "C" },
      { id: 2, label: "C", x: 90, y: 55, element: "C" },
      { id: 3, label: "C", x: 120, y: 70, element: "C" },
      { id: 4, label: "C", x: 120, y: 105, element: "C" },
      { id: 5, label: "C", x: 90, y: 120, element: "C" },
      { id: 6, label: "C", x: 60, y: 105, element: "C" },
      { id: 7, label: "C", x: 150, y: 55, element: "C" },  // chiral carbon
      { id: 8, label: "C", x: 180, y: 70, element: "C" },  // carbonyl carbon
      { id: 9, label: "O", x: 210, y: 55, element: "O" },  // acid OH
      { id: 10, label: "O", x: 180, y: 100, element: "O" }, // acid =O
      { id: 11, label: "C", x: 150, y: 25, element: "C" },  // methyl
      { id: 12, label: "C", x: 30, y: 120, element: "C" },  // isobutyl CH2 (para to acid, on C6)
      { id: 13, label: "C", x: 0, y: 105, element: "C" },   // isobutyl CH
      { id: 14, label: "C", x: -30, y: 120, element: "C" }, // isopropyl methyl 1
      { id: 15, label: "C", x: 0, y: 75, element: "C" }     // isopropyl methyl 2
    ],
    edges: [
      { source: 1, target: 2, type: "double" },
      { source: 2, target: 3, type: "single" },
      { source: 3, target: 4, type: "double" },
      { source: 4, target: 5, type: "single" },
      { source: 5, target: 6, type: "double" },
      { source: 6, target: 1, type: "single" },
      { source: 3, target: 7, type: "single" },
      { source: 7, target: 8, type: "single" },
      { source: 8, target: 9, type: "single" },
      { source: 8, target: 10, type: "double" },
      { source: 7, target: 11, type: "single" },
      { source: 6, target: 12, type: "single" },
      { source: 12, target: 13, type: "single" },
      { source: 13, target: 14, type: "single" },
      { source: 13, target: 15, type: "single" }
    ],
    fingerprint: [1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0]
  }
};

export default function CheminformaticsPage() {
  const [selectedA, setSelectedA] = useState<string>("dopamine");
  const [selectedB, setSelectedB] = useState<string>("adrenaline");
  const [selectedAtom, setSelectedAtom] = useState<number | null>(null);
  const [hoveredAtom, setHoveredAtom] = useState<number | null>(null);
  const [ecfpRadius, setEcfpRadius] = useState<number>(1); // radius 0, 1, 2

  const molA = molecules[selectedA];
  const molB = molecules[selectedB];

  // Helper to calculate Tanomoto similarity
  const getTanimoto = (fp1: number[], fp2: number[]) => {
    let intersection = 0;
    let union = 0;
    for (let i = 0; i < fp1.length; i++) {
      if (fp1[i] === 1 && fp2[i] === 1) intersection++;
      if (fp1[i] === 1 || fp2[i] === 1) union++;
    }
    return union === 0 ? 0 : intersection / union;
  };

  const tanimotoScore = getTanimoto(molA.fingerprint, molB.fingerprint);

  // Helper to find neighboring atoms in graph up to a certain radius
  const getNeighborhoodAtoms = (mol: MoleculeData, centerId: number, radius: number): Set<number> => {
    const visited = new Set<number>([centerId]);
    let currentQueue = [centerId];

    for (let step = 0; step < radius; step++) {
      const nextQueue: number[] = [];
      for (const nodeId of currentQueue) {
        mol.edges.forEach((edge) => {
          if (edge.source === nodeId && !visited.has(edge.target)) {
            visited.add(edge.target);
            nextQueue.push(edge.target);
          } else if (edge.target === nodeId && !visited.has(edge.source)) {
            visited.add(edge.source);
            nextQueue.push(edge.source);
          }
        });
      }
      currentQueue = nextQueue;
    }
    return visited;
  };

  const highlightedNeighbors = selectedAtom !== null 
    ? getNeighborhoodAtoms(molA, selectedAtom, ecfpRadius) 
    : new Set<number>();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1>Module 3: Cheminformatics &amp; Molecular Representations</h1>
        <p className="lead text-slate-600">
          Understand how computers represent, process, and analyze chemical molecules. Master connection tables, line notations (SMILES/SMARTS), molecular descriptors, and structural fingerprint similarity.
        </p>
      </div>

      <hr className="border-slate-100 dark:border-slate-900" />

      {/* Section 1: Overview */}
      <section className="space-y-4">
        <h2>1. Computers vs. Chemists: The Structural Challenge</h2>
        <p>
          Molecules are dynamic quantum-mechanical objects. Representing them computationally requires approximations across different dimensional spaces. Modern chemical AI models organize these representations into three primary families:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-2 not-prose">
          <div className="border border-border rounded-xl p-4 bg-white shadow-sm space-y-1">
            <h4 className="font-bold text-sm text-foreground">Discrete Representations</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Express structures as distinct symbolic units. Includes molecular graphs (atoms and bonds), 1D text strings (SMILES, SELFIES), and binary bit vectors. They are human-interpretable and highly traceable.
            </p>
          </div>
          <div className="border border-border rounded-xl p-4 bg-white shadow-sm space-y-1">
            <h4 className="font-bold text-sm text-foreground">Continuous Representations</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Express chemical features as real-valued vectors or spatial functions (like Cartesian coordinate arrays or learned neural embeddings from GNNs). Essential for gradient-based deep learning.
            </p>
          </div>
          <div className="border border-border rounded-xl p-4 bg-white shadow-sm space-y-1">
            <h4 className="font-bold text-sm text-foreground">Hybrid Architectures (LLMs)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Large Language Models that tokenize discrete chemical notations into continuous embeddings, perform reasoning in latent spaces, and decode them back to discrete structures.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Core Formats */}
      <section className="space-y-4">
        <h2>2. Standard Representations: SMILES, SELFIES, SMARTS, & SDF</h2>
        <p>
          Several formats serve as standard representations for transferring structural files between databases (like ChEMBL or PubChem) and computational docking algorithms:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h3 className="font-bold text-sm text-slate-900">SMILES Notation</h3>
            <p className="text-sm text-slate-800 leading-relaxed">
              A line notation language storing structural topology in ASCII strings. Atoms are elements, branching is enclosed in parentheses <code>()</code>, and ring closure coordinates are designated by digits.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h3 className="font-bold text-sm text-slate-900">SELFIES Notation</h3>
            <p className="text-sm text-slate-800 leading-relaxed">
              A self-referencing line notation built for machine learning. Unlike SMILES, where random mutations yield invalid chemistry, SELFIES grammar guarantees that <strong>100% of generated strings</strong> translate to syntactically valid molecules.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h3 className="font-bold text-sm text-slate-900">SMARTS Substructures</h3>
            <p className="text-sm text-slate-800 leading-relaxed">
              An extension of SMILES for specifying patterns to filter molecules. It permits expressions like wildcards, aromatic checks, and coordinate counts to identify toxicophores or functional cores.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h3 className="font-bold text-sm text-slate-900">SMIRKS Reactions</h3>
            <p className="text-sm text-slate-800 leading-relaxed">
              A line notation for chemical transformations. Whereas SMILES represents molecules and SMARTS represents queries, SMIRKS represents *reactions* (e.g. <code>[C:1](=[O:2])[O:3] &gt;&gt; [C:1](=[O:2])[Cl:4]</code>), mapping reactant atoms to products via indexes.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
            <h3 className="font-bold text-sm text-slate-900">SDF/MOL Tables</h3>
            <p className="text-sm text-slate-800 leading-relaxed">
              Files that record explicit 3D spatial coordinate blocks (x, y, z) and connection arrays matching each atom index to specify atomic types, charges, and formal bond topologies.
            </p>
          </div>
        </div>

        {/* InChI & InChIKey Subsection */}
        <div className="mt-6 space-y-4 not-prose">
          <h3 className="font-bold text-base text-slate-900">InChI &amp; InChIKey: The Universal Chemical Identifier</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
              <h4 className="font-bold text-sm text-slate-900">InChI (International Chemical Identifier)</h4>
              <p className="text-sm text-slate-800 leading-relaxed">
                A machine-readable canonical string developed by IUPAC and NIST. Unlike SMILES, which can have multiple valid representations for the same molecule, InChI provides a <strong>single unique canonical representation</strong>. It uses a layered format encoding: formula, connectivity, hydrogen, charge, and stereochemistry.
              </p>
              <div className="mt-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Caffeine InChI</span>
                <code className="text-xs font-mono text-slate-800 break-all leading-relaxed">InChI=1S/C8H10N4O2/c1-10-4-9-6-5(10)7(13)12(3)8(14)11(6)2/h4H,1-3H3</code>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-white space-y-1.5">
              <h4 className="font-bold text-sm text-slate-900">InChIKey</h4>
              <p className="text-sm text-slate-800 leading-relaxed">
                A fixed-length <strong>27-character hash</strong> derived from an InChI string. Its format follows the pattern <code>XXXXXXXXXXXXXX-YYYYYYYYYY-Z</code> (14 characters encoding connectivity, 10 characters for other layers, and 1 version character). InChIKey enables exact-match database searching across ChEMBL, PubChem, and other chemical databases.
              </p>
              <div className="mt-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Caffeine InChIKey</span>
                <code className="text-xs font-mono text-slate-800 break-all leading-relaxed">RYYVLZVUVIJVGH-UHFFFAOYSA-N</code>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1.5">
            <div className="flex items-center gap-2">
              <Info size={14} className="text-blue-600 flex-shrink-0" />
              <h4 className="font-bold text-sm text-blue-900">Why InChIKey Matters for QSAR</h4>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed">
              During data curation, InChIKey serves as the <strong>unique compound identifier for deduplication</strong>. Two molecules with different SMILES strings but identical InChIKeys are the same compound; this is critical for removing duplicates before training machine learning models.
            </p>
          </div>

          {/* User-Friendly InChI/InChIKey Code Block */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-semibold text-slate-800 space-y-2 mt-4">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Info className="h-4 w-4 text-blue-600" /> How it works:
            </span>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Chem.MolFromSmiles:</strong> Parses a 1D SMILES string to reconstruct a molecular graph database entry.</li>
              <li><strong>Chem.MolToInchi:</strong> IUPAC NIST converter that generates a canonical, layered string representation of structural layers.</li>
              <li><strong>inchi.InchiToInchiKey:</strong> Generates a fixed-length 27-character hash, ideal for rapid database indexing and deduplication.</li>
            </ul>
          </div>

          <CollapsibleCode
            title="InChI &amp; InChIKey Generation Script"
            code={`from rdkit import Chem
from rdkit.Chem import inchi

# 1. Parse SMILES representation into RDKit Molecular Connection Object (Caffeine molecule)
smiles_string = 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C'
mol = Chem.MolFromSmiles(smiles_string)

if mol:
    # 2. Convert Molecular Object to canonical layered InChI representation
    inchi_str = Chem.MolToInchi(mol)
    
    # 3. Hash the InChI string to produce a fixed-length 27-character identifier (InChIKey)
    inchi_key = inchi.InchiToInchiKey(inchi_str)
    
    # 4. Output results (InChIKey is format-standardized for exact matching in PubChem/ChEMBL)
    print('InChI String: ', inchi_str)
    print('InChIKey Hash: ', inchi_key)`}
          />

          {/* The Isomerism Landscape */}
          <div className="border-t border-slate-200 pt-6 mt-6 space-y-4">
            <h4 className="font-bold text-sm text-slate-900">The Isomerism Landscape</h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>Isomers</strong> share a molecular formula but differ in some other way — and almost every kind changes biological activity. R/S chirality is only one branch of the tree. The split that matters most for a cheminformatician is whether the <em>connectivity</em> changes (a different graph) or only the <em>spatial arrangement</em> does (the same graph).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <h5 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-teal-500" />
                  Constitutional (Structural) Isomers — different connectivity
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The atoms are bonded together in a different order, so the molecular <strong>graph itself differs</strong>. These are trivially distinguished by any 2D representation — different SMILES, different fingerprints, different everything.
                </p>
                <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1">
                  <li><strong>Chain / skeletal:</strong> butane <code>CCCC</code> vs isobutane <code>CC(C)C</code>.</li>
                  <li><strong>Positional (regioisomers):</strong> where a substituent sits on a ring. Ibuprofen is the <em>para</em> isomer <code>CC(C)Cc1ccc(...)cc1</code>; the <em>meta</em> isomer is a different, inactive compound.</li>
                  <li><strong>Functional group:</strong> ethanol <code>CCO</code> vs dimethyl ether <code>COC</code> — same C₂H₆O, entirely different chemistry.</li>
                  <li><strong>Tautomers:</strong> a special case that interconverts rapidly (keto ⇌ enol). See tautomer canonicalization in the curation section below.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <h5 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  Stereoisomers — same connectivity, different 3D arrangement
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The graph is <strong>identical</strong>; only the spatial arrangement differs. These are the dangerous ones computationally — a naive 2D pipeline cannot see them at all.
                </p>
                <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1">
                  <li><strong>Enantiomers (R/S):</strong> non-superimposable mirror images. One <em>eutomer</em> fits the pocket; the <em>distomer</em> may be inactive or toxic (thalidomide).</li>
                  <li><strong>Diastereomers:</strong> stereoisomers that are <em>not</em> mirror images (≥2 stereocentres, differing at some but not all). Ephedrine vs pseudoephedrine — different compounds, different pharmacology.</li>
                  <li><strong>Geometric (cis/trans, E/Z):</strong> restricted rotation about a C=C or ring. Only <em>(Z)</em>-tamoxifen is the active antiestrogen; <em>(E)</em>-diethylstilbestrol (Module 5) is the active estrogen.</li>
                  <li><strong>Atropisomers:</strong> axial chirality from hindered rotation about a single bond (biaryls) — now a formal regulatory concern in kinase-inhibitor programmes.</li>
                  <li><strong>Conformers (rotamers):</strong> interconvert by free rotation, so not separable compounds — but the <em>bioactive conformation</em> is what the receptor sees (Module 5).</li>
                </ul>
              </div>
            </div>

            <div className="overflow-x-auto not-prose border border-slate-200 rounded-lg">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-bold text-slate-900">Isomer type</th>
                    <th className="px-3 py-2 text-left font-bold text-slate-900">How SMILES encodes it</th>
                    <th className="px-3 py-2 text-left font-bold text-slate-900">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                  <tr>
                    <td className="px-3 py-2 font-semibold">Constitutional</td>
                    <td className="px-3 py-2">Different atom/bond ordering — a different string entirely</td>
                    <td className="px-3 py-2 font-mono">CCO vs COC</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-semibold">Enantiomer / diastereomer</td>
                    <td className="px-3 py-2">Tetrahedral tags <code>@</code> / <code>@@</code></td>
                    <td className="px-3 py-2 font-mono">C[C@H](N)C(=O)O</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-semibold">Geometric (E/Z)</td>
                    <td className="px-3 py-2">Directional bonds <code>/</code> and <code>\</code></td>
                    <td className="px-3 py-2 font-mono">F/C=C/F (E) vs F/C=C\F (Z)</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-semibold">Atropisomer</td>
                    <td className="px-3 py-2">Not captured by default — needs explicit axial stereo or 3D coordinates</td>
                    <td className="px-3 py-2 font-mono text-slate-500">(3D required)</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-semibold">Conformer</td>
                    <td className="px-3 py-2">Never encoded — SMILES is a 2D topology, not a geometry</td>
                    <td className="px-3 py-2 font-mono text-slate-500">(conformer search)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs font-semibold text-amber-900 space-y-2">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <Info className="h-4 w-4 text-amber-600" /> Critical: standard fingerprints are stereo-blind
              </span>
              <p className="leading-relaxed font-medium">
                ECFP4/Morgan fingerprints encode <strong>topology only</strong>. By default, two enantiomers hash to the <strong>identical</strong> bit vector — a Tanimoto of <strong>1.00</strong> — so a QSAR model literally cannot tell the eutomer from the distomer. Passing <code>useChirality=True</code> drops that pair to ≈<strong>0.71</strong> and lets the model separate them. Constitutional isomers, by contrast, are always distinguishable because the graph differs. If your endpoint depends on stereochemistry, a default 2D fingerprint will silently cap your model&apos;s accuracy.
              </p>
            </div>

            <CollapsibleCode
              title="Detecting Every Isomer Type in RDKit"
              code={`from rdkit import Chem
from rdkit.Chem import AllChem, DataStructs

# ---------------------------------------------------------------
# 1. CONSTITUTIONAL ISOMERS: same formula, different graph
# ---------------------------------------------------------------
ethanol, dme = Chem.MolFromSmiles('CCO'), Chem.MolFromSmiles('COC')
# Both are C2H6O, but the canonical SMILES (and any fingerprint) differ.

# ---------------------------------------------------------------
# 2. TETRAHEDRAL STEREOCENTRES (R/S enantiomers & diastereomers)
# ---------------------------------------------------------------
mol = Chem.MolFromSmiles('CN[C@@H](C)[C@H](O)c1ccccc1')  # ephedrine-like
Chem.AssignStereochemistry(mol, cleanIt=True, force=True)
print(Chem.FindMolChiralCenters(mol, useLegacyImplementation=False))
# -> [(2, 'S'), (4, 'R')]  ... flipping ONE centre gives a diastereomer,
#    flipping BOTH gives the enantiomer.

# ---------------------------------------------------------------
# 3. DOUBLE-BOND GEOMETRY (E/Z) -- encoded with / and \\
# ---------------------------------------------------------------
for smi in ['F/C=C/F', 'F/C=C\\\\F']:
    m = Chem.MolFromSmiles(smi)
    Chem.AssignStereochemistry(m, cleanIt=True, force=True)
    print(smi, [str(b.GetStereo()) for b in m.GetBonds()
                if b.GetStereo() != Chem.BondStereo.STEREONONE])
# -> F/C=C/F ['STEREOE']   (trans)
# -> F/C=C\\F ['STEREOZ']   (cis)

# Find double bonds whose geometry is UNSPECIFIED and must be resolved:
Chem.FindPotentialStereoBonds(mol)

# ---------------------------------------------------------------
# 4. WHY IT MATTERS: fingerprints ignore stereo unless you ask
# ---------------------------------------------------------------
R = Chem.MolFromSmiles('C[C@H](N)C(=O)O')   # D-alanine
S = Chem.MolFromSmiles('C[C@@H](N)C(=O)O')  # L-alanine

for use_chirality in (False, True):
    fp_r = AllChem.GetMorganFingerprintAsBitVect(R, 2, 2048, useChirality=use_chirality)
    fp_s = AllChem.GetMorganFingerprintAsBitVect(S, 2, 2048, useChirality=use_chirality)
    print(use_chirality, DataStructs.TanimotoSimilarity(fp_r, fp_s))
# -> False 1.0    <-- enantiomers are INDISTINGUISHABLE by default!
# -> True  0.714  <-- now the model can separate eutomer from distomer`}
            />
          </div>

          {/* Chirality & Stereoisomer Curation */}
          <div className="border-t border-slate-200 pt-6 mt-6 space-y-4">
            <h4 className="font-bold text-sm text-slate-900">Chirality &amp; Stereoisomer Curation</h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              Zooming in on the branch that causes the most trouble in practice: molecules with identical atomic connectivity can exhibit different three-dimensional arrangements called <strong>stereoisomers</strong>. Chirality is a key driver of biological activity; often, only one enantiomer fits the receptor pocket (the active &quot;eutomer&quot;), while the other is inactive or toxic (the &quot;distomer&quot;).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
                <h5 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  Handling Undefined Stereochemistry
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  When curating chemical libraries from databases, compounds are sometimes represented with undefined chiral centers (lacking wedge/dash bonds). Computational workflows must identify these centers and enumerate all possible physical stereoisomers to avoid screening incomplete chemical spaces.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
                <h5 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-violet-500" />
                  Programmatic Enumeration in RDKit
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  RDKit provides the <code>EnumerateStereoisomers</code> module. It analyzes the tetrahedral carbon centers in a molecular graph and builds a collection of distinct conformers representing every possible combination of R and S configurations.
                </p>
              </div>
            </div>

            {/* RDKit Code Block */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-semibold text-slate-800 space-y-2 mt-4">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Info className="h-4 w-4 text-violet-600" /> Programmatic Enumeration Example:
              </span>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>EnumerateStereoisomers:</strong> Finds all stereocenters and generates a generator yielding all combinations of stereochemical configurations.</li>
                <li><strong>StereoEnumerationOptions:</strong> Allows constraints on the maximum number of generated stereoisomers (e.g. maxIsomers=32) to prevent exponential explosion for complex compounds.</li>
              </ul>
            </div>
            <CollapsibleCode
              title="Stereoisomer Enumeration Script"
              code={`from rdkit import Chem
from rdkit.Chem.EnumerateStereoisomers import EnumerateStereoisomers, StereoEnumerationOptions

# 1. Parse a SMILES string with undefined stereochemistry (e.g. threonine-like precursor)
smiles = 'CC(O)C(N)C(=O)O'
mol = Chem.MolFromSmiles(smiles)

# 2. Enumerate all possible stereoisomers (2 chiral centers -> 2^2 = 4 isomers)
options = StereoEnumerationOptions(maxIsomers=32)
isomers = list(EnumerateStereoisomers(mol, options))

print(f"Total enumerated stereoisomers: {len(isomers)}")
for idx, isomer in enumerate(isomers):
    # Convert back to SMILES to inspect chiral tags (e.g. [C@@H], [C@H])
    isomer_smiles = Chem.MolToSmiles(isomer, isomericSmiles=True)
    print(f"Isomer {idx+1}: {isomer_smiles}")`}
            />
          </div>
        </div>
      </section>

      {/* Interactive Widget: SMILES & Fingerprint Similarity Explorer */}
      <section className="p-5 rounded-xl bg-slate-50/50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-900 space-y-4">
        <div className="flex items-center gap-2">
          <GitBranch size={16} />
          <h3 className="font-bold text-sm">Interactive Playground: Chemical Graph & Tanimoto Similarity</h3>
        </div>
        <p className="text-sm text-slate-600 leading-normal">
          Select structural templates to project their graphs and generated fingerprints. Click any atom in Molecule A to explore how circular ECFP neighborhoods are hashed at increasing radii.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white dark:bg-slate-950 p-5 rounded-lg border border-slate-100 dark:border-slate-900 not-prose">
          
          {/* Column 1: Molecule A - Graph Viewer */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Molecule A: Graph Explorer</span>
              <select 
                value={selectedA}
                onChange={(e) => {
                  setSelectedA(e.target.value);
                  setSelectedAtom(null);
                }}
                className="text-xs border border-border rounded p-1 bg-white"
              >
                <option value="dopamine">Dopamine</option>
                <option value="adrenaline">Adrenaline</option>
                <option value="ibuprofen">Ibuprofen</option>
              </select>
            </div>

            <div className="relative bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-lg p-3 flex flex-col items-center">
              <div className="text-xs font-mono bg-white px-2 py-0.5 rounded border mb-2 max-w-full truncate">
                SMILES: <span className="font-bold text-slate-700">{molA.smiles}</span>
              </div>

              {/* Dynamic Molecule Graph SVG */}
              <div className="w-full max-w-[280px] aspect-[4/3] relative flex justify-center">
                <svg viewBox="-80 -20 300 200" className="w-full h-full">
                  {/* Edges */}
                  {molA.edges.map((edge, idx) => {
                    const srcNode = molA.nodes.find((n) => n.id === edge.source)!;
                    const tgtNode = molA.nodes.find((n) => n.id === edge.target)!;
                    
                    const isSourceHighlighted = highlightedNeighbors.has(edge.source);
                    const isTargetHighlighted = highlightedNeighbors.has(edge.target);
                    const isEdgeHighlighted = isSourceHighlighted && isTargetHighlighted;

                    if (edge.type === "double") {
                      // Draw double bond lines
                      const dx = tgtNode.x - srcNode.x;
                      const dy = tgtNode.y - srcNode.y;
                      const len = Math.sqrt(dx*dx + dy*dy);
                      const offsetX = (-dy / len) * 2.5;
                      const offsetY = (dx / len) * 2.5;

                      return (
                        <g key={idx}>
                          <line 
                            x1={srcNode.x + offsetX} y1={srcNode.y + offsetY} 
                            x2={tgtNode.x + offsetX} y2={tgtNode.y + offsetY} 
                            stroke="currentColor" 
                            className={isEdgeHighlighted ? "text-accent" : "text-slate-300"} 
                            strokeWidth={isEdgeHighlighted ? 2.5 : 1.5} 
                          />
                          <line 
                            x1={srcNode.x - offsetX} y1={srcNode.y - offsetY} 
                            x2={tgtNode.x - offsetX} y2={tgtNode.y - offsetY} 
                            stroke="currentColor" 
                            className={isEdgeHighlighted ? "text-accent" : "text-slate-300"} 
                            strokeWidth={isEdgeHighlighted ? 2.5 : 1.5} 
                          />
                        </g>
                      );
                    }
                    return (
                      <line 
                        key={idx}
                        x1={srcNode.x} y1={srcNode.y} 
                        x2={tgtNode.x} y2={tgtNode.y} 
                        stroke="currentColor" 
                        className={isEdgeHighlighted ? "text-accent" : "text-slate-300"} 
                        strokeWidth={isEdgeHighlighted ? 2.5 : 1.5} 
                      />
                    );
                  })}

                  {/* Nodes */}
                  {molA.nodes.map((node) => {
                    const isHighlighted = highlightedNeighbors.has(node.id);
                    const isCenter = selectedAtom === node.id;
                    const nodeHovered = hoveredAtom === node.id;

                    let nodeFill = "bg-white text-slate-700 border-slate-300";
                    if (node.element === "O") nodeFill = "bg-red-50 text-red-700 border-red-200";
                    if (node.element === "N") nodeFill = "bg-blue-50 text-blue-700 border-blue-200";
                    if (isHighlighted) nodeFill = "bg-accent text-white border-accent shadow-sm";
                    if (isCenter) nodeFill = "bg-accent-dark text-white border-accent-dark ring-4 ring-accent/30 font-extrabold scale-110";

                    return (
                      <g 
                        key={node.id} 
                        className="cursor-pointer transition-all duration-150"
                        onClick={() => setSelectedAtom(node.id)}
                        onMouseEnter={() => setHoveredAtom(node.id)}
                        onMouseLeave={() => setHoveredAtom(null)}
                      >
                        <circle 
                          cx={node.x} 
                          cy={node.y} 
                          r={13} 
                          className={`fill-white stroke-2 transition-all ${
                            isCenter ? "stroke-accent" : isHighlighted ? "stroke-accent/70" : nodeHovered ? "stroke-slate-700" : "stroke-slate-200"
                          }`} 
                        />
                        <text 
                          x={node.x} 
                          y={node.y + 4} 
                          textAnchor="middle" 
                          className={`text-xs font-bold font-mono transition-colors ${
                            isCenter || isHighlighted ? "fill-slate-900" : node.element === "O" ? "fill-red-600" : node.element === "N" ? "fill-blue-600" : "fill-slate-700"
                          }`}
                        >
                          {node.label}
                        </text>
                        {node.charge && (
                          <text x={node.x + 8} y={node.y - 4} className="text-[8px] font-bold fill-blue-600">{node.charge}</text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Atom Explorer controls */}
              <div className="w-full mt-2 border-t border-slate-100 pt-2.5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Circular Neighborhood (ECFP)</span>
                  {selectedAtom !== null ? (
                    <span className="text-accent font-semibold">Atom {molA.nodes.find(n => n.id === selectedAtom)?.label}#{selectedAtom} Selected</span>
                  ) : (
                    <span className="text-slate-400">Click any atom above to explore</span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {[0, 1, 2].map((r) => (
                    <button
                      key={r}
                      disabled={selectedAtom === null}
                      onClick={() => setEcfpRadius(r)}
                      className={`flex-1 py-1 rounded text-xs font-medium border transition-colors ${
                        selectedAtom === null ? "opacity-40 cursor-not-allowed" :
                        ecfpRadius === r 
                          ? "bg-accent border-accent text-white font-bold"
                          : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      Radius {r} ({r * 2} Bond Steps)
                    </button>
                  ))}
                </div>
                
                {selectedAtom !== null && (
                  <p className="text-[11px] text-slate-600 leading-normal">
                    {ecfpRadius === 0 ? (
                      <span><strong>Radius 0:</strong> Considers only the target atom's properties (Element: {molA.nodes.find(n=>n.id===selectedAtom)?.element}, valence, charge).</span>
                    ) : ecfpRadius === 1 ? (
                      <span><strong>Radius 1:</strong> Considers the center atom plus its immediate neighbor atoms. Hashed to construct structural bit identifiers.</span>
                    ) : (
                      <span><strong>Radius 2:</strong> Extends to neighbors 2 bonds away (Diameter 4). This is the standard definition for <strong>ECFP4</strong> similarity searches.</span>
                    )}
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* Column 2: Similarity Analysis */}
          <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Molecule B: Similarity Compare</span>
                <select 
                  value={selectedB}
                  onChange={(e) => setSelectedB(e.target.value)}
                  className="text-xs border border-border rounded p-1 bg-white"
                >
                  <option value="dopamine">Dopamine</option>
                  <option value="adrenaline">Adrenaline</option>
                  <option value="ibuprofen">Ibuprofen</option>
                </select>
              </div>

              {/* Tanimoto metric cards */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3.5">
                <div className="text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Tanimoto Coefficient (Tc)</span>
                  <div className="text-3xl font-extrabold text-slate-900 font-mono">
                    {tanimotoScore.toFixed(3)}
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 leading-normal">
                    {tanimotoScore === 1 ? (
                      <span className="text-emerald-700 font-semibold">Identical compounds (Same structural fingerprints)</span>
                    ) : tanimotoScore > 0.6 ? (
                      <span className="text-blue-700 font-semibold">High similarity: Very likely to bind same targets (Similar structures)</span>
                    ) : tanimotoScore > 0.3 ? (
                      <span className="text-amber-700 font-semibold">Moderate similarity: Shares functional groups but core scaffolds differ.</span>
                    ) : (
                      <span className="text-slate-500">Low similarity: Unrelated structure topologies. Scaffold hopping candidate.</span>
                    )}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 bg-white border border-slate-100 rounded-md">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase mb-0.5">Bit intersection</span>
                    <span className="font-bold font-mono text-slate-800">
                      {molA.fingerprint.filter((x, idx) => x === 1 && molB.fingerprint[idx] === 1).length} bits
                    </span>
                  </div>
                  <div className="p-2 bg-white border border-slate-100 rounded-md">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase mb-0.5">Bit union</span>
                    <span className="font-bold font-mono text-slate-800">
                      {molA.fingerprint.filter((x, idx) => x === 1 || molB.fingerprint[idx] === 1).length} bits
                    </span>
                  </div>
                </div>
              </div>

              {/* Bit vector visualization */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs text-slate-600">
                  <span className="font-semibold">Fingerprint Bits Grid (32-bit illustration)</span>
                  <span>Union overlaps highlighted</span>
                </div>
                
                {/* Fingerprint A */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{molA.name} FP:</div>
                  <div className="grid grid-cols-8 gap-0.5">
                    {molA.fingerprint.map((bit, idx) => {
                      const bothActive = bit === 1 && molB.fingerprint[idx] === 1;
                      const activeOnly = bit === 1 && molB.fingerprint[idx] === 0;
                      return (
                        <div 
                          key={idx}
                          title={`Bit ${idx}: ${bit}`}
                          className={`h-4.5 rounded-sm flex items-center justify-center text-[8px] font-bold ${
                            bothActive ? "bg-accent text-white font-black" :
                            activeOnly ? "bg-slate-200 text-slate-700" : "bg-slate-50 text-slate-300 border border-slate-100"
                          }`}
                        >
                          {bit}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Fingerprint B */}
                <div className="space-y-1.5 pt-2">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{molB.name} FP:</div>
                  <div className="grid grid-cols-8 gap-0.5">
                    {molB.fingerprint.map((bit, idx) => {
                      const bothActive = bit === 1 && molA.fingerprint[idx] === 1;
                      const activeOnly = bit === 1 && molA.fingerprint[idx] === 0;
                      return (
                        <div 
                          key={idx}
                          title={`Bit ${idx}: ${bit}`}
                          className={`h-4.5 rounded-sm flex items-center justify-center text-[8px] font-bold ${
                            bothActive ? "bg-accent text-white font-black" :
                            activeOnly ? "bg-slate-200 text-slate-700" : "bg-slate-50 text-slate-300 border border-slate-100"
                          }`}
                        >
                          {bit}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

            <p className="text-[11px] text-slate-500 leading-normal border-t border-slate-100 pt-2.5">
              *Tanimoto Coefficient formula: Tc(A, B) = |A ∩ B| / |A ∪ B| = N_ab / (N_a + N_b - N_ab), where N_ab is the number of bits set in both fingerprints, and N_a and N_b are the numbers of bits set in molecules A and B individually. In screening pipelines, Tc ≥ 0.85 (with 2048-bit ECFP4 vectors) is the standard threshold to select bio-similar active candidates.
            </p>
          </div>

        </div>
      </section>

      {/* Section 3: Fingerprints */}
      <section className="space-y-4">
        <h2>3. Predefined vs. Topological Fingerprints</h2>
        <p>
          While basic 1D descriptors capture simple properties (like logP or molecular weight), advanced machine learning relies on molecular fingerprints to encode spatial networks:
        </p>

        <div className="space-y-4 not-prose">
          <div className="flex gap-4 p-4 rounded-lg border border-border bg-white">
            <span className="h-6 w-6 text-xs font-bold bg-slate-100 border border-border rounded flex items-center justify-center flex-shrink-0">A</span>
            <div>
              <h4 className="font-bold text-sm text-foreground">Predefined Fragments (MACCS Keys)</h4>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                MACCS (Molecular ACCess System) uses a dictionary of 166 pre-calculated structural fragments (e.g. "Is there an aromatic oxygen?", "Is there a ring of size 5?"). Each bit index corresponds to a specific question, resulting in a 166-bit binary fingerprint. Highly interpretable but limited to predefined structures.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-lg border border-border bg-white">
            <span className="h-6 w-6 text-xs font-bold bg-slate-100 border border-border rounded flex items-center justify-center flex-shrink-0">B</span>
            <div>
              <h4 className="font-bold text-sm text-foreground">Extended Connectivity Fingerprints (ECFPs)</h4>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Topological or circular fingerprints. ECFP doesn't use a dictionary. Instead, it systematically identifies every atom in a molecule and lists its neighbors at increasing radii (e.g. radius 2, matching a diameter of 4 for <strong>ECFP4</strong>). The resulting substructures are hashed into integers, which are mapped onto a fixed-size bit array (typically 1024 or 2048 bits).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Quantitative Similarity */}
      <section className="space-y-4">
        <h2>4. The Tanimoto Coefficient: Defining Chemical Similarity</h2>
        <p>
          In virtual database screening, we compare candidate molecules to a known active reference molecule to identify biological hits. The standard metric to quantify structural similarity is the <strong>Tanimoto Coefficient (Tc)</strong>:
        </p>
        <blockquote>
          <strong>Tanimoto Coefficient Equation:</strong> 
          <div className="my-3 font-mono text-center text-sm bg-slate-50 dark:bg-slate-900 py-2 rounded">
            {"Tc = N_c / (N_a + N_b - N_c)"}
          </div>
          Where <span className="font-semibold">N_c</span> is the number of common active bits (intersection) shared between both, and <span className="font-semibold">N_a</span> and <span className="font-semibold">N_b</span> are the total active bits in molecules A and B respectively. The coefficient ranges from <span className="font-semibold">0.0</span> (no overlap) to <span className="font-semibold">1.0</span> (identical bit vectors).
        </blockquote>
      </section>

      {/* Section 5: Curation & Standardisation */}
      <section className="space-y-4">
        <h2>5. Chemical Data Curation & Standardisation Pipeline</h2>
        <p>
          In public bioactivity databases (e.g. ChEMBL, PubChem), molecules are uploaded as raw SMILES representing diverse experimental settings. They often contain counterions (salts), solvent molecules, incorrect formal charges, and mismatching tautomeric forms. If used directly in machine learning, these artifacts degrade prediction accuracy.
        </p>
        <p>
          To prepare a clean chemical library, computational chemists apply a multi-step <strong>RDKit standardization pipeline</strong>:
        </p>
        
        <div className="p-5 rounded-xl border border-border bg-slate-50">
          <h4 className="font-bold text-sm text-slate-900 mb-2.5">The 5-Step Curation Protocol</h4>
          <ol className="space-y-2 text-sm text-slate-800 leading-relaxed font-medium">
            <li>
              <strong>Exclusion & Filtering:</strong> Remove invalid structures, strip molecules lacking carbon atoms, exclude heavy compounds (MW &ge; 1500 Da), and reject mixtures (mixtures containing more than 4-5 carbon fragments).
            </li>
            <li>
              <strong>Salt and Solvent Stripping:</strong> Isolate the active parent compound by removing counterions (like Na+, Cl-) and solvent adducts. In RDKit, this is performed using <code>rdMolStandardize.FragmentParent</code>.
            </li>
            <li>
              <strong>Charge Neutralization:</strong> Convert charge states to neutral equivalents (e.g. carboxylates to carboxylic acids, protonated amines to neutral amines) using <code>rdMolStandardize.Uncharger</code>.
            </li>
            <li>
              <strong>Isotope & Stereo Standardization:</strong> Remove isotopic labels (converting Carbon-13 to Carbon-12) to group chemical duplicates, and standardize stereochemical representations.
            </li>
            <li>
              <strong>Tautomer Canonicalization:</strong> Resolve different tautomers (e.g., keto-enol tautomerism) by enumerating and selecting a single, consistent canonical representation using <code>rdMolStandardize.TautomerEnumerator().Canonicalize</code>.
            </li>
          </ol>
        </div>

        <p>
          Here is a standard Python script block using <strong>RDKit</strong> to implement this pipeline on a raw SMILES string:
        </p>

        <CollapsibleCode
          title="RDKit Standardization Pipeline"
          code={`from rdkit import Chem
from rdkit.Chem.MolStandardize import rdMolStandardize

def standardize_smiles(raw_smiles: str) -> str:
    # -----------------------------------------------------------------
    # STEP 1: CONVERT STRING TO MOLECULAR GRAPH OBJECT
    # -----------------------------------------------------------------
    # Attempt to parse the SMILES string. If syntax is invalid, return None.
    mol = Chem.MolFromSmiles(raw_smiles)
    if mol is None:
        return None
    
    # -----------------------------------------------------------------
    # STEP 2: STRIP SOLVENTS, COUNTERIONS, AND SALTS
    # -----------------------------------------------------------------
    # FragmentParent isolates the largest organic carbon fragment in the 
    # connection table, stripping away salts (like Na+, Cl-) or water.
    parent = rdMolStandardize.FragmentParent(mol)
    
    # -----------------------------------------------------------------
    # STEP 3: CONVERT CHARGED MOLECULES TO THEIR NEUTRAL FORMS
    # -----------------------------------------------------------------
    # The Uncharger class neutralizes charges where proton transfer is 
    # possible (e.g. converting COO- and NH3+ back to COOH and NH2).
    uncharger = rdMolStandardize.Uncharger()
    neutral = uncharger.uncharge(parent)
    
    # -----------------------------------------------------------------
    # STEP 4: REMOVE ISOTOPES AND STANDARDIZE BASIC STEREO
    # -----------------------------------------------------------------
    # IsotopeParent replaces heavy isotope markers (like Carbon-13 or deuterium)
    # with their standard molecular-weight isotopes for grouping.
    neutral = rdMolStandardize.IsotopeParent(neutral)
    
    # -----------------------------------------------------------------
    # STEP 5: CANONICALIZE TAUTOMERS TO AN ENZYMATIC BASELINE
    # -----------------------------------------------------------------
    # TautomerEnumerator calculates all possible tautomers (e.g., keto vs. enol)
    # and selects the single most energetically stable canonical isomer.
    te = rdMolStandardize.TautomerEnumerator()
    canonical_mol = te.Canonicalize(neutral)
    
    # -----------------------------------------------------------------
    # STEP 6: EXPORT STABLE MOLECULE AS STANDARDIZED SMILES
    # -----------------------------------------------------------------
    # Generate the final canonical 1D string for database duplicate checks.
    return Chem.MolToSmiles(canonical_mol)`}
        />
      </section>

      {/* Advanced Section: Practical Cheminformatics with RDKit */}
      <section className="space-y-4 border-t border-border pt-8">
        <h2>Advanced: Practical Cheminformatics with RDKit</h2>
        <p>
          RDKit is the industry-standard library for cheminformatics in Python. Beyond chemical standardization, it provides robust APIs for multi-format file operations, 3D conformer generation, and chemical reaction processing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-border bg-white space-y-2">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              1. Reading &amp; Writing Molecules
            </h4>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              RDKit reads and writes structures across SMILES, SDF, MOL, and InChI formats. Use <code>SDWriter</code> to export libraries with their computed properties preserved.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-white space-y-2">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              2. 3D Conformer Generation
            </h4>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              Molecules are 3D entities. RDKit uses the <strong>ETKDG method</strong> (Experimental-Torsion Knowledge Distance Geometry) to generate physically realistic 3D conformer ensembles.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-white space-y-2">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              3. Reaction Handling
            </h4>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              Virtual libraries are built using chemical reactions. By applying SMARTS-based reaction transformations (e.g. amide coupling), RDKit automatically generates products from reactants.
            </p>
          </div>
        </div>

        <p className="pt-2">
          Here is a comprehensive script demonstrating these four core operations in RDKit:
        </p>

        {/* User-Friendly Explanations Callout */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-semibold text-slate-800 space-y-2 mt-4">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <span className="h-4 w-4 text-indigo-600" /> Deep Dive into the Script Operations:
          </span>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Chem.SDWriter:</strong> Creates an SDF (Structure Data File) output stream to store coordinates alongside custom chemical annotations.</li>
            <li><strong>Chem.AddHs &amp; EmbedMultipleConfs:</strong> Hydrogens must be added to build correct 3D geometries. The ETKDG algorithm places atoms based on experimental torsion databases.</li>
            <li><strong>AllChem.MMFFOptimizeMolecule:</strong> Uses the Merck Molecular Force Field (MMFF94) to optimize bond angles, lengths, and steric clashes.</li>
            <li><strong>AllChem.ReactionFromSmarts:</strong> Applies organic reaction maps where reactants match substructure queries to generate valid product graphs.</li>
            <li><strong>Recap &amp; BRICS:</strong> Cleaves molecules along common synthetic bonds (like esters or amides) to generate fragment building blocks for retrosynthetic design.</li>
          </ul>
        </div>

        <CollapsibleCode
          title="Advanced RDKit Cheminformatics Script"
          code={`from rdkit import Chem
from rdkit.Chem import AllChem
from rdkit.Chem import BRICS
from rdkit.Chem import Recap

# =====================================================================
# OPERATION 1: MULTI-FORMAT FILE OPERATIONS (SDF EXPORT)
# =====================================================================
# Define SMILES for Caffeine and Aspirin
smiles_list = ["CN1C=NC2=C1C(=O)N(C(=O)N2C)C", "CC(=O)OC1=CC=CC=C1C(=O)O"]
mols = []
for s in smiles_list:
    m = Chem.MolFromSmiles(s)
    if m:
        mols.append(m)

# Instantiate the Structure Data File (SDF) writer
writer = Chem.SDWriter('output_library.sdf')
for i, mol in enumerate(mols):
    # Set properties/metadata which are saved in the SDF connection block
    mol.SetProp("_Name", "Compound_" + str(i))
    mol.SetProp("Compound_ID", "CMP-" + str(i).zfill(4))
    writer.write(mol)
writer.close() # Always close the file writer to flush buffer output

# =====================================================================
# OPERATION 2: 3D CONFORMER GENERATION (ETKDG METHOD)
# =====================================================================
# 3D structures require explicit hydrogens to resolve steric volumes
target_mol = mols[0]
target_mol_h = Chem.AddHs(target_mol)

# Initialize standard ETKDG v3 parameter class (rules based on torsion databases)
params = AllChem.ETKDGv3()
params.randomSeed = 42 # Lock seed for reproducible 3D coordinates

# Embed 10 distinct physical conformations (poses) inside the molecule
conformer_ids = AllChem.EmbedMultipleConfs(target_mol_h, numConfs=10, params=params)

# Run Merck Molecular Force Field (MMFF94) to minimize steric strain
for conf_id in conformer_ids:
    AllChem.MMFFOptimizeMolecule(target_mol_h, confId=conf_id)

# =====================================================================
# OPERATION 3: IN SILICO REACTION HANDLING (REACTION SMARTS)
# =====================================================================
# Describe amide coupling reaction: Carboxylic Acid + Amine -> Amide
reaction_smarts = '[C:1](=[O:2])[OH].[N:3]>>[C:1](=[O:2])[N:3]'
reaction = AllChem.ReactionFromSmarts(reaction_smarts)

# Load reactants
acid = Chem.MolFromSmiles('CC(=O)O')   # Acetic acid
amine = Chem.MolFromSmiles('CCN')      # Ethylamine

# Run reaction. This returns a tuple of lists containing products
products_tuple = reaction.RunReactants((acid, amine))
first_product = products_tuple[0][0]

# Convert the product molecule back to SMILES to inspect results
product_smiles = Chem.MolToSmiles(first_product)
print('Synthesized Product SMILES: ' + product_smiles) # Output: CCNC(=O)C

# =====================================================================
# OPERATION 4: RETROSYNTHETIC FRAGMENTATION (RECAP & BRICS)
# =====================================================================
# Aspirin molecule
aspirin_mol = mols[1]

# 1. RECAP: Deconstructs along 11 common synthetically active bonds (e.g. ester)
recap_tree = Recap.RecapDeconstruct(aspirin_mol)
recap_fragments = list(recap_tree.GetLeaves().keys())
print('RECAP fragment leaves: ' + str(recap_fragments))

# 2. BRICS: Deconstructs along 16 synthetically accessible reactions
brics_fragments = list(BRICS.BRICSDeconstruct(aspirin_mol))
print('BRICS fragment leaves: ' + str(brics_fragments))`}
        />
      </section>

      {/* Quiz Section */}
      <hr className="border-slate-200 my-8" />
      <Quiz 
        moduleTitle="Module 3: Cheminformatics & Molecular Representations"
        questions={[
          {
            question: "Why is tautomer canonicalization critical before generating ECFP4 fingerprints for machine learning models?",
            options: [
              "Because tautomers represent different stereoisomers, which have different molecular weights.",
              "Because the same chemical compound can exist in multiple tautomeric forms (e.g. keto vs enol), which would result in different SMILES and different circular fingerprints, confusing the machine learning model.",
              "Because RDKit cannot calculate fingerprints on non-canonical structures.",
              "Because it is required to remove solvent water molecules from the connection table."
            ],
            correctIndex: 1,
            explanation: "Tautomers are chemical isomers that interconvert rapidly in solution (like keto and enol forms). Although they are functionally the same drug, they have different bond connectivity and atom states. ECFP4 circular fingerprints encode local bond connectivity; hence, different tautomeric forms of the same molecule would generate different fingerprints. Canonicalizing them to a single standard form ensures consistent ML features."
          },
          {
            question: "When calculating Tanimoto Similarity between compound fingerprints, what does a score of Tc = 1.0 indicate?",
            options: [
              "The compounds are chemically identical and share identical formal connectivity.",
              "The compounds have identical 3D shapes and conformers in solution.",
              "The compound fingerprints share the exact same active bits, which means they are topologically identical at the fingerprint level, though they could occasionally be different structural molecules due to hash collisions.",
              "The compounds have the same molecular weight and logP values."
            ],
            correctIndex: 2,
            explanation: "Tanimoto coefficient measures fingerprint bit vector overlap. Tc = 1.0 means the bit vectors are identical. While this usually indicates identical molecules, fingerprints are fixed-length arrays generated via hash functions. In rare cases, two different substructures can map to the same bit (hash collision), or two different molecules can generate the same bit vector, though they are structurally distinct."
          }
        ]}
      />
    </div>
  );
}
