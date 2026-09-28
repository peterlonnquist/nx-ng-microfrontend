import { Injectable, signal } from '@angular/core';

/** Demo-only settings that the shell toggles and every microfrontend reads. */
@Injectable({ providedIn: 'root' })
export class MfeDevSettings {
  readonly showBoundaries = signal(true);
}
