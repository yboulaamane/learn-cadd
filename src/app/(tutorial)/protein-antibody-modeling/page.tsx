import { ExtensionLesson, type LessonSection } from "@/components/ExtensionLesson";
import type { Question } from "@/components/Quiz";
import { InterfaceEvidencePlayground } from "@/components/playgrounds/InterfaceEvidencePlayground";

const sections: LessonSection[] = [
  {
    title: "Why protein therapeutics need a different modeling stack",
    paragraphs: [
      "Antibodies, nanobodies, engineered binders, enzymes, and multispecific proteins operate through large, flexible interfaces. Their models must represent sequence, fold, loop uncertainty, oligomerization, glycosylation, electrostatics, conformational change, and manufacturability.",
    ],
    cards: [
      {
        title: "Small molecule",
        description:
          "A compact ligand is usually docked into a comparatively localized pocket. Search emphasizes ligand conformation, pose, and receptor flexibility.",
      },
      {
        title: "Protein-protein complex",
        description:
          "Two large surfaces must be oriented while side chains, loops, and sometimes domains reorganize. Shape complementarity alone produces many false poses.",
      },
      {
        title: "Antibody-antigen complex",
        description:
          "Six CDR loops create the paratope, but framework residues, orientation of variable domains, glycans, and long CDR-H3 conformations can influence recognition.",
      },
      {
        title: "Multispecific format",
        description:
          "Multiple binding arms introduce valency, linker geometry, avidity, competing target sinks, assembly risk, and tissue-distribution constraints.",
      },
    ],
  },
  {
    title: "Antibody structure and sequence annotation",
    table: {
      headers: ["Element", "Modeling question", "Common failure mode"],
      rows: [
        ["Framework", "Is the template close in sequence and canonical geometry?", "A poor framework shifts the relative orientation of binding loops."],
        ["CDR loops", "Which numbering scheme and boundary definition are being used?", "Residue positions are compared across incompatible schemes."],
        ["CDR-H3", "How uncertain are length, kink, base, and loop conformations?", "One highly uncertain model is treated as a solved paratope."],
        ["VH/VL orientation", "Does the template support the intended interface geometry?", "Correct local loops are combined with the wrong domain orientation."],
        ["Fc and glycans", "Are effector function, FcRn interaction, and glycosylation relevant?", "A truncated model is used for whole-antibody conclusions."],
      ],
    },
  },
  {
    title: "Building an antibody or engineered-protein model",
    steps: [
      {
        title: "Curate the sequence",
        description:
          "Confirm chain boundaries, signal peptides, mutations, disulfides, numbering, construct tags, linkers, and intended oligomeric state.",
      },
      {
        title: "Select templates or predictions",
        description:
          "Choose frameworks and domain orientations using sequence and structural compatibility. Use prediction confidence to define, not hide, uncertain regions.",
      },
      {
        title: "Model loops and side chains as an ensemble",
        description:
          "Generate alternatives for CDR-H3, engineered loops, and interface side chains. Filter clashes and poor stereochemistry before complex modeling.",
      },
      {
        title: "Add relevant chemistry",
        description:
          "Represent disulfides, glycans, protonation, post-translational modifications, metals, and linker geometry when they affect the question.",
      },
      {
        title: "Validate against data",
        description:
          "Use known mutagenesis, epitope mapping, competition, crosslinking, HDX, cryo-EM density, or homologous complexes to challenge the model.",
      },
    ],
  },
  {
    title: "Protein-protein and antibody-antigen docking",
    paragraphs: [
      "Protein docking explores rigid-body orientation first, then refines interfaces. Unconstrained global docking is difficult because the surface is large and flexibility is expensive; experimental restraints sharply reduce the search space.",
    ],
    table: {
      headers: ["Evidence", "How it constrains docking", "Caution"],
      rows: [
        ["Known epitope/paratope residues", "Defines attractive or ambiguous interaction restraints", "A functional residue may act indirectly rather than contact the partner."],
        ["Crosslinks", "Restricts pairs to a distance range", "Account for linker length, side-chain geometry, and uncertainty."],
        ["Mutagenesis", "Prioritizes interface patches and tests refined poses", "Loss of binding can result from destabilization."],
        ["Competition or homologous complex", "Restricts the face and orientation of binding", "Homologous partners may use different loops or angles."],
        ["Density or low-resolution shape", "Filters rigid-body poses globally", "Flexible regions may not be resolved."],
      ],
    },
    note:
      "Cluster poses by interface similarity and inspect representatives. A tiny score difference between nearly redundant poses is less informative than agreement across independent evidence.",
  },
  {
    title: "Interface scoring and validation",
    cards: [
      {
        title: "Geometry",
        description:
          "Check buried surface area, shape complementarity, clashes, cavities, unsatisfied polar groups, and interface planarity. Remove impossible poses before interpreting energy.",
      },
      {
        title: "Chemistry",
        description:
          "Inspect salt bridges, hydrogen-bond networks, aromatic and cation-pi contacts, hydrophobic patches, water mediation, and electrostatic complementarity.",
      },
      {
        title: "Robustness",
        description:
          "Compare scoring functions, refinement protocols, starting structures, and ensemble members. Stable conclusions survive reasonable modeling choices.",
      },
      {
        title: "Experimental falsification",
        description:
          "Select mutations or binding measurements that distinguish competing poses. The most useful model proposes a test that could prove it wrong.",
      },
    ],
  },
  {
    title: "Protein engineering and developability",
    table: {
      headers: ["Risk", "Sequence/structure signals", "Engineering response"],
      rows: [
        ["Low stability", "Buried unsatisfied groups, cavities, poor packing, exposed hydrophobics", "Stabilize the core or interface while preserving function."],
        ["Aggregation", "Large hydrophobic or charged surface patches and flexible exposed segments", "Reduce patchiness, improve colloidal behavior, and test concentration dependence."],
        ["Polyspecificity", "Broad hydrophobic or electrostatic complementarity", "Balance paratope chemistry and screen nonspecific binding experimentally."],
        ["Chemical liabilities", "Deamidation, isomerization, oxidation, cleavage, or unpaired cysteine motifs", "Remove hotspots when compatible with activity and structure."],
        ["Immunogenicity", "Potential T-cell epitopes, non-human framework content, aggregates", "Humanize and de-risk with sequence, structure, and experimental evidence."],
        ["Poor multispecific geometry", "Steric occlusion, strained linkers, incompatible arm spacing", "Model full-format architecture and test simultaneous engagement."],
      ],
    },
  },
];

const questions: Question[] = [
  {
    question: "Why is protein-protein docking generally harder than docking a small molecule?",
    options: ["Proteins have no coordinates", "The interfaces are large and both partners can be flexible", "Protein scoring uses no physics", "Small molecules never rotate"],
    correctIndex: 1,
    explanation:
      "Large search spaces, conformational change, and many superficially complementary surface patches make protein-protein docking difficult.",
  },
  {
    question: "Which antibody region is often the most structurally uncertain?",
    options: ["Every framework beta strand", "CDR-H3", "The peptide bond", "All Fc helices"],
    correctIndex: 1,
    explanation:
      "CDR-H3 varies greatly in length and conformation and is usually the hardest loop to model accurately.",
  },
  {
    question: "What is the best way to use a mutagenesis result as a docking restraint?",
    options: ["Assume every activity-losing residue is a direct contact", "Combine it with stability controls and other evidence", "Ignore the structure", "Force all mutated residues to one atom"],
    correctIndex: 1,
    explanation:
      "A mutation can disrupt folding or allostery. Stability controls and orthogonal evidence help distinguish direct interface contacts.",
  },
  {
    question: "Which concern is specific to a full multispecific format?",
    options: ["Whether atoms have coordinates", "Simultaneous engagement, valency, linker geometry, and competing target sinks", "Whether SMILES is canonical", "Whether a docking grid is cubic"],
    correctIndex: 1,
    explanation:
      "Multispecific molecules combine multiple binding events and an architecture whose geometry and pharmacology cannot be inferred from isolated arms alone.",
  },
];

export default function ProteinAntibodyModelingPage() {
  return (
    <ExtensionLesson
      moduleNumber={16}
      title="Protein, Antibody & Protein-Protein Modeling"
      summary="Extend structure-based design from small-molecule pockets to flexible protein interfaces, antibody paratopes, multispecific architectures, and developability-aware protein engineering."
      outcomes={[
        "Explain how protein and antibody modeling differs from small-molecule docking.",
        "Build an ensemble-aware antibody or engineered-protein model.",
        "Use experimental restraints to constrain and validate protein-protein docking.",
        "Evaluate interface quality alongside stability, aggregation, and other developability risks.",
      ]}
      playground={<InterfaceEvidencePlayground />}
      sections={sections}
      questions={questions}
    />
  );
}
