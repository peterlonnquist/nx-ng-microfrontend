import { sanitizeWidgetPlacements } from './dashboard-layout';

describe('sanitizeWidgetPlacements', () => {
  it('clamps sizes into the grid', () => {
    expect(sanitizeWidgetPlacements([{ instanceId: 'a', widgetId: 'cart.summary', cols: 9, rows: 0 }])).toEqual([
      { instanceId: 'a', widgetId: 'cart.summary', cols: 4, rows: 1 },
    ]);
  });

  it('rejects malformed input', () => {
    expect(() => sanitizeWidgetPlacements('nope')).toThrow();
    expect(() => sanitizeWidgetPlacements([{ instanceId: 'a' }])).toThrow(/widgetId/);
  });
});
