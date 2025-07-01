import Cookies from 'js-cookie';

const COOKIE_KEY = 'user_login';

export function SaveUserToCookie(login: string) {
  Cookies.set(COOKIE_KEY, login, { expires: 7 });
}

export function GetUserFromCookie(): string | null {
  const raw = Cookies.get(COOKIE_KEY);
  if (!raw) return null;
  return raw;
}

export function RemoveUserFromCookie() {
  Cookies.remove(COOKIE_KEY);
}
