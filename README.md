# Learn CADD

Interactive, visual guide to computer-aided drug design — from binding physics to generative design. Each module pairs theory with a browser playground.

Live site: [learn-cadd.vercel.app](https://learn-cadd.vercel.app/)

<img width="1372" height="912" alt="Learn CADD screenshot" src="https://github.com/user-attachments/assets/192b8d61-f2d0-44d9-b3f5-872af438ff3f" />

## Curriculum

**18 modules** — core (1–12) in order, then applied extensions (13–18) in any order.

**Core**
1. Introduction to Drug Discovery
2. Target Identification, Validation & Druggability
3. Ligand–Receptor Interactions
4. Molecular Mechanics & Force Fields
5. Cheminformatics & Molecular Representations
6. Molecular Docking
7. Pharmacophore Modeling
8. Virtual Screening Strategies
9. QSAR Modeling & AI Interpretation
10. Molecular Dynamics & Free Energy Methods
11. De Novo & Generative Molecular Design
12. In Silico ADMET & Safety Assessment

**Extensions**
13. Structural Bioinformatics & Visualization
14. Applied CADD Workflows & Reproducibility
15. Pharmacokinetics & DMPK
16. Protein, Antibody & PPI Modeling
17. Bioinformatics & Systems Biology
18. Sequence Bioinformatics & Evolution

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test && npm run lint && npx tsc --noEmit && npm run build
```

Playgrounds are teaching models, not experimental claims. See [scientific corrections](docs/scientific-corrections.md) and [playground layout tests](docs/playground-layout.md).

## License

[MIT](LICENSE)
