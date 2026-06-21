import type {
  AlertItem,
  ArticleContentItem,
  InfoBoxItem,
  ListItem,
  PictureItem,
  TableItem,
} from '../types/types.ts';
import batchPageBlocks from './batchPageBlocks.ts';

const AMBOX_REGEX = /\b(?:ambox|tmbox|cmbox|imbox|ombox|fmbox)\b/;
const FILE_TYPEOF_REGEX = /\bmw:File\b/;

const generateId = () => crypto.randomUUID?.();

function removeStyles(el: Element) {
  const clone = el.cloneNode(true) as Element;
  clone.querySelectorAll('style').forEach((s) => s.remove());
  return clone.innerHTML.trim();
}

function isFileElement(el: Element): boolean {
  return FILE_TYPEOF_REGEX.test(el.getAttribute('typeof') || '');
}

function shouldSkipElement(el: Element): boolean {
  const tagName = el.tagName.toLowerCase();
  return (
    el.classList.contains('mw-empty-elt') ||
    Array.from(el.classList).some((c) => c.startsWith('ts-')) ||
    tagName === 'meta' ||
    tagName === 'style'
  );
}

function extractCaption(
  fileEl: Element,
  container: Element
): string | undefined {
  const figcaption = container.querySelector('figcaption');
  if (figcaption) return removeStyles(figcaption);

  const mediaCaption = container.querySelector('.media-caption');
  if (mediaCaption?.textContent?.trim()) return removeStyles(mediaCaption);

  const dataMw = fileEl.getAttribute('data-mw');
  if (dataMw) {
    try {
      const caption = JSON.parse(dataMw)?.caption;
      if (typeof caption === 'string' && caption.trim()) return caption.trim();
    } catch {}
  }

  return undefined;
}

/**
 * Достаёт картинку из контейнера, который определён как картинка
 */
function extractPicture(container: Element): PictureItem | null {
  const tagName = container.tagName.toLowerCase();
  const img = tagName === 'img' ? container : container.querySelector('img');
  if (!img) return null;

  const fileEl = isFileElement(container)
    ? container
    : (Array.from(container.querySelectorAll('[typeof]')).find(isFileElement) ??
      container);

  const src = img.getAttribute('src') || '';
  const caption = extractCaption(fileEl, container);

  return {
    id: generateId(),
    type: 'picture',
    src: src.startsWith('//') ? `https:${src}` : src,
    ...(caption ? { caption } : {}),
  };
}

type Matcher = {
  test: (el: Element) => boolean;
  parse: (el: Element) => ArticleContentItem | null;
};

const matchers: Matcher[] = [
  { test: (el) => el.classList.contains('infobox'), parse: parseInfoBox },
  { test: (el) => AMBOX_REGEX.test(el.className), parse: parseAmbox },
  { test: (el) => el.tagName.toLowerCase() === 'table', parse: parseTable },
  {
    test: (el) => /^h[1-6]$/.test(el.tagName.toLowerCase()),
    parse: parseHeading,
  },
  {
    test: (el) => ['ul', 'ol'].includes(el.tagName.toLowerCase()),
    parse: parseListElement,
  },
  { test: (el) => el.tagName.toLowerCase() === 'p', parse: parseParagraph },
  {
    test: (el) =>
      ['figure', 'img'].includes(el.tagName.toLowerCase()) || isFileElement(el),
    parse: extractPicture,
  },
];

function parseElement(el: Element): ArticleContentItem | null {
  if (shouldSkipElement(el)) return null;
  return matchers.find((m) => m.test(el))?.parse(el) ?? null;
}

function parseChildren(el: Element): ArticleContentItem[] {
  const result: ArticleContentItem[] = [];
  for (const child of Array.from(el.children)) {
    const tag = child.tagName.toLowerCase();
    const isContainer = tag === 'div' || tag === 'section';

    if (
      isContainer &&
      !child.classList.contains('infobox') &&
      !AMBOX_REGEX.test(child.className)
    ) {
      result.push(...parseChildren(child));
    } else {
      const parsed = parseElement(child);
      if (parsed) result.push(parsed);
    }
  }
  return result;
}

function parseHeading(el: Element): ArticleContentItem | null {
  const tagName = el.tagName.toLowerCase();
  const headlineEl = el.querySelector('.mw-headline');
  const source = headlineEl ?? el;

  const clone = source.cloneNode(true) as Element;
  clone.querySelectorAll('[typeof="mw:FallbackId"]').forEach((s) => s.remove());

  const text = clone.innerHTML.trim();
  return text
    ? {
        id: generateId(),
        type: 'heading',
        level: parseInt(tagName[1], 10),
        text,
      }
    : null;
}

function parseParagraph(el: Element): ArticleContentItem | null {
  const htmlContent = removeStyles(el);
  return htmlContent
    ? { id: generateId(), type: 'text', text: htmlContent }
    : null;
}

function parseTable(el: Element): InfoBoxItem | TableItem {
  if (el.classList.contains('infobox')) return parseInfoBox(el);

  const caption = el.querySelector('caption');
  const title = caption?.textContent?.trim();

  const headerRow = el.querySelector('tr:has(th)');
  const columns: string[] = headerRow
    ? Array.from(headerRow.querySelectorAll('th')).map(
        (th) => th.textContent?.trim() || ''
      )
    : [];

  const dataRows = Array.from(el.querySelectorAll('tr')).filter(
    (tr) => tr.querySelector('td') !== null
  );

  const rows: Record<string, string>[] = dataRows.map((tr) => {
    const cells = Array.from(tr.querySelectorAll('th[scope="row"], td'));
    const row: Record<string, string> = {};
    cells.forEach((cell, i) => {
      const key = columns[i] || String(i);
      row[key] = cell.textContent?.trim() || '';
    });
    return row;
  });

  return { id: generateId(), type: 'table', title, columns, rows };
}

function parseListElement(el: Element): ListItem {
  const listType = el.tagName.toLowerCase() === 'ol' ? 'ordered' : 'bullet';
  const items: ListItem['children'] = [];

  for (const li of Array.from(el.children)) {
    if (li.tagName.toLowerCase() !== 'li') continue;

    const liClone = li.cloneNode(true) as Element;
    const nestedLists: ListItem[] = [];

    for (const child of Array.from(li.children)) {
      const tag = child.tagName.toLowerCase();
      if (tag === 'ul' || tag === 'ol') {
        nestedLists.push(parseListElement(child));
        const selector = child.id ? `#${child.id}` : child.tagName;
        liClone.querySelector(selector)?.remove();
      }
    }

    items.push({ title: removeStyles(liClone), children: nestedLists });
  }

  return { id: generateId(), type: 'list', listType, children: items };
}

function parseInfoBox(el: Element): InfoBoxItem {
  const rows: InfoBoxItem['rows'] = [];
  let boxTitle: string | undefined;

  function findTaxonomyContainer(el: Element): Element | null {
    return el.querySelector(':has(> .ts-Taxonomy-rang-row)');
  }

  function parseTaxonomyRows(container: Element): InfoBoxItem['rows'] {
    return Array.from(
      container.querySelectorAll(':scope > .ts-Taxonomy-rang-row')
    ).map((row) => {
      const labelEl = row.querySelector('.ts-Taxonomy-rang-label');
      const nameEl = row.querySelector('.ts-Taxonomy-rang-name');

      const label = labelEl?.textContent?.trim().replace(/:$/, '') || null;
      const value = nameEl?.textContent?.trim()
        ? [
            {
              id: generateId(),
              type: 'text' as const,
              text: removeStyles(nameEl),
            },
          ]
        : [];

      return { label, value };
    });
  }

  el.querySelectorAll('tr').forEach((tr) => {
    const ths = Array.from(tr.querySelectorAll('th'));
    const tds = Array.from(tr.querySelectorAll('td'));

    if (ths.length === 1 && tds.length === 0) {
      const thClone = ths[0].cloneNode(true) as HTMLElement;

      thClone.querySelectorAll('style, script').forEach((s) => s.remove());

      thClone
        .querySelectorAll('[class]')
        .forEach((el) => el.removeAttribute('class'));
      const boxTitleHtml = thClone.innerHTML.trim();

      if (!boxTitleHtml) return;

      if (!boxTitle) {
        boxTitle = boxTitleHtml;
        return;
      }

      rows.push({
        label: boxTitleHtml,
        value: [],
      });
      return;
    }

    if (ths.length === 1 && tds.length === 1) {
      const taxonomyContainer = findTaxonomyContainer(tds[0]);
      if (taxonomyContainer) {
        rows.push(...parseTaxonomyRows(taxonomyContainer));
        return;
      }
      rows.push({
        label: ths[0].textContent?.trim() || null,
        value: parseInfoBoxCell(tds[0]),
      });
      return;
    }

    if (ths.length === 0 && tds.length === 2) {
      rows.push({
        label: tds[0].textContent?.trim().replace(/:$/, '') || null,
        value: parseInfoBoxCell(tds[1]),
      });
      return;
    }

    if (ths.length === 0 && tds.length === 1) {
      const taxonomyContainer = findTaxonomyContainer(tds[0]);
      if (taxonomyContainer) {
        rows.push(...parseTaxonomyRows(taxonomyContainer));
        return;
      }
      rows.push({ label: null, value: parseInfoBoxCell(tds[0]) });
    }
  });

  return { id: generateId(), type: 'infobox', title: boxTitle, rows };
}

function parseInfoBoxCell(td: Element): ArticleContentItem[] {
  function isPictureOnlyCell(td: Element): boolean {
    const fileEl = isFileElement(td)
      ? td
      : Array.from(td.querySelectorAll('[typeof]')).find(isFileElement);

    const img = td.querySelector('img');
    if (!img) return false;
    if (!fileEl) return true;

    const figcaption = td.querySelector('figcaption');
    const mediaCaption = td.querySelector('.media-caption');

    const hasOtherContent = Array.from(td.querySelectorAll('a')).some((a) => {
      if (fileEl.contains(a)) return false;
      if (figcaption?.contains(a) || mediaCaption?.contains(a)) return false;
      return (a.textContent?.trim().length ?? 0) > 0;
    });

    return !hasOtherContent;
  }

  if (isPictureOnlyCell(td)) {
    const picture = extractPicture(td);
    return picture ? [picture] : [];
  }

  const cellItems: ArticleContentItem[] = [];
  if (td.querySelector('ul, ol, p')) {
    cellItems.push(...parseChildren(td));
  }

  if (cellItems.length === 0 && td.textContent?.trim()) {
    cellItems.push({ id: generateId(), type: 'text', text: removeStyles(td) });
  }

  return cellItems;
}

function parseAmbox(el: Element): AlertItem {
  const textRoot = el.querySelector('.mbox-text, .mbox-text-div') ?? el;
  const clone = textRoot.cloneNode(true) as Element;

  const boldEl = clone.querySelector('b');
  const title = boldEl?.textContent?.trim();
  boldEl?.remove();

  return {
    id: generateId(),
    type: 'alert',
    classes: el.className,
    title,
    text: removeStyles(clone),
  };
}

export default function parsePageHTML(html: string): ArticleContentItem[] {
  const domParser = new DOMParser();
  const document = domParser.parseFromString(html, 'text/html');

  document.querySelectorAll('style, script').forEach((el) => el.remove());

  const uiBlocks = parseChildren(document.body);
  return batchPageBlocks(uiBlocks);
}
