import { Route } from '@angular/router';
import { RemoteEntry } from './entry';

/** Exposed as `mfe-orders/./routes` – the shell mounts this under `/orders`. */
export const routes: Route[] = [
  {
    path: '',
    component: RemoteEntry,
    children: [{ path: '', loadComponent: () => import('../order-list').then((m) => m.OrderList) }],
  },
];
