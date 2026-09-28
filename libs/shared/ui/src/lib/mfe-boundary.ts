import { Component, computed, inject, input } from '@angular/core';
import { MfeInfo } from '@mfe/shared/util';
import { MfeDevSettings } from './mfe-dev-settings';

/**
 * Wraps a microfrontend's UI and shows who owns it and where it was loaded from.
 * Purely a demo aid for making MFE boundaries visible – toggle with the "Show boundaries" switch in the shell.
 */
@Component({
  selector: 'mfe-boundary',
  host: { class: 'block' },
  template: `
    <section
      class="flex h-full flex-col rounded-2xl transition-colors"
      [class]="visible() ? 'border-2 border-dashed border-tertiary p-3' : 'border-2 border-transparent'"
    >
      @if (visible()) {
        <header class="mb-3 flex flex-wrap items-center gap-2 text-xs">
          <span class="rounded-full bg-tertiary-container px-2.5 py-1 font-medium text-on-tertiary-container">
            {{ info().name }} · v{{ info().version }}
          </span>
          <span class="text-on-surface-variant">{{ info().team }}</span>
          <span class="ml-auto font-mono text-on-surface-variant">{{ originLabel() }}</span>
        </header>
      }
      <ng-content />
    </section>
  `,
})
export class MfeBoundary {
  readonly info = input.required<MfeInfo>();
  /** Pass `new URL(import.meta.url).origin` from inside the remote to show where its code came from. */
  readonly origin = input<string>('');

  protected readonly visible = inject(MfeDevSettings).showBoundaries;
  protected readonly originLabel = computed(() => (this.origin() ? `served from ${this.origin()}` : ''));
}
