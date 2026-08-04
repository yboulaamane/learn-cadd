import { ExtensionLesson, type LessonSection } from "@/components/ExtensionLesson";
import type { Question } from "@/components/Quiz";

const sections: LessonSection[] = [
  {
    title: "The evidence layers behind a CADD project",
    paragraphs: [
      "Computer-aided drug design begins before molecular modeling. Sequence, structure, variation, expression, pathways, phenotypes, and chemical-biology evidence determine which target, construct, state, and assay should be modeled.",
    ],
    table: {
      headers: ["Evidence layer", "Typical resources", "CADD decision supported"],
      rows: [
        ["Sequence and function", "UniProt and curated literature", "Isoform, domains, catalytic residues, localization, and construct boundaries."],
        ["Structure", "PDB and predicted-structure repositories", "Template, biological assembly, pocket state, flexibility, and missing regions."],
        ["Chemistry and activity", "ChEMBL, PubChem, BindingDB, patents, and assay reports", "Known ligands, activity definition, selectivity, and model-training data."],
        ["Genetics and disease", "Variant, association, and functional-genomics resources", "Causal support, patient population, gain/loss-of-function direction, and safety."],
        ["Expression and pathways", "Transcriptomic, proteomic, interaction, and pathway databases", "Relevant cell type, compensatory mechanisms, biomarkers, and combination hypotheses."],
      ],
    },
    note:
      "Database records are hypotheses with provenance. Check organism, isoform, assay, units, evidence level, and update date before joining records by an identifier.",
  },
  {
    title: "Pairwise sequence alignment",
    paragraphs: [
      "Global alignment compares sequences end to end; local alignment finds the best matching regions. Dynamic programming balances residue substitution scores and gap penalties, while heuristic tools such as BLAST accelerate database search.",
    ],
    cards: [
      {
        title: "Substitution matrices",
        description:
          "PAM- and BLOSUM-type matrices encode how acceptable one amino-acid substitution is relative to chance. The matrix should match the expected evolutionary distance.",
      },
      {
        title: "Gap penalties",
        description:
          "Affine penalties make opening a gap more expensive than extending one, reflecting insertions or deletions as contiguous evolutionary events.",
      },
      {
        title: "Identity is not coverage",
        description:
          "A high-identity short alignment may not cover the domain or pocket of interest. Report identity, similarity, alignment length, gaps, and domain boundaries together.",
      },
      {
        title: "E-value and significance",
        description:
          "A database-search E-value estimates how many matches of comparable score are expected by chance. Interpret it with sequence length, composition, and biological context.",
      },
    ],
  },
  {
    title: "Multiple alignment, phylogeny, and homolog selection",
    steps: [
      {
        title: "Collect representative sequences",
        description:
          "Choose the correct family and domains, remove obvious fragments and duplicates, and retain functionally informative orthologs and paralogs.",
      },
      {
        title: "Align with structural awareness",
        description:
          "Inspect conserved motifs, secondary structure, catalytic residues, insertions, low-complexity segments, and transmembrane regions rather than accepting an automated alignment blindly.",
      },
      {
        title: "Infer relationships",
        description:
          "Build and assess a tree with an appropriate evolutionary model and support estimates. A tree is an inference affected by sampling, alignment, and model choices.",
      },
      {
        title: "Translate to CADD",
        description:
          "Map conserved and variable residues onto structures to anticipate selectivity, resistance mutations, species differences, and suitable homology-model templates.",
      },
    ],
  },
  {
    title: "Genome, transcriptome, proteome, and metagenome",
    table: {
      headers: ["Layer", "What is measured", "Drug-discovery use"],
      rows: [
        ["Genome", "DNA sequence and variation", "Causal variants, target direction, resistance, pharmacogenomics, and patient stratification."],
        ["Transcriptome", "RNA abundance and isoforms", "Disease-state expression, cell-type specificity, response biomarkers, and compensatory pathways."],
        ["Proteome", "Protein abundance, state, interactions, and modifications", "Target presence, pathway activation, complex formation, and direct drug response."],
        ["Metabolome", "Small-molecule products and intermediates", "Pathway consequences, mechanism, target engagement, and safety signals."],
        ["Metagenome", "Microbial community genes and taxa", "Microbiome targets, xenobiotic metabolism, resistance reservoirs, and host-microbe effects."],
      ],
    },
  },
  {
    title: "Interactomes, pathways, and systems pharmacology",
    paragraphs: [
      "Targets operate in networks. Protein interactions, signaling pathways, metabolic reactions, regulatory edges, and tissue context can reveal whether a target controls disease or is bypassed by redundancy.",
    ],
    cards: [
      {
        title: "Network topology",
        description:
          "Centrality and community structure can highlight influential nodes, but highly connected essential proteins may also carry greater safety risk.",
      },
      {
        title: "Pathway enrichment",
        description:
          "Test whether a predefined gene set is overrepresented or coordinately shifted. Correct for multiple testing and avoid treating correlated gene sets as independent discoveries.",
      },
      {
        title: "Polypharmacology",
        description:
          "Map intended and off-target activities onto disease and safety networks. Multiple targets may explain efficacy, toxicity, resistance, or opportunities for deliberate multitarget design.",
      },
      {
        title: "Perturbation data",
        description:
          "Genetic knockdown, CRISPR, chemical perturbation, and phenotypic profiles help connect molecular mechanism to system response and can support target deconvolution.",
      },
    ],
  },
  {
    title: "An integrated target-to-model evidence workflow",
    steps: [
      {
        title: "Frame the disease mechanism",
        description:
          "Specify the cell type, tissue, molecular phenotype, desired direction of modulation, and evidence that the mechanism is causal rather than correlated.",
      },
      {
        title: "Resolve the molecular identity",
        description:
          "Select organism, gene, isoform, domains, sequence construct, modifications, complexes, and relevant disease variants.",
      },
      {
        title: "Connect chemical and biological evidence",
        description:
          "Curate ligands and assays, standardize endpoints, distinguish biochemical from cellular activity, and inspect selectivity and phenotypic signatures.",
      },
      {
        title: "Choose the structural hypothesis",
        description:
          "Select or model the correct conformational state and assembly; map conserved residues, variants, interfaces, and regulatory sites onto the structure.",
      },
      {
        title: "Define falsifiable milestones",
        description:
          "State which experiment will validate target engagement, mechanism, selectivity, and downstream phenotype before optimizing computational scores.",
      },
    ],
  },
];

const questions: Question[] = [
  {
    question: "Why is percent identity alone insufficient when selecting a homology-model template?",
    options: ["Identity applies only to DNA", "Coverage, domain boundaries, structural state, and local pocket conservation also matter", "Templates must have 100% identity", "Gap penalties remove all uncertainty"],
    correctIndex: 1,
    explanation:
      "A useful template must cover the relevant region and represent a suitable structure and functional state, not merely achieve a high identity score.",
  },
  {
    question: "What does a BLAST E-value estimate?",
    options: ["Binding free energy", "Expected number of chance matches with comparable score", "Expression level", "Model calibration error"],
    correctIndex: 1,
    explanation:
      "The E-value describes the expected frequency of matches of similar quality arising by chance in the searched database.",
  },
  {
    question: "Which omics layer most directly identifies expressed isoforms in a disease-relevant cell type?",
    options: ["Genome", "Transcriptome", "Crystal structure", "Docking score"],
    correctIndex: 1,
    explanation:
      "Transcriptomic data measure RNA expression and splice isoforms, ideally with cell-type and condition resolution.",
  },
  {
    question: "What is a key limitation of selecting a target only because it is a network hub?",
    options: ["Hubs have no interactions", "High connectivity can reflect essential biology and increased safety risk", "Networks cannot include proteins", "Hubs cannot be modeled"],
    correctIndex: 1,
    explanation:
      "Network centrality can indicate influence, but disrupting highly connected essential proteins may have broad and undesirable effects.",
  },
];

export default function BioinformaticsSystemsBiologyPage() {
  return (
    <ExtensionLesson
      moduleNumber={17}
      title="Bioinformatics & Systems Biology Foundations"
      summary="Connect sequence, structure, genomics, transcriptomics, interactomes, pathways, and chemical-biology data so each CADD project begins with the right molecular identity and a defensible disease hypothesis."
      outcomes={[
        "Trace sequence, structure, chemistry, genetics, and pathway evidence across databases.",
        "Interpret pairwise and multiple alignments, database-search significance, and phylogenetic context.",
        "Relate genome, transcriptome, proteome, metabolome, and metagenome data to target selection.",
        "Integrate network and perturbation evidence into falsifiable CADD milestones.",
      ]}
      sections={sections}
      questions={questions}
    />
  );
}
