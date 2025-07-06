import axios from 'axios';
import type {
  Featured,
  OnThisDay,
  PageMetadata,
  PageSummary,
} from '../types/typesAPI.ts';

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

export async function GetOnThisDay(
  locale: string
): Promise<OnThisDay[] | null> {
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
    for (let selector of querySelectors) {
      if (resultHTML) resultHTML = resultHTML.querySelector(selector);
    }
    return resultHTML;
  }
  return response;
}
