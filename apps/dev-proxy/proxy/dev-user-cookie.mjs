// The `dev-user` cookie: set by the login page (browser), read and cleared by the dev proxy (Node).
// No Node or browser APIs here, so both sides import this one module.
// Cookies ignore the port, so a cookie set on localhost:4299 reaches every localhost dev server.

export const DEV_USER_COOKIE = 'dev-user';

/** The picked user's name from a `Cookie` header or `document.cookie`. */
export function readDevUserCookie(cookie = '') {
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${DEV_USER_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

/** A cookie string that picks `name`, or clears the cookie when `name` is undefined.
 *  Works both as a `Set-Cookie` header value and as `document.cookie = …`. */
export function devUserCookie(name) {
  return name === undefined
    ? `${DEV_USER_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`
    : `${DEV_USER_COOKIE}=${encodeURIComponent(name)}; Path=/; SameSite=Lax`;
}
