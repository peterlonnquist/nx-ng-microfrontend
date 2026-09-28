/**
 * layout-api – stores which widgets are placed on the dashboard (owned by Team Platform).
 *
 *   GET    /api/layout   current layout (falls back to the default layout)
 *   PUT    /api/layout   replace layout, body: { widgets: WidgetPlacement[] }
 *   DELETE /api/layout   reset to the default layout
 *   GET    /health
 *
 * Deliberately dependency-free (node:http + a JSON file). Swap for a real database/service in production.
 */
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { type DashboardLayout, sanitizeWidgetPlacements, type WidgetPlacement } from '@mfe/shared/util';

const PORT = Number(process.env['PORT'] ?? 3333);
const LAYOUT_FILE = resolve(process.env['LAYOUT_FILE'] ?? 'tmp/layout-api/layout.json');
const MAX_BODY_BYTES = 64 * 1024;

const DEFAULT_WIDGETS: WidgetPlacement[] = [
  { instanceId: 'default-1', widgetId: 'insights.revenue', cols: 2, rows: 1 },
  { instanceId: 'default-2', widgetId: 'cart.summary', cols: 1, rows: 1 },
  { instanceId: 'default-3', widgetId: 'profile.card', cols: 1, rows: 1 },
  { instanceId: 'default-4', widgetId: 'insights.weekly-sales', cols: 2, rows: 2 },
  { instanceId: 'default-5', widgetId: 'orders.recent', cols: 2, rows: 1 },
  { instanceId: 'default-6', widgetId: 'products.top-rated', cols: 2, rows: 1 },
];

async function readLayout(): Promise<DashboardLayout> {
  try {
    const stored = JSON.parse(await readFile(LAYOUT_FILE, 'utf8')) as DashboardLayout;
    return { widgets: sanitizeWidgetPlacements(stored.widgets), updatedAt: stored.updatedAt ?? null };
  } catch {
    return { widgets: DEFAULT_WIDGETS, updatedAt: null };
  }
}

async function writeLayout(widgets: WidgetPlacement[]): Promise<DashboardLayout> {
  const layout: DashboardLayout = { widgets, updatedAt: new Date().toISOString() };
  await mkdir(dirname(LAYOUT_FILE), { recursive: true });
  await writeFile(LAYOUT_FILE, JSON.stringify(layout, null, 2));
  return layout;
}

function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((ok, fail) => {
    let size = 0;
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        fail(new Error('body too large'));
        req.destroy();
      } else chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        ok(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
      } catch {
        fail(new Error('invalid JSON'));
      }
    });
    req.on('error', fail);
  });
}

function send(res: ServerResponse, status: number, body?: unknown): void {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(body === undefined ? undefined : JSON.stringify(body));
}

const server = createServer(async (req, res) => {
  const path = new URL(req.url ?? '/', 'http://localhost').pathname;
  try {
    if (path === '/health') return send(res, 200, { ok: true });
    if (path !== '/api/layout') return send(res, 404, { error: 'not found' });

    switch (req.method) {
      case 'GET':
        return send(res, 200, await readLayout());
      case 'PUT': {
        const body = (await readBody(req)) as { widgets?: unknown };
        let widgets: WidgetPlacement[];
        try {
          widgets = sanitizeWidgetPlacements(body.widgets);
        } catch (e) {
          return send(res, 400, { error: (e as Error).message });
        }
        return send(res, 200, await writeLayout(widgets));
      }
      case 'DELETE':
        await rm(LAYOUT_FILE, { force: true });
        return send(res, 200, await readLayout());
      default:
        res.setHeader('Allow', 'GET, PUT, DELETE');
        return send(res, 405, { error: 'method not allowed' });
    }
  } catch (e) {
    console.error(e);
    return send(res, 500, { error: 'internal error' });
  }
});

server.listen(PORT, () => console.log(`layout-api listening on http://localhost:${PORT} (data: ${LAYOUT_FILE})`));

for (const signal of ['SIGINT', 'SIGTERM'] as const) process.on(signal, () => server.close(() => process.exit(0)));
