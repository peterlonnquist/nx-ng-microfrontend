// Must match DEV_USER_COOKIE in tools/dev-proxy/dev-users.mjs, which reads it on every proxied call.
export const DEV_USER_COOKIE = 'dev-user';
export const DEFAULT_REDIRECT = 'http://localhost:4200/';

export interface DevUser {
  name: string;
  /** `customInfo` split into its `key=value` parts, e.g. `{ userId: 'anna', roles: 'admin' }`. */
  info: Record<string, string>;
}

/** The shape of tools/dev-proxy/dev-users.json, served as an asset so edits apply without a rebuild. */
export interface DevUsersFile {
  users: Record<string, { token: string; customInfo: string }>;
}

export const DEV_USERS_URL = 'dev-users.json';

export function toDevUsers(file: DevUsersFile): DevUser[] {
  return Object.entries(file.users).map(([name, user]) => ({ name, info: parseCustomInfo(user.customInfo) }));
}

export function parseCustomInfo(customInfo: string): Record<string, string> {
  return Object.fromEntries(
    customInfo
      .split(';')
      .filter(Boolean)
      .map((part) => {
        const [key, ...value] = part.split('=');
        return [key.trim(), value.join('=').trim()];
      }),
  );
}

export function readDevUserCookie(cookie: string): string | undefined {
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${DEV_USER_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

// Cookies ignore the port, so a cookie set here on localhost:4299 reaches every localhost dev server.
export function devUserCookie(name: string | undefined): string {
  return name === undefined
    ? `${DEV_USER_COOKIE}=; path=/; max-age=0; samesite=lax`
    : `${DEV_USER_COOKIE}=${encodeURIComponent(name)}; path=/; samesite=lax`;
}

/** `?to=` if it points at a local dev server, else the shell. */
export function redirectTarget(search: string): string {
  const to = new URLSearchParams(search).get('to');
  return to && /^http:\/\/localhost:\d+\//.test(to) ? to : DEFAULT_REDIRECT;
}
