import { Route } from '@angular/router';
import { App } from './app';

/** Exposed as `mfe-insights/./routes` – the shell mounts this under `/insights`. */
export const routes: Route[] = [
  {
    path: '',
    component: App,
    children: [{ path: '', loadComponent: () => import('./insights-page').then((m) => m.InsightsPage) }],
  },
];
