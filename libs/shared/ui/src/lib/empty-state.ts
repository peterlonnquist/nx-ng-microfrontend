import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'mfe-empty-state',
  imports: [MatIconModule],
  host: { class: 'flex flex-col items-center gap-3 rounded-2xl bg-surface-container-low px-6 py-16 text-center' },
  template: `
    <mat-icon class="!h-12 !w-12 text-5xl text-outline">{{ icon() }}</mat-icon>
    <h2 class="m-0 text-xl font-normal">{{ heading() }}</h2>
    <p class="m-0 max-w-md text-on-surface-variant"><ng-content /></p>
    <ng-content select="[actions]" />
  `,
})
export class EmptyState {
  readonly heading = input.required<string>();
  readonly icon = input('inbox');
}
