import { resizePlacement, samePlacements } from './layout-editing';

const p = { instanceId: 'a', widgetId: 'cart.summary', cols: 2, rows: 1 };

describe('layout editing', () => {
  it('clamps resizing to the grid', () => {
    expect(resizePlacement(p, 5, 5)).toMatchObject({ cols: 4, rows: 2 });
    expect(resizePlacement(p, -5, -5)).toMatchObject({ cols: 1, rows: 1 });
  });

  it('detects changes', () => {
    expect(samePlacements([p], [{ ...p }])).toBe(true);
    expect(samePlacements([p], [resizePlacement(p, 1, 0)])).toBe(false);
  });
});
