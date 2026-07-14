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
    description: "Learn the stages of the drug discovery and development pipeline, key terminology (hit, lead, candidate), and active screening strategies.",
    duration: "20 min",
  },
  {
    slug: "ligand-receptor-interactions",
    title: "Module 2: Fundamentals of Ligand-Receptor Interactions",
    description: "Explore the thermodynamic basis of binding, molecular recognition models, and critical non-covalent interactions.",
    duration: "30 min",
  },
  {
    slug: "cheminformatics",
    title: "Module 3: Cheminformatics & Molecular Representations",
    description: "Master chemical graph representation, SMILES/SMARTS syntax, SDF connection tables, molecular descriptors, and ECFP4 fingerprints.",
    duration: "25 min",
  },
  {
    slug: "molecular-docking",
    title: "Module 4: Molecular Docking",
    description: "Understand conformational search algorithms, scoring functions, consensus scoring, and receptor flexibility in docking.",
    duration: "25 min",
  },
  {
    slug: "pharmacophore-modeling",
    title: "Module 5: Pharmacophore Modeling",
    description: "Define pharmacophore features, distinguish ligand-based vs. structure-based models, and explore scaffold hopping.",
    duration: "25 min",
  },
  {
    slug: "virtual-screening",
    title: "Module 6: Virtual Screening Strategies",
    description: "Master ligand-based and structure-based virtual screening workflows, database preparation, and evaluation metrics (ROC, Enrichment).",
    duration: "20 min",
  },
  {
    slug: "qsar-modeling",
    title: "Module 7: QSAR Modeling & AI Interpretation",
    description: "Learn QSAR machine learning workflows, descriptor calculations (ECFP4), model validation, and deep learning architectures.",
    duration: "35 min",
  },
  {
    slug: "molecular-dynamics",
    title: "Module 8: Molecular Dynamics & Trajectory Analysis",
    description: "Simulate time-dependent molecular trajectories, understand force fields, and analyze RMSD, RMSF, Radius of Gyration, SASA, and hydrogen bonds.",
    duration: "35 min",
  },
  {
    slug: "advanced-frontiers",
    title: "Module 9: Advanced Frontiers: AI Generative Chemistry, TPD, & ML Force Fields",
    description: "Explore de novo 3D diffusion generative models, targeted protein degradation (PROTACs/molecular glues), machine learning force fields, and DNA-encoded library pipelines.",
    duration: "30 min",
  },
  {
    slug: "in-silico-toxicology",
    title: "Module 10: In Silico ADMET & Safety Assessment",
    description: "Profile oral drug-likeness with Lipinski's Rule of Five and Veber's rules, then predict cardiotoxicity (hERG), hepatotoxicity (DILI), and mutagenicity (Ames) using machine learning. Compare models with DeLong's test and interpret alerts with SHAP explainability.",
    duration: "30 min",
  },
];
