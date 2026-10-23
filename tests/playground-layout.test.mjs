import assert from "node:assert/strict";
import test from "node:test";
import { HYDROGEN_BOND_DIAGRAM, HYDROGEN_BOND_PLOT,
  hydrogenBondDiagram, hydrogenBondPlotPoint } from "../src/lib/playground-layout.ts";

test("hydrogen-bond labels follow the acceptor with room on every side", () => {
  for (let angle = 90; angle <= 180; angle++) {
    const { acceptor, acceptorLabel } = hydrogenBondDiagram(angle);
    assert.equal(acceptorLabel.x, acceptor.x + 12);
    assert.equal(acceptorLabel.y, acceptor.y);
    assert.ok(acceptor.y - 8 > 0 && acceptor.y + 8 < HYDROGEN_BOND_DIAGRAM.height);
    assert.ok(acceptorLabel.x + 56 < HYDROGEN_BOND_DIAGRAM.width);
    assert.ok(acceptorLabel.y - 8 > 0 && acceptorLabel.y + 8 < HYDROGEN_BOND_DIAGRAM.height);
  }
  assert.notDeepEqual(hydrogenBondDiagram(90).acceptorLabel, hydrogenBondDiagram(180).acceptorLabel);
});

test("the full distance/energy range and markers fit inside plot padding", () => {
  const p = HYDROGEN_BOND_PLOT;
  for (const distance of [1.8, 2.4, 2.9, 3.2, 5.5]) {
    for (const energy of [-4, 0, 4, 8]) {
      const point = hydrogenBondPlotPoint(distance, energy);
      assert.ok(point.x >= p.left && point.x <= p.right);
      assert.ok(point.y >= p.top && point.y <= p.bottom);
      assert.ok(point.x - 5 > 0 && point.x + 5 < p.width);
      assert.ok(point.y - 5 > 0 && point.y + 5 < p.height);
    }
  }
});

test("plot axes increase distance rightwards and energy upwards", () => {
  assert.ok(hydrogenBondPlotPoint(5.5, 0).x > hydrogenBondPlotPoint(1.8, 0).x);
  assert.ok(hydrogenBondPlotPoint(2.9, 8).y < hydrogenBondPlotPoint(2.9, -4).y);
  assert.equal(hydrogenBondPlotPoint(2.9, 0).y, 132);
});
