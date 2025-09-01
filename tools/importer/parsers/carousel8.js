/* global WebImporter */
export default function parse(element, { document }) {
  // The source HTML only contains navigation dots and a button (no images or slide content)
  // The example markdown does not show a Section Metadata table and expects just the block header row
  // To ensure all text content is not missed, collect all text content in a single cell (if present)
  const headerRow = ['Carousel (carousel8)'];

  // Gather all non-empty text contents from the element (dot numbers and button label)
  const textNodes = Array.from(element.querySelectorAll('button')).map(btn => btn.textContent.trim()).filter(Boolean);
  // Also check for any additional visible text nodes directly under the element (unlikely in this HTML, but for flexibility)
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  let extraTextNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    // Only keep text nodes that are not inside a <button> (already handled)
    if (!node.parentElement || node.parentElement.tagName.toLowerCase() !== 'button') {
      extraTextNodes.push(node.textContent.trim());
    }
  }

  // Merge all collected text
  const allText = [...textNodes, ...extraTextNodes].join(' ').trim();
  let contentRow;
  if (allText) {
    // Use a paragraph for all the text content
    const p = document.createElement('p');
    p.textContent = allText;
    contentRow = [p];
  }

  // Build rows
  const rows = [headerRow];
  if (contentRow) {
    rows.push(contentRow);
  }
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
