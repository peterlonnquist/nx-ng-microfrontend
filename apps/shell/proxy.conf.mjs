// Local dev only: adds the headers a real login would produce to every /api call.
// Switch user by changing "active" in dev-users.json – it is read on every request, no restart needed.
import { readFileSync } from 'node:fs';

const USERS_FILE = new URL('./dev-users.json', import.meta.url);

function activeUser() {
  const { active, users } = JSON.parse(readFileSync(USERS_FILE, 'utf8'));
  if (!users[active]) throw new Error(`"active": "${active}" is not in dev-users.json (${Object.keys(users).join(', ')})`);
  return users[active];
}

export default {
  '/api': {
    target: 'http://localhost:3333',
    secure: false,
    configure: (proxy) => {
      proxy.on('proxyReq', (proxyReq) => {
        try {
          const user = activeUser();
          proxyReq.setHeader('Authorization', `Bearer ${user.token}`);
          proxyReq.setHeader('X-Custom-Info', user.customInfo);
        } catch (error) {
          console.warn(`[proxy] no dev user headers: ${error.message}`);
        }
      });
    },
  },
};
