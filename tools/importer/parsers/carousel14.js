/* global WebImporter */
export default function parse(element, { document }) {
  // Find the slick-track which contains all the slides
  const slickTrack = element.querySelector('.slick-track');
  if (!slickTrack) return;

  // Only get slides that are NOT slick-cloned
  const slides = Array.from(slickTrack.children).filter(slide =>
    slide.classList.contains('slick-slide') && !slide.classList.contains('slick-cloned')
  );

  // Table header must match example exactly
  const rows = [['Carousel (carousel14)']];

  slides.forEach((slide) => {
    // IMAGE CELL: first <img> inside the slide
    const img = slide.querySelector('img');
    const imgCell = img || '';

    // TEXT CELL: label, heading, description, possible CTA
    const cellContent = [];

    // LABEL: .label .text (plain text, referenced directly)
    const label = slide.querySelector('.label .text');
    if (label && label.textContent.trim()) {
      // Wrap label in <strong> for emphasis, maintaining semantic meaning
      const strong = document.createElement('strong');
      strong.textContent = label.textContent;
      cellContent.push(strong);
    }

    // DETAIL: heading, description, extra content
    const detail = slide.querySelector('.detail');
    if (detail) {
      // Heading: use a heading tag for semantic meaning if .heading exists
      const heading = detail.querySelector('.heading');
      if (heading && heading.textContent.trim()) {
        const h3 = document.createElement('h3');
        h3.textContent = heading.textContent;
        cellContent.push(h3);
      }
      // Description: all .text inside .detail (may be <div>, sometimes inside a paragraph)
      const desc = detail.querySelector('.text');
      if (desc && desc.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = desc.textContent;
        cellContent.push(p);
      }
    }

    // If .detail contains any <a> tags (CTA), include them (rare in this source, but future proof)
    if (detail) {
      const links = Array.from(detail.querySelectorAll('a[href]'));
      links.forEach(link => {
        cellContent.push(link);
      });
    }

    // Add the row
    rows.push([imgCell, cellContent.length ? cellContent : '']);
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
