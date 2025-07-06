import axios from 'axios';
import PickTimeLineIcon from '../utils/timelineIcon.ts';

import type {
  ArticleSummary,
  MaterialsOfTheDay,
  Picture,
  SearchResult,
} from '../types/types.ts';

import ParseImageMetadata from '../utils/parseImageMetadata.ts';
import ParseFacts from '../utils/parseFacts.ts';
import type { TimelineItem } from '@nuxt/ui/components/Timeline.vue';
import { GetOnThisDay } from './restAPI.ts';

const API_URI = 'https://_.wikipedia.org/w/api.php';
const IMAGE_API_URI = 'https://commons.wikimedia.org/w/api.php';
const ORIGIN = '*';
const standard_params = { format: 'json', origin: ORIGIN };

const MAIN_PAGE_DATA_MAP = {
  en: {
    featuredArticle: "Wikipedia:Today's featured article",
    facts: 'Wikipedia:Recent_additions',
  },
  ru: {
    featuredArticle: 'Шаблон:Текущая_избранная_статья',
    goodArticle: 'Шаблон:Текущая_хорошая_статья',
    facts: 'Шаблон:Знаете_ли_вы',
  },
};

export async function GetHistoryForThisDay(
  locale: string
): Promise<TimelineItem | null> {
  const result = await GetOnThisDay(locale);
  if (result) {
    const { events } = result;

    return events.reverse().map((event) => {
      const title = !!event.pages.length
        ? event.pages[0].titles.normalized
        : event.year.toString();
      const description = event.text;
      const date = event.year;
      const icon = PickTimeLineIcon(
        event.pages.map((page) => page.title),
        event.text
      );

      return { title, description, date, icon };
    });
  }
  return result;
}

export async function GetMaterialsOfTheDay(locale: string) {
  // console.log(parsedHTML.querySelector('#main-tfa')?.querySelector('section'));
  // console.log(parsedHTML.querySelector('#main-tga')?.querySelector('section'));
  // console.log(await GetPageHTML(locale, 'Заглавная_страница'));

  try {
    const featuredArticleTitle = await GetArticleTitle(
      locale,
      MAIN_PAGE_DATA_MAP[locale as keyof typeof MAIN_PAGE_DATA_MAP]
        .featuredArticle
    );
    const goodArticleTitle =
      locale === 'ru'
        ? await GetArticleTitle(locale, MAIN_PAGE_DATA_MAP[locale].goodArticle)
        : '';

    const materials: MaterialsOfTheDay = {
      featuredArticle: await GetArticleSummary(
        locale,
        featuredArticleTitle || ''
      ),
      goodArticle: await GetArticleSummary(locale, goodArticleTitle || ''),
      facts: await GetFactsOfTheDay(locale),
      featuredPicture: await GetImageOfTheDay(),
    };
    return materials;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function SearchForPage(searchValue: string, locale: string) {
  try {
    const result = await axios.get(API_URI.replace('_', locale), {
      params: {
        action: 'query',
        list: 'search',
        srsearch: searchValue,
        ...standard_params,
      },
    });
    const data: any[] = result.data.query.search;

    return data.map((value) => {
      return {
        title: value.title,
        firstLine: value.snippet,
        lastUpdated: value.timestamp,
      } as SearchResult;
    });
  } catch {
    return null;
  }
}

export async function GetFactsOfTheDay(locale: string) {
  try {
    const query =
      MAIN_PAGE_DATA_MAP[locale as keyof typeof MAIN_PAGE_DATA_MAP].facts;
    const result = await axios.get(API_URI.replace('_', locale), {
      params: {
        action: 'query',
        prop: 'revisions',
        titles: query,
        rvprop: 'content',
        ...standard_params,
      },
    });

    if (!result) return null;

    return ParseFacts(
      Object.values(result.data.query.pages as object)[0].revisions[0]?.['*'],
      locale
    );
  } catch {
    return null;
  }
}

export async function GetArticleTitle(
  locale: string,
  query: string
): Promise<string | null> {
  try {
    const result = await axios.get(API_URI.replace('_', locale), {
      params: {
        action: 'parse',
        page: query,
        prop: 'links',
        ...standard_params,
      },
    });

    if (!result) return null;
    const links = result.data.parse?.links;
    if (!links || links.length === 0) return null;

    const mainLink = links.find((link: any) => link.ns === 0);
    return (mainLink?.['*'] as string) ?? null;
  } catch {
    return null;
  }
}
export async function GetArticleSummary(locale: string, pageTitle: string) {
  try {
    const { data } = await axios.get(API_URI.replace('_', locale), {
      params: {
        action: 'query',
        prop: 'extracts|description|pageimages',
        titles: pageTitle,
        exintro: 1,
        explaintext: 1,
        piprop: 'original',
        ...standard_params,
      },
    });
    const pages = data?.query?.pages;
    if (!pages) return null;

    const page = Object.values(pages)[0] as any;

    return {
      title: page.title,
      description: page.description,
      summary: page.extract,
      image: page.original?.source,
    } as ArticleSummary;
  } catch {
    return null;
  }
}

export async function GetImageOfTheDay() {
  const date = new Date().toISOString().slice(0, 10);
  const uri = IMAGE_API_URI;
  const page = `Template:Potd/${date}`;
  try {
    const result = await axios.get(uri, {
      params: {
        action: 'parse',
        page,
        prop: 'images',
        ...standard_params,
      },
    });
    if (!result) return null;

    const image = result.data.parse;
    return await GetImageData(image.images[0]);
  } catch {
    return null;
  }
}
export async function GetImageData(imageTitle: string) {
  try {
    const result = await axios.get(IMAGE_API_URI, {
      params: {
        action: 'query',
        titles: `File:${imageTitle}`,
        prop: 'imageinfo',
        iiprop: 'url|metadata',
        ...standard_params,
      },
    });

    if (!result) return null;

    const { url, metadata } = Object.values(
      result.data.query.pages as object
    )[0].imageinfo[0];
    const { title } = Object.values(result.data.query.pages as object)[0];

    return {
      src: url,
      ...ParseImageMetadata(metadata, title),
    } as Picture;
  } catch {
    return null;
  }
}
