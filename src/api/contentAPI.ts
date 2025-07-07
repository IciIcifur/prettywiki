import PickTimeLineIcon from '../utils/timelineIcon.ts';

import type {
  ArticleSummary,
  EventItem,
  MaterialsOfTheDay,
  Picture,
  SearchItem,
} from '../types/types.ts';
import {
  GetFeatured,
  GetMainPageContents,
  GetOnThisDay,
  SearchRequest,
} from './api.ts';

export async function GetHistoryForThisDay(
  locale: string
): Promise<EventItem[] | null> {
  const result = await GetOnThisDay(locale);
  if (result) {
    function filterEvents(length: number, index: number): boolean {
      return index === length - 1
        ? true
        : length > 70
          ? !(index % 4)
          : length > 30
            ? !(index % 2)
            : true;
    }

    const { events } = result;
    const eventsLength = events.length;

    return events
      .reverse()
      .filter((_, index) => filterEvents(eventsLength, index))
      .map((event) => {
        const title = !!event.pages.length
          ? event.pages[0].titles.normalized
          : event.year.toString();
        const description = event.text[0].toUpperCase() + event.text.slice(1);
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

export async function GetMaterialsOfTheDay(
  locale: string
): Promise<MaterialsOfTheDay | null> {
  const result = await GetFeatured(locale);
  if (result) {
    function trimTitle(title: string) {
      return title?.replace('File:', '').split('.').slice(0, -1).join('.');
    }

    const { tfa, image } = result;

    const featuredPicture: Picture = {
      src: image.image.source,
      title: trimTitle(image.title),
      description: image.description.text,
      author: image.artist.text,
      location:
        image.structured.captions[locale] || image.structured.captions['en'],
    };

    const featuredArticle: ArticleSummary | null = tfa
      ? {
          title: tfa.titles.normalized,
          description: tfa.description,
          image: tfa.originalimage?.source || '',
          summary: tfa.extract,
        }
      : null;

    const goodArticle = null;
    const facts = null;

    console.log(await GetMainPageContents(locale));

    return { featuredPicture, featuredArticle, goodArticle, facts };
  }
  return null;
}

export async function SearchForPage(
  searchValue: string,
  locale: string
): Promise<SearchItem[] | null> {
  const result = await SearchRequest(locale, searchValue);

  if (result)
    return result.map((item) => {
      return {
        title: item.title,
        firstLine: item.snippet,
        lastUpdated: item.timestamp,
      };
    });

  return null;
}
