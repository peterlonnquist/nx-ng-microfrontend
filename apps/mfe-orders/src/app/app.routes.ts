import { Route } from '@angular/router';
import { App } from './app';

/** Exposed as `mfe-orders/./routes` – the shell mounts this under `/orders`. */
export const routes: Route[] = [
  {
    path: '',
    component: App,
    children: [{ path: '', loadComponent: () => import('./order-list').then((m) => m.OrderList) }],
  },
];
