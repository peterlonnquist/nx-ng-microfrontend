import { DASHBOARD_COLUMNS, MAX_WIDGET_ROWS, WidgetPlacement } from '@mfe/shared/util';

const clamp = (n: number, max: number) => Math.min(max, Math.max(1, n));

export function resizePlacement(p: WidgetPlacement, dCols: number, dRows: number): WidgetPlacement {
  return { ...p, cols: clamp(p.cols + dCols, DASHBOARD_COLUMNS), rows: clamp(p.rows + dRows, MAX_WIDGET_ROWS) };
}

export function samePlacements(a: WidgetPlacement[], b: WidgetPlacement[]): boolean {
  return (
    a.length === b.length &&
    a.every(
      (p, i) => p.instanceId === b[i].instanceId && p.widgetId === b[i].widgetId && p.cols === b[i].cols && p.rows === b[i].rows,
    )
  );
}
