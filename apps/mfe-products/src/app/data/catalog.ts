import { Product } from '@mfe/shared/util';

/** Owned by Team Catalog. In a real system this would be an API call. */
export const CATALOG: Product[] = [
  { id: 'p-1', name: 'Nordic Headphones', category: 'Audio', price: 1249, emoji: '🎧', rating: 4.6, description: 'Trådlösa hörlurar med brusreducering och 30 timmars batteritid.' },
  { id: 'p-2', name: 'Fjäll Backpack', category: 'Outdoor', price: 899, emoji: '🎒', rating: 4.4, description: 'Vattentålig ryggsäck på 24 liter med laptopfack.' },
  { id: 'p-3', name: 'Smart Lamp', category: 'Home', price: 499, emoji: '💡', rating: 4.1, description: 'Dimbar lampa med app-styrning och 16 miljoner färger.' },
  { id: 'p-4', name: 'Trail Runners', category: 'Outdoor', price: 1399, emoji: '👟', rating: 4.7, description: 'Lätta terrängskor med grepp för blöta stigar.' },
  { id: 'p-5', name: 'Fika Mug', category: 'Home', price: 349, emoji: '☕', rating: 4.9, description: 'Handgjord keramikmugg, 35 cl. Tål diskmaskin.' },
  { id: 'p-6', name: 'Pocket Speaker', category: 'Audio', price: 699, emoji: '🔊', rating: 4.3, description: 'Kompakt bluetooth-högtalare, IP67-klassad.' },
  { id: 'p-7', name: 'Mechanical Keyboard', category: 'Tech', price: 1599, emoji: '⌨️', rating: 4.8, description: 'Tyst mekaniskt tangentbord med svensk layout.' },
  { id: 'p-8', name: 'Desk Plant', category: 'Home', price: 229, emoji: '🪴', rating: 4.5, description: 'Lättskött grön växt som klarar kontorsljus.' },
  { id: 'p-9', name: 'USB-C Hub', category: 'Tech', price: 549, emoji: '🔌', rating: 4.2, description: '7-i-1 hub med HDMI, SD-läsare och 100 W laddning.' },
];
