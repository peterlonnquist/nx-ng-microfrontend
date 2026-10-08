import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CartStore, OrderStore } from '@mfe/shared/data-access';
import { EmptyState, PageHeader } from '@mfe/shared/ui';
import { formatPrice, publishMfeEvent } from '@mfe/shared/util';

const FREE_SHIPPING_FROM = 999;
const SHIPPING = 49;

@Component({
  selector: 'cart-page',
  imports: [RouterLink, MatButtonModule, MatDividerModule, MatIconModule, EmptyState, PageHeader],
  template: `
    <mfe-page-header heading="Varukorg" [subheading]="cart.count() + ' artiklar'" />

    @if (cart.isEmpty()) {
      <mfe-empty-state heading="Varukorgen är tom" icon="remove_shopping_cart">
        Hitta något du gillar bland produkterna.
        <a actions mat-flat-button routerLink="/products">Till produkterna</a>
      </mfe-empty-state>
    } @else {
      <div class="grid gap-6 lg:grid-cols-3">
        <ul class="m-0 list-none space-y-3 p-0 lg:col-span-2">
          @for (item of cart.items(); track item.product.id) {
            <li class="flex items-center gap-4 rounded-2xl bg-surface-container p-4">
              <div class="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-surface-container-lowest text-3xl">
                {{ item.product.emoji }}
              </div>
              <div class="min-w-0 flex-1">
                <div class="truncate font-medium">{{ item.product.name }}</div>
                <div class="text-sm text-on-surface-variant">{{ price(item.product.price) }} / st</div>
              </div>
              <div class="flex items-center">
                <button mat-icon-button (click)="cart.setQuantity(item.product.id, item.quantity - 1)" aria-label="Minska">
                  <mat-icon>remove</mat-icon>
                </button>
                <span class="w-6 text-center tabular-nums">{{ item.quantity }}</span>
                <button mat-icon-button (click)="cart.setQuantity(item.product.id, item.quantity + 1)" aria-label="Öka">
                  <mat-icon>add</mat-icon>
                </button>
              </div>
              <div class="hidden w-24 text-right font-medium tabular-nums sm:block">
                {{ price(item.product.price * item.quantity) }}
              </div>
              <button mat-icon-button (click)="cart.remove(item.product.id)" aria-label="Ta bort"><mat-icon>delete</mat-icon></button>
            </li>
          }
        </ul>

        <aside class="h-fit rounded-2xl bg-surface-container p-5">
          <h2 class="m-0 mb-4 text-lg font-medium">Sammanfattning</h2>
          <dl class="m-0 space-y-2">
            <div class="flex justify-between"><dt>Delsumma</dt><dd class="m-0 tabular-nums">{{ price(cart.total()) }}</dd></div>
            <div class="flex justify-between">
              <dt>Frakt</dt>
              <dd class="m-0 tabular-nums">{{ shipping() === 0 ? 'Fri frakt' : price(shipping()) }}</dd>
            </div>
          </dl>
          @if (shipping() > 0) {
            <p class="mb-0 mt-2 text-xs text-on-surface-variant">Fri frakt över {{ price(freeFrom) }}.</p>
          }
          <mat-divider class="!my-4" />
          <div class="mb-4 flex justify-between text-lg font-medium">
            <span>Totalt</span><span class="tabular-nums">{{ price(grandTotal()) }}</span>
          </div>
          <button mat-flat-button class="w-full" (click)="checkout()"><mat-icon>lock</mat-icon> Till kassan</button>
        </aside>
      </div>
    }
  `,
})
export class CartPage {
  protected readonly cart = inject(CartStore);
  private readonly orders = inject(OrderStore);
  private readonly router = inject(Router);

  protected readonly price = formatPrice;
  protected readonly freeFrom = FREE_SHIPPING_FROM;
  protected readonly shipping = computed(() => (this.cart.total() >= FREE_SHIPPING_FROM ? 0 : SHIPPING));
  protected readonly grandTotal = computed(() => this.cart.total() + this.shipping());

  protected checkout(): void {
    const order = this.orders.place(this.cart.items(), this.grandTotal());
    this.cart.clear();
    publishMfeEvent('order:placed', { orderId: order.id, total: order.total });
    // Cross-MFE navigation goes through the shell's router via plain URLs – no import of another team's code.
    this.router.navigateByUrl('/orders');
  }
}
