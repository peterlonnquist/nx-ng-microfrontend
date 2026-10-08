import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MfeBoundary } from '@mfe/shared/ui';
import { MFE_INFO } from './mfe-info';

/**
 * Root of everything this team shows in the shell: the MFE boundary, and the team's Tailwind utilities
 * (app.css, ViewEncapsulation.None), since a remote's global styles never reach the shell.
 */
@Component({
  selector: 'prof-root',
  imports: [RouterOutlet, MfeBoundary],
  encapsulation: ViewEncapsulation.None,
  styleUrl: './app.css',
  template: `
    <mfe-boundary [info]="info" [origin]="origin">
      <router-outlet />
    </mfe-boundary>
  `,
})
export class App {
  protected readonly info = MFE_INFO;
  protected readonly origin = new URL(import.meta.url).origin;
}
