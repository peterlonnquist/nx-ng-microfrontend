import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { EmptyState } from '@mfe/shared/ui';

@Component({
  selector: 'app-remote-unavailable',
  imports: [MatButtonModule, EmptyState],
  template: `
    <mfe-empty-state heading="Den här delen är inte tillgänglig just nu" icon="cloud_off">
      Microfrontenden <code class="rounded bg-surface-container-high px-1.5 py-0.5">{{ remoteName() }}</code>
      kunde inte laddas. Resten av applikationen fungerar som vanligt.
      <button actions mat-flat-button (click)="reload()">Försök igen</button>
    </mfe-empty-state>
  `,
})
export class RemoteUnavailable {
  /** Bound from route data via withComponentInputBinding(). */
  readonly remoteName = input('');

  protected reload(): void {
    location.reload();
  }
}
