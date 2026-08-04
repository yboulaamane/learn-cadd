import { ExtensionLesson, type LessonSection } from "@/components/ExtensionLesson";
import type { Question } from "@/components/Quiz";

const sections: LessonSection[] = [
  {
    title: "Navigate biological databases with provenance",
    paragraphs: [
      "Sequence bioinformatics starts with records, not algorithms. A useful record links molecular identity to evidence, but curated statements, computational predictions, and author-submitted annotations do not have the same reliability.",
    ],
    table: {
      headers: ["Resource class", "Typical content", "Questions to ask"],
      rows: [
        ["Sequence archives", "Submitted DNA and RNA sequences", "What sample, construct, assembly, and version produced this sequence?"],
        ["Curated protein records", "Protein sequence, function, isoforms, features, and cross-references", "Which statements are reviewed, experimentally supported, or predicted?"],
        ["Genome browsers", "Genes, transcripts, variants, conservation, and regulatory tracks", "Which genome build, transcript, strand, and coordinate system are in use?"],
        ["Families and domains", "Motifs, profiles, domain boundaries, and classifications", "Does the match cover the functional domain and exceed the model-specific threshold?"],
        ["Structure archives", "Experimental coordinates, assemblies, ligands, and metadata", "Does the structure represent the correct species, construct, state, and biological assembly?"],
        ["Ontologies and pathways", "Controlled terms, relationships, reactions, and evidence links", "Which evidence code, organism, context, and database version support the annotation?"],
      ],
    },
    note:
      "Save stable identifiers and versions, then follow cross-references deliberately. Names alone can merge distinct genes, proteins, isoforms, or chemical entities.",
  },
  {
    title: "Pairwise alignment answers a scoped question",
    paragraphs: [
      "An alignment proposes which residues correspond between two sequences. The correct method depends on whether the whole sequences are comparable or only a local region, such as a catalytic domain, is expected to match.",
    ],
    cards: [
      {
        title: "Dot plot",
        description:
          "A visual comparison where matching regions form diagonals. Breaks, parallel diagonals, and repeated patterns can reveal insertions, deletions, repeats, or domain rearrangements.",
      },
      {
        title: "Global alignment",
        description:
          "Needleman–Wunsch aligns sequences end to end. It is most appropriate for sequences of similar length with comparable full-length architecture.",
      },
      {
        title: "Local alignment",
        description:
          "Smith–Waterman finds the best-scoring local regions. It is useful for shared domains or motifs within otherwise different sequences.",
      },
      {
        title: "Dynamic programming",
        description:
          "A score matrix evaluates match, substitution, and gap choices to obtain an optimal alignment under the selected scoring model. Optimal does not mean biologically correct.",
      },
    ],
  },
  {
    title: "Scoring substitutions and gaps",
    table: {
      headers: ["Choice", "Meaning", "Practical interpretation"],
      rows: [
        ["Log-odds score", "A substitution is compared with its chance expectation.", "Positive scores favor substitutions observed more often than expected by chance."],
        ["BLOSUM matrix", "Built from conserved local blocks at a stated clustering threshold.", "Higher BLOSUM numbers generally target closer, more conserved relationships."],
        ["PAM matrix", "Derived from an evolutionary substitution model and extrapolated over distance.", "Higher PAM numbers represent greater evolutionary divergence."],
        ["Affine gap penalty", "Opening a gap costs more than extending it.", "This models one insertion or deletion event more plausibly than many single gaps."],
        ["Alignment summary", "Identity, similarity, length, gaps, and coverage describe different properties.", "Report them together and inspect the domain or pocket region directly."],
      ],
    },
    note:
      "Matrix and gap choices can move an alignment around low-complexity segments and insertions. Test whether key catalytic, binding-site, or structural residues remain plausibly aligned.",
  },
  {
    title: "Interpret BLAST as a heuristic search",
    paragraphs: [
      "BLAST accelerates database searching by extending promising sequence seeds into high-scoring segment pairs. It is fast and useful, but it is not guaranteed to return the mathematically optimal alignment.",
    ],
    table: {
      headers: ["Program", "Query", "Database", "Typical use"],
      rows: [
        ["BLASTP", "Protein", "Protein", "Find protein homologs, domains, and related families."],
        ["BLASTN", "Nucleotide", "Nucleotide", "Find closely related DNA or RNA sequences."],
        ["BLASTX", "Translated nucleotide", "Protein", "Detect coding regions or protein similarity in an unannotated nucleotide query."],
        ["TBLASTN", "Protein", "Translated nucleotide", "Search genomes or transcript collections for sequences encoding related proteins."],
      ],
    },
    steps: [
      {
        title: "Clean and define the query",
        description:
          "Confirm sequence type and orientation; remove vector contamination; identify low-complexity, signal-peptide, and transmembrane regions that may dominate a search.",
      },
      {
        title: "Choose the search space",
        description:
          "Match program, database, organism scope, and filtering settings to the biological question. A larger database changes the expected number of chance hits.",
      },
      {
        title: "Inspect more than the top hit",
        description:
          "Compare E-value, score, query coverage, identity, gaps, conserved motifs, and domain architecture. Promiscuous domains can produce convincing but incomplete matches.",
      },
      {
        title: "Validate the biological claim",
        description:
          "Check reciprocal relationships, curated annotations, genomic context, structure, and experimentally supported function before transferring a name or mechanism.",
      },
    ],
    note:
      "An E-value estimates how many matches of comparable score are expected by chance in the searched space. It is not a probability that two sequences have the same function.",
  },
  {
    title: "Multiple alignment and sequence profiles",
    paragraphs: [
      "Exact simultaneous alignment becomes computationally impractical as the number of sequences grows, so common tools use heuristics. Progressive alignment is useful, but early errors can propagate through later steps.",
    ],
    steps: [
      {
        title: "Curate representative sequences",
        description:
          "Remove obvious fragments, duplicates, unrelated domain architectures, and poor-quality records while preserving meaningful diversity.",
      },
      {
        title: "Estimate pairwise similarity",
        description:
          "Initial pairwise comparisons provide distances used to organize the order of alignment.",
      },
      {
        title: "Build a guide tree",
        description:
          "The guide tree controls progressive alignment order. It is an algorithmic scaffold, not a validated evolutionary tree.",
      },
      {
        title: "Align progressively and inspect",
        description:
          "Add sequences or profiles in guide-tree order, then inspect conserved motifs, secondary structure, insertions, low-complexity regions, and domain boundaries.",
      },
      {
        title: "Use the profile carefully",
        description:
          "A position-specific scoring matrix captures residue preferences by alignment position. Iterative profile searches such as PSI-BLAST can detect distant relatives but can also drift if false positives enter the profile.",
      },
    ],
  },
  {
    title: "Read phylogenetic trees as inferences",
    cards: [
      {
        title: "Root and branch meaning",
        description:
          "Rooting gives direction to the tree. Branch lengths may represent inferred change or simply layout, depending on whether the figure is a phylogram or cladogram.",
      },
      {
        title: "Gene tree versus species tree",
        description:
          "A gene family can have duplications, losses, horizontal transfer, or incomplete lineage sorting, so its tree need not match the organismal history.",
      },
      {
        title: "Orthologs and paralogs",
        description:
          "Orthologs diverge through speciation; paralogs through gene duplication. Both can retain or change function, so the label guides rather than replaces functional analysis.",
      },
      {
        title: "Support and sensitivity",
        description:
          "Bootstrap support measures stability under resampling. Test sensitivity to sequence sampling, alignment, trimming, evolutionary model, and rooting choice.",
      },
    ],
    note:
      "Do not read a progressive-alignment guide tree as a final phylogeny. Rebuild the tree from a curated alignment with an explicit evolutionary method and support assessment.",
  },
  {
    title: "Infer function from genomic context",
    paragraphs: [
      "Sequence similarity is only one clue to function. Comparative genomics can add evidence when the protein is poorly annotated or belongs to a broad family.",
    ],
    cards: [
      {
        title: "Phylogenetic profiles",
        description:
          "Genes that are repeatedly gained or lost together across genomes may participate in the same process, although shared ecology and genome quality can confound the pattern.",
      },
      {
        title: "Gene neighborhood and fusion",
        description:
          "Conserved proximity or fusion into one protein can support a functional relationship, especially in microbial genomes.",
      },
      {
        title: "Conserved noncoding regions",
        description:
          "Conservation outside coding sequence can suggest regulatory elements, but functional interpretation requires cell-type and experimental evidence.",
      },
      {
        title: "Annotation boundaries",
        description:
          "Gene prediction and automatic annotation can miss exons, split genes, or propagate an old error. Inspect the underlying sequence and evidence before modeling a target.",
      },
    ],
  },
  {
    title: "Translate sequence evidence into CADD decisions",
    steps: [
      {
        title: "Confirm the target sequence",
        description:
          "Record species, isoform, mutations, signal peptide, transmembrane segments, domains, construct boundaries, and database version.",
      },
      {
        title: "Choose structural templates",
        description:
          "Evaluate full and local coverage, pocket-residue conservation, insertions, oligomeric state, ligand state, and experimental quality rather than percent identity alone.",
      },
      {
        title: "Anticipate selectivity and resistance",
        description:
          "Map conserved and variable residues across paralogs, species, pathogens, and known resistant variants onto the binding site.",
      },
      {
        title: "Design validation",
        description:
          "Test predicted function, binding, selectivity, and mechanism with orthogonal assays. Keep alignment, search, database, and tree settings with the project record.",
      },
    ],
  },
];

const questions: Question[] = [
  {
    question: "When is a local alignment more appropriate than a global alignment?",
    options: ["When two sequences may share only one domain", "When both sequences are identical end to end", "When no sequence is available", "When measuring compound solubility"],
    correctIndex: 0,
    explanation:
      "Local alignment can identify a shared domain or motif within sequences that differ elsewhere in length or architecture.",
  },
  {
    question: "Which statement correctly contrasts common substitution-matrix numbering?",
    options: ["Higher BLOSUM and higher PAM both always mean more divergence", "Higher BLOSUM generally targets closer relationships, while higher PAM represents more divergence", "PAM is used only for DNA", "Matrix choice never affects an alignment"],
    correctIndex: 1,
    explanation:
      "The numbering runs in opposite practical directions: higher BLOSUM numbers are used for more conserved relationships, while higher PAM numbers model more accumulated change.",
  },
  {
    question: "Why can the same query produce a different BLAST E-value in a larger database?",
    options: ["The query sequence changes", "The expected number of chance matches depends on search-space size", "BLAST becomes a global aligner", "Protein residues become nucleotides"],
    correctIndex: 1,
    explanation:
      "The E-value is calibrated to the searched space, so comparable scores are expected more often by chance in a larger database.",
  },
  {
    question: "What is the role of a guide tree in progressive multiple alignment?",
    options: ["It proves the species history", "It determines the order in which sequences or profiles are aligned", "It measures binding affinity", "It removes every alignment error"],
    correctIndex: 1,
    explanation:
      "A guide tree organizes progressive alignment. It is not automatically a suitable or supported phylogenetic inference.",
  },
  {
    question: "What distinguishes paralogs from orthologs?",
    options: ["Paralogs arise by gene duplication; orthologs diverge by speciation", "Paralogs are always proteins and orthologs are always DNA", "Orthologs must be identical", "Only paralogs can retain function"],
    correctIndex: 0,
    explanation:
      "The terms describe evolutionary origin. Neither relationship guarantees identical function, so additional evidence remains necessary.",
  },
  {
    question: "Why is percent identity alone insufficient when selecting a homology-model template?",
    options: ["Identity applies only to DNA", "Coverage, domain boundaries, structural state, and local pocket conservation also matter", "Templates must have 100% identity", "Gap penalties remove all uncertainty"],
    correctIndex: 1,
    explanation:
      "A useful template must cover the relevant region and represent a suitable structure and functional state, not merely achieve a high identity score.",
  },
];

export default function SequenceBioinformaticsPage() {
  return (
    <ExtensionLesson
      moduleNumber={18}
      title="Sequence Bioinformatics & Evolution"
      summary="Move from a biological database record to defensible alignments, similarity searches, sequence profiles, evolutionary relationships, and CADD decisions without confusing computational output with biological proof."
      outcomes={[
        "Navigate sequence, protein, domain, genome, structure, and pathway records with provenance.",
        "Choose and interpret pairwise alignment, substitution matrices, gaps, and BLAST searches.",
        "Build and inspect multiple alignments, sequence profiles, and phylogenetic trees.",
        "Use conservation and genomic context to guide templates, selectivity, resistance, and validation.",
      ]}
      sections={sections}
      questions={questions}
    />
  );
}
