import Cookies from 'js-cookie';

const COOKIE_USER_KEY = 'user_login';
const COOKIE_LOCALE_KEY = 'user_locale';

export function SaveUserToCookie(login: string) {
  Cookies.set(COOKIE_USER_KEY, login, { expires: 7 });
}
export function SaveLocaleToCookie(locale: string) {
  Cookies.set(COOKIE_LOCALE_KEY, locale, { expires: 7 });
}

export function GetUserFromCookie(): string | null {
  const raw = Cookies.get(COOKIE_USER_KEY);
  if (!raw) return null;
  return raw;
}
export function GetLocaleFromCookie(): string | null {
  const raw = Cookies.get(COOKIE_LOCALE_KEY);
  if (!raw) return null;
  return raw;
}

export function RemoveUserFromCookie() {
  Cookies.remove(COOKIE_USER_KEY);
}
