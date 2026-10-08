import { Route } from '@angular/router';
import { App } from './app';

/** Exposed as `mfe-products/./routes` – the shell mounts this under `/products`. */
export const routes: Route[] = [
  {
    path: '',
    component: App,
    children: [
      { path: '', loadComponent: () => import('./product-list').then((m) => m.ProductList) },
      { path: ':id', loadComponent: () => import('./product-detail').then((m) => m.ProductDetail) },
    ],
  },
];
