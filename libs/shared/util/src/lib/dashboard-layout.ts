/**
 * Dashboard layout contract, shared by the shell (renders/edits it) and layout-api (stores it).
 * A layout is an ordered list; the grid flows items left-to-right, top-to-bottom.
 */
export const DASHBOARD_COLUMNS = 4;
export const MAX_WIDGET_ROWS = 2;
export const MAX_WIDGETS = 50;

export interface WidgetSize {
  cols: number;
  rows: number;
}

export interface WidgetPlacement extends WidgetSize {
  /** Unique per placement – the same widget may be placed twice. */
  instanceId: string;
  /** `<domain>.<name>`, e.g. `cart.summary`. Resolved against the widget catalog at runtime. */
  widgetId: string;
}

export interface DashboardLayout {
  widgets: WidgetPlacement[];
  updatedAt: string | null;
}

const clamp = (value: unknown, max: number): number =>
  Math.min(max, Math.max(1, Math.round(Number(value) || 1)));

/** Validates untrusted input (HTTP body, storage) into a well-formed placement list. Throws on bad shape. */
export function sanitizeWidgetPlacements(input: unknown): WidgetPlacement[] {
  if (!Array.isArray(input)) throw new Error('widgets must be an array');
  if (input.length > MAX_WIDGETS) throw new Error(`at most ${MAX_WIDGETS} widgets are allowed`);
  return input.map((item, i) => {
    const w = item as Partial<WidgetPlacement> | null;
    if (!w || typeof w.widgetId !== 'string' || !w.widgetId) throw new Error(`widgets[${i}].widgetId is required`);
    if (typeof w.instanceId !== 'string' || !w.instanceId) throw new Error(`widgets[${i}].instanceId is required`);
    return {
      instanceId: w.instanceId.slice(0, 64),
      widgetId: w.widgetId.slice(0, 128),
      cols: clamp(w.cols, DASHBOARD_COLUMNS),
      rows: clamp(w.rows, MAX_WIDGET_ROWS),
    };
  });
}
