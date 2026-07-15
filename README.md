# Learn CADD

An interactive, visual, first-principles web guide to computer-aided drug design (CADD) — from the physics of binding to generative molecular design. Every module pairs the theory with a hands-on browser playground.

## Course Structure
The curriculum is organized into 12 interactive modules, each pairing theory with a browser playground:

1. **Introduction to Drug Discovery:** The R&D funnel, hit/lead/candidate terminology, hit-finding strategies (HTS, fragment-based, DNA-encoded libraries), and the "undruggable" proteome.
2. **Target Identification, Validation & Druggability:** Target classes, the validation evidence chain, binding-site detection (fpocket, FTMap, SiteMap), druggability scoring, and polypharmacology / target fishing. *Playground: SiteMap Dscore druggability scorecard.*
3. **Fundamentals of Ligand-Receptor Interactions:** Thermodynamics, non-covalent contacts (H-bonds, halogen bonds, salt bridges, cation-π, dispersion), and binding affinity ($\Delta G = R \cdot T \cdot \ln K_d$). *Playgrounds: Lennard-Jones potential, desolvation, supramolecular binding sandbox.*
4. **Molecular Mechanics & Force Fields:** The energy decomposition (bond/angle/torsion/improper/vdW/electrostatics), force field families (AMBER, CHARMM, OPLS, GROMOS, GAFF), parameterization, energy minimization, and the multiple-minimum problem. *Playground: butane torsional profile with Newman projection and Boltzmann populations.*
5. **Cheminformatics & Molecular Representations:** SMILES, InChI/InChIKey, the isomerism landscape (constitutional, stereo, E/Z, atropisomers), fingerprint families (ECFP, atom-pair, 2D pharmacophore), and Tanimoto/Tversky similarity. *Playground: chemical graph + ECFP neighbourhood + Tanimoto.*
6. **Molecular Docking:** Search algorithms, scoring functions, homology modeling & AlphaFold, covalent docking, and PROTAC ternary complexes. *Playgrounds: manual pose matcher, PROTAC hook effect.*
7. **Pharmacophore Modeling:** Structure vs. ligand-based pharmacophores, 3D hashes, and scaffold hopping. *Playground: 3D-to-2D pharmacophore alignment.*
8. **Virtual Screening Strategies:** LBVS vs. SBVS cascading filters, database curation, and performance metrics (ROC, EF). *Playgrounds: ROC/enrichment, live HTS simulator.*
9. **QSAR Modeling & AI Interpretation:** Classical Hansch analysis (π, σ, Eₛ) and Craig plots, ML models (SVM, RF, XGBoost, KNN, Naive Bayes), GNNs, and validation with applicability domains. *Playgrounds: Hansch/Craig plot, decision tree, PCA applicability domain.*
10. **Molecular Dynamics & Free Energy Methods:** Equilibration, trajectory analysis (RMSD/RMSF/Rg/SASA), enhanced sampling (umbrella, metadynamics, steered MD, T-REMD), QM/MM, binding free energy (MM/GBSA and FEP), and machine-learned force fields. *Playground: MD trajectory dashboard.*
11. **De Novo & Generative Molecular Design:** The three pillars — construction (atom/fragment/reaction), scoring (explicit/implicit, multi-objective), and search (MC, GA, MCTS, RL) — plus 3D pocket-conditioned diffusion. *Playground: Pareto frontier explorer.*
12. **In Silico ADMET & Safety Assessment:** Drug-likeness (Lipinski, Veber), LogP/TPSA/clearance, hERG, DILI, Ames, explainable AI (SHAP), and DeLong validation. *Playgrounds: drug-likeness scorecard, SHAP profiler.*

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
