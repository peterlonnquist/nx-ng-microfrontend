import { Route } from '@angular/router';
import { cartRoutes } from '@mfe/cart/feature';
import { App } from './app';

/** Exposed as `mfe-ordering/./cart` – the shell mounts this under `/cart`. */
export const routes: Route[] = [{ path: '', component: App, children: cartRoutes }];
