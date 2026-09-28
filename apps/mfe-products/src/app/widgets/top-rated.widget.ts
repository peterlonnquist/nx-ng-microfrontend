import { Component, inject, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartStore } from '@mfe/shared/data-access';
import { formatPrice, Product, publishMfeEvent } from '@mfe/shared/util';
import { CATALOG } from '../data/catalog';

@Component({
  selector: 'prod-top-rated-widget',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  encapsulation: ViewEncapsulation.None,
  styleUrl: '../remote-entry/remote-styles.css',
  template: `
    <ul class="m-0 list-none space-y-2 p-0">
      @for (p of top; track p.id) {
        <li class="flex items-center gap-3">
          <span class="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-surface-container-lowest text-2xl">{{ p.emoji }}</span>
          <a [routerLink]="['/products', p.id]" class="min-w-0 flex-1 text-inherit no-underline">
            <div class="truncate font-medium">{{ p.name }}</div>
            <div class="text-xs text-on-surface-variant">★ {{ p.rating }} · {{ price(p.price) }}</div>
          </a>
          <button mat-icon-button (click)="add(p)" [attr.aria-label]="'Köp ' + p.name"><mat-icon>add_shopping_cart</mat-icon></button>
        </li>
      }
    </ul>
  `,
})
export class TopRatedWidget {
  private readonly cart = inject(CartStore);
  protected readonly top = [...CATALOG].sort((a, b) => b.rating - a.rating).slice(0, 3);
  protected readonly price = formatPrice;

  protected add(product: Product): void {
    this.cart.add(product);
    publishMfeEvent('cart:item-added', { productName: product.name, quantity: 1 });
  }
}
