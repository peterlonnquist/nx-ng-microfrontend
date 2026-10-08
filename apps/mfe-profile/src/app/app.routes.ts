import { Route } from '@angular/router';
import { App } from './app';

/** Exposed as `mfe-profile/./routes` – the shell mounts this under `/profile`. */
export const routes: Route[] = [
  {
    path: '',
    component: App,
    children: [{ path: '', loadComponent: () => import('./profile-page').then((m) => m.ProfilePage) }],
  },
];
