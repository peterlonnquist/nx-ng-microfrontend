import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { CartStore, OrderStore } from '@mfe/shared/data-access';
import { CartPage } from './cart-page';

@Component({ template: '' })
class Stub {}

describe('CartPage', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([{ path: 'orders', component: Stub }])] });
  });

  it('shows an empty state', async () => {
    const fixture = TestBed.createComponent(CartPage);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Varukorgen är tom');
  });

  it('turns the cart into an order on checkout', async () => {
    const cart = TestBed.inject(CartStore);
    const orders = TestBed.inject(OrderStore);
    const before = orders.count();
    cart.add({ id: 'x', name: 'X', description: '', category: 'c', price: 2000, emoji: '📦', rating: 5 });

    const fixture = TestBed.createComponent(CartPage);
    await fixture.whenStable();
    [...(fixture.nativeElement as HTMLElement).querySelectorAll('button')].find((b) => b.textContent?.includes('Till kassan'))?.click();

    expect(orders.count()).toBe(before + 1);
    expect(orders.orders()[0].total).toBe(2000); // free shipping over 999
    expect(cart.isEmpty()).toBe(true);
  });
});
