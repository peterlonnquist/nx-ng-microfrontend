import { BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { map } from 'rxjs';
import { CartStore, UserStore } from '@mfe/shared/data-access';
import { MfeDevSettings } from '@mfe/shared/ui';
import { formatPrice, onMfeEvent } from '@mfe/shared/util';
import { NAV_ITEMS } from './layout/navigation';

// A full page load, not a router link: the auth in front of the app ends the session and redirects.
// Locally the dev proxy answers it (apps/dev-proxy/proxy/proxy.conf.mjs).
const LOGOUT_URL = '/logout';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  host: { class: 'block h-dvh' },
  template: `
    <mat-sidenav-container class="h-full">
      <mat-sidenav
        #drawer
        [mode]="isHandset() ? 'over' : 'side'"
        [opened]="!isHandset()"
        class="!w-64 !border-0 !bg-surface-container-low"
      >
        <div class="flex h-16 items-center gap-2 px-5 text-lg font-medium">
          <mat-icon class="text-primary">hub</mat-icon> MFE Store
        </div>
        <mat-nav-list>
          @for (item of nav; track item.path) {
            <a
              mat-list-item
              [routerLink]="item.path"
              routerLinkActive
              #rla="routerLinkActive"
              [activated]="rla.isActive"
              [routerLinkActiveOptions]="{ exact: item.path === '/' }"
              (click)="isHandset() && drawer.close()"
            >
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
              <span matListItemLine class="text-xs">{{ item.team }}</span>
            </a>
          }
        </mat-nav-list>
        <div class="px-5 pt-6 text-xs text-on-surface-variant">
          <mat-slide-toggle [checked]="dev.showBoundaries()" (change)="dev.showBoundaries.set($event.checked)">
            Visa MFE-gränser
          </mat-slide-toggle>
        </div>
      </mat-sidenav>

      <mat-sidenav-content class="!bg-surface">
        <mat-toolbar class="sticky top-0 z-10 !bg-surface">
          @if (isHandset()) {
            <button mat-icon-button (click)="drawer.toggle()" aria-label="Meny"><mat-icon>menu</mat-icon></button>
          }
          <span class="text-sm text-on-surface-variant">Shell · Team Platform</span>
          <span class="flex-1"></span>
          <a
            mat-icon-button
            routerLink="/cart"
            [matTooltip]="cartTooltip()"
            aria-label="Varukorg"
          >
            <mat-icon [matBadge]="cart.count()" [matBadgeHidden]="cart.count() === 0" matBadgeSize="small">
              shopping_cart
            </mat-icon>
          </a>
          <button
            type="button"
            class="ml-2 grid h-9 w-9 cursor-pointer place-items-center rounded-full border-0 bg-primary text-sm font-medium text-on-primary"
            [matTooltip]="user.user().name"
            [matMenuTriggerFor]="userMenu"
            aria-label="Användarmeny"
          >
            {{ user.initials() }}
          </button>
          <mat-menu #userMenu="matMenu" xPosition="before">
            <a mat-menu-item routerLink="/profile"><mat-icon>person</mat-icon> Profil</a>
            <a mat-menu-item [href]="logoutUrl"><mat-icon>logout</mat-icon> Logga ut</a>
          </mat-menu>
        </mat-toolbar>

        <main class="mx-auto max-w-6xl px-4 pb-12 pt-2 sm:px-6">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
})
export class App {
  protected readonly nav = NAV_ITEMS;
  protected readonly logoutUrl = LOGOUT_URL;
  protected readonly cart = inject(CartStore);
  protected readonly user = inject(UserStore);
  protected readonly dev = inject(MfeDevSettings);

  protected readonly isHandset = toSignal(
    inject(BreakpointObserver)
      .observe('(max-width: 959px)')
      .pipe(map((r) => r.matches)),
    { initialValue: false },
  );

  protected cartTooltip = () => `${this.cart.count()} artiklar · ${formatPrice(this.cart.total())}`;

  constructor() {
    const snackBar = inject(MatSnackBar);
    const html = inject(DOCUMENT).documentElement;

    // Loose coupling: remotes publish DOM events, the shell decides how to present them.
    const subscriptions = [
      onMfeEvent('cart:item-added', (e) => snackBar.open(`${e.quantity} × ${e.productName} i varukorgen`, 'OK', { duration: 2500 })),
      onMfeEvent('order:placed', (e) => snackBar.open(`Order ${e.orderId} lagd – tack!`, 'OK', { duration: 3500 })),
      onMfeEvent('profile:updated', () => snackBar.open('Profilen sparad', undefined, { duration: 2000 })),
    ];
    inject(DestroyRef).onDestroy(() => subscriptions.forEach((unsubscribe) => unsubscribe()));

    effect(() => {
      const mode = this.user.user().darkMode;
      html.classList.toggle('theme-light', mode === 'light');
      html.classList.toggle('theme-dark', mode === 'dark');
    });
  }
}
