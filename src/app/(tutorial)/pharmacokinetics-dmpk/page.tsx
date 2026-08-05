import { ExtensionLesson, type LessonSection } from "@/components/ExtensionLesson";
import { PharmacokineticsPlayground } from "@/components/playgrounds/PharmacokineticsPlayground";
import type { Question } from "@/components/Quiz";

const sections: LessonSection[] = [
  {
    title: "PK, PD, and the ADME system",
    paragraphs: [
      "Pharmacokinetics describes what the body does to a drug: absorption, distribution, metabolism, and excretion determine exposure over time. Pharmacodynamics describes what the drug does to the biological system. Potency matters only if adequate unbound concentration reaches the target for long enough.",
      "Module 12 uses drug-likeness rules and toxicity models for early triage. This module begins at the next decision layer: translating compound and modality properties into exposure, clearance, dose, and pharmacological effect.",
    ],
    cards: [
      {
        title: "Exposure",
        description:
          "The concentration-time profile is summarized with quantities such as Cmax, Tmax, AUC, trough concentration, bioavailability, and half-life.",
      },
      {
        title: "Unbound drug",
        description:
          "Only the unbound fraction is generally available for diffusion, clearance, and target engagement. Total plasma concentration can be misleading when protein binding differs.",
      },
      {
        title: "Dose and route",
        description:
          "Oral, intravenous, inhaled, topical, and other routes impose different absorption and first-pass constraints. A PK objective must specify route and dosing schedule.",
      },
      {
        title: "PK/PD linkage",
        description:
          "Relate exposure to an effect metric such as receptor occupancy, biomarker modulation, growth inhibition, or microbial killing instead of optimizing PK in isolation.",
      },
    ],
  },
  {
    title: "Absorption: dissolving and crossing membranes",
    table: {
      headers: ["Driver", "Useful in silico view", "Common design tension"],
      rows: [
        ["Solubility", "pKa, logP/logD, crystal packing, melting point proxies, and aqueous solubility models", "Adding polarity may improve solubility but reduce passive permeability."],
        ["Permeability", "Polar surface area, hydrogen-bonding, size, ionization, conformational flexibility, and transporter models", "Masking polarity can improve permeability but increase lipophilicity and metabolic risk."],
        ["Dissolution", "Particle and solid-state properties plus dose/volume context", "A potent compound can still be dose limited if the required mass cannot dissolve."],
        ["First-pass loss", "Gut-wall and hepatic metabolism, efflux, and extraction models", "Oral exposure may remain low even when permeability is high."],
      ],
    },
    note:
      "Use logD at the relevant pH for ionizable molecules. A single neutral logP value does not describe the species presented to the intestine or target tissue.",
  },
  {
    title: "Distribution: where the compound goes",
    cards: [
      {
        title: "Volume of distribution",
        description:
          "Vd relates the amount of drug in the body to measured plasma concentration. A large apparent Vd often indicates extensive tissue partitioning, not a literal anatomical volume.",
      },
      {
        title: "Plasma and tissue binding",
        description:
          "Albumin, alpha-1-acid glycoprotein, membranes, and tissue components influence free concentration and can produce species- or concentration-dependent behavior.",
      },
      {
        title: "Blood-brain barrier",
        description:
          "CNS exposure reflects passive permeability, ionization, efflux transporters, plasma binding, brain-tissue binding, and local clearance. No single descriptor is decisive.",
      },
      {
        title: "Target-site exposure",
        description:
          "Plasma PK is a proxy. Distribution into tumor, lung, skin, intracellular compartments, or infection sites can be the true determinant of efficacy.",
      },
    ],
  },
  {
    title: "Metabolism and drug-drug interaction risk",
    paragraphs: [
      "Phase I reactions commonly introduce or expose functional groups through oxidation, reduction, or hydrolysis. Phase II enzymes conjugate molecules with groups such as glucuronide, sulfate, or glutathione. Metabolites may be inactive, active, reactive, or toxic.",
    ],
    table: {
      headers: ["Question", "Computational approach", "Experimental partner"],
      rows: [
        ["Where will metabolism occur?", "Site-of-metabolism and CYP-reactivity models; docking as a supporting hypothesis", "Metabolite identification and soft-spot assays"],
        ["How fast is intrinsic clearance?", "QSAR/ML models stratified by assay and species", "Microsomes, hepatocytes, or recombinant enzymes"],
        ["Could the compound inhibit CYPs?", "Classification/regression and structure alerts", "Reversible and time-dependent inhibition assays"],
        ["Are reactive metabolites plausible?", "Bioactivation rules, structural alerts, and metabolite enumeration", "Glutathione trapping and covalent-binding studies"],
      ],
    },
  },
  {
    title: "Clearance, half-life, and exposure",
    paragraphs: [
      "For a simple one-compartment intravenous model, total clearance is the dose divided by AUC. The terminal half-life depends on both distribution and clearance: t1/2 = 0.693 × Vd / CL. Improving stability can increase exposure, but excessive persistence may complicate safety or dosing control.",
    ],
    cards: [
      {
        title: "Hepatic clearance",
        description:
          "Depends on hepatic blood flow, unbound fraction, and intrinsic metabolic capacity. The limiting factor changes between low- and high-extraction compounds.",
      },
      {
        title: "Renal clearance",
        description:
          "Combines filtration of unbound drug, active secretion, and reabsorption. Molecular size, charge, transporters, and urine pH can matter.",
      },
      {
        title: "Bioavailability",
        description:
          "Oral bioavailability is the product of absorbed fraction and survival through intestinal and hepatic first pass. Diagnose which component limits exposure.",
      },
      {
        title: "Dose projection",
        description:
          "Combine target potency, required unbound coverage, clearance, bioavailability, safety margin, and variability. Potency alone cannot determine a human dose.",
      },
    ],
  },
  {
    title: "In silico DMPK is a decision system, not one score",
    steps: [
      {
        title: "Define the product profile",
        description:
          "State route, dosing frequency, target tissue, onset, duration, acceptable interaction risk, and species before selecting endpoints.",
      },
      {
        title: "Use assay-matched models",
        description:
          "A model trained on one solubility protocol, pH, species, or matrix should not be silently applied to another. Preserve assay metadata and units.",
      },
      {
        title: "Interpret within an applicability domain",
        description:
          "Flag unusual chemistry, ionization, molecular size, modality, or predicted uncertainty. Do not force a precise value for out-of-domain molecules.",
      },
      {
        title: "Triangulate predictions",
        description:
          "Combine physicochemical calculations, empirical models, mechanistic reasoning, and targeted experiments. Resolve disagreements instead of averaging them away.",
      },
      {
        title: "Optimize a profile",
        description:
          "Track potency, selectivity, solubility, permeability, clearance, safety, and synthetic feasibility together. Pareto thinking is more honest than a hidden weighted sum.",
      },
    ],
  },
  {
    title: "Biologics and multispecific antibodies",
    paragraphs: [
      "Large biologics are not governed by small-molecule rules. Their PK can be driven by target-mediated drug disposition, FcRn recycling, proteolysis, immunogenicity, tissue convection, nonspecific binding, charge patches, and aggregation. Multispecific formats add valency, geometry, and multiple target sinks.",
    ],
    note:
      "Do not apply Lipinski-style descriptors to antibodies. Use modality-appropriate developability and mechanistic PK models, then connect structure-based engineering to measured clearance and target engagement.",
  },
];

const questions: Question[] = [
  {
    question: "Which statement best distinguishes PK from PD?",
    options: ["PK is efficacy and PD is toxicity", "PK describes exposure over time; PD links concentration to biological effect", "PK applies only to oral drugs", "PD applies only to proteins"],
    correctIndex: 1,
    explanation:
      "PK describes what the body does to the drug, while PD describes how drug concentration relates to biological response.",
  },
  {
    question: "Why can a compound have high permeability but poor oral bioavailability?",
    options: ["Permeability guarantees complete exposure", "It may undergo strong efflux or intestinal/hepatic first-pass metabolism", "High permeability prevents dissolution", "It cannot bind plasma proteins"],
    correctIndex: 1,
    explanation:
      "Absorption and bioavailability are multistep outcomes. Efflux and first-pass loss can dominate even when passive permeability is favorable.",
  },
  {
    question: "What happens to half-life if Vd increases while clearance remains constant?",
    options: ["It decreases", "It remains identical", "It increases", "It becomes equal to bioavailability"],
    correctIndex: 2,
    explanation:
      "In a simple model, half-life is proportional to Vd/CL, so increasing distribution volume increases half-life when clearance is unchanged.",
  },
  {
    question: "What is the most defensible use of an in silico clearance prediction?",
    options: ["Treat it as an exact human value", "Use it with assay context, domain checks, and targeted experiments", "Average it with docking score", "Ignore species and matrix"],
    correctIndex: 1,
    explanation:
      "DMPK predictions support decisions when tied to the assay definition, chemical domain, uncertainty, and experimental follow-up.",
  },
];

export default function PharmacokineticsDmpkPage() {
  return (
    <ExtensionLesson
      moduleNumber={15}
      title="Pharmacokinetics & DMPK"
      summary="Connect molecular properties to absorption, distribution, metabolism, excretion, exposure, and dosing so that computational design optimizes the full pharmacokinetic profile rather than drug-likeness alone."
      outcomes={[
        "Distinguish PK, PD, exposure, unbound concentration, and ADME drivers.",
        "Reason about solubility-permeability, distribution, metabolism, and clearance tradeoffs.",
        "Interpret common PK quantities and their relationship to dose and target coverage.",
        "Use in silico DMPK models with assay context, uncertainty, and modality awareness.",
      ]}
      playground={<PharmacokineticsPlayground />}
      sections={sections}
      questions={questions}
    />
  );
}
