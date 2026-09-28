import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PageHeader } from '@mfe/shared/ui';
import { WidgetPlacement } from '@mfe/shared/util';
import { DashboardLayoutStore } from '../dashboard/layout.store';
import { CatalogWidget, WidgetRegistry } from '../dashboard/widget-registry';
import { resizePlacement, samePlacements } from './layout-editing';

@Component({
  selector: 'app-dashboard-editor',
  imports: [
    CdkDrag,
    CdkDragHandle,
    CdkDropList,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
    PageHeader,
  ],
  template: `
    <mfe-page-header heading="Anpassa översikten" subheading="Dra för att flytta, ändra storlek och lägg till widgets från teamens kataloger">
      <div class="flex flex-wrap gap-2">
        <a mat-button routerLink="/"><mat-icon>visibility</mat-icon> Visa</a>
        <button mat-button (click)="resetToDefault()" [disabled]="busy()">Återställ standard</button>
        <button mat-stroked-button (click)="discard()" [disabled]="!dirty() || busy()">Ångra</button>
        <button mat-flat-button (click)="save()" [disabled]="!dirty() || busy()"><mat-icon>save</mat-icon> Spara</button>
      </div>
    </mfe-page-header>

    @if (layoutStore.layout.error()) {
      <p class="mb-4 mt-0 rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">
        Layout-API:t svarar inte – ändringar kan inte sparas just nu.
      </p>
    }
    @if (busy() || layoutStore.layout.isLoading()) {
      <mat-progress-bar mode="indeterminate" class="mb-4" />
    }

    <div class="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <section>
        <h2 class="m-0 mb-3 text-lg font-medium">Layout</h2>
        <div
          cdkDropList
          cdkDropListOrientation="mixed"
          (cdkDropListDropped)="drop($event)"
          class="grid min-h-40 auto-rows-[7.5rem] grid-flow-dense grid-cols-4 gap-3 rounded-2xl bg-surface-container-low p-3"
        >
          @for (p of draft(); track p.instanceId; let i = $index) {
            @let w = registry.byId().get(p.widgetId);
            <div
              cdkDrag
              class="flex min-w-0 flex-col rounded-xl bg-surface-container-high p-3 col-span-(--cols) row-span-(--rows)"
              [class.outline-dashed]="!w"
              [class.outline-error]="!w"
              [style.--cols]="p.cols"
              [style.--rows]="p.rows"
            >
              <div class="flex items-start gap-2">
                <mat-icon cdkDragHandle class="cursor-move text-on-surface-variant" matTooltip="Dra för att flytta">drag_indicator</mat-icon>
                <div class="min-w-0 flex-1">
                  <div class="truncate font-medium">{{ w?.title ?? p.widgetId }}</div>
                  <div class="truncate text-xs text-on-surface-variant">{{ w?.info?.team ?? 'Saknas i katalogen' }}</div>
                </div>
                <button mat-icon-button (click)="remove(i)" aria-label="Ta bort" matTooltip="Ta bort"><mat-icon>close</mat-icon></button>
              </div>
              <div class="mt-auto flex items-center justify-end text-xs text-on-surface-variant">
                <button mat-icon-button (click)="resize(i, -1, 0)" [disabled]="p.cols <= 1" aria-label="Smalare"><mat-icon>chevron_left</mat-icon></button>
                <span class="tabular-nums">{{ p.cols }}×{{ p.rows }}</span>
                <button mat-icon-button (click)="resize(i, 1, 0)" [disabled]="p.cols >= 4" aria-label="Bredare"><mat-icon>chevron_right</mat-icon></button>
                <button mat-icon-button (click)="resize(i, 0, p.rows === 1 ? 1 : -1)" [attr.aria-label]="p.rows === 1 ? 'Högre' : 'Lägre'" [matTooltip]="p.rows === 1 ? 'Högre' : 'Lägre'">
                  <mat-icon>{{ p.rows === 1 ? 'unfold_more' : 'unfold_less' }}</mat-icon>
                </button>
              </div>
            </div>
          } @empty {
            <p class="col-span-4 m-0 self-center text-center text-on-surface-variant">Tomt – lägg till widgets från katalogen.</p>
          }
        </div>
      </section>

      <aside class="rounded-2xl bg-surface-container p-4">
        <div class="mb-3 flex items-center justify-between">
          <h2 class="m-0 text-lg font-medium">Katalog</h2>
          <button mat-icon-button (click)="registry.catalog.reload()" aria-label="Uppdatera katalog" matTooltip="Hämta om från alla remotes">
            <mat-icon>refresh</mat-icon>
          </button>
        </div>
        @for (group of catalogByTeam(); track group.team) {
          <h3 class="mb-2 mt-4 text-xs font-medium uppercase tracking-wider text-on-surface-variant first:mt-0">{{ group.team }}</h3>
          <ul class="m-0 list-none space-y-2 p-0">
            @for (w of group.widgets; track w.id) {
              <li class="flex items-start gap-3 rounded-xl bg-surface-container-high p-3">
                <mat-icon class="shrink-0 text-primary">{{ w.icon }}</mat-icon>
                <div class="min-w-0 flex-1">
                  <div class="font-medium">{{ w.title }}</div>
                  <div class="text-xs text-on-surface-variant">{{ w.description }}</div>
                  <code class="text-[11px] text-on-surface-variant">{{ w.id }} · {{ w.defaultSize.cols }}×{{ w.defaultSize.rows }}</code>
                </div>
                <button mat-icon-button (click)="add(w)" [attr.aria-label]="'Lägg till ' + w.title" matTooltip="Lägg till"><mat-icon>add</mat-icon></button>
              </li>
            }
          </ul>
        }
        @if (registry.catalog.value()?.unavailableRemotes?.length) {
          <p class="mb-0 mt-4 text-xs text-on-surface-variant">
            Ej nåbara just nu: {{ registry.catalog.value()?.unavailableRemotes?.join(', ') }}
          </p>
        }
      </aside>
    </div>
  `,
})
export class DashboardEditor {
  protected readonly registry = inject(WidgetRegistry);
  protected readonly layoutStore = inject(DashboardLayoutStore);
  private readonly snackBar = inject(MatSnackBar);

  private readonly saved = computed(() => this.layoutStore.layout.value()?.widgets ?? []);
  /** Local working copy; resets whenever the stored layout changes. */
  protected readonly draft = linkedSignal<WidgetPlacement[]>(() => this.saved());
  protected readonly dirty = computed(() => !samePlacements(this.draft(), this.saved()));
  protected readonly busy = signal(false);

  protected readonly catalogByTeam = computed(() => {
    const groups = new Map<string, CatalogWidget[]>();
    for (const w of this.registry.catalog.value()?.widgets ?? []) {
      groups.set(w.info.team, [...(groups.get(w.info.team) ?? []), w]);
    }
    return [...groups].map(([team, widgets]) => ({ team, widgets }));
  });

  protected drop(event: CdkDragDrop<unknown>): void {
    this.draft.update((list) => {
      const next = [...list];
      moveItemInArray(next, event.previousIndex, event.currentIndex);
      return next;
    });
  }

  protected add(widget: CatalogWidget): void {
    this.draft.update((list) => [...list, { instanceId: crypto.randomUUID(), widgetId: widget.id, ...widget.defaultSize }]);
  }

  protected remove(index: number): void {
    this.draft.update((list) => list.filter((_, i) => i !== index));
  }

  protected resize(index: number, dCols: number, dRows: number): void {
    this.draft.update((list) => list.map((p, i) => (i === index ? resizePlacement(p, dCols, dRows) : p)));
  }

  protected discard(): void {
    this.draft.set(this.saved());
  }

  protected save(): Promise<void> {
    return this.run(() => this.layoutStore.save(this.draft()), 'Layouten sparad');
  }

  protected resetToDefault(): Promise<void> {
    return this.run(() => this.layoutStore.resetToDefault(), 'Standardlayouten återställd');
  }

  private async run(action: () => Promise<void>, success: string): Promise<void> {
    this.busy.set(true);
    try {
      await action();
      this.snackBar.open(success, undefined, { duration: 2000 });
    } catch {
      this.snackBar.open('Kunde inte spara – försök igen', 'OK', { duration: 4000 });
    } finally {
      this.busy.set(false);
    }
  }
}
