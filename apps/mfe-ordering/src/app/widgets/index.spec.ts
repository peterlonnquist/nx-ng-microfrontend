import { widgets } from './index';

describe('mfe-ordering widgets', () => {
  // Saved dashboard layouts reference these ids. They came from mfe-cart and mfe-orders and must survive the merge.
  it('keeps the persisted widget ids of both domains', () => {
    expect(widgets.map((w) => w.id)).toEqual(['cart.summary', 'orders.recent']);
  });

  it('loads every widget component', async () => {
    for (const widget of widgets) expect(await widget.load()).toBeTypeOf('function');
  });
});
