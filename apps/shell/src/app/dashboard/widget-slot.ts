import { NgComponentOutlet } from '@angular/common';
import { Component, input, resource } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MfeBoundary } from '@mfe/shared/ui';
import { CatalogWidget } from './widget-registry';

/**
 * Platform-owned frame around a team's widget: title, loading and error states.
 * The widget component itself is only downloaded when a slot for it is rendered.
 */
@Component({
  selector: 'app-widget-slot',
  imports: [NgComponentOutlet, MatIconModule, MatProgressSpinnerModule, MfeBoundary],
  host: { class: 'block min-w-0' },
  template: `
    @if (widget(); as w) {
      <mfe-boundary [info]="w.info" [origin]="w.origin" class="h-full">
        <article class="flex h-full flex-col rounded-2xl bg-surface-container p-5">
          <header class="mb-3 flex items-center gap-2 text-sm font-medium text-on-surface-variant">
            <mat-icon class="text-primary">{{ w.icon }}</mat-icon>
            {{ w.title }}
          </header>
          <div class="min-h-0 flex-1">
            @if (component.hasValue()) {
              <ng-container *ngComponentOutlet="component.value()" />
            } @else if (component.error()) {
              <p class="m-0 text-sm text-on-surface-variant">Widgeten kunde inte laddas.</p>
            } @else {
              <mat-progress-spinner mode="indeterminate" diameter="24" />
            }
          </div>
        </article>
      </mfe-boundary>
    } @else {
      <article
        class="flex h-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-outline-variant p-5 text-center text-sm text-on-surface-variant"
      >
        <mat-icon>extension_off</mat-icon>
        <span><code>{{ widgetId() }}</code> är inte tillgänglig just nu</span>
      </article>
    }
  `,
})
export class WidgetSlot {
  readonly widgetId = input.required<string>();
  /** Undefined when the providing remote is down or no longer offers the widget. */
  readonly widget = input<CatalogWidget>();

  protected readonly component = resource({
    params: () => this.widget(),
    loader: ({ params }) => params.load(),
  });
}
