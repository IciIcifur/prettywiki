import axios from 'axios';
import type {
  Featured,
  MainPageRawContents,
  OnThisDay,
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
): Promise<MainPageRawContents | null> {
  const requiredTitles = getRequiredTitles(locale);
  const materials = await QueryRequest(locale, requiredTitles, ['images']);

  if (!materials) return null;

  // TODO: work on image metadata
  // ru: parse file name from materials.get(requiredTitles[3]).revisions
  // ru: parse description from materials.get(requiredTitles[4]).revisions
  // en: parse file name and description from materials.get(requiredTitles[2]).revisions
  /*  if (locale === 'ru')
    console.log(
      'ru',
      materials.get(requiredTitles[3])?.revisions,
      materials.get(requiredTitles[4])?.revisions
    );
  else console.log('en', materials.get(requiredTitles[2])?.revisions);*/

  // await ImageMetadataQueryRequest(locale, materials[2].images[0] || '');
  // tfi типа raw content
  // ru: tfi.file(парсить название файла)
  // en: tfi.description[0]
  // tfi -> url, metadata, description

  const imageResult = await ImageMetadataQueryRequest(
    locale,
    "File:Tamarind fruits (Tamarindus indica 'Si Thong').jpg"
  );

  console.log(imageResult);

  const fallback = { images: undefined, revisions: undefined };
  if (locale === 'ru') {
    return {
      tfa: materials.get(requiredTitles[0]) || fallback,
      dyk: materials.get(requiredTitles[1]) || fallback,
      tga: materials.get(requiredTitles[2]),
      tfi: {
        url: imageResult?.url ?? '', // materials.get(requiredTitles[3]),
        metadata: imageResult?.metadata ?? { title: '' },
        description: '', // materials.get(requiredTitles[4]),
      },
    };
  }

  return {
    tfa: materials.get(requiredTitles[0]) || fallback,
    dyk: materials.get(requiredTitles[1]) || fallback,
    tfi: {
      url: imageResult?.url ?? '',
      metadata: imageResult?.metadata ?? { title: '' },
      description: '', //materials.get(requiredTitles[2])
    },
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
export async function GetPageSummary(
  locale: string,
  page: string
): Promise<PageSummary | null> {
  return await GetRequest(locale, `page/summary/${page}`);
}
