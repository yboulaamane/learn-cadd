import { ExtensionLesson, type LessonSection } from "@/components/ExtensionLesson";
import type { Question } from "@/components/Quiz";

const sections: LessonSection[] = [
  {
    title: "The evidence layers behind a CADD project",
    paragraphs: [
      "Computer-aided drug design begins before molecular modeling. Genetics, expression, pathways, phenotypes, chemical biology, and structural evidence determine which target, molecular state, and assay should be modeled.",
    ],
    table: {
      headers: ["Evidence layer", "Typical evidence", "CADD decision supported"],
      rows: [
        ["Molecular identity", "Curated sequence, isoform, domain, and structure records", "Target construct, biological assembly, binding site, and model boundaries."],
        ["Chemistry and activity", "Standardized compounds, assay protocols, endpoints, and selectivity panels", "Known ligands, activity definition, training data, and off-target risks."],
        ["Genetics and disease", "Human variants, association studies, functional screens, and model systems", "Causal support, desired modulation direction, patient group, and safety."],
        ["Expression and cell state", "Bulk, single-cell, spatial, and proteomic measurements", "Relevant tissue, cell type, disease state, compensatory response, and biomarkers."],
        ["Networks and pathways", "Physical interactions, regulation, metabolism, perturbations, and phenotypes", "Mechanism, bypass routes, combinations, and system-level consequences."],
      ],
    },
    note:
      "A database record is an evidence claim with provenance. Check organism, isoform, assay, units, evidence level, and update date before joining records by identifier.",
  },
  {
    title: "What each omics layer contributes",
    table: {
      headers: ["Layer", "What is measured", "Drug-discovery use", "Common limitation"],
      rows: [
        ["Genome", "DNA sequence and variation", "Causal variants, target direction, resistance, and pharmacogenomics.", "A variant association does not by itself identify the causal gene or mechanism."],
        ["Transcriptome", "RNA abundance and isoforms", "Cell-state expression, response signatures, and compensatory pathways.", "RNA abundance may not predict protein amount or activity."],
        ["Proteome", "Protein abundance, interactions, and modifications", "Target presence, complex formation, signaling state, and target engagement.", "Coverage and dynamic range vary by protein class and method."],
        ["Metabolome", "Small-molecule products and intermediates", "Pathway consequences, mechanism, efficacy markers, and safety signals.", "Metabolites can have several biological and technical sources."],
        ["Metagenome", "Microbial genes, pathways, and taxa", "Microbiome targets, xenobiotic metabolism, and resistance reservoirs.", "Composition and function are strongly affected by environment and sampling."],
      ],
    },
  },
  {
    title: "Reading expression evidence without overclaiming",
    paragraphs: [
      "Expression studies compare conditions, but the biological conclusion depends on study design. A large fold change from a confounded or poorly replicated experiment is not strong target evidence.",
    ],
    cards: [
      {
        title: "Design before statistics",
        description:
          "Define the biological contrast, sample unit, replicates, covariates, and batch structure before testing differential expression.",
        items: ["Avoid treating repeated measurements as independent samples.", "Balance batches across conditions whenever possible."],
      },
      {
        title: "Effect size and uncertainty",
        description:
          "Interpret normalized abundance, fold change, confidence intervals, and multiple-testing-adjusted significance together.",
        items: ["A small precise effect may be real but not useful.", "A large uncertain effect needs replication."],
      },
      {
        title: "Cellular resolution",
        description:
          "Bulk tissue averages cell types. Single-cell and spatial data can localize a signal, but sparsity, cell annotation, and compositional shifts introduce new uncertainty.",
      },
      {
        title: "Association is a starting point",
        description:
          "Coexpression and clustering generate hypotheses. Genetic or chemical perturbation and orthogonal protein-level evidence are needed to test causality.",
      },
    ],
  },
  {
    title: "Interaction evidence is method-dependent",
    paragraphs: [
      "An interactome is assembled from experiments with different meanings. Low overlap between datasets can reflect limited coverage, biological context, and measurement noise rather than a single correct map.",
    ],
    table: {
      headers: ["Evidence type", "What it supports", "Interpretation checkpoint"],
      rows: [
        ["Binary interaction assay", "Two proteins can associate in the assay system.", "Confirm localization, construct quality, directionality, and an orthogonal assay."],
        ["Affinity purification–mass spectrometry", "Proteins occur in the same captured complex.", "Complex membership does not prove a direct pairwise contact."],
        ["Genetic or CRISPR interaction", "The combined perturbation changes fitness or phenotype.", "A functional relationship may be indirect and context-specific."],
        ["Coexpression and colocalization", "Molecules vary together or occupy compatible compartments.", "Compatibility is useful support, not proof of physical binding."],
        ["Regulatory occupancy", "A factor is enriched near a genomic region.", "Pair occupancy with expression or perturbation evidence to infer regulation."],
      ],
    },
    note:
      "Prioritize interactions that reproduce across complementary methods and in the disease-relevant cell state. Network centrality alone is not target validation.",
  },
  {
    title: "Reconstructing and contextualizing pathways",
    paragraphs: [
      "Pathway databases provide curated consensus models. A disease-, tissue-, or organism-specific pathway is a contextual hypothesis built from those references and the available measurements.",
    ],
    steps: [
      {
        title: "Define the graph",
        description:
          "Represent genes, proteins, metabolites, or reactions as nodes and label each regulatory, physical, or biochemical edge with direction and evidence.",
      },
      {
        title: "Anchor the question",
        description:
          "Start from disease genes, perturbed proteins, metabolites, or pathway seeds rather than searching the entire network without a hypothesis.",
      },
      {
        title: "Build the relevant subnetwork",
        description:
          "Connect seeds with plausible paths, known reactions, and compartment constraints. Keep alternative routes instead of forcing one neat story.",
      },
      {
        title: "Add biological context",
        description:
          "Overlay expression, abundance, localization, variants, and perturbation responses for the relevant tissue, cell type, and condition.",
      },
      {
        title: "Validate the model",
        description:
          "Test predicted nodes or edges experimentally and compare against held-out evidence. Database agreement is not independent validation.",
      },
    ],
  },
  {
    title: "Networks in systems pharmacology",
    cards: [
      {
        title: "Topology",
        description:
          "Communities and centrality can reveal influential nodes, but highly connected essential proteins may also carry greater safety risk.",
      },
      {
        title: "Pathway enrichment",
        description:
          "Test whether a defined gene set is overrepresented or coordinately shifted. Correct for multiple testing and recognize overlapping gene sets.",
      },
      {
        title: "Polypharmacology",
        description:
          "Map intended and off-target activities onto disease and safety networks. Multiple targets can explain efficacy, toxicity, or resistance.",
      },
      {
        title: "Perturbation profiles",
        description:
          "Genetic, chemical, and phenotypic perturbations connect a molecular intervention to system response and can support target deconvolution.",
      },
    ],
  },
  {
    title: "An integrated target-to-model evidence workflow",
    steps: [
      {
        title: "Frame the disease mechanism",
        description:
          "Specify the tissue, cell type, molecular phenotype, desired modulation direction, and evidence that the mechanism is causal rather than correlated.",
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
          "Select or model the relevant conformation and assembly; map variants, interfaces, regulatory sites, and pathway context onto the structure.",
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
    question: "Why is differential expression alone insufficient to establish a therapeutic target?",
    options: ["RNA cannot be measured", "Expression can be correlated with disease without causing it", "All expressed genes are essential", "Fold changes contain no units"],
    correctIndex: 1,
    explanation:
      "Expression can mark a disease state without driving it. Perturbation, genetics, mechanism, and orthogonal evidence strengthen a causal target hypothesis.",
  },
  {
    question: "What does affinity purification–mass spectrometry most directly support?",
    options: ["Two proteins make a direct atomic contact", "Proteins occur in the same captured complex", "A gene causes a disease", "A ligand crosses the blood-brain barrier"],
    correctIndex: 1,
    explanation:
      "Affinity purification can identify complex members, but additional experiments are required to determine which contacts are direct.",
  },
  {
    question: "Why should pathway-database agreement not be treated as independent validation?",
    options: ["Pathways contain no proteins", "Databases may share source evidence and consensus assumptions", "Pathways cannot be represented as graphs", "Only docking can validate pathways"],
    correctIndex: 1,
    explanation:
      "Pathway resources often reuse literature and each other. Validation should use independent perturbation, measurement, or held-out evidence.",
  },
  {
    question: "What is a limitation of selecting a target only because it is a network hub?",
    options: ["Hubs have no interactions", "High connectivity can reflect essential biology and increased safety risk", "Networks cannot include proteins", "Hubs cannot be modeled"],
    correctIndex: 1,
    explanation:
      "Centrality can indicate influence, but disrupting a highly connected essential protein can produce broad undesirable effects.",
  },
  {
    question: "What should be checked before joining records from different biological databases?",
    options: ["Only the record color", "Organism, isoform, identifier mapping, evidence, and version", "Only sequence length", "Only publication count"],
    correctIndex: 1,
    explanation:
      "Identifier mappings can mix species, isoforms, obsolete records, and evidence types. Provenance checks prevent silent biological mismatches.",
  },
];

export default function BioinformaticsSystemsBiologyPage() {
  return (
    <ExtensionLesson
      moduleNumber={17}
      title="Bioinformatics & Systems Biology Foundations"
      summary="Connect omics, interaction, pathway, perturbation, and chemical-biology evidence so each CADD project begins with the right molecular identity and a defensible disease hypothesis."
      outcomes={[
        "Trace genetics, expression, chemistry, structure, and pathway evidence across databases.",
        "Interpret omics results with attention to study design, uncertainty, and biological context.",
        "Distinguish physical, functional, regulatory, and correlative interaction evidence.",
        "Turn network and pathway hypotheses into falsifiable CADD milestones.",
      ]}
      sections={sections}
      questions={questions}
    />
  );
}
