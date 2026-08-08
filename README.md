# Learn CADD

An interactive, visual, first-principles web guide to computer-aided drug design (CADD) — from the physics of binding to generative molecular design. Every module pairs the theory with a hands-on browser playground.

## Course Structure

The curriculum runs to **18 modules across two tracks**, each pairing theory with a browser playground and a short knowledge check:

- **Modules 1–12 — Core curriculum.** CADD from first principles, in the order the concepts build on each other. Work through these in sequence.
- **Modules 13–18 — Applied extensions.** Shorter, research-practice modules covering the structural, computational, pharmacokinetic, biologics, and systems-level material a real project needs. Read them in any order once the core is done.

### Core curriculum

1. **Introduction to Drug Discovery:** The R&D funnel, hit/lead/candidate terminology, hit-finding strategies (HTS, fragment-based, DNA-encoded libraries), and the "undruggable" proteome. *Playground: R&D attrition funnel.*
2. **Target Identification, Validation & Druggability:** Target classes, the validation evidence chain, binding-site detection (fpocket, FTMap, SiteMap), druggability scoring, and polypharmacology / target fishing. *Playground: SiteMap Dscore druggability scorecard.*
3. **Fundamentals of Ligand-Receptor Interactions:** Thermodynamics, non-covalent contacts (H-bonds, halogen bonds, salt bridges, cation-π, dispersion), and binding affinity ($\Delta G = R \cdot T \cdot \ln K_d$). *Playgrounds: Lennard-Jones potential, desolvation, supramolecular binding sandbox.*
4. **Molecular Mechanics & Force Fields:** The energy decomposition (bond/angle/torsion/improper/vdW/electrostatics), force field families (AMBER, CHARMM, OPLS, GROMOS, GAFF), parameterization, energy minimization, and the multiple-minimum problem. *Playground: butane torsional profile with Newman projection and Boltzmann populations.*
5. **Cheminformatics & Molecular Representations:** SMILES, InChI/InChIKey, the isomerism landscape (constitutional, stereo, E/Z, atropisomers), fingerprint families (ECFP, atom-pair, 2D pharmacophore), and Tanimoto/Tversky similarity. *Playground: chemical graph + ECFP neighbourhood + Tanimoto.*
6. **Molecular Docking:** Search algorithms, scoring functions, pose validation, covalent docking, receptor flexibility, and PROTAC ternary complexes. *Playgrounds: manual pose matcher, PROTAC hook effect.*
7. **Pharmacophore Modeling:** Structure vs. ligand-based pharmacophores, 3D hashes, and scaffold hopping. *Playground: 3D-to-2D pharmacophore alignment with a tolerance sweep from missed scaffold hops to admitted decoys.*
8. **Virtual Screening Strategies:** LBVS vs. SBVS cascading filters, database curation, and performance metrics (ROC, EF). *Playgrounds: ROC/enrichment, live HTS simulator.*
9. **QSAR Modeling & AI Interpretation:** Classical Hansch analysis (π, σ, Eₛ) and Craig plots, ML models (SVM, RF, XGBoost, KNN, Naive Bayes), GNNs, and validation with applicability domains. *Playgrounds: Hansch/Craig plot, decision tree, PCA applicability domain.*
10. **Molecular Dynamics & Free Energy Methods:** Equilibration, trajectory analysis (RMSD/RMSF/Rg/SASA), enhanced sampling (umbrella, metadynamics, steered MD, T-REMD), QM/MM, binding free energy (MM/GBSA and FEP), and machine-learned force fields. *Playground: MD trajectory dashboard.*
11. **De Novo & Generative Molecular Design:** The three pillars — construction (atom/fragment/reaction), scoring (explicit/implicit, multi-objective), and search (MC, GA, MCTS, RL) — plus 3D pocket-conditioned diffusion. *Playground: Pareto frontier explorer.*
12. **In Silico ADMET & Safety Assessment:** Drug-likeness (Lipinski, Veber), LogP/TPSA/clearance, hERG, DILI, Ames, explainable AI (SHAP), and DeLong validation. *Playgrounds: drug-likeness scorecard, SHAP profiler.*

### Applied extensions

13. **Structural Bioinformatics & Molecular Visualization:** Sequence-to-structure hierarchy, PDB/mmCIF records, experimental vs. predicted vs. comparative models, homology modeling, and validation with resolution, Ramachandran, QMEAN, pLDDT, and PAE. *Playground: structure readiness triage.*
14. **Applied CADD Workflows & Reproducibility:** Auditable chemical-data, docking, MD, ML, KNIME, Python, and HPC pipelines with explicit provenance, configuration, and failure checks. *Playground: workflow provenance audit.*
15. **Pharmacokinetics & DMPK:** Absorption, distribution, metabolism, excretion, exposure, clearance, dosing, and modality-aware PK design. *Playground: one-compartment oral PK (Bateman function).*
16. **Protein, Antibody & Protein-Protein Modeling:** Flexible interfaces, antibody paratopes, multispecific architectures, and developability risk. *Playground: interface evidence review.*
17. **Bioinformatics & Systems Biology Foundations:** Omics integration, interaction networks, pathways, perturbation data, and chemical-biology evidence for target selection. *Playground: target evidence scorecard.*
18. **Sequence Bioinformatics & Evolution:** Biological databases, pairwise and multiple alignments, BLAST, profiles, phylogenetic trees, and genomic context. *Playground: alignment interpretation.*

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
