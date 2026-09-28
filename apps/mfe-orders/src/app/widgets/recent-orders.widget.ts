import { Component, computed, inject, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { OrderStore } from '@mfe/shared/data-access';
import { formatDate, formatPrice, Order } from '@mfe/shared/util';
import { ORDER_STATUS } from '../order-status';

@Component({
  selector: 'ord-recent-orders-widget',
  imports: [RouterLink, MatButtonModule],
  encapsulation: ViewEncapsulation.None,
  styleUrl: '../remote-entry/remote-styles.css',
  template: `
    <ul class="m-0 list-none space-y-3 p-0">
      @for (order of recent(); track order.id) {
        <li class="flex items-center gap-3">
          <div class="min-w-0 flex-1">
            <div class="font-medium">{{ order.id }}</div>
            <div class="text-xs text-on-surface-variant">{{ date(order.createdAt) }}</div>
          </div>
          <span class="rounded-full px-2.5 py-0.5 text-xs font-medium" [class]="statusOf(order).classes">
            {{ statusOf(order).label }}
          </span>
          <span class="w-24 text-right tabular-nums">{{ price(order.total) }}</span>
        </li>
      } @empty {
        <li class="text-on-surface-variant">Inga ordrar ännu.</li>
      }
    </ul>
    <a mat-button routerLink="/orders" class="!mt-2">Alla ordrar</a>
  `,
})
export class RecentOrdersWidget {
  private readonly store = inject(OrderStore);
  protected readonly recent = computed(() => this.store.orders().slice(0, 3));
  protected readonly price = formatPrice;
  protected readonly date = formatDate;

  protected statusOf(order: Order) {
    return ORDER_STATUS[order.status];
  }
}
