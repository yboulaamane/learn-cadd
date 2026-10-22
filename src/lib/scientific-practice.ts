export interface ScientificPracticeEntry {
  prerequisites: number[];
  question: string;
  output: string;
  reasoning: string;
  source: { label: string; url: string };
}

/** Compact interpretation prompts, not claims of completed practical training. */
export const scientificPractice: Record<number, ScientificPracticeEntry> = {
  "1": {
    "prerequisites": [],
    "question": "A cellular screen improves a disease marker, but its target is unknown. Should you start by docking every hit?",
    "output": "Draft a project brief: observed endpoint, two possible mechanisms, the cheapest distinguishing experiment, and a stopping criterion.",
    "reasoning": "Confirm identity, activity, and interference first. Docking may generate target hypotheses, but it cannot establish the mechanism of a phenotypic hit.",
    "source": {
      "label": "Morgan et al.: exposure, engagement and pharmacology",
      "url": "https://pubmed.ncbi.nlm.nih.gov/22227532/"
    }
  },
  "2": {
    "prerequisites": [
      1,
      17
    ],
    "question": "A target has a high pocket score but weak functional perturbation evidence. Would you advance it?",
    "output": "Write a target evidence matrix with modulation direction, provenance, modality, and the next falsifying experiment.",
    "reasoning": "Keep pocket ligandability separate from disease causality. Seek selective perturbation and rescue in a relevant model; absent human genetics is not an automatic veto.",
    "source": {
      "label": "Open Targets: modality-specific tractability",
      "url": "https://platform-docs.opentargets.org/target/tractability"
    }
  },
  "3": {
    "prerequisites": [
      1
    ],
    "question": "A matched pair gains a hydrogen bond but loses affinity. What would you measure next?",
    "output": "Build a solvent-aware energy ledger and convert a Kd to standard binding free energy with units.",
    "reasoning": "Consider desolvation, pKa, strain, and conformational populations. A contact count cannot distinguish these explanations. IC50 is an assay endpoint, not automatically Kd.",
    "source": {
      "label": "IUPAC: IC50 definition",
      "url": "https://goldbook.iupac.org/terms/view/12669"
    }
  },
  "4": {
    "prerequisites": [
      3
    ],
    "question": "One minimized conformer has lower energy. Does that establish its solution population?",
    "output": "Record several conformers, angles, force field, optimization status, and the limitations of a discrete-well population estimate.",
    "reasoning": "Minimization is local optimization, not ensemble sampling. This curve shows a torsion term, not a solvent-aware relaxed free-energy profile.",
    "source": {
      "label": "LAMMPS: reactive force fields and their scope",
      "url": "https://docs.lammps.org/pair_reaxff.html"
    }
  },
  "5": {
    "prerequisites": [
      1
    ],
    "question": "Two assay records canonicalize to one structure but have different activities. Which value should you keep?",
    "output": "Specify an identity policy and a transformation ledger; retain assay context, censoring, and replicate dispersion.",
    "reasoning": "Do not automatically keep the strongest activity. Separate incompatible assays and preserve source records. Canonical tautomers are normalization choices, not predicted dominant states.",
    "source": {
      "label": "RDKit: canonical tautomer selection",
      "url": "https://www.rdkit.org/docs/cppapi/classRDKit_1_1MolStandardize_1_1TautomerEnumerator.html"
    }
  },
  "6": {
    "prerequisites": [
      3,
      4,
      5,
      13
    ],
    "question": "Redocking gives 1.5 Å RMSD. Is the protocol ready for prospective ranking?",
    "output": "Write a pose-validation report including atom mapping, receptor state, settings, alternative poses, and remaining tests.",
    "reasoning": "This supports one pose-recovery test only. Check symmetry, preparation sensitivity, cross-docking, known actives/decoys, and experimental follow-up appropriate to the decision.",
    "source": {
      "label": "AutoDock Vina: accuracy and scoring assumptions",
      "url": "https://autodock-vina.readthedocs.io/en/latest/faq.html"
    }
  },
  "7": {
    "prerequisites": [
      3,
      5,
      6
    ],
    "question": "A scaffold hop fits every required feature. Does it have the same pharmacology?",
    "output": "Define a query, tolerances, excluded volumes, and held-out recovery metrics; explain one likely false positive.",
    "reasoning": "Feature fit supports a recognition hypothesis, not affinity or efficacy. Test conformer coverage, receptor state, actives and decoys before selecting compounds.",
    "source": {
      "label": "IUPAC: pharmacophore definition",
      "url": "https://goldbook.iupac.org/terms/view/11485"
    }
  },
  "8": {
    "prerequisites": [
      5,
      6,
      7
    ],
    "question": "An aggressive filter raises precision but discards several actives. Is it better?",
    "output": "Choose an assay-budget-sized set and report retained and missed actives, diversity, uncertainty, and confirmation assays.",
    "reasoning": "The decision depends on budget, false-negative cost, chemical quality, and diversity. Maximum rejection and a better aggregate AUC are not universal objectives.",
    "source": {
      "label": "MoleculeNet: datasets and split-dependent benchmarks",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5868307/"
    }
  },
  "9": {
    "prerequisites": [
      5,
      8
    ],
    "question": "The projected point sits inside the drawn ellipse. Would you trust its activity prediction?",
    "output": "Prepare a model card: endpoint, split, simple baseline, errors, domain evidence, calibration, and failure cases.",
    "reasoning": "A two-dimensional teaching plot cannot establish full-space support or precision. Validate on independent, task-relevant chemistry; prediction R² is not squared Pearson correlation.",
    "source": {
      "label": "scikit-learn: prediction R² definition",
      "url": "https://scikit-learn.org/stable/modules/generated/sklearn.metrics.r2_score.html"
    }
  },
  "10": {
    "prerequisites": [
      3,
      4,
      13
    ],
    "question": "An RMSD trace is flat, but independent runs disagree. Has the system converged?",
    "output": "Write a trajectory-analysis memo with selections, fitting/PBC choices, contact identities, replicate comparisons, and uncertainty.",
    "reasoning": "A plateau may indicate trapping. Convergence is observable-specific; examine correlation, block estimates, independent runs, and state transitions. More nanoseconds alone is not proof.",
    "source": {
      "label": "Best practices for uncertainty in molecular simulations",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6286151/"
    }
  },
  "11": {
    "prerequisites": [
      5,
      6,
      9
    ],
    "question": "A generated molecule wins the docking reward but has an uncertain synthesis route. Would you select it?",
    "output": "Produce a small design-selection dossier with component scores, uncertainty, route evidence, liabilities, and diversity.",
    "reasoning": "Treat routes and scores as hypotheses. Pareto domination depends on included objectives and their uncertainty; neither a reaction template nor pocket conditioning proves feasibility.",
    "source": {
      "label": "Pocket2Mol: original model description",
      "url": "https://proceedings.mlr.press/v162/peng22b.html"
    }
  },
  "12": {
    "prerequisites": [
      5,
      9
    ],
    "question": "An illustrative hERG score is high, but target-site exposure is unknown. Can you call the compound unsafe?",
    "output": "Write a safety-triage memo separating measured hazards, predictions, structural alerts, exposure margins, and follow-up assays.",
    "reasoning": "Do not convert an invented score into probability or clinical risk. hERG inhibition, QT effects, arrhythmia, bacterial mutagenicity, and human carcinogenicity are distinct endpoints.",
    "source": {
      "label": "FDA: integrated cardiac-safety guidance",
      "url": "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/e14-and-s7b-clinical-and-nonclinical-evaluation-qtqtc-interval-prolongation-and-proarrhythmic"
    }
  },
  "13": {
    "prerequisites": [
      3,
      18
    ],
    "question": "A predicted model has high pLDDT while a holo experimental entry has weaker global quality. Which receptor is better?",
    "output": "Create a local pocket preparation log: density/confidence, assembly, construct, waters, chemistry, and alternative states.",
    "reasoning": "Choose task-specific local evidence, not a method hierarchy or whole-model score. High pLDDT does not establish ligand-ready side chains, and it is not a B-factor measurement.",
    "source": {
      "label": "AlphaFold 3: model and evaluation",
      "url": "https://www.nature.com/articles/s41586-024-07487-w"
    }
  },
  "14": {
    "prerequisites": [
      5,
      6,
      9
    ],
    "question": "A pipeline reruns identically but silently drops assay records. Is it scientifically reproducible?",
    "output": "Specify a manifest, count reconciliation, rejection ledger, assay-aware aggregation policy, and a deliberate failure test.",
    "reasoning": "Repeatable software can reproduce an invalid inference. Preserve raw records, trace transformations, test expected outputs, and distinguish wrapper templates from runnable exercises.",
    "source": {
      "label": "RDKit: chemical-data tooling",
      "url": "https://www.rdkit.org/docs/GettingStartedInPython.html"
    }
  },
  "15": {
    "prerequisites": [
      3,
      12
    ],
    "question": "Two compounds have the same total plasma AUC but different peaks and protein binding. Which should advance?",
    "output": "Calculate a unit-checked exposure profile and identify the unbound target-site metric relevant to the mechanism.",
    "reasoning": "AUC alone cannot settle the decision. The widget assumes a linear one-compartment oral model; target-site distribution, binding, time coverage, and modality may invalidate that simplification.",
    "source": {
      "label": "Morgan et al.: exposure at the target",
      "url": "https://pubmed.ncbi.nlm.nih.gov/22227532/"
    }
  },
  "16": {
    "prerequisites": [
      3,
      13,
      18
    ],
    "question": "A pose has the best energy and developability score but unresolved severe clashes. Can those scores rescue it?",
    "output": "Compare plausible models and propose a discriminating mutation panel with folding and expression controls.",
    "reasoning": "Reject impossible geometry first. Then assess restraint agreement, ensemble support, and developability separately. Multivalent avidity depends on antigen spacing and assay geometry, not just single-site affinity.",
    "source": {
      "label": "AlphaFold 3: complex-structure prediction and limits",
      "url": "https://www.nature.com/articles/s41586-024-07487-w"
    }
  },
  "17": {
    "prerequisites": [
      1
    ],
    "question": "A nearby GWAS gene is differentially expressed. Does that identify the causal target and modulation direction?",
    "output": "Draw a provenance-aware evidence graph and specify a relevant perturbation/rescue experiment.",
    "reasoning": "Fine-mapping and colocalization can strengthen gene assignment, but need functional interpretation. Define biological replicates, background universe, multiple-testing method, and correlated evidence sources.",
    "source": {
      "label": "Open Targets: evidence provenance",
      "url": "https://platform-docs.opentargets.org/evidence"
    }
  },
  "18": {
    "prerequisites": [
      1
    ],
    "question": "A BLAST hit has the highest identity but covers only a small region. Is it the right template?",
    "output": "Produce an annotated alignment, accession versions, pocket comparison, and sequence-to-PDB-chain residue map.",
    "reasoning": "Select by task, coverage, architecture, orthology/paralogy, and local evidence. Map insertion codes and construct offsets explicitly before proposing a residue mutation.",
    "source": {
      "label": "NCBI: BLAST interpretation tutorial",
      "url": "https://www.ncbi.nlm.nih.gov/BLAST/tutorial/"
    }
  }
};
