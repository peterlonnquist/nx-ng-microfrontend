// Local dev only: the users in dev-users.json and the `dev-user` cookie set by the dev-login app (apps/dev-login).
// The file is read on every call, so edits apply without a restart.
import { readFileSync } from 'node:fs';

export const DEV_USER_COOKIE = 'dev-user';

const USERS_FILE = new URL('./dev-users.json', import.meta.url);

export function readDevUsers() {
  return JSON.parse(readFileSync(USERS_FILE, 'utf8'));
}

export function devUserFromCookie(cookieHeader = '') {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${DEV_USER_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

/** The user picked in the dev-login app, or undefined if none is picked or it is no longer in dev-users.json. */
export function devUserFor(cookieHeader) {
  const name = devUserFromCookie(cookieHeader);
  return name === undefined ? undefined : readDevUsers().users[name];
}
