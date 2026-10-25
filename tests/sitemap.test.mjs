import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

test("sitemap and robots files exist", () => {
  assert.ok(fs.existsSync(path.join(root, "src/app/sitemap.ts")));
  assert.ok(fs.existsSync(path.join(root, "src/app/robots.ts")));
});

test("sitemap covers every curriculum slug", () => {
  const curriculum = fs.readFileSync(path.join(root, "src/lib/curriculum.ts"), "utf8");
  const sitemap = fs.readFileSync(path.join(root, "src/app/sitemap.ts"), "utf8");
  const slugs = [...curriculum.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
  assert.equal(slugs.length, 18);
  assert.match(sitemap, /curriculum\.map/);
  assert.match(sitemap, /https:\/\/learn-cadd\.vercel\.app/);
});

test("robots points at sitemap.xml", () => {
  const robots = fs.readFileSync(path.join(root, "src/app/robots.ts"), "utf8");
  assert.match(robots, /sitemap\.xml/);
  assert.match(robots, /allow:\s*"\/"/);
});
