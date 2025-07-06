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

export interface MaterialsOfTheDay {
  featuredArticle: ArticleSummary | null;
  goodArticle: ArticleSummary | null;
  featuredPicture: Picture | null;
  facts: string[] | null;
}
