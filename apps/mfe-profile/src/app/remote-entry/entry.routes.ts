import { Route } from '@angular/router';
import { RemoteEntry } from './entry';

/** Exposed as `mfe-profile/./routes` – the shell mounts this under `/profile`. */
export const routes: Route[] = [
  {
    path: '',
    component: RemoteEntry,
    children: [{ path: '', loadComponent: () => import('../profile-page').then((m) => m.ProfilePage) }],
  },
];
