import { TestBed } from '@angular/core/testing';
import { OrderList } from './order-list';

describe('OrderList', () => {
  beforeEach(() => localStorage.clear());

  it('renders seeded orders', async () => {
    const fixture = TestBed.createComponent(OrderList);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelectorAll('tr[mat-row]').length).toBe(2);
  });
});
