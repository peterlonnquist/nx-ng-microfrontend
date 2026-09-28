import { formatPrice } from './format';

describe('formatPrice', () => {
  it('formats SEK', () => {
    expect(formatPrice(1299)).toMatch(/1\s?299,00\s?kr/);
  });
});
