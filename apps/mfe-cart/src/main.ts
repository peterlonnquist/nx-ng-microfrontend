// mfe-cart only runs inside the shell, which holds the logged-in user's profile and permissions. The shell loads
// what federation.config.mjs exposes (./routes, ./widgets); this file is only the build's entry point and
// what you see when opening this remote's own dev server or container directly.
document.body.innerHTML = `
  <main style="max-width: 32rem; margin: 6rem auto; padding: 0 1rem; text-align: center">
    <h1 style="margin: 0 0 0.75rem; font: var(--mat-sys-headline-small)">mfe-cart körs bara i shellen</h1>
    <p style="color: var(--mat-sys-on-surface-variant)">
      Starta med <code>npm start</code> och öppna <a href="http://localhost:4200/cart">localhost:4200/cart</a>.
    </p>
  </main>`;
