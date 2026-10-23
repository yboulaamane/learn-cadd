# Playground layout cleanup — 23 October 2026

## Corrections

- Module 3: keep the acceptor label next to its moving atom, reserve room for all
  labels, and give the energy plot padded axes and markers over the full control
  range. Drawing coordinates are separate from the unchanged teaching potential.
- Shared typography: larger reading text no longer overrides SVG label sizes.
  Long inline identifiers and words wrap instead of disappearing beyond the
  reading column. Code blocks retain horizontal scrolling.
- Module 5: wrap the molecule selectors, show complete SMILES strings, provide a
  keyboard-accessible neighborhood selector, and keep atom labels visible in dark mode.
- Module 7: keep the widget inside the reading column and move molecule metadata
  out of the drawing area. Metadata is available on mobile instead of being hidden.
- Module 10: reflow the system selector, observable controls, timeline and frame
  controls; give the animation a dedicated aspect-ratio area above its legend.
- Module 12: wrap compound choices and expose their selected state.
- Shared code panels: titles and disclosure controls wrap according to available
  space instead of clipping each other in narrow panels.
- Add native coordinate tests and a reusable browser layout regression suite.

## Local checks

Verified on 23 October: 10 native tests, ESLint, TypeScript, a 22-route production
build, and a fresh lockfile installation with scripts disabled passed. Edge
browser checks covered 347 layout/interaction states (the resumed main run plus
the final 320px prefix recheck), with no detected label clipping, typography
conflicts, control clipping, or page/article overflow in those states. The main
browser run reported no uncaught page errors. Light/dark screenshots of the
corrected acceptor diagram were also inspected.

```sh
npm ci
npm test
npm run lint
npx tsc --noEmit
npm run build
```

The lockfile now includes the previously missing emnapi entries. Adding the
Playwright development dependency did not upgrade Next.js or React. A fresh
`npm ci --ignore-scripts --no-audit --no-fund` install was checked in a temporary
Linux directory; installation scripts were intentionally not exercised by that check.

## Browser regression checks

Install a test browser once, start the production build, then run the checks
from another terminal:

```sh
npx playwright install chromium
npm run build
npm start
# In another terminal:
npm run test:playgrounds -- --base-url=http://localhost:3000
```

On Windows, an installed Edge can be used without downloading Chromium:

```sh
npm run test:playgrounds -- --base-url=http://localhost:3000 --channel=msedge
```

On Linux CI, Playwright's browser system libraries must also be present
(`npx playwright install --with-deps chromium` installs them where permitted).

The suite covers all 18 modules at 320, 390, 768, and 1365 CSS pixels, in both
Learn/Review modes and light/dark themes. It measures transformed SVG text against
its viewBox, checks typography conflicts and page/article overflow, and checks
code-panel control bounds. Interaction cases exercise hydrogen-bond geometry,
Newman rotation, molecule/atom selection, pharmacophore metadata, toxicity choices,
MD observables, and keyboard-operated code disclosure.

Screenshots are written to the ignored `test-results/playgrounds/` directory.
These checks supplement visual inspection; they are not a full accessibility
certification or proof that every possible chart state is visually ideal.

Development file watching on this WSL/Windows-mounted checkout did not reliably
refresh edited files, so final visual checks use a freshly generated production
build rather than trusting hot reload.
