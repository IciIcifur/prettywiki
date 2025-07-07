import axios from 'axios';
import type {
  Featured,
  OnThisDay,
  PageSummary,
  SearchResultItem,
} from '../types/apiTypes.ts';

const MAIN_API = 'https://_.wikipedia.org/w/api.php';
const REST_API = 'https://_.wikipedia.org/api/rest_v1';
const IMAGE_URL_BASE = 'https://commons.wikimedia.org/wiki';

function twoDigits(n: number) {
  if (n.toString().length < 2) return `0${n}`;
  return n.toString();
}

export async function QueryRequest(
  locale: string,
  titles: string[],
  prop: ('links' | 'externallinks' | 'images')[] = []
) {
  try {
    const keys: string[] = ['revisions', ...prop];
    const {
      data: { query },
    } = await axios.get(`${MAIN_API.replace('_', locale)}`, {
      params: {
        action: 'query',
        titles: titles.join('|'),
        prop: keys.join('|'),
        rvprop: 'content',
        format: 'json',
        origin: '*',
      },
    });
    const pages: Record<string, any>[] = Object.values(query.pages);
    // todo: make result processing and typing
    return pages.map((page: Record<string, any>) => {
      const result: Record<string, any> = {};
      for (const key of keys) {
        if (key === 'revisions') result[key] = page[key][0];
        else if (key === 'images') {
          result[key] = page[key]
            ?.filter(
              (image: { ns: number; title: string }) =>
                !/File:\d+ green\.svg/.test(image.title)
            )
            .map((image: { ns: number; title: string }) => {
              return {
                ns: image.ns,
                title: `${IMAGE_URL_BASE}/${image.title}`,
              };
            });
        } else result[key] = page[key];
      }
      return result;
    });
  } catch (e) {
    console.error(e);
    return null;
  }
}
/** Request to Wikipedia REST API **/
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

/** Search request to Wikipedia PHP API **/
export async function SearchRequest(
  locale: string,
  query: string
): Promise<SearchResultItem[] | null> {
  try {
    const { data } = await axios.get(MAIN_API.replace('_', locale), {
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

/** @returns raw list of events **/
export async function GetOnThisDay(
  locale: string,
  eventType: 'events' | 'births' | 'deaths' | 'holidays' = 'events'
): Promise<OnThisDay | null> {
  const date = new Date();
  return await GetRequest(
    locale,
    `feed/onthisday/${eventType}/${date.getMonth() + 1}/${date.getDate()}`
  );
}
/** @returns - small extract from TFA
 * - tiny description of the TID
 * - recent news
 * - most read articles list**/
export async function GetFeatured(locale: string): Promise<Featured | null> {
  const date = new Date();
  return await GetRequest(
    locale,
    `feed/featured/${date.getFullYear()}/${twoDigits(date.getMonth() + 1)}/${twoDigits(date.getDate())}`
  );
}
/** @returns page title, page image and page description **/
export async function GetPageSummary(
  locale: string,
  page: string
): Promise<PageSummary | null> {
  return await GetRequest(locale, `page/summary/${page}`);
}

export async function GetMainPage(locale: string) {
  // Шаблон:Текущая избранная статья
  // Шаблон:Текущая хорошая статья
  // Шаблон:Знаете ли вы
  // Шаблон:Potd/${year}-${moth2}-${day1} (ru)
  // https://commons.wikimedia.org/wiki/File:${результат запроса по шаблону Шаблон:Potd/2025-07-7}

  // Wikipedia:Today's featured_article/${month} ${day}, ${year}
  // Template:POTD_protected/${year}-${month}-${day}
  // Template:DYK

  console.log(locale);
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const localeMonth = date.toLocaleDateString('en', { month: 'long' });

  const ruTitles = [
    'Шаблон:Текущая избранная статья',
    'Шаблон:Текущая хорошая статья',
    'Шаблон:Знаете ли вы',
    `Шаблон:Potd/${year}-${twoDigits(month)}-${day} (ru)`,
    `Шаблон:Potd/${year}-${twoDigits(month)}-${day}`,
  ];
  const enTitles = [
    `Wikipedia:Today's featured_article/${localeMonth} ${day}, ${year}`,
    `Template:POTD protected/${year}-${twoDigits(month)}-${twoDigits(day)}`,
    'Template:Did you know',
  ];

  const ru = await QueryRequest('ru', ruTitles, ['images']);
  const en = await QueryRequest('en', enTitles, ['images']);

  console.log(ru);
  console.log(en);
}
