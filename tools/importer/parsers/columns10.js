/* global WebImporter */
export default function parse(element, { document }) {
  // Extract column <li> elements directly under the <ul>
  const columnsLi = element.querySelectorAll(':scope > ul.list > li.col');
  if (!columnsLi.length) return;

  // For each column, build a container with its <b> and nested <ul>
  const columns = Array.from(columnsLi).map((col) => {
    const title = col.querySelector(':scope > .title');
    const linksList = col.querySelector(':scope > ul.list');
    const div = document.createElement('div');
    if (title) div.appendChild(title);
    if (linksList) div.appendChild(linksList);
    return div;
  });

  // Header row must be a single column, matching the markdown example
  const cells = [
    ['Columns (columns10)'],   // header row (one cell)
    columns                   // second row: one cell per column
  ];

  // Create the block table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
