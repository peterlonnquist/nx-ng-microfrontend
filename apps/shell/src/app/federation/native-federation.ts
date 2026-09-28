import { inject, InjectionToken } from '@angular/core';
import { Routes } from '@angular/router';
import type { NativeFederationResult } from '@angular-architects/native-federation';
import { RemoteUnavailable } from './remote-unavailable';

export const NATIVE_FEDERATION = new InjectionToken<NativeFederationResult>('NATIVE_FEDERATION');

/**
 * `loadChildren` factory for a remote that exposes `./routes`.
 * If the remote is down (e.g. its container is stopped) the shell keeps working and shows a fallback.
 */
export function loadRemoteRoutes(remoteName: string, exposedModule = './routes') {
  return () => {
    const federation = inject(NATIVE_FEDERATION);
    return federation
      .loadRemoteModule<{ routes: Routes }>(remoteName, exposedModule)
      .then((m) => m.routes)
      .catch((error: unknown): Routes => {
        console.error(`[shell] Could not load ${remoteName}`, error);
        return [{ path: '**', component: RemoteUnavailable, data: { remoteName } }];
      });
  };
}
