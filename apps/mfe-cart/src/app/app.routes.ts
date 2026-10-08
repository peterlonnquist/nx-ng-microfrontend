import { Route } from '@angular/router';
import { App } from './app';

/** Exposed as `mfe-cart/./routes` – the shell mounts this under `/cart`. */
export const routes: Route[] = [
  {
    path: '',
    component: App,
    children: [{ path: '', loadComponent: () => import('./cart-page').then((m) => m.CartPage) }],
  },
];
