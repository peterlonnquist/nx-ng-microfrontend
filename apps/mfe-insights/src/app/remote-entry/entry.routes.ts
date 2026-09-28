import { Route } from '@angular/router';
import { RemoteEntry } from './entry';

/** Exposed as `mfe-insights/./routes` – the shell mounts this under `/insights`. */
export const routes: Route[] = [
  {
    path: '',
    component: RemoteEntry,
    children: [{ path: '', loadComponent: () => import('../insights-page').then((m) => m.InsightsPage) }],
  },
];
