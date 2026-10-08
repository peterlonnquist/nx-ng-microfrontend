import { Route } from '@angular/router';

/** The orders domain's pages. The remote that hosts the domain mounts them under its App. */
export const ordersRoutes: Route[] = [{ path: '', loadComponent: () => import('./order-list').then((m) => m.OrderList) }];
