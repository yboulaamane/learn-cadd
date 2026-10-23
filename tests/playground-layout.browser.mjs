import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { curriculum } from "../src/lib/curriculum.ts";
import { inspectPlaygroundLayout } from "./helpers/playground-layout.mjs";

const option = (name, fallback) => process.argv.find(value => value.startsWith(name + "="))?.slice(name.length + 1) ?? fallback;
const baseURL = option("--base-url", "http://localhost:3000");
const artifacts = option("--artifacts-dir", "test-results/playgrounds");
const browser = await chromium.launch({ headless: true, channel: option("--channel", undefined) });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const pageErrors = [];
page.on("pageerror", error => pageErrors.push(error.message));
await page.route(/googletagmanager|google-analytics/, route => route.abort());
await mkdir(artifacts, { recursive: true });
let checks = 0;
const resumeFrom = option("--from", undefined);
let scanning = resumeFrom === undefined;

async function visit(slug) {
  const response = await page.goto(new URL("/" + slug, baseURL).href, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200, slug + " response");
}
async function assertLayout(context) {
  const report = await page.evaluate(inspectPlaygroundLayout);
  assert.deepEqual(report.clippedLabels, [], context + ": clipped SVG labels: " + JSON.stringify(report.clippedLabels));
  assert.deepEqual(report.fontConflicts, [], context + ": HTML typography overrides SVG font sizes");
  assert.deepEqual(report.clippedControls, [], context + ": hidden code-panel controls");
  assert.ok(report.articleOverflow <= 1, context + ": article clips " + report.articleOverflow + "px of content");
  assert.ok(report.pageOverflow <= 1, context + ": horizontal page overflow");
  checks++;
}
async function setRange(id, value) {
  await page.locator("#" + id).evaluate((element, next) => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(element, String(next));
    element.dispatchEvent(new Event("input", { bubbles: true }));
  }, value);
}
async function theme(value) {
  const dark = await page.locator("html").evaluate(element => element.classList.contains("dark"));
  if (dark !== (value === "dark")) {
    await page.getByRole("button", { name: "Switch to " + value + " mode", exact: true }).click();
    await page.waitForFunction(expected => document.documentElement.classList.contains("dark") === expected, value === "dark");
  }
}

try {
  // All modules, responsive breakpoints, both reading modes, both color themes.
  for (const width of [320, 390, 768, 1365]) {
    await page.setViewportSize({ width, height: 900 });
    for (const lesson of curriculum) {
      if (!scanning && width + ":" + lesson.slug === resumeFrom) scanning = true;
      if (!scanning) continue;
      await visit(lesson.slug);
      // Include diagrams under optional "Explore further" disclosures.
      await page.locator(".course-article details").evaluateAll(details => details.forEach(element => { element.open = true; }));
      for (const color of ["light", "dark"]) {
        await theme(color);
        for (const mode of ["Learn", "Review"]) {
          await page.getByRole("group", { name: "Reading view", exact: true })
            .getByRole("button", { name: mode, exact: true }).click();
          await page.waitForFunction(expected => document.querySelector(".course-article").dataset.readingMode === expected, mode.toLowerCase());
          await assertLayout(lesson.slug + " / " + width + " / " + color + " / " + mode);
        }
      }
    }
    if (scanning) console.log("PASS: scanned module layouts at " + width + "px, light/dark and Learn/Review.");
  }
  assert.ok(scanning, "Unknown --from resume point");

  await page.setViewportSize({ width: 390, height: 844 });
  await visit("ligand-receptor-interactions");
  await page.getByRole("heading", { name: "Hydrogen-bond distance and angle", exact: true }).waitFor();
  await theme("light");
  for (const angle of [90, 105, 120, 135, 150, 165, 180]) {
    await setRange("hbond-angle", angle);
    await page.locator('svg[aria-label="Hydrogen-bond geometry at ' + angle + ' degrees"]').waitFor();
    for (const distance of [1.8, 2.9, 5.5]) {
      await setRange("hbond-distance", distance);
      await page.waitForFunction(expected => document.querySelector('output[for="hbond-distance"]').textContent.startsWith(expected), distance.toFixed(2));
      await assertLayout("hydrogen bond / " + angle + " degrees / " + distance + " Å");
      const geometry = await page.locator('svg[aria-label^="Hydrogen-bond geometry"]').evaluate(svg => {
        const atom = svg.querySelectorAll("circle")[2];
        const label = [...svg.querySelectorAll("text")].find(text => text.textContent === "acceptor");
        return { atomX: Number(atom.getAttribute("cx")), atomY: Number(atom.getAttribute("cy")),
          labelX: Number(label.getAttribute("x")), labelY: Number(label.getAttribute("y")) };
      });
      assert.ok(Math.abs(geometry.labelX - geometry.atomX - 12) < 0.001);
      assert.ok(Math.abs(geometry.labelY - geometry.atomY) < 0.001);
    }
  }
  await page.getByRole("button", { name: "Same distance, bent", exact: true }).click();
  assert.equal(await page.getByRole("button", { name: "Same distance, bent", exact: true }).getAttribute("aria-pressed"), "true");
  await page.locator('svg[aria-label^="Hydrogen-bond geometry"]').screenshot({ path: path.join(artifacts, "module3-acceptor-light.png") });
  await theme("dark");
  await assertLayout("hydrogen bond / dark");
  await page.locator('svg[aria-label^="Hydrogen-bond geometry"]').screenshot({ path: path.join(artifacts, "module3-acceptor-dark.png") });
  console.log("PASS: acceptor follows the atom; full angle/distance range remains in bounds.");

  await visit("molecular-mechanics");
  for (let angle = 0; angle <= 360; angle += 15) {
    await setRange("butane-dihedral", angle);
    await page.waitForFunction(expected => document.querySelector('output[for="butane-dihedral"]').textContent.startsWith(expected), String(angle));
    await assertLayout("Newman projection / " + angle);
  }
  console.log("PASS: rotating Newman labels remain inside the diagram.");

  await visit("cheminformatics");
  for (const molecule of ["dopamine", "adrenaline", "ibuprofen"]) {
    await page.getByLabel("Molecule A", { exact: true }).selectOption(molecule);
    await page.getByLabel("Neighborhood center", { exact: true }).selectOption({ index: 1 });
    await page.getByRole("button", { name: /Radius 2/ }).click();
    assert.equal(await page.getByRole("button", { name: /Radius 2/ }).getAttribute("aria-pressed"), "true");
    await assertLayout("chemical graph / " + molecule);
  }
  // Atom labels must remain visible on the dark diagram, not white-on-white.
  const atomColors = await page.locator('svg[aria-label^="Chemical graph"]').evaluate(svg => {
    const group = [...svg.querySelectorAll("g")].find(node => node.querySelector("circle") && node.querySelector("text"));
    return { background: getComputedStyle(group.querySelector("circle")).fill,
      foreground: getComputedStyle(group.querySelector("text")).fill };
  });
  assert.notEqual(atomColors.background, atomColors.foreground);
  console.log("PASS: molecular controls work without clicking atoms; dark labels remain visible.");

  await visit("pharmacophore-modeling");
  const metadata = page.getByText("Selected Conformational Projection", { exact: true });
  const canvas = page.locator('svg[aria-label^="Pharmacophore alignment canvas"]');
  const metadataRow = await metadata.locator("..").locator("..").boundingBox();
  assert.ok(metadataRow.y + metadataRow.height <= (await canvas.boundingBox()).y);
  await assertLayout("pharmacophore / mobile metadata");
  await canvas.screenshot({ path: path.join(artifacts, "pharmacophore-mobile.png") });

  await visit("in-silico-toxicology");
  const compounds = page.getByLabel("Illustrative toxicology compounds", { exact: true });
  for (const button of await compounds.getByRole("button").all()) {
    await button.click();
    assert.equal(await button.getAttribute("aria-pressed"), "true");
    await assertLayout("toxicology / " + await button.innerText());
  }
  console.log("PASS: pharmacophore metadata does not cover the canvas; all toxicity presets fit.");

  await page.setViewportSize({ width: 320, height: 844 });
  await visit("molecular-dynamics");
  await page.getByLabel("Trajectory system", { exact: true }).selectOption("cov2");
  for (const button of await page.getByRole("group", { name: "Trajectory observables", exact: true }).getByRole("button").all()) {
    await button.click();
    assert.equal(await button.getAttribute("aria-pressed"), "true");
    await assertLayout("MD observable / " + await button.innerText());
  }
  const showCode = page.getByRole("button", { name: "Show Code Implementation", exact: true }).first();
  await showCode.focus();
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Hide Code Details", exact: true }).first().waitFor();
  await assertLayout("expanded code / 320px");
  console.log("PASS: MD controls, observable tabs, and code disclosure remain usable at 320px.");

  assert.deepEqual(pageErrors, [], "Uncaught browser errors");
  console.log("PASS: " + checks + " layout states checked; no uncaught browser errors.");
} catch (error) {
  await page.screenshot({ path: path.join(artifacts, "failure.png"), fullPage: true });
  throw error;
} finally {
  await browser.close();
}
