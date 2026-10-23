# Scientific correction pass — 22 October 2026

Scope: targeted corrections from the source review of all 18 modules at main
`4b183d5078161494d958e3bf507f9c97eb16bbee`. This is not a new scientific
validation of the course simulations or a claim of demonstrated learning gains.

## Changes by module

| Module | Applied correction |
| --- | --- |
| 1. Discovery | Separate lack of efficacy from exposure/engagement/function failures; qualify hit/lead/candidate definitions, phenotypic relevance, and repurposing safety requirements. |
| 2. Targets | Replace absolute pocket-score verdicts with fitted-score interpretations; make tractability modality-dependent; revise the CETSA quiz and dated target counts. |
| 3. Binding | State the standard concentration in the free-energy relation; distinguish Kd, Ki, and IC50; include conformational selection. |
| 4. Mechanics | Correct reversed butane angle proximity; distinguish the torsion term and discrete-well populations from a solution ensemble; qualify fixed-topology limitations. |
| 5. Cheminformatics | Correct canonical-tautomer, InChIKey suffix, chemical-identity, stereo-fingerprint, radius/diameter, and substructure-screenout statements; label hand-authored bits. |
| 6. Docking | Remove the finite-grid global-minimum guarantee; limit redocking claims; label the imposed PROTAC curve and readout as an illustrative score, not calculated degradation. |
| 7. Pharmacophores | Replace biological-equivalence claims with recognition hypotheses; identify schematic coordinates/activity classes; make clustering choices pipeline-specific. |
| 8. Screening | Permit one Lipinski violation consistently with Module 12; label the BEDROC expression as schematic; qualify confidence-interval interpretation. |
| 9. QSAR | Correct prediction R² versus squared correlation; remove fake leverage/precision and confidence-envelope claims from the projection; add position-dependent interpretation feedback; qualify calibration/domain cutoffs. |
| 10. MD | Label synthetic traces; remove plateau/occupancy/SASA proof claims; correct dimensionless REMD acceptance and replica-directory invocation; remove universal timeframe and accuracy ladders. |
| 11. Generation | Distinguish Pocket2Mol from diffusion; qualify route feasibility and Pareto conclusions; identify invented objective scores and their directions. |
| 12. Safety | Replace invented probabilities/SHAP with illustrative endpoint scores and annotations; separate hazard from clinical risk; qualify Ames, hERG, ionization, and TPSA claims. |
| 13. Structures | Remove method-wide score bonuses; distinguish teaching ratings, map evidence, pLDDT/PAE, and experimental B-factors. |
| 14. Workflows | Aggregate compatible exact assay replicates in log space instead of selecting the strongest; retain source/review records and dispersion; label absent-script orchestration as a template. |
| 15. PK | Derive feedback from actual inputs; make fast clearance a one-factor preset; distinguish elimination half-life from absorption-limited oral terminal kinetics. |
| 16. Interfaces | Enforce severe-clash rejection before ranking; separate intrinsic affinity from format/assay-dependent avidity. |
| 17. Systems biology | Remove the mandatory-genetics veto; add gene-assignment, modulation-direction, replicate/background, and multiple-testing qualifications. |
| 18. Sequences | Hide recommended answers until a learner selects a hit, reset selection on task change, and require explicit sequence-to-structure residue mapping. |

Every module now has a short research-decision prompt, an expected student output,
suggested background links, a reasoning disclosure, and a primary evidence anchor.
These are formative checkpoints, not new datasets or complete runnable practical labs.

## Evidence anchors

- [Prediction R²: scikit-learn](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.r2_score.html).
- [RDKit canonical tautomer selection](https://www.rdkit.org/docs/cppapi/classRDKit_1_1MolStandardize_1_1TautomerEnumerator.html),
  [Pattern fingerprints for substructure screening](https://www.rdkit.org/docs/source/rdkit.Chem.rdSubstructLibrary.html),
  and [InChI technical FAQ](https://www.inchi-trust.org/technical-faq/).
- [Vina scoring and accuracy FAQ](https://autodock-vina.readthedocs.io/en/latest/faq.html).
- [GROMACS replica exchange](https://manual.gromacs.org/current/reference-manual/algorithms/replica-exchange.html)
  and [mdrun replica directories](https://manual.gromacs.org/current/onlinehelp/gmx-mdrun.html).
- [Simulation uncertainty best practices](https://pmc.ncbi.nlm.nih.gov/articles/PMC6286151/).
- [Pocket2Mol original paper](https://proceedings.mlr.press/v162/peng22b.html)
  and [DiffSBDD original paper](https://www.nature.com/articles/s43588-024-00737-x).
- [Modality-specific tractability](https://platform-docs.opentargets.org/target/tractability)
  and [exposure/engagement/pharmacology evidence](https://pubmed.ncbi.nlm.nih.gov/22227532/).
- [FDA integrated cardiac-safety guidance](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/e14-and-s7b-clinical-and-nonclinical-evaluation-qtqtc-interval-prolongation-and-proarrhythmic).

## Verification and reproducibility limits

Verified locally with Node.js 24.19.0:

- Seven native regression tests and one actual Python-example test passed.
- Full ESLint, `tsc --noEmit`, and `git diff --check` passed.
- The production build prerendered all 22 routes successfully.
- Edge browser checks rendered all 18 module pages and opened each checkpoint.
- Interaction checks covered six butane geometries, single/multi-control PK changes,
  deferred sequence answers and task resets, hard clash rejection, absent-genetics
  cases, method-invariant structure scores, and position-dependent QSAR feedback.
- PK, QSAR, and sequence exercises fit a 390-pixel mobile viewport. No uncaught
  page errors occurred in the interaction checks.
- The Python example ran with pandas 3.0.5, NumPy 2.4.6, and RDKit 2026.09.1.

Standard checks (Node.js 24 LTS):

```sh
npm test
npm run lint
npx tsc --noEmit
npm run build
```

The native regression tests exercise butane angle proximity, linear oral PK including
the equal-rate limit and flip-flop condition, actual-input feedback, the Lipinski
allowance, functional-evidence gating, and severe-clash exclusion.

An optional scientific-example test executes the actual Module 14 Python snippet
against compatible/incompatible assays, replicate activities, censored values,
non-positive/non-finite values, missing context, and an invalid structure:

```sh
python3 tests/curation-example.test.py
```

It requires pandas, NumPy, and RDKit. No docking or MD calculation is run by these tests.
The remaining course Python/shell snippets have not all been executed. GROMACS input
files, the orchestration scripts, and full practical datasets remain separate work.

The inherited package lock fails `npm ci` with missing `@emnapi/core@1.11.3`
and `@emnapi/runtime@1.11.3` entries. For this correction pass dependencies were
installed with `npm install --no-package-lock`; the dependency lock was not rewritten.
A passing build therefore does not establish that a lockfile-only clean CI install works.

Update, 23 October 2026: the missing lockfile entries were repaired as part of the
[playground layout cleanup](playground-layout.md). A fresh `npm ci --ignore-scripts`
installation passed; the historical limitation above describes the earlier correction pass.
