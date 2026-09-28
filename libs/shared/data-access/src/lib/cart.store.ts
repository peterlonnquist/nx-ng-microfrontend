import { computed, Injectable } from '@angular/core';
import { CartItem, Product } from '@mfe/shared/util';
import { persistedSignal } from './persisted-signal';

/**
 * Shopping cart state. Because @mfe/shared/data-access is a mapped path in tsconfig.base.json,
 * Native Federation shares it as a singleton: shell, products and cart all see the same instance.
 */
@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly state = persistedSignal<CartItem[]>('cart', []);

  readonly items = this.state.asReadonly();
  readonly count = computed(() => this.state().reduce((n, i) => n + i.quantity, 0));
  readonly total = computed(() => this.state().reduce((sum, i) => sum + i.quantity * i.product.price, 0));
  readonly isEmpty = computed(() => this.state().length === 0);

  add(product: Product, quantity = 1): void {
    this.state.update((items) => {
      const existing = items.find((i) => i.product.id === product.id);
      return existing
        ? items.map((i) => (i === existing ? { ...i, quantity: i.quantity + quantity } : i))
        : [...items, { product, quantity }];
    });
  }

  setQuantity(productId: string, quantity: number): void {
    this.state.update((items) =>
      quantity <= 0
        ? items.filter((i) => i.product.id !== productId)
        : items.map((i) => (i.product.id === productId ? { ...i, quantity } : i)),
    );
  }

  remove(productId: string): void {
    this.setQuantity(productId, 0);
  }

  clear(): void {
    this.state.set([]);
  }
}
