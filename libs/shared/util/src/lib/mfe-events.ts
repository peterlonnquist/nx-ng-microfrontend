/**
 * Loosely coupled, framework-agnostic messaging between microfrontends.
 *
 * Use this when a team only needs to *notify* others (fire and forget).
 * For shared state that several MFEs read, use the stores in @mfe/shared/data-access.
 */
export interface MfeEventMap {
  'cart:item-added': { productName: string; quantity: number };
  'order:placed': { orderId: string; total: number };
  'profile:updated': { name: string };
}

export type MfeEventName = keyof MfeEventMap;

const PREFIX = 'mfe:';

export function publishMfeEvent<K extends MfeEventName>(name: K, detail: MfeEventMap[K]): void {
  window.dispatchEvent(new CustomEvent(PREFIX + name, { detail }));
}

/** Returns an unsubscribe function. */
export function onMfeEvent<K extends MfeEventName>(
  name: K,
  handler: (detail: MfeEventMap[K]) => void,
): () => void {
  const listener = (e: Event) => handler((e as CustomEvent<MfeEventMap[K]>).detail);
  window.addEventListener(PREFIX + name, listener);
  return () => window.removeEventListener(PREFIX + name, listener);
}
