import { initFederation } from '@angular-architects/native-federation';

// Remotes have no manifest of their own: they only register their shared dependencies
// so the app can also run standalone during development.
initFederation({}, { hostRemoteEntry: { url: './remoteEntry.json' } })
  .then(() => import('./bootstrap'))
  .catch((err) => console.error(err));
