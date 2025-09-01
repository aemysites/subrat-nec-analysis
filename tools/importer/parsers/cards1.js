/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards1)'];
  const rows = [headerRow];
  // Find all immediate columns (cards)
  const inner = element.querySelector(':scope > .inner');
  const cols = inner ? inner.querySelectorAll(':scope > .col') : [];
  cols.forEach((col) => {
    // IMAGE (first cell)
    let img = col.querySelector('img');
    // TEXT CELL (second cell)
    const cellContent = [];
    // Title: from .media .title OR fallback to .txt p if missing
    const linkEl = col.querySelector('.media');
    const titleEl = linkEl ? linkEl.querySelector('.title') : null;
    let titleText = titleEl && titleEl.textContent.trim() ? titleEl.textContent.trim() : '';
    // Description: from .txt p
    const descEl = col.querySelector('.txt p');
    // Link: the .media itself is a link, use its href
    let link = null;
    if (linkEl && linkEl.getAttribute('href')) {
      link = document.createElement('a');
      link.href = linkEl.getAttribute('href');
      link.textContent = titleText || linkEl.getAttribute('href');
      link.target = '_blank';
    }
    // Add title (as link if available)
    if (link) {
      // For visual similarity, wrap with <strong> if title exists
      if (titleText) {
        const strong = document.createElement('strong');
        strong.appendChild(link);
        cellContent.push(strong);
      } else {
        cellContent.push(link);
      }
    } else if (titleText) {
      const strong = document.createElement('strong');
      strong.textContent = titleText;
      cellContent.push(strong);
    }
    // Add description below title
    if (descEl) {
      // Only include if not duplicating title
      if (!titleText || descEl.textContent.trim() !== titleText) {
        cellContent.push(descEl);
      }
    }
    // Tag(s): .mod-list-tag li
    const tagLis = col.querySelectorAll('.mod-list-tag li');
    if (tagLis.length > 0) {
      const tagsDiv = document.createElement('div');
      tagLis.forEach((li, i) => {
        if (li.textContent && li.textContent.trim()) {
          // For block, visually separate tags
          const tagSpan = document.createElement('span');
          tagSpan.textContent = li.textContent.trim();
          tagSpan.style.display = 'inline-block';
          tagSpan.style.background = '#eee';
          tagSpan.style.fontSize = '0.85em';
          tagSpan.style.marginRight = '6px';
          tagSpan.style.padding = '2px 6px';
          tagSpan.style.borderRadius = '3px';
          tagsDiv.appendChild(tagSpan);
        }
      });
      if (tagsDiv.childNodes.length) cellContent.push(tagsDiv);
    }
    rows.push([img, cellContent]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
