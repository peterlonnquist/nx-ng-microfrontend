import { initFederation } from '@angular-architects/native-federation';

// The manifest maps remote names to their remoteEntry.json URLs. It is fetched at runtime,
// so each environment (local, docker, prod) can point the shell at different remotes without a rebuild.
initFederation('federation.manifest.json', {
  hostRemoteEntry: { url: './remoteEntry.json' },
})
  .then((federation) => import('./bootstrap').then((m) => m.bootstrap(federation)))
  .catch((err) => console.error(err));
