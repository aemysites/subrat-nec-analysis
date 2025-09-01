/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Hero (hero4)'];

  // Find the most prominent image for background (prefer pc-show over pc-hide)
  let bgImg = null;
  const images = element.querySelectorAll('img');
  // Prefer .pc-show image if present
  bgImg = Array.from(images).find(img => img.classList.contains('pc-show')) || images[0] || '';

  // Second row: Background Image (optional)
  const backgroundRow = [bgImg];

  // Third row: Title (optional) - styled as Heading.
  // The heading is inside: .content-inner > h1.hdg
  let titleElem = element.querySelector('.content-inner > .hdg') || '';
  const textRow = [titleElem];

  const cells = [headerRow, backgroundRow, textRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
