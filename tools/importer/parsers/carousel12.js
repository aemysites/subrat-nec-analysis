/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel wrapper
  const carousel = element.querySelector('.str-mainvisual-carousel-01');
  if (!carousel) return;

  // Find the track containing slides
  const track = carousel.querySelector('.slick-track');
  if (!track) return;

  // Get all direct slide children
  const slides = Array.from(track.children).filter(c => c.classList.contains('slide'));

  // Carousel header
  const headerRow = ['Carousel (carousel12)'];
  const tableRows = [headerRow];

  slides.forEach(slide => {
    // Get the main image (prefer pc-show)
    let image = null;
    const imgWrap = slide.querySelector('.slide-image');
    if (imgWrap) {
      image = imgWrap.querySelector('img.pc-show') || imgWrap.querySelector('img');
    }

    // Build slide text content cell
    const textItems = [];
    const inner = slide.querySelector('.slide-content .inner');
    if (inner) {
      // Heading (should be <h2> with .hdg)
      const hdg = inner.querySelector('h2, .hdg, h1, h3, h4, h5, h6');
      if (hdg) textItems.push(hdg);
      // Description (usually p)
      const p = inner.querySelector('p');
      if (p) textItems.push(p);
      // CTA (the anchor inside .btnArea)
      const cta = inner.querySelector('.btnArea a[href]');
      if (cta) textItems.push(cta);
    }
    // Avoid empty array, put '' if no content
    const textCell = textItems.length ? textItems : '';
    // Push the row [image, text cell]
    tableRows.push([image, textCell]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
