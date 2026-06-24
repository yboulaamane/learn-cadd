# Computational Drug Discovery Course

An interactive, visual, first-principles web guide to computational drug discovery. Learn ligand-receptor binding, molecular docking, pharmacophores, and QSAR machine learning models.

## Course Structure
The curriculum is organized into 10 interactive modules:
1. **Introduction to Drug Discovery:** The R&D funnel, target validation, clinical trial attrition, and new modalities.
2. **Fundamentals of Ligand-Receptor Interactions:** Thermodynamics, non-covalent contacts, and binding affinity equations ($\Delta G = R \cdot T \cdot \ln K_d$).
3. **Cheminformatics & Molecular Representations:** SMILES, InChI/InChIKey, stereoisomer enumeration (RDKit), fingerprints, and similarity calculations.
4. **Molecular Docking:** Target coordinate preparation, partial charge calculation, empirical scoring functions, and covalent docking.
5. **Pharmacophore Modeling:** Structure vs. ligand-based pharmacophores, 3D hashes, and MD dynamic clustering.
6. **Virtual Screening Strategies:** LBVS vs. SBVS cascading filters, database curation, screening performance metrics (EF & BEDROC), and Active Learning / Bayesian Optimization.
7. **QSAR Modeling & AI Interpretation:** Machine learning models (SVM, RF, XGBoost, KNN, Naive Bayes), consensus modeling, and three-tier validation (Williams plots, applicability domains).
8. **Molecular Dynamics & Trajectory Analysis:** Equilibration, solvation models (explicit vs. implicit), trajectory analysis (RMSD/RMSF formulas), and enhanced sampling (umbrella sampling, metadynamics, steered MD).
9. **Advanced Frontiers in Drug Discovery:** Pocket-conditioned diffusion models, targeted protein degradation (PROTAC cooperativity kinetics), and neural network force fields (MACE, ANI).
10. **In Silico Toxicology & Safety Assessment:** Ames mutagenicity, hERG blockade, DILI endpoints, explainable AI (SHAP value calculations), and DeLong statistical validation.

## Getting Started

First, install the npm dependencies:
```bash
npm install
```

Then, run the Next.js development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the course locally.

## Compilation & Verification

The project compiles cleanly using Next.js Turbopack:
```bash
npm run build
```
