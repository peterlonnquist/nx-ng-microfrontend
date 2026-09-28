import { WidgetDefinition } from '@mfe/shared/ui';
import { MFE_INFO } from '../mfe-info';

/** Exposed as `mfe-products/./widgets`. Ids are persisted in layouts – never rename them. */
export const info = MFE_INFO;
export const origin = new URL(import.meta.url).origin;
export const widgets: WidgetDefinition[] = [
  {
    id: 'products.top-rated',
    title: 'Topprankade produkter',
    description: 'De tre högst betygsatta produkterna med snabbköp.',
    icon: 'star',
    defaultSize: { cols: 2, rows: 1 },
    load: () => import('./top-rated.widget').then((m) => m.TopRatedWidget),
  },
];
