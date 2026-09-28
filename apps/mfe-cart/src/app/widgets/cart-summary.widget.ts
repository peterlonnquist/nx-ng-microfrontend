import { Component, computed, inject, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CartStore } from '@mfe/shared/data-access';
import { formatPrice } from '@mfe/shared/util';

@Component({
  selector: 'cart-summary-widget',
  imports: [RouterLink, MatButtonModule],
  encapsulation: ViewEncapsulation.None,
  styleUrl: '../remote-entry/remote-styles.css',
  host: { class: 'flex h-full flex-col' },
  template: `
    <div class="text-4xl font-medium tabular-nums">{{ cart.count() }}</div>
    <div class="text-sm text-on-surface-variant">artiklar · {{ total() }}</div>
    <div class="mt-auto pt-4">
      @if (cart.isEmpty()) {
        <a mat-stroked-button routerLink="/products">Börja handla</a>
      } @else {
        <a mat-flat-button routerLink="/cart">Till kassan</a>
      }
    </div>
  `,
})
export class CartSummaryWidget {
  protected readonly cart = inject(CartStore);
  protected readonly total = computed(() => formatPrice(this.cart.total()));
}
