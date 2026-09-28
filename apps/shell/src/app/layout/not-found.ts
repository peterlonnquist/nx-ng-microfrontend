import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { EmptyState } from '@mfe/shared/ui';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, MatButtonModule, EmptyState],
  template: `
    <mfe-empty-state heading="Sidan finns inte" icon="explore_off">
      Adressen matchar ingen microfrontend.
      <a actions mat-flat-button routerLink="/">Till översikten</a>
    </mfe-empty-state>
  `,
})
export class NotFound {}
