import axios from 'axios';

const API_URI = 'https://_.wikipedia.org/w/api.php';

const ORIGIN = '*';

export async function GetForThisDay(locale: string) {
  const today = new Date();
  const THIS_DAY_API_URI = `https://${locale}.wikipedia.org/api/rest_v1/feed/onthisday/events/${today.getMonth() + 1}/${today.getDate()}`;

  try {
    const result = await axios.get(THIS_DAY_API_URI);
    const data: any[] = result.data.events;

    return data.reverse().map((value) => {
      const title = !!value.pages.length
        ? value.pages[value.pages.length > 1 ? 1 : 0].title
        : value.year;
      return {
        title: title.replace('_', ' '),
        description: value.text,
        date: value.year,
        icon: 'i-lucide-rocket',
      };
    });
  } catch {
    return null;
  }
}

export async function SearchForPage(
  searchValue: string,
  locale: string
): Promise<any[] | null> {
  try {
    const result = await axios.get(API_URI.replace('_', locale), {
      params: {
        action: 'query',
        list: 'search',
        srsearch: searchValue,
        format: 'json',
        origin: ORIGIN,
      },
    });
    const data: any[] = result.data.query.search;

    return data.map((value) => {
      return {
        title: value.title,
        firstLine: value.snippet,
        lastUpdated: value.timestamp,
      };
    });
  } catch {
    return null;
  }
}
