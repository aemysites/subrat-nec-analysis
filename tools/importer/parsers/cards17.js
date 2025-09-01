/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block definition
  const headerRow = ['Cards (cards17)'];
  const rows = [];
  // Find the card container (ul)
  const ul = element.querySelector('ul.list');
  if (ul) {
    const cards = ul.querySelectorAll('li');
    cards.forEach((li) => {
      // Each card is an <a> with .thumb (image) and .detail (text)
      const a = li.querySelector('a.inner');
      let imageCell = '';
      let textCellContent = [];
      if (a) {
        // --- IMAGE CELL ---
        const thumb = a.querySelector('.thumb');
        if (thumb) {
          // Use the <img> inside .thumb if available
          const img = thumb.querySelector('img');
          if (img) {
            imageCell = img;
          }
        }
        // --- TEXT CELL ---
        const detail = a.querySelector('.detail');
        if (detail) {
          // Heading as <strong> per style
          const heading = detail.querySelector('.heading');
          if (heading && heading.textContent.trim()) {
            const strong = document.createElement('strong');
            strong.textContent = heading.textContent.trim();
            textCellContent.push(strong);
          }
          // Description as normal text (if present)
          const description = detail.querySelector('.text');
          if (description && description.textContent.trim()) {
            if (textCellContent.length) {
              textCellContent.push(document.createElement('br'));
            }
            // Use the existing description node for accurate styling & content
            textCellContent.push(description);
          }
        }
      }
      rows.push([imageCell, textCellContent]);
    });
  }
  // Compose table
  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
  element.replaceWith(table);
}
