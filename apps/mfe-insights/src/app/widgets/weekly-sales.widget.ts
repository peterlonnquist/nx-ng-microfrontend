import { Component, ViewEncapsulation } from '@angular/core';
import { WEEKLY_SALES } from '../data/weekly-sales';

@Component({
  selector: 'ins-weekly-sales-widget',
  encapsulation: ViewEncapsulation.None,
  styleUrl: '../app.css',
  host: { class: 'flex h-full min-h-40 gap-2' },
  template: `
    @for (bar of week; track bar.day) {
      <div class="flex h-full flex-1 flex-col items-center justify-end gap-2">
        <div class="w-full rounded-t-lg bg-primary" [style.height.%]="bar.value" [title]="bar.value + ' ordrar'"></div>
        <span class="text-xs text-on-surface-variant">{{ bar.day }}</span>
      </div>
    }
  `,
})
export class WeeklySalesWidget {
  protected readonly week = WEEKLY_SALES;
}
