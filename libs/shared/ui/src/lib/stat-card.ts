import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'mfe-stat-card',
  imports: [MatIconModule],
  host: { class: 'block rounded-2xl bg-surface-container p-5' },
  template: `
    <div class="flex items-center justify-between text-sm text-on-surface-variant">
      {{ label() }}
      <mat-icon class="text-primary">{{ icon() }}</mat-icon>
    </div>
    <div class="mt-2 text-3xl font-medium tabular-nums">{{ value() }}</div>
    @if (hint()) {
      <div class="mt-1 text-xs text-on-surface-variant">{{ hint() }}</div>
    }
  `,
})
export class StatCard {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly icon = input('insights');
  readonly hint = input<string>();
}
