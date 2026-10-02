// Local dev only, shared by the shell and every remote's dev server.
//
// Frontend code calls the same relative URLs as in deployed environments:
//   /api/...                      -> layout-api
//   /gateway/<service>/api/...    -> the backend microservice, locally at localhost:<port>/<service>/api/...
//
// Adds the headers a real login would produce to every proxied call, for the user picked in the dev-login
// app (http://localhost:4299, a `dev-user` cookie). Without one, page loads redirect to dev-login and API
// calls get 401.
import { devUserFor } from './dev-users.mjs';

// Backend microservice -> local port. Add a line per service.
const GATEWAY_SERVICES = {
  profile: 21020,
};

const DEV_LOGIN = 'http://localhost:4299/';

// Vite runs `bypass` before proxying: ending the response here stops the request.
function requireDevUserForApi(req, res) {
  if (devUserFor(req.headers.cookie)) return undefined;
  res.writeHead(401, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'No dev user picked', login: DEV_LOGIN }));
  return req.url;
}

function addDevUserHeaders(proxy) {
  proxy.on('proxyReq', (proxyReq, req) => {
    const user = devUserFor(req.headers.cookie);
    proxyReq.setHeader('Authorization', `Bearer ${user.token}`);
    proxyReq.setHeader('X-Custom-Info', user.customInfo);
  });
}

const api = (target, extra = {}) => ({
  target,
  secure: false,
  bypass: requireDevUserForApi,
  configure: addDevUserHeaders,
  ...extra,
});

const gateway = Object.fromEntries(
  Object.entries(GATEWAY_SERVICES).map(([service, port]) => [
    `/gateway/${service}`,
    api(`http://localhost:${port}`, { pathRewrite: { '^/gateway': '' } }),
  ]),
);

// Matches every other request, but never proxies: `bypass` either redirects a page load without a dev user
// to dev-login, or returns the URL so the dev server serves it as usual.
const loginRedirect = {
  '^/': {
    target: 'http://localhost',
    bypass: (req, res) => {
      const isPageLoad =
        req.headers['sec-fetch-mode'] === 'navigate' || req.headers.accept?.includes('text/html');
      if (isPageLoad && !devUserFor(req.headers.cookie)) {
        const to = `http://${req.headers.host}${req.url}`;
        res.writeHead(302, { Location: `${DEV_LOGIN}?to=${encodeURIComponent(to)}` });
        res.end();
      }
      return req.url;
    },
  },
};

// Order matters: the catch-all goes last.
export default {
  '/api': api('http://localhost:3333'),
  ...gateway,
  ...loginRedirect,
};
