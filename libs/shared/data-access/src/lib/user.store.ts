import { computed, Injectable } from '@angular/core';
import { User } from '@mfe/shared/util';
import { persistedSignal } from './persisted-signal';

@Injectable({ providedIn: 'root' })
export class UserStore {
  private readonly state = persistedSignal<User>('user', {
    id: 'u-1',
    name: 'Alex Andersson',
    email: 'alex@example.com',
    memberSince: '2023-04-01',
    newsletter: true,
    darkMode: 'system',
  });

  readonly user = this.state.asReadonly();
  readonly initials = computed(() =>
    this.state()
      .name.split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
  );

  update(patch: Partial<User>): void {
    this.state.update((u) => ({ ...u, ...patch }));
  }
}
