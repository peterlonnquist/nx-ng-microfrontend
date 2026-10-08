import { Route } from '@angular/router';
import { ordersRoutes } from '@mfe/orders/feature';
import { App } from './app';

/** Exposed as `mfe-ordering/./orders` – the shell mounts this under `/orders`. */
export const routes: Route[] = [{ path: '', component: App, children: ordersRoutes }];
