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
interface HeadingItem extends BaseItem {
  type: 'heading';
  level: number;
  text: string;
}
interface ListItem extends BaseItem {
  type: 'list';
  listType: 'ordered' | 'bullet';
  children: {
    title: string;
    children: ListItem;
  }[];
}
interface PictureItem extends BaseItem {
  type: 'picture';
  src: string;
  caption?: string;
}
interface TextItem extends BaseItem {
  type: 'text';
  text: string;
}

export type ArticleContentItem =
  | HeadingItem
  | ListItem
  | PictureItem
  | TextItem;
