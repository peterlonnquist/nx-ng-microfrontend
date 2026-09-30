import { initFederation } from '@angular-architects/native-federation';

// The manifest maps remote names to their remoteEntry.json URLs. It is fetched at runtime,
// so each environment (local, docker, prod) can point the shell at different remotes without a rebuild.
initFederation('federation.manifest.json', {
  hostRemoteEntry: { url: './remoteEntry.json' },
  // Live reload across dev servers: reload the shell when a remote finishes rebuilding. Only remotes that
  // advertise a build-notifications endpoint (dev servers with `buildNotifications`) are watched, so this is
  // a no-op against production builds. (Can't use isDevMode() here – Angular must not load before federation.)
  sse: true,
})
  .then((federation) => import('./bootstrap').then((m) => m.bootstrap(federation)))
  .catch((err) => console.error(err));
