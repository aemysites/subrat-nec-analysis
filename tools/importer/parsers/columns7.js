/* global WebImporter */
export default function parse(element, { document }) {
  // Select the menu list
  const ul = element.querySelector('ul.list');
  if (!ul) return;
  const lis = Array.from(ul.children);

  // Build each column: wrap image + label in a <div> to group them semantically
  const columns = lis.map((li) => {
    const a = li.querySelector('a');
    if (!a) return li; // fallback
    const img = a.querySelector('span.img img');
    const txt = a.querySelector('span.txt');
    // Wrap both in a div to group them
    const div = document.createElement('div');
    if (img) div.appendChild(img);
    if (txt) {
      const label = document.createElement('div');
      label.textContent = txt.textContent;
      div.appendChild(label);
    }
    return div;
  });

  // Create the table: header row is a single cell, second row is as many columns as are needed
  const tableRows = [
    ['Columns (columns7)'],
    columns
  ];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
