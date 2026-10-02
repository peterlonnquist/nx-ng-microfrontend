// Local dev only, shared by the shell and every remote's dev server.
//
// Frontend code calls the same relative URLs as in deployed environments:
//   /api/...                      -> layout-api
//   /gateway/<service>/api/...    -> the backend microservice, locally at localhost:<port>/<service>/api/...
//
// Adds the headers a real login would produce to every proxied call.
// Switch user by changing "active" in dev-users.json – it is read on every request, no restart needed.
import { readFileSync } from 'node:fs';

// Backend microservice -> local port. Add a line per service.
const GATEWAY_SERVICES = {
  profile: 21020,
};

const USERS_FILE = new URL('./dev-users.json', import.meta.url);

function activeUser() {
  const { active, users } = JSON.parse(readFileSync(USERS_FILE, 'utf8'));
  if (!users[active]) throw new Error(`"active": "${active}" is not in dev-users.json (${Object.keys(users).join(', ')})`);
  return users[active];
}

function addDevUserHeaders(proxy) {
  proxy.on('proxyReq', (proxyReq) => {
    try {
      const user = activeUser();
      proxyReq.setHeader('Authorization', `Bearer ${user.token}`);
      proxyReq.setHeader('X-Custom-Info', user.customInfo);
    } catch (error) {
      console.warn(`[proxy] no dev user headers: ${error.message}`);
    }
  });
}

const gateway = Object.fromEntries(
  Object.entries(GATEWAY_SERVICES).map(([service, port]) => [
    `/gateway/${service}`,
    {
      target: `http://localhost:${port}`,
      secure: false,
      pathRewrite: { '^/gateway': '' },
      configure: addDevUserHeaders,
    },
  ]),
);

export default {
  '/api': {
    target: 'http://localhost:3333',
    secure: false,
    configure: addDevUserHeaders,
  },
  ...gateway,
};
