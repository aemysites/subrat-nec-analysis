/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .layout element which contains the columns
  const layout = element.querySelector('.layout');
  if (!layout) return;

  // Get all direct children (columns)
  const columnEls = Array.from(layout.children);

  // Check if there are further rows (for example, more .layout wrappers)
  // For this HTML, we have only one .layout, so one row of columns
  // But if more .layout rows, should handle them
  let rows = [];
  // If the layout itself is a row, columns are its direct children
  rows.push(columnEls);

  // Compose the cells: header row, then one row per row of columns
  const cells = [
    ['Columns (columns6)'],
    ...rows
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}