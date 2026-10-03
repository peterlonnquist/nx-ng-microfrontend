// Local dev only: the users in ../dev-users.json and the `dev-user` cookie set by the dev-proxy login page.
// The file is read on every call, so edits apply without a restart.
import { readFileSync } from 'node:fs';
import { readDevUserCookie } from './dev-user-cookie.mjs';

const USERS_FILE = new URL('../dev-users.json', import.meta.url);

export function readDevUsers() {
  return JSON.parse(readFileSync(USERS_FILE, 'utf8'));
}

/** The user picked on the login page, or undefined if none is picked or it is no longer in dev-users.json. */
export function devUserFor(cookieHeader) {
  const name = readDevUserCookie(cookieHeader);
  return name === undefined ? undefined : readDevUsers().users[name];
}
