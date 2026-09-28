import { TestBed } from '@angular/core/testing';
import { Product } from '@mfe/shared/util';
import { CartStore } from './cart.store';

const product: Product = { id: 'p', name: 'P', description: '', category: 'c', price: 100, emoji: '📦', rating: 5 };

describe('CartStore', () => {
  beforeEach(() => localStorage.clear());

  it('adds and aggregates items', () => {
    const store = TestBed.inject(CartStore);
    store.add(product);
    store.add(product, 2);
    expect(store.count()).toBe(3);
    expect(store.total()).toBe(300);
  });

  it('removes when quantity reaches zero', () => {
    const store = TestBed.inject(CartStore);
    store.add(product);
    store.setQuantity('p', 0);
    expect(store.isEmpty()).toBe(true);
  });
});
