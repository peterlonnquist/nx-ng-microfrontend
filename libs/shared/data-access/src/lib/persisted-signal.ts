import { effect, signal, WritableSignal } from '@angular/core';

/** A signal that is mirrored to localStorage so demo state survives reloads. */
export function persistedSignal<T>(key: string, initial: T): WritableSignal<T> {
  const storageKey = `mfe-demo.${key}`;
  let start = initial;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) start = JSON.parse(raw) as T;
  } catch {
    // storage unavailable – fall back to in-memory state
  }
  const state = signal<T>(start);
  effect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state()));
    } catch {
      // ignore
    }
  });
  return state;
}
