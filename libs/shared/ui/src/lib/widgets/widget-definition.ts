import type { Type } from '@angular/core';
import type { MfeInfo, WidgetSize } from '@mfe/shared/util';

/**
 * A widget a team offers for the dashboard. Metadata is cheap; the component is only
 * downloaded (`load`) when the widget is actually placed on the dashboard.
 */
export interface WidgetDefinition {
  /** Globally unique, prefixed with the team's domain: `orders.recent`. Never rename – layouts store it. */
  id: string;
  title: string;
  description: string;
  /** Material icon name. */
  icon: string;
  defaultSize: WidgetSize;
  load: () => Promise<Type<unknown>>;
}

/**
 * Shape of the `./widgets` module every remote may expose (see federation.config.mjs).
 * The shell discovers widgets by loading this module from each remote in the federation manifest.
 */
export interface WidgetModule {
  info: MfeInfo;
  /** `new URL(import.meta.url).origin` – where the remote is served from. */
  origin: string;
  widgets: WidgetDefinition[];
}
