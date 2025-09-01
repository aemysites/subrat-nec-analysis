/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content wrapper
  const wide = element.querySelector('.str-outer-wide');
  if (!wide) return;
  const inner = wide.querySelector('.str-inner');
  if (!inner) return;
  const wrap = inner.querySelector('.wrap');
  if (!wrap) return;

  // Get all immediate children of the .wrap block
  // These are typically the content columns
  const cols = [];
  wrap.childNodes.forEach((node) => {
    if (node.nodeType === 1 && (node.tagName === 'UL' || node.tagName === 'P')) {
      cols.push(node);
    }
  });

  // If no columns found, don't create the block table
  if (cols.length === 0) return;

  // The header row is always a single cell (not repeated for each column)
  const cells = [
    ['Columns (columns5)'],
    cols,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
