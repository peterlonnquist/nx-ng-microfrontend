import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CartStore } from '@mfe/shared/data-access';
import { EmptyState, PageHeader } from '@mfe/shared/ui';
import { formatPrice, Product, publishMfeEvent } from '@mfe/shared/util';
import { CATALOG } from './data/catalog';

@Component({
  selector: 'prod-product-list',
  imports: [
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    EmptyState,
    PageHeader,
  ],
  template: `
    <mfe-page-header heading="Produkter" [subheading]="filtered().length + ' av ' + products.length + ' produkter'">
      <mat-form-field appearance="outline" subscriptSizing="dynamic" class="w-full sm:w-72">
        <mat-icon matPrefix>search</mat-icon>
        <input matInput placeholder="Sök produkt" [ngModel]="query()" (ngModelChange)="query.set($event)" />
      </mat-form-field>
    </mfe-page-header>

    <mat-chip-listbox class="mb-6 block" aria-label="Kategori" [value]="category()" (change)="category.set($event.value ?? 'Alla')">
      @for (c of categories; track c) {
        <mat-chip-option [value]="c">{{ c }}</mat-chip-option>
      }
    </mat-chip-listbox>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      @for (p of filtered(); track p.id) {
        <article class="flex flex-col rounded-2xl bg-surface-container p-5 transition hover:bg-surface-container-high">
          <a [routerLink]="['./', p.id]" class="flex flex-1 flex-col text-inherit no-underline">
            <div class="mb-4 grid h-32 place-items-center rounded-xl bg-surface-container-lowest text-6xl">{{ p.emoji }}</div>
            <span class="text-xs uppercase tracking-wider text-on-surface-variant">{{ p.category }}</span>
            <h2 class="m-0 mt-1 text-lg font-medium">{{ p.name }}</h2>
            <p class="m-0 mt-1 line-clamp-2 flex-1 text-sm text-on-surface-variant">{{ p.description }}</p>
          </a>
          <div class="mt-4 flex items-center justify-between">
            <span class="text-lg font-medium tabular-nums">{{ price(p.price) }}</span>
            <button mat-flat-button (click)="add(p)"><mat-icon>add_shopping_cart</mat-icon> Köp</button>
          </div>
        </article>
      } @empty {
        <mfe-empty-state heading="Inga träffar" icon="search_off" class="sm:col-span-2 lg:col-span-3">
          Prova en annan sökning eller kategori.
        </mfe-empty-state>
      }
    </div>
  `,
})
export class ProductList {
  private readonly cart = inject(CartStore);

  protected readonly products = CATALOG;
  protected readonly categories = ['Alla', ...new Set(CATALOG.map((p) => p.category))];
  protected readonly query = signal('');
  protected readonly category = signal('Alla');
  protected readonly price = formatPrice;

  protected readonly filtered = computed(() => {
    const q = this.query().toLowerCase().trim();
    const c = this.category();
    return this.products.filter(
      (p) => (c === 'Alla' || p.category === c) && (!q || p.name.toLowerCase().includes(q)),
    );
  });

  protected add(product: Product): void {
    this.cart.add(product);
    publishMfeEvent('cart:item-added', { productName: product.name, quantity: 1 });
  }
}
