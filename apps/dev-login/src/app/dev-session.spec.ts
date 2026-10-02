import { devUserCookie, parseCustomInfo, readDevUserCookie, redirectTarget } from './dev-session';

describe('dev-session', () => {
  it('splits customInfo into key/value parts', () => {
    expect(parseCustomInfo('userId=kim;roles=customer')).toEqual({ userId: 'kim', roles: 'customer' });
  });

  it('round-trips the dev-user cookie', () => {
    const [pair] = devUserCookie('kim').split(';');
    expect(readDevUserCookie(`other=1; ${pair}`)).toBe('kim');
    expect(readDevUserCookie('other=1')).toBeUndefined();
  });

  it('expires the cookie on logout', () => {
    expect(devUserCookie(undefined)).toContain('max-age=0');
  });

  it('only redirects to a local dev server', () => {
    expect(redirectTarget('?to=http://localhost:4205/')).toBe('http://localhost:4205/');
    expect(redirectTarget('?to=https://evil.example/')).toBe('http://localhost:4200/');
    expect(redirectTarget('')).toBe('http://localhost:4200/');
  });
});
