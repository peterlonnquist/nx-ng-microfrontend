import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { devUserCookie, readDevUserCookie, redirectTarget, users } from './dev-session';

@Component({
  selector: 'dev-root',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <main class="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-12">
      <header>
        <h1 class="m-0 text-3xl font-normal">Dev-inloggning</h1>
        <p class="text-on-surface-variant">
          Välj användare. Dev-proxyn lägger på användarens <code>Authorization</code> och
          <code>X-Custom-Info</code> på alla <code>/api</code>- och <code>/gateway</code>-anrop i den här webbläsaren.
        </p>
      </header>

      <ul class="m-0 flex list-none flex-col gap-3 p-0">
        @for (user of users; track user.name) {
          @let current = user.name === cookieUser();
          <li
            class="flex items-center gap-4 rounded-2xl p-4"
            [class]="current ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container'"
          >
            <div class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary text-xl text-on-primary">
              {{ user.name.charAt(0).toUpperCase() }}
            </div>
            <div class="flex min-w-0 grow flex-col gap-1">
              <div class="text-lg">
                {{ user.name }}
                @if (current) {
                  <span class="text-sm opacity-80">· inloggad</span>
                }
              </div>
              <div class="flex flex-wrap gap-2">
                @for (entry of infoEntries(user.info); track entry[0]) {
                  <span class="rounded-full bg-surface-container-highest px-2 py-0.5 text-xs text-on-surface-variant">
                    {{ entry[0] }}: {{ entry[1] }}
                  </span>
                }
              </div>
            </div>
            <button mat-flat-button class="shrink-0" (click)="login(user.name)">Logga in</button>
          </li>
        }
      </ul>

      <footer class="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant">
        <button mat-stroked-button [disabled]="!cookieUser()" (click)="logout()">
          <mat-icon>logout</mat-icon> Logga ut
        </button>
        <span>Efter val skickas du till <code>{{ redirectTo }}</code>.</span>
      </footer>
    </main>
  `,
})
export class App {
  private readonly document = inject(DOCUMENT);

  protected readonly users = users;
  protected readonly redirectTo = redirectTarget(this.document.location.search);
  protected readonly cookieUser = signal(readDevUserCookie(this.document.cookie));

  protected infoEntries(info: Record<string, string>): [string, string][] {
    return Object.entries(info);
  }

  protected login(name: string): void {
    this.document.cookie = devUserCookie(name);
    this.document.location.assign(this.redirectTo);
  }

  /** Stays here: every dev server would redirect straight back without a dev user. */
  protected logout(): void {
    this.document.cookie = devUserCookie(undefined);
    this.cookieUser.set(undefined);
  }
}
