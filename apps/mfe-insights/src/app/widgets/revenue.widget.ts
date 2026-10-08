import { Component, computed, inject, ViewEncapsulation } from '@angular/core';
import { OrderStore } from '@mfe/shared/data-access';
import { formatPrice } from '@mfe/shared/util';

@Component({
  selector: 'ins-revenue-widget',
  // Widgets render outside App, so they bring this remote's Tailwind utilities themselves.
  encapsulation: ViewEncapsulation.None,
  styleUrl: '../app.css',
  template: `
    <div class="text-4xl font-medium tabular-nums">{{ revenue() }}</div>
    <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
      <div>
        <div class="text-on-surface-variant">Ordrar</div>
        <div class="text-xl tabular-nums">{{ orders.count() }}</div>
      </div>
      <div>
        <div class="text-on-surface-variant">Snittorder</div>
        <div class="text-xl tabular-nums">{{ average() }}</div>
      </div>
    </div>
  `,
})
export class RevenueWidget {
  protected readonly orders = inject(OrderStore);
  protected readonly revenue = computed(() => formatPrice(this.orders.revenue()));
  protected readonly average = computed(() =>
    formatPrice(this.orders.count() ? this.orders.revenue() / this.orders.count() : 0),
  );
}
