import axios from 'axios';
import type { PageMetadata } from '../types/typesAPI.ts';

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

export async function GetOnThisDay(locale: string): Promise<any[] | null> {
  const date = new Date();
  return await GetRequest(
    locale,
    `feed/onthisday/selected/${date.getMonth() + 1}/${date.getDate()}`
  );
}
export async function GetFeatured(locale: string): Promise<any | null> {
  const twoDigits = (n: number) => {
    if (n.toString().length < 2) return `0${n}`;
  };

  const date = new Date();
  const result = await GetRequest(
    locale,
    `feed/featured/${date.getFullYear()}/${twoDigits(date.getMonth() + 1)}/${twoDigits(date.getDate())}`
  );

  if (result && locale === 'en') return result;
  return result;
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
): Promise<PageMetadata | null> {
  return await GetRequest(locale, `page/summary/${page}`);
}
