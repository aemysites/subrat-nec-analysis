/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches example exactly
  const headerRow = ['Search (search13)'];

  // Collect all content (including text nodes) from the element for semantic preservation
  // Reference existing nodes (do not clone)
  const cellContent = [];
  Array.from(element.childNodes).forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      cellContent.push(node);
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      // Wrap non-empty text nodes for structure
      const div = document.createElement('div');
      div.textContent = node.textContent.trim();
      cellContent.push(div);
    }
  });

  // Add the query index link at the end of the cell
  const queryIndexUrl = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';
  const queryIndexLink = document.createElement('a');
  queryIndexLink.href = queryIndexUrl;
  queryIndexLink.textContent = queryIndexUrl;
  cellContent.push(queryIndexLink);

  // Compose table structure
  const cells = [
    headerRow,
    [cellContent]
  ];

  // Create and replace block table, no return value
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}