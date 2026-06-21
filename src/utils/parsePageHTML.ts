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
  // 1. <figcaption> — стандарт для figure-обёрток (mw:File/Thumb)
  const figcaption = container.querySelector('figcaption');
  if (figcaption) return removeStyles(figcaption);

  // 2. Видимый .media-caption — встречается в infobox-вариантах без figure
  const mediaCaption = container.querySelector('.media-caption');
  if (mediaCaption?.textContent?.trim()) return removeStyles(mediaCaption);

  // 3. JSON в data-mw самого File-элемента — Parsoid хранит подпись здесь
  //    даже когда видимого текста рядом нет (например, mw:File/Frameless)
  const dataMw = fileEl.getAttribute('data-mw');
  if (dataMw) {
    try {
      const caption = JSON.parse(dataMw)?.caption;
      if (typeof caption === 'string' && caption.trim()) return caption.trim();
    } catch {
      /* битый JSON — игнорируем */
    }
  }

  return undefined;
}

/**
 * Достаёт картинку из контейнера, который УЖЕ доверенно определён как картинка
 * (тег figure/img, typeof на самом элементе, или явный класс типа infobox-image).
 * Поиск [typeof] внутри тут безопасен — неопределённости в типе контента нет,
 * её сняли на уровне вызывающего кода.
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

// ---- Матчеры: каждый знает только свой тип контента ----

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
    // Доверенный сигнал "это картинка": тег figure/img, либо typeof
    // объявлен прямо на этом элементе (не на потомке!)
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

  el.querySelectorAll('tr').forEach((tr) => {
    const th = tr.querySelector('th');
    const td = tr.querySelector('td');

    if (th && !td) {
      const text = th.textContent?.trim();
      if (!boxTitle && text) boxTitle = text;
      return;
    }

    if (td) {
      rows.push({
        label: th ? th.textContent?.trim() || null : null,
        value: parseInfoBoxCell(td),
      });
    }
  });

  return { id: generateId(), type: 'infobox', title: boxTitle, rows };
}

function parseInfoBoxCell(td: Element): ArticleContentItem[] {
  // Доверенный сигнал от шаблона: эта ячейка целиком — картинка с подписью.
  // Никаких догадок по содержимому не нужно.
  if (td.classList.contains('infobox-image')) {
    const picture = extractPicture(td);
    return picture ? [picture] : [];
  }

  const cellItems: ArticleContentItem[] = [];

  // Картинки тут НЕ ищем — если изображение оказалось в обычной ячейке
  // не в составе блочного контента, это инлайновая декорация, а не контент
  if (td.querySelector('ul, ol, p')) {
    for (const child of Array.from(td.children)) {
      const parsed = parseElement(child);
      if (parsed) cellItems.push(parsed);
    }
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
  const uiBlocks = parseChildren(document.body);
  return batchPageBlocks(uiBlocks);
}
