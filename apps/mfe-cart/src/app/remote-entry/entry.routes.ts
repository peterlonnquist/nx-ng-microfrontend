import { Route } from '@angular/router';
import { RemoteEntry } from './entry';

/** Exposed as `mfe-cart/./routes` – the shell mounts this under `/cart`. */
export const routes: Route[] = [
  {
    path: '',
    component: RemoteEntry,
    children: [{ path: '', loadComponent: () => import('../cart-page').then((m) => m.CartPage) }],
  },
];
