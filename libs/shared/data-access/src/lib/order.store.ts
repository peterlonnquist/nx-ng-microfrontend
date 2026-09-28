import { computed, Injectable } from '@angular/core';
import { CartItem, Order, OrderStatus } from '@mfe/shared/util';
import { persistedSignal } from './persisted-signal';

const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();

const SEED: Order[] = [
  {
    id: 'ORD-1001',
    createdAt: daysAgo(12),
    status: 'delivered',
    total: 2498,
    items: [
      {
        quantity: 2,
        product: { id: 'p-1', name: 'Nordic Headphones', description: '', category: 'Audio', price: 1249, emoji: '🎧', rating: 4.6 },
      },
    ],
  },
  {
    id: 'ORD-1002',
    createdAt: daysAgo(3),
    status: 'shipped',
    total: 349,
    items: [
      {
        quantity: 1,
        product: { id: 'p-5', name: 'Fika Mug', description: '', category: 'Home', price: 349, emoji: '☕', rating: 4.9 },
      },
    ],
  },
];

@Injectable({ providedIn: 'root' })
export class OrderStore {
  private readonly state = persistedSignal<Order[]>('orders', SEED);

  readonly orders = computed(() => [...this.state()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  readonly revenue = computed(() => this.state().reduce((sum, o) => sum + o.total, 0));
  readonly count = computed(() => this.state().length);

  place(items: CartItem[], total: number): Order {
    const order: Order = {
      id: `ORD-${1000 + this.state().length + 1}`,
      createdAt: new Date().toISOString(),
      items,
      total,
      status: 'placed',
    };
    this.state.update((orders) => [...orders, order]);
    return order;
  }

  advance(orderId: string): void {
    const flow: OrderStatus[] = ['placed', 'packed', 'shipped', 'delivered'];
    this.state.update((orders) =>
      orders.map((o) =>
        o.id === orderId ? { ...o, status: flow[Math.min(flow.indexOf(o.status) + 1, flow.length - 1)] } : o,
      ),
    );
  }
}
