/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards20) header
  const headerRow = ['Cards (cards20)'];
  const cells = [headerRow];

  // Select all cards
  const cardEls = element.querySelectorAll(':scope .col');
  cardEls.forEach((col) => {
    // Get image element
    let imageEl = null;
    const figure = col.querySelector('figure.mod-media');
    if (figure) {
      const img = figure.querySelector('img');
      if (img) imageEl = img;
    }
    // Get text content: title, description, CTA
    const box = col.querySelector('.box');
    const txt = box && box.querySelector('.mod-txt');
    // Title is strong
    let titleFragment = null;
    if (txt) {
      const strong = txt.querySelector('strong');
      if (strong) {
        // If strong is wrapped in a link, use the link
        const parentA = strong.closest('a');
        if (parentA && parentA !== txt) {
          titleFragment = parentA;
        } else {
          titleFragment = strong;
        }
      }
    }
    // Description: first p after figure
    let descFragment = null;
    if (box) {
      const pAfterFig = box.querySelector('figure.mod-media + p');
      if (pAfterFig) descFragment = pAfterFig;
    }
    // CTA button: .mod-btn .btn > a
    let ctaFragment = null;
    if (box) {
      const ctaA = box.querySelector('.mod-btn .btn a');
      if (ctaA) ctaFragment = ctaA;
    }
    // Compose text cell
    const textParts = [];
    if (titleFragment) textParts.push(titleFragment);
    if (descFragment) textParts.push(descFragment);
    if (ctaFragment) textParts.push(ctaFragment);

    cells.push([
      imageEl,
      textParts
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
