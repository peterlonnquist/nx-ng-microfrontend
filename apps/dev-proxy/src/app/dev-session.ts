import devUsersFile from '../../dev-users.json';

export { devUserCookie, readDevUserCookie } from '../../proxy/dev-user-cookie.mjs';

export const DEFAULT_REDIRECT = 'http://localhost:4200/';

export interface DevUser {
  name: string;
  /** `customInfo` split into its `key=value` parts, e.g. `{ userId: 'anna', roles: 'admin' }`. */
  info: Record<string, string>;
}

// Editing dev-users.json rebuilds and reloads this page; the proxy reads the file on every call.
export const users: DevUser[] = Object.entries(devUsersFile.users).map(([name, user]) => ({
  name,
  info: parseCustomInfo(user.customInfo),
}));

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

/** `?to=` if it points at a local dev server, else the shell. */
export function redirectTarget(search: string): string {
  const to = new URLSearchParams(search).get('to');
  return to && /^http:\/\/localhost:\d+\//.test(to) ? to : DEFAULT_REDIRECT;
}
