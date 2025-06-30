import Cookies from 'js-cookie';

const COOKIE_KEY = 'user_login';

export function SaveUserToCookie(login: string) {
  Cookies.set(COOKIE_KEY, JSON.stringify(login), { expires: 7 });
}

export function GetUserFromCookie(): string | null {
  const raw = Cookies.get(COOKIE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as string;
  } catch {
    return null;
  }
}

export function RemoveUserFromCookie() {
  Cookies.remove(COOKIE_KEY);
}
