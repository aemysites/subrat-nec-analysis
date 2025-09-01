/* global WebImporter */
export default function parse(element, { document }) {
  // Block header, from the example
  const headerRow = ['Carousel (carousel9)'];

  // Find the ticker carousel root
  const tickerCarousel = element.querySelector('.mod-ticker-01');
  if (!tickerCarousel) return;

  // Find the slick-list, then slick-track, then all .slide elements (not .slick-cloned)
  const slickList = tickerCarousel.querySelector('.slick-list');
  if (!slickList) return;
  const slickTrack = slickList.querySelector('.slick-track');
  if (!slickTrack) return;

  // Only select direct children, no cloned slides
  const slides = Array.from(slickTrack.children).filter(slide =>
    slide.classList.contains('slide') && !slide.classList.contains('slick-cloned')
  );

  // Each slide: extract date and headline
  const rows = slides.map(slide => {
    // Find .slide-content > .inner
    const inner = slide.querySelector('.slide-content > .inner');
    if (!inner) return ['']; // empty cell if no content
    const dl = inner.querySelector('dl');
    if (!dl) return [''];
    // Extract date
    const dtInner = dl.querySelector('dt.date .inner');
    const dateStr = dtInner ? dtInner.textContent.trim() : '';
    // Extract headline link (original element)
    const descInner = dl.querySelector('dd.desc .inner');
    const linkElem = descInner ? descInner.querySelector('a') : null;
    // Compose the text cell (preserve semantic: date, then link)
    const textCell = document.createElement('div');
    if (dateStr) {
      const dateStrong = document.createElement('strong');
      dateStrong.textContent = dateStr;
      textCell.appendChild(dateStrong);
    }
    if (dateStr && linkElem) {
      textCell.appendChild(document.createElement('br'));
    }
    if (linkElem) {
      textCell.appendChild(linkElem);
    }
    return [textCell];
  });

  // Combine header and rows
  const cells = [headerRow, ...rows];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
