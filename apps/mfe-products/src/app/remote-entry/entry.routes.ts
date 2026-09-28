import { Route } from '@angular/router';
import { RemoteEntry } from './entry';

/** Exposed as `mfe-products/./routes` – the shell mounts this under `/products`. */
export const routes: Route[] = [
  {
    path: '',
    component: RemoteEntry,
    children: [
      { path: '', loadComponent: () => import('../product-list').then((m) => m.ProductList) },
      { path: ':id', loadComponent: () => import('../product-detail').then((m) => m.ProductDetail) },
    ],
  },
];
