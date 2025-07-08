type KeysOfUnion<T> = T extends any ? keyof T : never;

// REST
interface ImageInfo {
  source: string;
  width: number;
  height: number;
}
interface URLsInfo {
  page: string;
  revisions: string;
  edit: string;
  talk: string;
}
interface MainInfo {
  type: string;
  title: string;
  displaytitle: string;
  namespace: {
    id: number;
    text: string;
  };
  wikibase_item: string;
  titles: {
    canonical: string;
    normalized: string;
    display: string;
  };
  pageid: number;
  thumbnail?: ImageInfo;
  originalimage?: ImageInfo;
  lang: string;
  dir: string;
  revision: string;
  tid: string;
  timestamp: string;
  description: string;
  description_source: string;
  content_urls: {
    desktop: URLsInfo;
    mobile: URLsInfo;
  };
  extract: string;
  extract_html: string;
  normalizedtitle: string;
}

export interface PageSummary {
  titles: {
    canonical: string;
    normalized: string;
    display: string;
  };
  pageid: number;
  extract: string;
  extract_html: string;
  thumbnail: {
    source: string;
    width: number;
    height: number;
  };
  originalimage: {
    source: string;
    width: number;
    height: number;
  };
  lang: string;
  dir: string;
  timestamp: Map<string, string>;
  description: string;
  coordinates: {
    lat: number;
    lon: number;
  };
}
export interface OnThisDay {
  events: { pages: MainInfo[]; text: string; year: number }[];
}

type FeaturedImage = {
  image: ImageInfo;
  file_page: string;
  artist: {
    html: string;
    text: string;
  };
  credit: {
    html: string;
    text: string;
  };
  license: {
    type: string;
    code: string;
    url: string;
  };
  description: {
    html: string; // html
    text: string;
    lang: string;
  };
  wb_entity_id: string;
  structured: {
    captions: Record<string, string>;
  };
} & Pick<MainInfo, 'title' | 'thumbnail'>;
interface FeaturedNews {
  links: MainInfo[];
  story: string; // html
}
interface FeaturedMostRead {
  date: string;
  articles: ({
    views: number;
    rank: number;
    view_history: { date: string; views: number }[];
  } & MainInfo)[];
}
interface FeaturedOnThisDay {
  text: string;
  pages: MainInfo[];
  year: number;
}

export interface Featured {
  tfa?: MainInfo;
  onthisday?: FeaturedOnThisDay[];
  mostread: FeaturedMostRead;
  image: FeaturedImage;
  news: FeaturedNews[];
}

// PHP
export interface SearchResultItem {
  ns: number;
  pageid: number;
  size: number;
  snippet: string; // html
  timestamp: string;
  title: string;
  wordcount: number;
}
export interface ImageInfoResultItem {
  descriptionshorturl: string;
  descriptionurl: string;
  extmetadata: Partial<ExtMetadataFields>;
  metadata: { name: keyof MetadataFields; value: string | number }[];
  url: string;
}
export type QueryResultPageFields =
  | { missing: '' }
  | {
      revisions: {
        contentformat: string;
        contentmodel: string;
        '*': string;
      }[];
      images: { ns: number; title: string }[];
      links: { ns: number; title: string }[];
      externallinks: { ns: number; title: string }[];
    };
export type QueryResultPageFieldsKey = KeysOfUnion<QueryResultPageFields>;

export type QueryResultPage = {
  pageid: number;
  ns: number;
  title: string;
} & Partial<QueryResultPageFields>;
export interface QueryResult {
  query: {
    pages: Map<number, QueryResultPage>;
  };
}

export type ProcessedQueryResult = Partial<{
  missing: '';
  revisions: string;
  images: string[];
  links: { ns: number; title: string }[];
  externallinks: { ns: number; title: string }[];
}>;

interface ExtMetadataField {
  source: string;
  value: string;
}
export interface ExtMetadataFields {
  ObjectName: ExtMetadataField;
  Label: ExtMetadataField;
  ImageDescription: ExtMetadataField;
  Artist: ExtMetadataField;
  DateTime: ExtMetadataField;
  DateTimeOriginal: ExtMetadataField;
  CountryDest: ExtMetadataField;
  ProvinceOrStateDest: ExtMetadataField;
  CityDest: ExtMetadataField;
}
export interface MetadataFields {
  // Name/Title
  ObjectName: string;
  ImageDescription: string;
  // Description/Keywords
  Keywords: string;
  // Author
  Artist: string;
  Make: string;
  // Date
  DateTimeOriginal: string; // Дата и время съёмки
  DateTimeDigitized: string; // Дата и время оцифровки (если отличается)
  // Dimensions
  ImageWidth: number;
  ImageLength: number;
  Orientation: number;
  //Other
  Rating: string; // Рейтинг изображения (если выставлен)
}
export interface ImageMetadata {
  title: string;
  description?: string;
  date?: string;
  author?: string;
  location?: string;
}

interface RawContent {
  revisions?: string;
  images?: string[];
}
export interface MainPageRawContents {
  tfa: RawContent;
  dyk: RawContent;
  tga?: RawContent;
  tfi: {
    url: string;
    metadata: ImageMetadata;
    description: string;
  };
}
