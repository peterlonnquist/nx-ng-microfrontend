import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Only used when the microfrontend runs standalone (e.g. `nx serve mfe-products`). */
@Component({
  selector: 'prod-root',
  imports: [RouterOutlet],
  template: `
    <div class="bg-tertiary-container px-4 py-2 text-center text-sm text-on-tertiary-container">
      Running <strong>mfe-products</strong> standalone – start the shell to see it composed with the other microfrontends.
    </div>
    <main class="mx-auto max-w-6xl p-6">
      <router-outlet />
    </main>
  `,
})
export class App {}
