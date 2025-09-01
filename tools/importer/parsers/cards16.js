/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified
  const headerRow = ['Cards (cards16)'];
  // Each card is a .col
  const cols = element.querySelectorAll('.col');
  const rows = [];

  cols.forEach(col => {
    // First cell: image (mandatory)
    let img = col.querySelector('img');

    // Second cell: structured text content
    const cellContent = [];

    // Title (from strong)
    const txtBlock = col.querySelector('.mod-txt');
    if (txtBlock) {
      const strong = txtBlock.querySelector('strong');
      if (strong) {
        // Keep original formatting (strong is typical for cards)
        const pTitle = document.createElement('p');
        pTitle.appendChild(strong);
        cellContent.push(pTitle);
      }
    }
    // Description (first <p> after image)
    // Find the .box, then get all direct <p> children not containing <strong>
    const box = col.querySelector('.box');
    if (box) {
      // Only <p> that do NOT contain <strong>
      const descParagraphs = Array.from(box.querySelectorAll(':scope > p')).filter(p => !p.querySelector('strong'));
      descParagraphs.forEach(p => cellContent.push(p));
    }
    // CTA (button/link) -- referenced directly
    const ctaA = col.querySelector('.mod-btn a');
    if (ctaA) {
      cellContent.push(ctaA);
    }
    // Compose row
    rows.push([
      img,
      cellContent
    ]);
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
