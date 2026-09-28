export interface NavItem {
  path: string;
  label: string;
  icon: string;
  team: string;
}

export const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Översikt', icon: 'dashboard', team: 'Team Platform' },
  { path: '/insights', label: 'Insikter', icon: 'insights', team: 'Team Insights' },
  { path: '/products', label: 'Produkter', icon: 'storefront', team: 'Team Catalog' },
  { path: '/cart', label: 'Varukorg', icon: 'shopping_cart', team: 'Team Checkout' },
  { path: '/orders', label: 'Ordrar', icon: 'receipt_long', team: 'Team Fulfillment' },
  { path: '/profile', label: 'Profil', icon: 'person', team: 'Team Identity' },
  { path: '/admin', label: 'Anpassa översikt', icon: 'dashboard_customize', team: 'Team Platform · Admin' },
];
