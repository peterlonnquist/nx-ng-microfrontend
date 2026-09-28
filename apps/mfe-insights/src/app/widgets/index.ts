import { WidgetDefinition } from '@mfe/shared/ui';
import { MFE_INFO } from '../mfe-info';

/** Exposed as `mfe-insights/./widgets`. Ids are persisted in layouts – never rename them. */
export const info = MFE_INFO;
export const origin = new URL(import.meta.url).origin;
export const widgets: WidgetDefinition[] = [
  {
    id: 'insights.revenue',
    title: 'Intäkter',
    description: 'Totala intäkter, antal ordrar och snittorder.',
    icon: 'payments',
    defaultSize: { cols: 2, rows: 1 },
    load: () => import('./revenue.widget').then((m) => m.RevenueWidget),
  },
  {
    id: 'insights.weekly-sales',
    title: 'Försäljning per veckodag',
    description: 'Stapeldiagram över veckans ordrar.',
    icon: 'bar_chart',
    defaultSize: { cols: 2, rows: 2 },
    load: () => import('./weekly-sales.widget').then((m) => m.WeeklySalesWidget),
  },
];
