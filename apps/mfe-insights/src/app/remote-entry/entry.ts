import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MfeBoundary } from '@mfe/shared/ui';
import { MFE_INFO } from '../mfe-info';

/** Root component of everything this team exposes. */
@Component({
  selector: 'ins-entry',
  imports: [RouterOutlet, MfeBoundary],
  encapsulation: ViewEncapsulation.None,
  styleUrl: './remote-styles.css',
  template: `
    <mfe-boundary [info]="info" [origin]="origin">
      <router-outlet />
    </mfe-boundary>
  `,
})
export class RemoteEntry {
  protected readonly info = MFE_INFO;
  protected readonly origin = new URL(import.meta.url).origin;
}
