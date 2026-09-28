/**
 * Domain contracts shared across all microfrontends.
 * Changing these is a cross-team change – keep them small and additive.
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  emoji: string;
  rating: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'placed' | 'packed' | 'shipped' | 'delivered';

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
}

export interface User {
  id: string;
  name: string;
  email: string;
  memberSince: string;
  newsletter: boolean;
  darkMode: 'system' | 'light' | 'dark';
}

/** Metadata each microfrontend publishes about itself (shown in the UI to visualise boundaries). */
export interface MfeInfo {
  name: string;
  team: string;
  version: string;
}
