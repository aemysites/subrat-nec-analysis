/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match the example exactly
  const cells = [['Cards (cards18)']];

  // Each card is an <li> inside the main <ul>
  const items = element.querySelectorAll('ul.list > li');
  items.forEach(li => {
    // The anchor wrapping the card
    const a = li.querySelector('a');
    if (!a) return;
    const detail = a.querySelector('.detail');
    if (!detail) return;

    // Extract title (in <b class="title">), description (after <br>), and tag (from .tagList ul.list li)
    const titleEl = detail.querySelector('b.title');
    const title = titleEl ? titleEl.textContent.trim() : '';

    // Find the <br> that separates title from description
    let description = '';
    const br = detail.querySelector('br');
    if (br) {
      let descFragments = [];
      let node = br.nextSibling;
      while (node) {
        if (node.nodeType === Node.TEXT_NODE) {
          descFragments.push(node.textContent.trim());
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
          descFragments.push(node.textContent.trim());
        }
        node = node.nextSibling;
      }
      description = descFragments.join(' ').trim();
    }

    // Extract tag/category
    let tag = '';
    const tagEl = detail.querySelector('.tagList ul.list li');
    if (tagEl) tag = tagEl.textContent.trim();

    // Compose the text cell preserving semantic meaning
    const textCell = [];
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title;
      textCell.push(strong);
    }
    if (description) {
      textCell.push(document.createElement('br'));
      const descDiv = document.createElement('span');
      descDiv.textContent = description;
      textCell.push(descDiv);
    }
    if (tag) {
      textCell.push(document.createElement('br'));
      const tagSpan = document.createElement('span');
      tagSpan.textContent = tag;
      tagSpan.className = 'card-tag';
      textCell.push(tagSpan);
    }
    // Add CTA (Read more link)
    textCell.push(document.createElement('br'));
    const link = document.createElement('a');
    link.href = a.href;
    link.textContent = 'Read more';
    textCell.push(link);

    // There is no image/icon in the source HTML, so first cell is empty string
    cells.push(['', textCell]);
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
