import { Route } from '@angular/router';
import { loadRemoteRoutes } from './federation/native-federation';
import { NotFound } from './layout/not-found';

/**
 * The shell owns the dashboard/admin (platform features) and the URL space.
 * Everything below a team prefix belongs to that team's remote.
 * Remote names must match the keys in public/federation.manifest.json.
 */
export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./dashboard/dashboard-page').then((m) => m.DashboardPage) },
  { path: 'admin', loadComponent: () => import('./admin/dashboard-editor').then((m) => m.DashboardEditor) },
  { path: 'insights', loadChildren: loadRemoteRoutes('mfe-insights') },
  { path: 'products', loadChildren: loadRemoteRoutes('mfe-products') },
  { path: 'cart', loadChildren: loadRemoteRoutes('mfe-cart') },
  { path: 'orders', loadChildren: loadRemoteRoutes('mfe-orders') },
  { path: 'profile', loadChildren: loadRemoteRoutes('mfe-profile') },
  { path: '**', component: NotFound },
];
