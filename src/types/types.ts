export interface User {
  id: string;
  login: string;
  gender?: string;
  groups?: string[];
  registrationDate?: string;
}

export interface EventItem {
  title: string;
  description: string;
  date: number;
  icon: string;
}
export interface SearchItem {
  title: string;
  firstLine: string;
  lastUpdated: string;
}

export interface Picture {
  src: string;
  title: string;
  description?: string;
  date?: string;
  author?: string;
  location?: string;
}
export interface ArticleSummary {
  title: string;
  description: string;
  summary: string;
  image: string;
}

export interface Article {
  title: string;
  loadTimestamp: Date | undefined;
  contents: ArticleContentItem[];
}

interface BaseItem {
  id: string;
}
export interface HeadingItem extends BaseItem {
  type: 'heading';
  level: number;
  text: string;
}
export interface ListItem extends BaseItem {
  type: 'list';
  listType: 'ordered' | 'bullet';
  children: {
    title: string;
    children: ListItem[];
  }[];
}
export interface PictureItem extends BaseItem {
  type: 'picture';
  src: string;
  caption?: string;
}
export interface TextItem extends BaseItem {
  type: 'text';
  text: string;
}

export interface InfoBoxItem extends BaseItem {
  type: 'infobox';
  title?: string;
  rows: {
    label: string | null;
    value: ArticleContentItem[];
  }[];
}

export interface TableItem extends BaseItem {
  type: 'table';
  title?: string;
  columns: string[];
  rows: Record<string, any>[];
}

export interface AlertItem extends BaseItem {
  type: 'alert';
  classes: string;
  title?: string;
  text?: string;
}

export interface GalleryItem extends BaseItem {
  type: 'gallery';
  children: PictureItem[];
}

export type ArticleContentItem =
  | HeadingItem
  | ListItem
  | PictureItem
  | GalleryItem
  | TextItem
  | InfoBoxItem
  | TableItem
  | AlertItem;
