import { Component, computed, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserStore } from '@mfe/shared/data-access';
import { PageHeader } from '@mfe/shared/ui';
import { publishMfeEvent, User } from '@mfe/shared/util';

@Component({
  selector: 'prof-profile-page',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    PageHeader,
  ],
  template: `
    <mfe-page-header heading="Profil" subheading="Dina uppgifter och inställningar" />

    <div class="grid gap-6 lg:grid-cols-3">
      <section class="flex flex-col items-center gap-3 rounded-2xl bg-surface-container p-6 text-center">
        <div class="grid h-24 w-24 place-items-center rounded-full bg-primary text-3xl font-medium text-on-primary">
          {{ store.initials() }}
        </div>
        <div class="text-xl">{{ store.user().name }}</div>
        <div class="text-sm text-on-surface-variant">Medlem sedan {{ memberSince() }}</div>
      </section>

      <form [formGroup]="form" (ngSubmit)="save()" class="flex flex-col gap-2 rounded-2xl bg-surface-container p-6 lg:col-span-2">
        <mat-form-field appearance="outline">
          <mat-label>Namn</mat-label>
          <input matInput formControlName="name" autocomplete="name" />
          @if (form.controls.name.hasError('required')) {
            <mat-error>Namn krävs</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>E-post</mat-label>
          <input matInput type="email" formControlName="email" autocomplete="email" />
          @if (form.controls.email.invalid) {
            <mat-error>Ange en giltig e-postadress</mat-error>
          }
        </mat-form-field>

        <mat-slide-toggle formControlName="newsletter">Skicka nyhetsbrev</mat-slide-toggle>

        <div class="mt-4">
          <div class="mb-2 text-sm text-on-surface-variant">Tema</div>
          <mat-button-toggle-group formControlName="darkMode" aria-label="Tema">
            <mat-button-toggle value="system"><mat-icon>contrast</mat-icon> System</mat-button-toggle>
            <mat-button-toggle value="light"><mat-icon>light_mode</mat-icon> Ljust</mat-button-toggle>
            <mat-button-toggle value="dark"><mat-icon>dark_mode</mat-icon> Mörkt</mat-button-toggle>
          </mat-button-toggle-group>
        </div>

        <div class="mt-6 flex justify-end gap-2">
          <button mat-button type="button" (click)="reset()" [disabled]="form.pristine">Ångra</button>
          <button mat-flat-button type="submit" [disabled]="form.invalid || form.pristine">Spara</button>
        </div>
      </form>
    </div>
  `,
})
export class ProfilePage {
  protected readonly store = inject(UserStore);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    newsletter: [false],
    darkMode: ['system' as User['darkMode']],
  });

  protected readonly memberSince = computed(() =>
    new Date(this.store.user().memberSince).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long' }),
  );

  constructor() {
    this.reset();
  }

  protected reset(): void {
    this.form.reset(this.store.user());
  }

  protected save(): void {
    this.store.update(this.form.getRawValue());
    this.form.markAsPristine();
    publishMfeEvent('profile:updated', { name: this.store.user().name });
  }
}
