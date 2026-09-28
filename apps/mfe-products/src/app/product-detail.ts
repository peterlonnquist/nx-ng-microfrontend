import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartStore } from '@mfe/shared/data-access';
import { EmptyState } from '@mfe/shared/ui';
import { formatPrice, publishMfeEvent } from '@mfe/shared/util';
import { CATALOG } from './data/catalog';

@Component({
  selector: 'prod-product-detail',
  imports: [RouterLink, MatButtonModule, MatIconModule, EmptyState],
  template: `
    <a mat-button routerLink="../"><mat-icon>arrow_back</mat-icon> Alla produkter</a>

    @if (product(); as p) {
      <div class="mt-4 grid gap-8 md:grid-cols-2">
        <div class="grid aspect-square place-items-center rounded-3xl bg-surface-container text-[10rem]">{{ p.emoji }}</div>
        <div class="flex flex-col gap-4">
          <span class="text-sm uppercase tracking-wider text-on-surface-variant">{{ p.category }}</span>
          <h1 class="m-0 text-4xl font-normal">{{ p.name }}</h1>
          <div class="flex items-center gap-1 text-on-surface-variant">
            <mat-icon class="text-tertiary">star</mat-icon> {{ p.rating }} / 5
          </div>
          <p class="m-0 text-lg">{{ p.description }}</p>
          <div class="text-3xl font-medium tabular-nums">{{ price(p.price) }}</div>
          <div class="flex items-center gap-3">
            <div class="flex items-center rounded-full bg-surface-container">
              <button mat-icon-button (click)="qty.set(qty() - 1)" [disabled]="qty() <= 1" aria-label="Minska"><mat-icon>remove</mat-icon></button>
              <span class="w-8 text-center tabular-nums">{{ qty() }}</span>
              <button mat-icon-button (click)="qty.set(qty() + 1)" aria-label="Öka"><mat-icon>add</mat-icon></button>
            </div>
            <button mat-flat-button (click)="add()"><mat-icon>add_shopping_cart</mat-icon> Lägg i varukorg</button>
          </div>
        </div>
      </div>
    } @else {
      <mfe-empty-state heading="Produkten finns inte" icon="help_outline" class="mt-4">
        Den kan ha tagits bort ur sortimentet.
      </mfe-empty-state>
    }
  `,
})
export class ProductDetail {
  /** Bound from the route param via withComponentInputBinding(). */
  readonly id = input.required<string>();

  private readonly cart = inject(CartStore);
  protected readonly product = computed(() => CATALOG.find((p) => p.id === this.id()));
  protected readonly qty = signal(1);
  protected readonly price = formatPrice;

  protected add(): void {
    const p = this.product();
    if (!p) return;
    this.cart.add(p, this.qty());
    publishMfeEvent('cart:item-added', { productName: p.name, quantity: this.qty() });
    this.qty.set(1);
  }
}
