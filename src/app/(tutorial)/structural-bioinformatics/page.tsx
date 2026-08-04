import { ExtensionLesson, type LessonSection } from "@/components/ExtensionLesson";
import type { Question } from "@/components/Quiz";

const sections: LessonSection[] = [
  {
    title: "From a biological question to a trustworthy structure",
    paragraphs: [
      "A structure is not simply a coordinate file. It is an experimental or predicted model with a specific biological assembly, sequence construct, resolution, missing regions, ligands, ions, waters, and uncertainty. Those details decide whether the structure is suitable for docking, pharmacophore modeling, or molecular dynamics.",
    ],
    cards: [
      {
        title: "Experimental structures",
        description:
          "X-ray crystallography, cryo-EM, and NMR provide coordinates supported by experimental data, but each method has characteristic uncertainty and preparation needs.",
        items: [
          "Check method, resolution or map quality, R-values, and local confidence.",
          "Inspect mutations, tags, missing loops, alternate locations, and crystal contacts.",
          "Use the biologically relevant assembly rather than assuming the asymmetric unit is correct.",
        ],
      },
      {
        title: "Predicted structures",
        description:
          "AlphaFold-class models can fill structural gaps, but confidence is spatially variable and a predicted apo conformation may not reproduce a ligand-ready pocket.",
        items: [
          "Inspect residue-level confidence and inter-domain uncertainty.",
          "Treat low-confidence loops and side chains near the pocket cautiously.",
          "Prefer an experimental holo template when accurate ligand geometry is essential.",
        ],
      },
    ],
  },
  {
    title: "Reading PDB and mmCIF records",
    paragraphs: [
      "Coordinate formats connect atom names and residue identities to Cartesian coordinates. Legacy PDB files are column-based; mmCIF is the modern, extensible archive format. Both must be interpreted together with the entry metadata.",
    ],
    table: {
      headers: ["Record or concept", "What it describes", "Why it matters in CADD"],
      rows: [
        ["ATOM", "Standard polymer atoms", "Defines the protein or nucleic-acid receptor coordinates."],
        ["HETATM", "Ligands, cofactors, ions, modified residues, and often solvent", "Separates the reference ligand and essential cofactors from removable crystallization components."],
        ["Chain and residue IDs", "Polymer membership and residue position", "Prevents accidental deletion of interfaces or docking against the wrong construct."],
        ["Occupancy and B-factor", "Alternate occupancy and positional disorder", "Flags uncertain atoms and flexible pocket regions."],
        ["Connectivity", "Covalent links and chemical components", "Important for metals, covalent inhibitors, disulfides, and non-standard residues."],
      ],
    },
    note:
      "Before deleting every HETATM record, classify it. A catalytic metal, structural ion, cofactor, or conserved water can be part of the binding mechanism.",
  },
  {
    title: "A defensible receptor-preparation workflow",
    steps: [
      {
        title: "Select the right entry",
        description:
          "Match species, construct, binding state, pocket conformation, experimental quality, and ligand similarity to the scientific question.",
      },
      {
        title: "Resolve structural issues",
        description:
          "Choose alternate conformers, repair missing side chains or loops when justified, assign bond orders, and check unusual residues and covalent links.",
      },
      {
        title: "Define chemistry",
        description:
          "Assign protonation and tautomer states at the intended pH, orient Asn/Gln/His where needed, retain mechanistic waters and metals, and add hydrogens consistently.",
      },
      {
        title: "Minimize conservatively",
        description:
          "Relax clashes while restraining experimentally supported heavy atoms. Large unvalidated movements can destroy the information supplied by the structure.",
      },
      {
        title: "Record provenance",
        description:
          "Keep the source identifier, assembly, preparation software, parameters, removed components, retained waters, protonation decisions, and final checks with the model.",
      },
    ],
  },
  {
    title: "PyMOL and Chimera for molecular interpretation",
    paragraphs: [
      "Molecular viewers are analytical tools, not only illustration software. Use representations deliberately: cartoons for fold and topology, sticks for chemistry, surfaces for pocket shape, and distance objects for candidate interactions.",
    ],
    cards: [
      {
        title: "Selection logic",
        description:
          "Name the ligand, protein, waters, metals, chains, and neighboring residues as reusable selections. Distance-based selections should be expanded by residue so complete side chains are displayed.",
      },
      {
        title: "Interaction inspection",
        description:
          "Check donor-acceptor geometry, salt bridges, aromatic contacts, hydrophobic enclosure, solvent exposure, steric clashes, and whether a contact is mediated by water or metal.",
      },
      {
        title: "Structure comparison",
        description:
          "Align apo and holo structures, homologs, mutants, or trajectory clusters. Interpret global RMSD together with local pocket rearrangements and domain motion.",
      },
      {
        title: "Publication output",
        description:
          "Use saved scenes, consistent colors, orthographic views when appropriate, ray tracing, transparent surfaces, and labels that identify rather than decorate.",
      },
    ],
    code: {
      title: "PyMOL pocket-inspection recipe",
      value: `# Load and define the chemical objects
load receptor_complex.pdb, complex
select protein_obj, polymer.protein
select ligand, organic and not solvent

# Show the complete residues within 5 A of the ligand
select pocket, byres (protein_obj within 5 of ligand)
hide everything
show cartoon, protein_obj
show sticks, ligand or pocket
show surface, protein_obj
set transparency, 0.55, protein_obj

# Inspect candidate polar contacts and label the pocket
distance polar_contacts, ligand, pocket, mode=2
label pocket and name CA, "%s%s" % (resn, resi)

# Produce a reproducible image
orient ligand or pocket
bg_color white
ray 1800, 1400
png binding_site.png, dpi=300`,
    },
  },
  {
    title: "Homology modeling when no suitable structure exists",
    paragraphs: [
      "Comparative modeling transfers structural information from one or more templates to a homologous target. The hardest decisions are template choice and alignment around insertions, deletions, active-site residues, and domain boundaries.",
    ],
    steps: [
      {
        title: "Find and rank templates",
        description:
          "Combine sequence identity and coverage with structure quality, oligomeric state, ligand state, and functional relevance. A slightly less similar holo template may be more useful than a high-identity apo structure.",
      },
      {
        title: "Build a structure-aware alignment",
        description:
          "Keep catalytic motifs and secondary-structure elements aligned; place gaps preferentially in solvent-exposed loops rather than conserved cores.",
      },
      {
        title: "Generate an ensemble",
        description:
          "Model alternative loop and side-chain conformations instead of treating one output as uniquely correct, especially around the binding site.",
      },
      {
        title: "Validate before use",
        description:
          "Check stereochemistry, Ramachandran outliers, clashes, packing, residue environments, pocket geometry, and performance in retrospective docking when known ligands are available.",
      },
    ],
  },
];

const questions: Question[] = [
  {
    question: "Which PDB component should never be removed automatically during receptor preparation?",
    options: ["Every crystallographic water", "Every HETATM record", "A catalytic metal or required cofactor", "All alternate locations"],
    correctIndex: 2,
    explanation:
      "Catalytic metals and cofactors can define the binding mechanism. HETATM records must be classified before retention or removal.",
  },
  {
    question: "Why can an AlphaFold-class model be unsuitable for docking despite high global confidence?",
    options: ["Predicted models contain no atoms", "The local pocket conformation or side chains may be uncertain", "Docking accepts only NMR structures", "Predicted structures cannot be visualized"],
    correctIndex: 1,
    explanation:
      "Docking depends on local pocket geometry. High overall confidence does not guarantee a ligand-ready local conformation.",
  },
  {
    question: "What is the strongest homology-model validation for a docking application?",
    options: ["A visually attractive cartoon", "The longest possible sequence alignment", "Stereochemical checks plus retrospective recovery of known ligand poses or enrichments", "The fewest water molecules"],
    correctIndex: 2,
    explanation:
      "General stereochemical quality is necessary, but task-specific retrospective performance tests whether the modeled pocket supports the intended use.",
  },
  {
    question: "Why use 'byres' for a distance-based PyMOL pocket selection?",
    options: ["It converts the structure to a trajectory", "It expands atom hits to complete residues", "It removes hydrogen atoms", "It calculates binding energy"],
    correctIndex: 1,
    explanation:
      "A raw distance selection may contain only individual atoms. Expanding by residue displays chemically interpretable side chains.",
  },
];

export default function StructuralBioinformaticsPage() {
  return (
    <ExtensionLesson
      moduleNumber={13}
      title="Structural Bioinformatics & Molecular Visualization"
      summary="Move from a database entry to a chemically defensible receptor model, then use PyMOL or Chimera to inspect, compare, communicate, and validate structural hypotheses."
      outcomes={[
        "Select an experimental or predicted structure for a specific CADD task.",
        "Interpret PDB/mmCIF records and classify ligands, waters, ions, and cofactors.",
        "Prepare and visually validate a receptor without erasing mechanistic chemistry.",
        "Build and assess a homology model when no suitable structure is available.",
      ]}
      sections={sections}
      questions={questions}
    />
  );
}
