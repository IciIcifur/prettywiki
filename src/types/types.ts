export interface User {
  id: string;
  login: string;
  gender?: string;
  groups?: string[];
  registrationDate?: string;
}

export type AvailableLocales = 'ru' | 'en';
