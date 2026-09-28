import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartStore, OrderStore } from '@mfe/shared/data-access';
import { PageHeader, StatCard } from '@mfe/shared/ui';
import { formatDate, formatPrice } from '@mfe/shared/util';
import { WEEKLY_SALES } from './data/weekly-sales';


@Component({
  selector: 'ins-insights-page',
  imports: [RouterLink, MatButtonModule, MatIconModule, PageHeader, StatCard],
  template: `
    <mfe-page-header heading="Insikter" subheading="Försäljning och nyckeltal för butiken">
      <a mat-flat-button routerLink="/products"><mat-icon>storefront</mat-icon> Handla</a>
    </mfe-page-header>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <mfe-stat-card label="Intäkter" [value]="revenue()" icon="payments" hint="Alla ordrar" />
      <mfe-stat-card label="Ordrar" [value]="orders.count()" icon="receipt_long" />
      <mfe-stat-card label="Snittorder" [value]="average()" icon="trending_up" />
      <mfe-stat-card label="I varukorgen" [value]="cart.count()" icon="shopping_cart" [hint]="cartTotal()" />
    </div>

    <div class="mt-6 grid gap-4 lg:grid-cols-3">
      <section class="rounded-2xl bg-surface-container p-5 lg:col-span-2">
        <h2 class="m-0 mb-4 text-lg font-medium">Försäljning senaste veckan</h2>
        <div class="flex h-48 gap-3">
          @for (bar of week; track bar.day) {
            <div class="flex h-full flex-1 flex-col items-center justify-end gap-2">
              <div
                class="w-full rounded-t-lg bg-primary transition-all hover:opacity-80"
                [style.height.%]="bar.value"
                [title]="bar.value + ' ordrar'"
              ></div>
              <span class="text-xs text-on-surface-variant">{{ bar.day }}</span>
            </div>
          }
        </div>
      </section>

      <section class="rounded-2xl bg-surface-container p-5">
        <div class="mb-3 flex items-center justify-between">
          <h2 class="m-0 text-lg font-medium">Senaste ordrar</h2>
          <a mat-button routerLink="/orders">Alla</a>
        </div>
        <ul class="m-0 list-none space-y-3 p-0">
          @for (order of recent(); track order.id) {
            <li class="flex items-center justify-between gap-2">
              <div>
                <div class="font-medium">{{ order.id }}</div>
                <div class="text-xs text-on-surface-variant">{{ date(order.createdAt) }}</div>
              </div>
              <span class="tabular-nums">{{ price(order.total) }}</span>
            </li>
          } @empty {
            <li class="text-on-surface-variant">Inga ordrar ännu.</li>
          }
        </ul>
      </section>
    </div>
  `,
})
export class InsightsPage {
  protected readonly orders = inject(OrderStore);
  protected readonly cart = inject(CartStore);

  protected readonly price = formatPrice;
  protected readonly date = formatDate;

  protected readonly revenue = computed(() => formatPrice(this.orders.revenue()));
  protected readonly average = computed(() =>
    formatPrice(this.orders.count() ? this.orders.revenue() / this.orders.count() : 0),
  );
  protected readonly cartTotal = computed(() => formatPrice(this.cart.total()));
  protected readonly recent = computed(() => this.orders.orders().slice(0, 5));

  protected readonly week = WEEKLY_SALES;
}
