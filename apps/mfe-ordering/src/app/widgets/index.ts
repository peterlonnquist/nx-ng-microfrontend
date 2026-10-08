import { WidgetDefinition } from '@mfe/shared/ui';
import { MFE_INFO } from '../mfe-info';

/** Exposed as `mfe-ordering/./widgets`. Ids are persisted in layouts – never rename them, even when a widget moves to another remote. */
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
  {
    id: 'orders.recent',
    title: 'Senaste ordrar',
    description: 'De tre senaste ordrarna och deras status.',
    icon: 'receipt_long',
    defaultSize: { cols: 2, rows: 1 },
    load: () => import('./recent-orders.widget').then((m) => m.RecentOrdersWidget),
  },
];
