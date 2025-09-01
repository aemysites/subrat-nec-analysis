/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the Cards block
  const headerRow = ['Cards (cards15)'];

  // Find the card container: look for .mod-lyt > .inner > .col
  const inner = element.querySelector('.mod-lyt .inner');
  if (!inner) return;
  const cols = Array.from(inner.children).filter((col) => col.classList.contains('col'));

  // Each col is a card
  const rows = cols.map((col) => {
    // Image/icon in first cell
    let image = null;
    const figure = col.querySelector('figure');
    if (figure) {
      image = figure.querySelector('img');
    }
    // Text content in second cell (usually linked title)
    let textCell = document.createElement('div');
    if (figure) {
      const figcaption = figure.querySelector('figcaption');
      if (figcaption) {
        // If the caption contains a link, use it as the title (bold), else use text
        const link = figcaption.querySelector('a');
        if (link) {
          const title = document.createElement('strong');
          title.appendChild(link);
          textCell.appendChild(title);
        } else {
          // Just the text
          const title = document.createElement('strong');
          title.textContent = figcaption.textContent.trim();
          textCell.appendChild(title);
        }
      }
    }
    return [image, textCell];
  });

  // Compose the cells array
  const cells = [headerRow, ...rows];

  // Create the table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
