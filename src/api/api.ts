import axios from 'axios';
import type {
  Featured,
  OnThisDay,
  PageMetadata,
  PageSummary,
  SearchResultItem,
} from '../types/apiTypes.ts';

const SEARCH_API_URI = 'https://_.wikipedia.org/w/api.php';
const REST_API = 'https://_.wikipedia.org/api/rest_v1';

export async function GetRequest(locale: string, url: string, params?: any) {
  try {
    const { data } = await axios.get(
      `${REST_API.replace('_', locale)}/${url}`,
      {
        ...params,
      }
    );
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
}
export async function SearchRequest(
  locale: string,
  query: string
): Promise<SearchResultItem[] | null> {
  try {
    const { data } = await axios.get(SEARCH_API_URI.replace('_', locale), {
      params: {
        srsearch: query,
        action: 'query',
        list: 'search',
        format: 'json',
        origin: '*',
      },
    });

    return data.query.search;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function GetOnThisDay(locale: string): Promise<OnThisDay | null> {
  const date = new Date();
  return await GetRequest(
    locale,
    `feed/onthisday/events/${date.getMonth() + 1}/${date.getDate()}`
  );
}
export async function GetFeatured(locale: string): Promise<Featured | null> {
  const twoDigits = (n: number) => {
    if (n.toString().length < 2) return `0${n}`;
  };

  const date = new Date();
  return await GetRequest(
    locale,
    `feed/featured/${date.getFullYear()}/${twoDigits(date.getMonth() + 1)}/${twoDigits(date.getDate())}`
  );
}

export async function GetPageMetadata(
  locale: string,
  page: string
): Promise<PageMetadata | null> {
  return await GetRequest(locale, `page/title/${page}`);
}
export async function GetPageSummary(
  locale: string,
  page: string
): Promise<PageSummary | null> {
  return await GetRequest(locale, `page/summary/${page}`);
}

export async function GetPageHTML(
  locale: string,
  page: string,
  querySelectors: string[] = []
): Promise<HTMLElement | null> {
  const response = await GetRequest(locale, `page/html/${page}`);
  if (response) {
    const parsedHTML = new DOMParser().parseFromString(response, 'text/html');
    let resultHTML: HTMLElement | null = parsedHTML.body;
    for (const selector of querySelectors) {
      if (resultHTML) resultHTML = resultHTML.querySelector(selector);
    }
    return resultHTML;
  }
  return response;
}

export async function GetMainPage(locale: string) {
  // Шаблон:Текущая избранная статья
  // Шаблон:Текущая хорошая статья
  // Шаблон:Знаете ли вы
  // Шаблон:Potd/${year}-${moth2}-${day1} (ru)
  // https://commons.wikimedia.org/wiki/File:${результат запроса по шаблону  File:Шаблон:Potd/2025-07-7}

  // Wikipedia:Today's featured_article/${month} ${day}, ${year}
  // Template:POTD_protected/${year}-${month}-${day}
  // Template:DYK
  console.log(
    await axios.get(`${SEARCH_API_URI.replace('_', locale)}`, {
      params: {
        action: 'query',
        prop: 'revisions',
        titles: 'Template:POTD_protected/2025-07-07',
        rvprop: 'content',
        format: 'json',
        origin: '*',
      },
    })
  );
}
