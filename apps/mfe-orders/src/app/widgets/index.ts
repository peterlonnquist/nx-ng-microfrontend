import { WidgetDefinition } from '@mfe/shared/ui';
import { MFE_INFO } from '../mfe-info';

/** Exposed as `mfe-orders/./widgets`. Ids are persisted in layouts – never rename them. */
export const info = MFE_INFO;
export const origin = new URL(import.meta.url).origin;
export const widgets: WidgetDefinition[] = [
  {
    id: 'orders.recent',
    title: 'Senaste ordrar',
    description: 'De tre senaste ordrarna och deras status.',
    icon: 'receipt_long',
    defaultSize: { cols: 2, rows: 1 },
    load: () => import('./recent-orders.widget').then((m) => m.RecentOrdersWidget),
  },
];
