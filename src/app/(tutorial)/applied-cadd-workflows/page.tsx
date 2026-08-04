import { ExtensionLesson, type LessonSection } from "@/components/ExtensionLesson";
import type { Question } from "@/components/Quiz";

const sections: LessonSection[] = [
  {
    title: "Reproducibility is part of the scientific method",
    paragraphs: [
      "A result is reproducible when another researcher can recover the same inputs, environment, parameters, random seeds, workflow steps, and outputs. A folder full of commands is useful evidence, but it becomes a scientific workflow only when assumptions and provenance are explicit.",
    ],
    cards: [
      {
        title: "Inputs",
        description:
          "Use immutable source files or record stable identifiers and retrieval dates. Preserve raw data and write cleaned outputs to a separate location.",
        items: ["Structures and sequence versions", "Compound identifiers and standardized structures", "Assay definitions, units, and censoring rules"],
      },
      {
        title: "Environment",
        description:
          "Pin software and database versions. Record operating system, CPU/GPU requirements, containers or environment files, and licensed components.",
      },
      {
        title: "Configuration",
        description:
          "Keep scientific choices in readable configuration files: protonation pH, grid center, scoring settings, split strategy, force field, water model, and random seed.",
      },
      {
        title: "Outputs and checks",
        description:
          "Create machine-readable summary tables, logs, checksums, and plots. A pipeline should fail loudly when expected records, columns, poses, or trajectories are missing.",
      },
    ],
  },
  {
    title: "Python, pandas, and RDKit as a transparent data layer",
    paragraphs: [
      "Use Python for explicit transformations that can be tested and version controlled. Pandas handles tabular assay data, while RDKit supplies chemical parsing, standardization, descriptors, fingerprints, and substructure operations.",
    ],
    code: {
      title: "Minimal auditable compound-curation pipeline",
      value: `from pathlib import Path
import pandas as pd
from rdkit import Chem
from rdkit.Chem import Descriptors

INPUT = Path("data/raw/assays.csv")
OUTPUT = Path("data/processed/curated_compounds.csv")

df = pd.read_csv(INPUT)
required = {"compound_id", "smiles", "activity_nm"}
missing = required.difference(df.columns)
if missing:
    raise ValueError(f"Missing columns: {sorted(missing)}")

df["mol"] = df["smiles"].map(Chem.MolFromSmiles)
invalid = df["mol"].isna()
if invalid.any():
    print("Invalid structures:", df.loc[invalid, "compound_id"].tolist())

curated = df.loc[~invalid].copy()
curated["canonical_smiles"] = curated["mol"].map(Chem.MolToSmiles)
curated["mw"] = curated["mol"].map(Descriptors.MolWt)
curated["clogp"] = curated["mol"].map(Descriptors.MolLogP)

# Keep one explicit policy for duplicate structure/activity records.
curated = curated.sort_values("activity_nm").drop_duplicates("canonical_smiles")
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
curated.drop(columns="mol").to_csv(OUTPUT, index=False)`,
    },
    note:
      "Canonical SMILES alone is not a complete standardization policy. Define how salts, mixtures, charges, isotopes, tautomers, stereochemistry, and duplicates are handled for the project.",
  },
  {
    title: "KNIME for visible, inspectable workflows",
    paragraphs: [
      "KNIME represents data transformations as connected nodes. It is valuable for teaching, prototyping, and mixed teams because each table can be inspected between steps. Component nodes should expose parameters and describe their chemical assumptions.",
    ],
    steps: [
      {
        title: "Read and validate",
        description:
          "Load molecular and assay tables, verify column types, parse structures, and branch invalid records to a review table rather than silently dropping them.",
      },
      {
        title: "Construct",
        description:
          "Generate molecules using atom-, fragment-, or reaction-based transformations. Preserve parent-child relationships and reaction provenance for every proposal.",
      },
      {
        title: "Score",
        description:
          "Calculate property filters, similarity, substructure alerts, predictive-model outputs, novelty, and synthesizability. Keep raw component scores before combining objectives.",
      },
      {
        title: "Search and select",
        description:
          "Explore candidates with enumeration, stochastic search, active learning, or multi-objective ranking. Apply diversity selection before exporting a review set.",
      },
      {
        title: "Package the workflow",
        description:
          "Bundle required extensions, input examples, component versions, annotations, and expected outputs. Test the workflow from a clean workspace.",
      },
    ],
  },
  {
    title: "Command-line automation for docking and MD",
    table: {
      headers: ["Stage", "Automation pattern", "Essential guardrail"],
      rows: [
        ["Library preparation", "One record per compound with a stable identifier and standardized protonation/3D generation", "Count inputs and outputs; quarantine failures."],
        ["Docking", "One configuration template plus an explicit compound/receptor manifest", "Capture software version, random seed, grid, exhaustiveness, and exit status."],
        ["Pose aggregation", "Parse scores and poses into a single table linked to source structures", "Do not rank across incompatible scoring setups."],
        ["MD setup", "Script topology, box, solvation, ions, minimization, NVT, NPT, and production stages", "Stop if energy, density, temperature, or pressure checks fail."],
        ["Trajectory analysis", "Use named index groups and scripted RMSD/RMSF/Rg/SASA/contact analyses", "Correct periodic boundaries and state the fitted atom selection."],
      ],
    },
  },
  {
    title: "Running at scale with SLURM and GPUs",
    paragraphs: [
      "An HPC scheduler allocates resources; it does not validate the science. Request resources that match the executable, split independent replicas or ligands into job arrays, and write logs that identify both job and scientific configuration.",
    ],
    code: {
      title: "SLURM template for a reproducible GROMACS run",
      value: `#!/usr/bin/env bash
#SBATCH --job-name=egfr-md
#SBATCH --partition=gpu
#SBATCH --gres=gpu:1
#SBATCH --cpus-per-task=8
#SBATCH --time=24:00:00
#SBATCH --output=logs/%x-%j.out
#SBATCH --error=logs/%x-%j.err

set -euo pipefail
module purge
module load GROMACS/2025

echo "job_id=\${SLURM_JOB_ID}"
gmx --version
nvidia-smi

test -s topol.tpr
gmx mdrun -deffnm production -s topol.tpr -ntomp "\${SLURM_CPUS_PER_TASK}"
test -s production.gro
test -s production.edr
test -s production.xtc`,
    },
  },
  {
    title: "From assay data to a deployable model",
    cards: [
      {
        title: "Assay quality first",
        description:
          "Check controls, replicates, plate effects, units, censoring, aggregation, autofluorescence, redox activity, reactive compounds, and orthogonal counterscreens before labeling molecules.",
      },
      {
        title: "Split by chemistry and time",
        description:
          "Random splits can leak close analogs. Prefer scaffold, series, cluster, or temporal splits that approximate how the model will encounter future compounds.",
      },
      {
        title: "Package preprocessing with the model",
        description:
          "The deployed artifact must include structure standardization, descriptor calculation, feature order, missing-value handling, model weights, thresholds, and applicability-domain logic.",
      },
      {
        title: "Monitor scientific validity",
        description:
          "Track input failures, chemical-space drift, confidence, calibration, and delayed assay outcomes. A Streamlit interface is a delivery layer, not evidence of model validity.",
      },
    ],
  },
];

const questions: Question[] = [
  {
    question: "What makes a computational workflow reproducible?",
    options: ["A screenshot of the final plot", "Recorded inputs, versions, parameters, seeds, steps, and checks", "Using only commercial software", "Keeping all outputs in one folder"],
    correctIndex: 1,
    explanation:
      "Reproducibility requires enough provenance to recreate both the computation and the scientific decisions behind it.",
  },
  {
    question: "Why is a random train/test split often optimistic for QSAR?",
    options: ["It always reduces sample size", "It may place very close analogs in both sets", "It prevents descriptor calculation", "It cannot handle continuous endpoints"],
    correctIndex: 1,
    explanation:
      "Analog leakage makes the test set easier than prospective chemistry. Scaffold, series, cluster, or time splits better estimate future performance.",
  },
  {
    question: "What should a KNIME molecule-construction workflow retain?",
    options: ["Only the highest score", "Only a rendered image", "Parent-child and transformation provenance", "The default row numbers"],
    correctIndex: 2,
    explanation:
      "Provenance makes generated molecules traceable and allows chemists to understand how each proposal was constructed.",
  },
  {
    question: "What is the role of 'set -euo pipefail' in a batch script?",
    options: ["It accelerates the GPU", "It makes common shell failures stop the workflow", "It changes the force field", "It submits a job array"],
    correctIndex: 1,
    explanation:
      "Strict shell settings reduce silent failures caused by non-zero commands, unset variables, and failed pipeline components.",
  },
];

export default function AppliedCaddWorkflowsPage() {
  return (
    <ExtensionLesson
      moduleNumber={14}
      title="Applied CADD Workflows & Reproducibility"
      summary="Turn isolated commands into inspectable pipelines using Python, pandas, RDKit, KNIME, the command line, SLURM, and deployment practices that preserve scientific provenance."
      outcomes={[
        "Design a reproducible project with explicit inputs, environments, parameters, and checks.",
        "Build transparent chemical-data transformations with Python or KNIME.",
        "Automate docking and MD without hiding failed records or incompatible results.",
        "Package and monitor predictive models without confusing an interface with validation.",
      ]}
      sections={sections}
      questions={questions}
    />
  );
}
