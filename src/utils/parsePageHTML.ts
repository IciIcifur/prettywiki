import type {
  ArticleContentItem,
  InfoBoxItem,
  ListItem,
  TableItem,
} from '../types/types.ts';

const generateId = () => crypto.randomUUID?.();

function removeStyles(el: Element) {
  const clone = el.cloneNode(true) as Element;
  clone.querySelectorAll('style').forEach((s) => s.remove());
  return clone.innerHTML.trim();
}

// parser.ts

function parseElement(el: Element): ArticleContentItem | null {
  const tagName = el.tagName.toLowerCase();

  if (
    el.classList.contains('mw-empty-elt') ||
    tagName === 'meta' ||
    tagName === 'style'
  ) {
    return null;
  }

  // Инфобокс — до общего table-чека
  if (el.classList.contains('infobox')) {
    return parseInfoBox(el);
  }

  if (tagName === 'table') {
    return parseTable(el);
  }

  if (/^h[1-6]$/.test(tagName)) {
    const headlineEl = el.querySelector('.mw-headline');
    const text = (headlineEl?.innerHTML || el.innerHTML || '').trim();
    return text
      ? {
          id: generateId(),
          type: 'heading',
          level: parseInt(tagName[1], 10),
          text,
        }
      : null;
  }

  if (tagName === 'ul' || tagName === 'ol') {
    return parseListElement(el);
  }

  if (
    tagName === 'figure' ||
    (tagName !== 'table' && el.querySelector('img'))
  ) {
    const img = el.querySelector('img');
    if (img) {
      const src = img.getAttribute('src') || '';
      const figcaption = el.querySelector('figcaption');
      return {
        id: generateId(),
        type: 'picture',
        src: src.startsWith('//') ? `https:${src}` : src,
        ...(figcaption ? { caption: removeStyles(figcaption) } : {}),
      };
    }
  }

  // div может содержать таблицы/списки — рекурсируем
  if (tagName === 'div') {
    const complexChildren = Array.from(el.children).filter((child) => {
      const t = child.tagName.toLowerCase();
      return t === 'table' || t === 'ul' || t === 'ol' || t === 'figure';
    });

    if (complexChildren.length > 0) {
      // Если внутри сложные блоки — парсим детей по одному
      // и возвращаем первый (или можно вернуть массив, если нужна группировка)
      for (const child of Array.from(el.children)) {
        const parsed = parseElement(child);
        if (parsed) return parsed; // упрощение: берём первый значимый блок
      }
      return null;
    }

    const htmlContent = removeStyles(el);
    return htmlContent
      ? { id: generateId(), type: 'text', text: htmlContent }
      : null;
  }

  if (tagName === 'p') {
    const htmlContent = removeStyles(el);
    return htmlContent
      ? { id: generateId(), type: 'text', text: htmlContent }
      : null;
  }

  return null;
}

function parseTable(el: Element): InfoBoxItem | TableItem {
  // Инфобоксы могут прийти сюда через tagName === 'table'
  if (el.classList.contains('infobox')) {
    return parseInfoBox(el);
  }

  const caption = el.querySelector('caption');
  const title = caption?.textContent?.trim();

  // Заголовки столбцов из первой строки с <th>
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

    items.push({
      title: removeStyles(liClone),
      children: nestedLists,
    });
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
      const cellItems: ArticleContentItem[] = [];

      // Если внутри ячейки сложная структура (есть списки, картинки или несколько параграфов)
      if (td.querySelector('ul, ol, figure, img, p')) {
        for (const child of Array.from(td.children)) {
          const parsedChild = parseElement(child);
          if (parsedChild) cellItems.push(parsedChild);
        }
      }

      // Если внутри ячейки просто текст/ссылки без блочных тегов, или если после парсинга тегов ничего не извлеклось
      if (cellItems.length === 0 && td.textContent?.trim()) {
        cellItems.push({
          id: generateId(),
          type: 'text',
          text: removeStyles(td),
        });
      }

      rows.push({
        label: th ? th.textContent?.trim() || null : null,
        value: cellItems, // Массив полноценных UI-компонентов!
      });
    }
  });

  return { id: generateId(), type: 'infobox', title: boxTitle, rows };
}

export default function parsePageHTML(html: string): ArticleContentItem[] {
  const domParser = new DOMParser();
  const document = domParser.parseFromString(html, 'text/html');
  const sections = document.getElementsByTagName('section');

  const uiBlocks: ArticleContentItem[] = [];
  for (const section of Array.from(sections)) {
    for (const el of Array.from(section.children)) {
      const parsed = parseElement(el);
      if (parsed) uiBlocks.push(parsed);
    }
  }

  console.log(uiBlocks);
  return uiBlocks;
}
