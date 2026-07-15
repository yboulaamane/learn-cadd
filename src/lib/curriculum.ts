export interface Module {
  slug: string;
  title: string;
  description: string;
  duration: string;
}

export const curriculum: Module[] = [
  {
    slug: "intro-to-drug-discovery",
    title: "Module 1: Introduction to Drug Discovery",
    description: "Learn the stages of the drug discovery and development pipeline, key terminology (hit, lead, candidate), hit-finding strategies including DNA-encoded libraries, and the undruggable proteome.",
    duration: "25 min",
  },
  {
    slug: "target-identification",
    title: "Module 2: Target Identification, Validation & Druggability",
    description: "Choose the right target before modelling anything. Explore target classes, the evidence chain for target validation, binding-site detection, druggability scoring, and polypharmacology.",
    duration: "25 min",
  },
  {
    slug: "ligand-receptor-interactions",
    title: "Module 3: Fundamentals of Ligand-Receptor Interactions",
    description: "Explore the thermodynamic basis of binding, molecular recognition models, and the critical non-covalent interactions that drive affinity.",
    duration: "30 min",
  },
  {
    slug: "molecular-mechanics",
    title: "Module 4: Molecular Mechanics & Force Fields",
    description: "Master the physics engine behind docking and MD: the force field energy decomposition, bonded and non-bonded terms, parameterization, energy minimization, and conformational analysis.",
    duration: "30 min",
  },
  {
    slug: "cheminformatics",
    title: "Module 5: Cheminformatics & Molecular Representations",
    description: "Master chemical graph representation, SMILES/SMARTS/InChI, the isomerism landscape, molecular descriptors, and fingerprint families with Tanimoto/Tversky similarity.",
    duration: "30 min",
  },
  {
    slug: "molecular-docking",
    title: "Module 6: Molecular Docking",
    description: "Understand conformational search algorithms, scoring functions, homology modeling, covalent docking, PROTAC ternary complexes, and receptor flexibility.",
    duration: "35 min",
  },
  {
    slug: "pharmacophore-modeling",
    title: "Module 7: Pharmacophore Modeling",
    description: "Define pharmacophore features, distinguish ligand-based vs. structure-based models, and explore scaffold hopping.",
    duration: "25 min",
  },
  {
    slug: "virtual-screening",
    title: "Module 8: Virtual Screening Strategies",
    description: "Master ligand-based and structure-based virtual screening workflows, database preparation, and evaluation metrics (ROC, Enrichment).",
    duration: "20 min",
  },
  {
    slug: "qsar-modeling",
    title: "Module 9: QSAR Modeling & AI Interpretation",
    description: "Learn classical Hansch analysis and Craig plots, QSAR machine learning workflows, descriptor calculations, model validation, and deep learning architectures.",
    duration: "35 min",
  },
  {
    slug: "molecular-dynamics",
    title: "Module 10: Molecular Dynamics & Free Energy Methods",
    description: "Simulate time-dependent trajectories, analyze RMSD/RMSF/Rg/SASA, apply enhanced sampling, compute binding free energies with MM/GBSA and FEP, and explore machine-learned force fields.",
    duration: "40 min",
  },
  {
    slug: "generative-design",
    title: "Module 11: De Novo & Generative Molecular Design",
    description: "Design molecules instead of searching for them. Master the three pillars of generative design — construction, scoring, and search — plus 3D diffusion models and multi-objective Pareto optimization.",
    duration: "35 min",
  },
  {
    slug: "in-silico-toxicology",
    title: "Module 12: In Silico ADMET & Safety Assessment",
    description: "Profile oral drug-likeness with Lipinski's Rule of Five and Veber's rules, then predict cardiotoxicity (hERG), hepatotoxicity (DILI), and mutagenicity (Ames) using machine learning, interpreting alerts with SHAP explainability.",
    duration: "30 min",
  },
];
