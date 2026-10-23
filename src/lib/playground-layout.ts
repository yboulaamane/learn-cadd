/** Drawing coordinates are independent of page typography and the physical model. */
export const HYDROGEN_BOND_DIAGRAM = { width: 220, height: 115 } as const;
export const HYDROGEN_BOND_PLOT = {
  width: 360, height: 240, left: 48, right: 336, top: 28, bottom: 184,
  minDistance: 1.8, maxDistance: 5.5, minEnergy: -4, maxEnergy: 8,
} as const;

export function hydrogenBondDiagram(angle: number) {
  const bend = ((180 - angle) * Math.PI) / 180;
  const donor = { x: 28, y: 78 };
  const hydrogen = { x: 88, y: 78 };
  const acceptor = { x: hydrogen.x + 60 * Math.cos(bend), y: hydrogen.y - 60 * Math.sin(bend) };
  return { donor, hydrogen, acceptor, acceptorLabel: { x: acceptor.x + 12, y: acceptor.y } };
}

export function hydrogenBondPlotPoint(distance: number, energy: number) {
  const plot = HYDROGEN_BOND_PLOT;
  return {
    x: plot.left + ((distance - plot.minDistance) / (plot.maxDistance - plot.minDistance)) * (plot.right - plot.left),
    y: plot.top + ((plot.maxEnergy - energy) / (plot.maxEnergy - plot.minEnergy)) * (plot.bottom - plot.top),
  };
}
