/** Runs inside the browser. Bounds include nested transforms and rotated axes. */
export function inspectPlaygroundLayout() {
  const article = document.querySelector(".course-article");
  const clippedLabels = [];
  const fontConflicts = [];
  const clippedControls = [];
  for (const button of article.querySelectorAll("button[aria-controls]")) {
    const frame = button.closest(".overflow-hidden");
    if (!frame || !button.getBoundingClientRect().width) continue;
    const control = button.getBoundingClientRect();
    const bounds = frame.getBoundingClientRect();
    if (control.left < bounds.left - 1 || control.right > bounds.right + 1) {
      clippedControls.push(button.textContent.trim());
    }
  }
  for (const svg of article.querySelectorAll("svg[viewBox]")) {
    if (!svg.getBoundingClientRect().width) continue;
    const viewBox = svg.viewBox.baseVal;
    const rootMatrix = svg.getScreenCTM();
    if (!rootMatrix) continue;
    for (const text of svg.querySelectorAll("text")) {
      if (!text.textContent.trim() || !text.getBoundingClientRect().width) continue;
      const box = text.getBBox();
      const matrix = rootMatrix.inverse().multiply(text.getScreenCTM());
      const corners = [[box.x, box.y], [box.x + box.width, box.y],
        [box.x, box.y + box.height], [box.x + box.width, box.y + box.height]]
        .map(([x, y]) => new DOMPoint(x, y).matrixTransform(matrix));
      const left = Math.min(...corners.map(point => point.x));
      const right = Math.max(...corners.map(point => point.x));
      const top = Math.min(...corners.map(point => point.y));
      const bottom = Math.max(...corners.map(point => point.y));
      const detail = { diagram: svg.getAttribute("aria-label"), label: text.textContent.trim(),
        bounds: [left, top, right, bottom], viewBox: svg.getAttribute("viewBox") };
      if (left < viewBox.x - 0.5 || top < viewBox.y - 0.5 ||
          right > viewBox.x + viewBox.width + 0.5 || bottom > viewBox.y + viewBox.height + 0.5) {
        clippedLabels.push(detail);
      }
      const declaredSize = text.getAttribute("font-size");
      if (declaredSize && Math.abs(parseFloat(getComputedStyle(text).fontSize) - parseFloat(declaredSize)) > 0.1) {
        fontConflicts.push(detail);
      }
    }
  }
  return { clippedLabels, fontConflicts, clippedControls,
    articleOverflow: Math.max(0, article.scrollWidth - article.clientWidth),
    pageOverflow: Math.max(0, document.documentElement.scrollWidth - window.innerWidth) };
}
