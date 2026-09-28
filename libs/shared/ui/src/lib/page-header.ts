import { Component, input } from '@angular/core';

@Component({
  selector: 'mfe-page-header',
  host: { class: 'mb-6 flex flex-wrap items-end justify-between gap-4' },
  template: `
    <div>
      <h1 class="m-0 text-3xl font-normal tracking-tight">{{ heading() }}</h1>
      @if (subheading()) {
        <p class="m-0 mt-1 text-on-surface-variant">{{ subheading() }}</p>
      }
    </div>
    <ng-content />
  `,
})
export class PageHeader {
  readonly heading = input.required<string>();
  readonly subheading = input<string>();
}
