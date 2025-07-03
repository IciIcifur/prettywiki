import axios from 'axios';

const API_URI = 'https://_.wikipedia.org/w/api.php';
const ORIGIN = '*';

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
