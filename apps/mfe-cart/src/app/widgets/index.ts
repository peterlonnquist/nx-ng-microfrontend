import { WidgetDefinition } from '@mfe/shared/ui';
import { MFE_INFO } from '../mfe-info';

/** Exposed as `mfe-cart/./widgets`. Ids are persisted in layouts – never rename them. */
export const info = MFE_INFO;
export const origin = new URL(import.meta.url).origin;
export const widgets: WidgetDefinition[] = [
  {
    id: 'cart.summary',
    title: 'Varukorg',
    description: 'Antal artiklar och summa, med genväg till kassan.',
    icon: 'shopping_cart',
    defaultSize: { cols: 1, rows: 1 },
    load: () => import('./cart-summary.widget').then((m) => m.CartSummaryWidget),
  },
];
