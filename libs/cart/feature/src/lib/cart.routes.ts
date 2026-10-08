import { Route } from '@angular/router';

/** The cart domain's pages. The remote that hosts the domain mounts them under its App. */
export const cartRoutes: Route[] = [{ path: '', loadComponent: () => import('./cart-page').then((m) => m.CartPage) }];
