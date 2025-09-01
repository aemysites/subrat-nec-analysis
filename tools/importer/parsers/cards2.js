/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate card columns
  const cols = element.querySelectorAll('.col');
  const cells = [];
  // Header row: block name must match exactly
  cells.push(['Cards (cards2)']);

  cols.forEach((col) => {
    // IMAGE CELL
    // Get image element inside figure.mod-media
    let img = null;
    const imgFigure = col.querySelector('figure.mod-media');
    if (imgFigure) {
      img = imgFigure.querySelector('img');
    }

    // TEXT CELL (always an array of elements, always second cell)
    const textCell = [];
    // Title: strong inside a link in .mod-txt (must be heading, preserve text, no hardcoding)
    const modTxt = col.querySelector('.mod-txt');
    if (modTxt) {
      const strong = modTxt.querySelector('a strong');
      if (strong) {
        // Use heading (h3 for semantics)
        const h = document.createElement('h3');
        h.textContent = strong.textContent.trim();
        textCell.push(h);
      }
    }
    // Description: the <p> after figure.mod-media
    const descP = col.querySelector('figure.mod-media + p');
    if (descP) {
      textCell.push(descP);
    }
    // CTA: .mod-btn .btn a (append at bottom if present)
    const cta = col.querySelector('.mod-btn .btn a');
    if (cta) {
      textCell.push(cta);
    }

    // Add row: always 2 columns, always array for textCell
    cells.push([
      img,
      textCell
    ]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
