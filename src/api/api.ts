import axios from 'axios';
import type {
  Featured,
  MainPageRawContents,
  OnThisDay,
  PageMediaItem,
  PageSummary,
  ProcessedQueryResult,
  QueryResult,
  QueryResultPageFieldsKey,
  SearchResultItem,
} from '../types/apiTypes.ts';
import {
  getRequiredTitles,
  MAIN_API,
  processImageMetadataQueryResult,
  processQueryResult,
  REST_API,
  twoDigits,
} from './utils.ts';

/** Query request to Wikipedia PHP API
 * @returns array of data for specified titles **/
export async function QueryRequest(
  locale: string,
  titles: string[],
  prop: Exclude<QueryResultPageFieldsKey, 'revisions'>[] = []
): Promise<Map<string, ProcessedQueryResult> | null> {
  try {
    const keys: QueryResultPageFieldsKey[] = ['revisions', ...prop];

    const { data }: { data: QueryResult } = await axios.get(
      `${MAIN_API.replace('_', locale)}`,
      {
        params: {
          action: 'query',
          titles: titles.join('|'),
          prop: keys.join('|'),
          rvprop: 'content',
          format: 'json',
          origin: '*',
        },
      }
    );

    return processQueryResult(data, keys);
  } catch (e) {
    console.error(e);
    return null;
  }
}
/** Expand template request to Wikipedia PHP API
 * @returns array of data for specified titles **/
export async function ExpandTemplateRequest(
  locale: string,
  title: string
): Promise<string | null> {
  try {
    const { data } = await axios.get(`${MAIN_API.replace('_', locale)}`, {
      params: {
        action: 'expandtemplates',
        text: `{{${title}}}`,
        prop: 'wikitext',
        format: 'json',
        origin: '*',
      },
    });
    return data?.expandtemplates?.wikitext;
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

    return data.query['search'];
  } catch (e) {
    console.error(e);
    return null;
  }
}

/** Returns image data by filename ("File:*.jpg") */
export async function ImageMetadataQueryRequest(locale: string, title: string) {
  try {
    const { data }: { data: QueryResult } = await axios.get(
      `${MAIN_API.replace('_', locale)}`,
      {
        params: {
          action: 'query',
          titles: title,
          prop: 'imageinfo',
          iiprop: 'url|metadata|extmetadata',
          format: 'json',
          origin: '*',
        },
      }
    );

    const imageInfo = Object.values(data.query.pages)[0]['imageinfo'][0];

    return processImageMetadataQueryResult(imageInfo);
  } catch (e) {
    console.error(e);
    return null;
  }
}

// PHP API
export async function GetMainPageContents(
  locale: string
): Promise<MainPageRawContents> {
  const requiredTitles = getRequiredTitles(locale);
  const materials = await QueryRequest(locale, requiredTitles, ['images']);

  if (!materials) return { tfa: undefined, tga: undefined, tfi: undefined };

  if (locale === 'ru')
    return {
      tfa: materials.get(requiredTitles[0]) || undefined,
      tga: materials.get(requiredTitles[1]) || undefined,
      tfi: materials.get(requiredTitles[2]) || undefined,
    };

  return {
    tfa: materials.get(requiredTitles[0]) || undefined,
    tga: undefined,
    tfi: materials.get(requiredTitles[1]) || undefined,
  };
}

// REST API
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
export async function GetRandomPageSummary(
  locale: string
): Promise<PageSummary | null> {
  return await GetRequest(locale, `page/random/summary/`);
}

/** @returns page title, page image and page description **/
export async function GetPageSummary(
  locale: string,
  page: string
): Promise<PageSummary | null> {
  return await GetRequest(locale, `page/summary/${page}`);
}

/** @returns page html **/
export async function GetPageHTML(
  locale: string,
  page: string
): Promise<string | null> {
  return await GetRequest(locale, `page/html/${page}`);
}

/** @returns media files on the page **/
export async function GetPageMedia(
  locale: string,
  page: string
): Promise<{ items: PageMediaItem[] } | null> {
  return await GetRequest(locale, `page/media-list/${page}`);
}
