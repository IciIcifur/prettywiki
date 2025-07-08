import type {
  ImageInfoResultItem,
  ImageMetadata,
  ProcessedQueryResult,
  QueryResult,
  QueryResultPageFieldsKey,
} from '../types/apiTypes.ts';

// Main APIs
export const MAIN_API = 'https://_.wikipedia.org/w/api.php';
export const REST_API = 'https://_.wikipedia.org/api/rest_v1';
export const IMAGE_BASE_URL = 'https://commons.wikimedia.org/wiki';

/** Actual Wiki Templates to parse **/
export const pagesMap = {
  ru: {
    tfa: 'Шаблон:Текущая избранная статья',
    tga: 'Шаблон:Текущая хорошая статья',
    dyk: 'Шаблон:Знаете ли вы',
    tfi: {
      file: 'Шаблон:Potd/{year}-{month2}-{day}',
      description: 'Шаблон:Potd/{year}-{month2}-{day} (ru)',
    },
  },
  en: {
    tfa: "Wikipedia:Today's featured article/{monthLong} {day}, {year}",
    dyk: 'Template:Did you know',
    tfi: 'Template:POTD protected/{year}-{month2}-{day2}',
  },
};

/** Filter to remove service images **/
const imagesFilter = /File:\d+ green\.svg/;

/** @returns 2-digit string **/
export function twoDigits(n: number) {
  if (n.toString().length < 2) return `0${n}`;
  return n.toString();
}

/** @returns main page titles to require for locale **/
export function getRequiredTitles(locale: string) {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const monthLong = date.toLocaleDateString(locale, { month: 'long' });
  const month2 = twoDigits(month);
  const day2 = twoDigits(day);

  const key = locale as keyof typeof pagesMap;
  let titles = [pagesMap[key].tfa, pagesMap[key].dyk];
  if (key === 'ru')
    titles = [
      ...titles,
      pagesMap[key].tga,
      pagesMap[key].tfi.file,
      pagesMap[key].tfi.description,
    ];
  else titles = [...titles, pagesMap[key].tfi];

  return titles.map((title) =>
    title
      .replace('{year}', year.toString())
      .replace('{month}', month.toString())
      .replace('{month2}', month2.toString())
      .replace('{monthLong}', monthLong.toString())
      .replace('{day}', day.toString())
      .replace('{day2}', day2.toString())
  );
}

/** Processes query results according to given
 * @returns array of data items of given keys **/
export function processQueryResult(
  data: QueryResult,
  keys: QueryResultPageFieldsKey[]
) {
  const pages = Object.values(data.query.pages);

  const fullResult: Map<string, ProcessedQueryResult> = new Map();
  pages.forEach((page) => {
    const result: ProcessedQueryResult = {};

    for (const key of keys) {
      if (page[key] === undefined) {
        result[key] = page[key];
        continue;
      }

      switch (key) {
        case 'revisions':
          result[key] = page[key][0]['*'];
          break;
        case 'images':
          result[key] = page[key]
            ?.filter(
              (image: { ns: number; title: string }) =>
                !imagesFilter.test(image.title)
            )
            .map(
              (image: { ns: number; title: string }) => image.title
              // `${IMAGE_BASE_URL}/${image.title}`
            );
          break;
        default:
          result[key] = page[key];
      }
    }

    fullResult.set(page.title, result);
  });
  return fullResult;
}

export function processImageMetadataQueryResult(data: ImageInfoResultItem): {
  url: string;
  metadata: ImageMetadata;
} {
  console.log(data.url);
  console.log(data.extmetadata);
  console.log(data.metadata);

  return { url: data.url, metadata: { title: '' } };
}
