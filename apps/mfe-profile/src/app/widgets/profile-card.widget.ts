import { Component, inject, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { UserStore } from '@mfe/shared/data-access';

@Component({
  selector: 'prof-profile-card-widget',
  imports: [RouterLink, MatButtonModule],
  encapsulation: ViewEncapsulation.None,
  styleUrl: '../app.css',
  host: { class: 'flex h-full flex-col items-start' },
  template: `
    <div class="flex items-center gap-3">
      <div class="grid h-12 w-12 place-items-center rounded-full bg-primary font-medium text-on-primary">
        {{ store.initials() }}
      </div>
      <div class="min-w-0">
        <div class="truncate font-medium">{{ store.user().name }}</div>
        <div class="truncate text-sm text-on-surface-variant">{{ store.user().email }}</div>
      </div>
    </div>
    <a mat-button routerLink="/profile" class="!mt-auto">Redigera profil</a>
  `,
})
export class ProfileCardWidget {
  protected readonly store = inject(UserStore);
}
