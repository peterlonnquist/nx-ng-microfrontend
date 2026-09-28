import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UserStore } from '@mfe/shared/data-access';
import { PageHeader } from '@mfe/shared/ui';
import { WidgetPlacement } from '@mfe/shared/util';
import { DashboardLayoutStore } from './layout.store';
import { WidgetRegistry } from './widget-registry';
import { WidgetSlot } from './widget-slot';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatProgressBarModule, PageHeader, WidgetSlot],
  template: `
    <mfe-page-header [heading]="'Hej ' + firstName() + ' 👋'" subheading="Din översikt – widgets från alla team">
      <a mat-stroked-button routerLink="/admin"><mat-icon>dashboard_customize</mat-icon> Anpassa</a>
    </mfe-page-header>

    @if (layoutStore.layout.error()) {
      <p class="mb-4 mt-0 rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">
        Layout-API:t svarar inte – visar alla tillgängliga widgets.
      </p>
    }

    @if (loading()) {
      <mat-progress-bar mode="indeterminate" />
    } @else {
      <div class="grid auto-rows-[minmax(10rem,auto)] grid-flow-dense grid-cols-1 gap-4 md:grid-cols-4">
        @for (p of placements(); track p.instanceId) {
          <app-widget-slot
            [widgetId]="p.widgetId"
            [widget]="registry.byId().get(p.widgetId)"
            [style.--cols]="p.cols"
            [style.--rows]="p.rows"
            class="md:col-span-(--cols) md:row-span-(--rows)"
          />
        }
      </div>
    }
  `,
})
export class DashboardPage {
  protected readonly registry = inject(WidgetRegistry);
  protected readonly layoutStore = inject(DashboardLayoutStore);
  private readonly user = inject(UserStore);

  protected readonly firstName = computed(() => this.user.user().name.split(' ')[0]);
  protected readonly loading = computed(() => this.registry.catalog.isLoading() || this.layoutStore.layout.isLoading());

  protected readonly placements = computed<WidgetPlacement[]>(() => {
    const layout = this.layoutStore.layout;
    if (layout.hasValue()) return layout.value().widgets;
    // Layout service down: degrade to "everything, default size" instead of an empty page.
    if (layout.error()) {
      return (this.registry.catalog.value()?.widgets ?? []).map((w) => ({
        instanceId: w.id,
        widgetId: w.id,
        ...w.defaultSize,
      }));
    }
    return [];
  });
}
