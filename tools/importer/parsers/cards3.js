/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards3) block: 2 columns, each card = image + text (title + description)
  const ul = element.querySelector('ul.list');
  if (!ul) return;
  const lis = Array.from(ul.children);

  // Table header exactly as specified
  const rows = [['Cards (cards3)']];

  lis.forEach((li) => {
    const link = li.querySelector('a.inner');
    if (!link) return;

    // Card image (first column)
    let imgEl = null;
    const thumb = link.querySelector('.thumb');
    if (thumb) {
      imgEl = thumb.querySelector('img');
    }

    // Card text content (second column)
    const detail = link.querySelector('.detail');
    const cardText = [];
    if (detail) {
      const heading = detail.querySelector('.heading');
      if (heading && heading.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = heading.textContent.trim();
        cardText.push(strong);
      }
      const text = detail.querySelector('.text');
      if (text && text.textContent.trim()) {
        const div = document.createElement('div');
        div.textContent = text.textContent.trim();
        cardText.push(div);
      }
    }

    rows.push([imgEl, cardText]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}