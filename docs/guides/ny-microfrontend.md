# Skapa en ny microfrontend

Steg för steg från tomt repo till en remote som syns i shellen. Exemplet skapar `mfe-reviews` för domänen
recensioner. Följ stegen i ordning och kör kommandona från repots rot.

> **Behövs en ny remote?** En remote är en deploybar enhet per team, inte per domän
> ([ADR 0002](../adr/0002-remote-per-team.md)). Har teamet redan en remote och släpps den nya domänen i samma
> takt, lägg den som en domän där i stället (se README, [En remote, flera domäner](../../README.md#en-remote-flera-domäner)).

## Välj namn och portar

Byt ut värdena i exemplet mot dina. Namn och URL följer **domänen**, aldrig teamet.

| Vad | Exempel | Regel |
| --- | --- | --- |
| Domän / URL | `reviews` → `/reviews` | Domänens namn, engelska, kebab-case |
| App | `mfe-reviews` | `mfe-` + domänen |
| Prefix (selectors) | `rev` | Kort och unikt bland apparna |
| Dev-port | `4204` | Nästa lediga 42xx (se tabellen i README) |
| Docker-port | `8094` | Nästa lediga 80xx |
| Team | `Team Catalog` | Visas bara i UI:t och i CODEOWNERS |

## Steg 1: Generera appen

```bash
npx nx g @nx/angular:application apps/mfe-reviews --prefix=rev --port=4204 \
  --tags="type:app,scope:reviews" --bundler=esbuild --style=scss --zoneless \
  --e2eTestRunner=none --unitTestRunner=vitest-angular
npx nx g @nx/angular:add-linting --projectName=mfe-reviews --projectRoot=apps/mfe-reviews --prefix=rev
npx nx g @angular-architects/native-federation:init --project=mfe-reviews --port=4204 --type=remote
```

Generatorerna formaterar om `nx.json`, `package.json` och andra appars `project.json` utan att ändra något i
sak. Återställ dem så att din ändring bara rör den nya appen:

```bash
git restore nx.json package.json $(git diff --name-only -- 'apps/*/project.json')
```

## Steg 2: Ta bort det som inte behövs

Generatorn skapar en fristående app. En remote körs bara i shellen och behöver varken bootstrap, app-config
eller startsida:

```bash
rm apps/mfe-reviews/src/bootstrap.ts \
   apps/mfe-reviews/src/app/app.config.ts \
   apps/mfe-reviews/src/app/app.html \
   apps/mfe-reviews/src/app/app.scss \
   apps/mfe-reviews/src/app/app.spec.ts \
   apps/mfe-reviews/src/app/nx-welcome.ts
mkdir apps/mfe-reviews/src/app/widgets
```

I `apps/mfe-reviews/src/index.html`, ta bort raden:

```html
    <rev-root></rev-root>
```

## Steg 3: Skriv remotens filer

Skapa eller ersätt filerna nedan med exakt detta innehåll.

### `apps/mfe-reviews/src/main.ts`

Byggets ingång. Den startar ingen Angular-app, den visar bara en hänvisning om någon öppnar remotens port direkt.

```ts
// mfe-reviews only runs inside the shell, which holds the logged-in user's profile and permissions. The shell loads
// what federation.config.mjs exposes (./routes, ./widgets); this file is only the build's entry point and
// what you see when opening this remote's own dev server or container directly.
document.body.innerHTML = `
  <main style="max-width: 32rem; margin: 6rem auto; padding: 0 1rem; text-align: center">
    <h1 style="margin: 0 0 0.75rem; font: var(--mat-sys-headline-small)">mfe-reviews körs bara i shellen</h1>
    <p style="color: var(--mat-sys-on-surface-variant)">
      Starta med <code>npm start</code> och öppna <a href="http://localhost:4200/reviews">localhost:4200/reviews</a>.
    </p>
  </main>`;
```

### `apps/mfe-reviews/src/app/mfe-info.ts`

```ts
import { MfeInfo } from '@mfe/shared/util';

/** Bump `version` and redeploy only this container to demo independent deployments. */
export const MFE_INFO: MfeInfo = {
  name: 'mfe-reviews',
  team: 'Team Catalog',
  version: '1.0.0',
};
```

### `apps/mfe-reviews/src/app/app.ts`

Rot-komponenten för allt remoten visar i shellen: MFE-gränsen och remotens Tailwind-klasser.

```ts
import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MfeBoundary } from '@mfe/shared/ui';
import { MFE_INFO } from './mfe-info';

/**
 * Root of everything this team shows in the shell: the MFE boundary, and the team's Tailwind utilities
 * (app.css, ViewEncapsulation.None), since a remote's global styles never reach the shell.
 */
@Component({
  selector: 'rev-root',
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
```

### `apps/mfe-reviews/src/app/app.css`

```css
/*
 * Tailwind utilities for this microfrontend.
 *
 * A remote's *global* styles (styles.scss) are NOT loaded when it runs inside the shell –
 * only component styles travel with the exposed code. So the root component (App) carries its own utilities
 * (ViewEncapsulation.None). The shell never needs to know which classes a remote uses, which keeps
 * deployments independent.
 */
@layer theme, base, components, utilities;
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/utilities.css' layer(utilities) source(none);
@import '../../../../libs/shared/ui/src/styles/tailwind-theme.css';
@source './';
@source '../../../../libs/shared';
```

### `apps/mfe-reviews/src/app/app.routes.ts`

Exponeras som `./routes`. Exportnamnet `routes` är kontraktet med shellen och får inte ändras. Varje sida
laddas lazy med `loadComponent`.

```ts
import { Route } from '@angular/router';
import { App } from './app';

/** Exposed as `mfe-reviews/./routes` – the shell mounts this under `/reviews`. */
export const routes: Route[] = [
  {
    path: '',
    component: App,
    children: [{ path: '', loadComponent: () => import('./reviews-page').then((m) => m.ReviewsPage) }],
  },
];
```

### `apps/mfe-reviews/src/app/reviews-page.ts`

Domänens första sida. Byt mot er riktiga.

```ts
import { Component } from '@angular/core';
import { PageHeader } from '@mfe/shared/ui';

@Component({
  selector: 'rev-reviews-page',
  imports: [PageHeader],
  template: `
    <mfe-page-header heading="Recensioner" subheading="Vad kunderna tycker" />
    <p class="rounded-2xl bg-surface-container p-6">Inga recensioner ännu.</p>
  `,
})
export class ReviewsPage {}
```

### `apps/mfe-reviews/src/app/reviews-page.spec.ts`

```ts
import { TestBed } from '@angular/core/testing';
import { ReviewsPage } from './reviews-page';

describe('ReviewsPage', () => {
  it('renders the page header', async () => {
    const fixture = TestBed.createComponent(ReviewsPage);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('h1')?.textContent).toContain('Recensioner');
  });
});
```

### `apps/mfe-reviews/src/app/widgets/index.ts`

Exponeras som `./widgets`. Ett widget-id sparas i användarnas layouter: välj ett nytt som börjar med domänen
och byt aldrig namn på det.

```ts
import { WidgetDefinition } from '@mfe/shared/ui';
import { MFE_INFO } from '../mfe-info';

/** Exposed as `mfe-reviews/./widgets`. Ids are persisted in layouts – never rename them. */
export const info = MFE_INFO;
export const origin = new URL(import.meta.url).origin;
export const widgets: WidgetDefinition[] = [
  {
    id: 'reviews.latest',
    title: 'Senaste recensioner',
    description: 'De senaste recensionerna från kunderna.',
    icon: 'reviews',
    defaultSize: { cols: 1, rows: 1 },
    load: () => import('./latest-reviews.widget').then((m) => m.LatestReviewsWidget),
  },
];
```

### `apps/mfe-reviews/src/app/widgets/latest-reviews.widget.ts`

En widget renderas utanför remotens `App` och måste därför själv ha `styleUrl: '../app.css'` och
`ViewEncapsulation.None`, annars saknas Tailwind-klasserna.

```ts
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'rev-latest-reviews-widget',
  encapsulation: ViewEncapsulation.None,
  styleUrl: '../app.css',
  template: `<p class="m-0 text-sm text-on-surface-variant">Inga recensioner ännu.</p>`,
})
export class LatestReviewsWidget {}
```

## Steg 4: Federation

### `apps/mfe-reviews/federation.config.mjs`

Ersätt hela filen. Jämfört med generatorns version exponeras `./routes` och `./widgets` i stället för
`./Component`, och `build: 'package'` är borttaget eftersom det gör parallella byggen instabila.

```js
import { withNativeFederation, fromPackageJson } from '@angular-architects/native-federation/config';

export default withNativeFederation({
  name: 'mfe-reviews',

  exposes: {
    './routes': './apps/mfe-reviews/src/app/app.routes.ts',
    './widgets': './apps/mfe-reviews/src/app/widgets/index.ts',
  },

  shared: fromPackageJson({ singleton: true, strictVersion: true, requiredVersion: 'auto' })
    // includeSecondaries is an opt-out of ignoreUnusedDeps, so all of
    // @angular/core is shared to prevent mismatches.
    .patch(['@angular/core'], { includeSecondaries: { keepAll: true } }),

  skip: ['rxjs/ajax', 'rxjs/fetch', 'rxjs/testing', 'rxjs/webSocket'],

  features: {
    // Opt-in: groups chunks in remoteEntry.json for smaller metadata file
    denseChunking: true,
  },
});
```

## Steg 5: `apps/mfe-reviews/project.json`

Tre ändringar.

**`targets.serve`:** shellen laddas om när remoten byggs om. Lägg till `continuous` och `buildNotifications`:

```json
"serve": {
  "executor": "@angular-architects/native-federation:build",
  "continuous": true,
  "options": {
    "target": "mfe-reviews:serve-original:development",
    "tsConfig": "apps/mfe-reviews/tsconfig.federation.json",
    "rebuildDelay": 500,
    "cacheExternalArtifacts": true,
    "dev": true,
    "devServer": true,
    "port": 0,
    "buildNotifications": { "enable": true }
  }
},
```

**`targets.test.options`:** testerna byggs med appens esbuild-konfiguration:

```json
"test": {
  "executor": "@angular/build:unit-test",
  "options": {
    "buildTarget": "mfe-reviews:esbuild:development",
    "tsConfig": "apps/mfe-reviews/tsconfig.spec.json",
    "watch": false
  }
},
```

**`targets.esbuild.configurations.production.budgets`:** `app.css` med Tailwind är redan cirka 5 kB och växer
med varje klass remoten använder, så generatorns gränser räcker inte:

```json
"budgets": [
  { "type": "initial", "maximumWarning": "1mb", "maximumError": "2mb" },
  { "type": "anyComponentStyle", "maximumWarning": "40kb", "maximumError": "80kb" }
],
```

## Steg 6: Koppla in remoten i shellen

**`apps/shell/public/federation.manifest.json`:** lägg till en rad med remotens namn och dev-port:

```json
"mfe-reviews": "http://localhost:4204/remoteEntry.json"
```

**`apps/shell/src/app/app.routes.ts`:** lägg till en route före `'**'`:

```ts
{ path: 'reviews', loadChildren: loadRemoteRoutes('mfe-reviews') },
```

**`apps/shell/src/app/layout/navigation.ts`:** lägg till en menypost i `NAV_ITEMS`, före `/admin`:

```ts
{ path: '/reviews', label: 'Recensioner', icon: 'reviews', team: 'Team Catalog' },
```

## Steg 7: Lint, Docker och ägarskap

**`eslint.config.mjs`:** lägg till en regel i `depConstraints`, så att remoten bara får använda delade libs och
sin egen kod:

```js
{ sourceTag: "scope:reviews", onlyDependOnLibsWithTags: ["scope:shared", "scope:reviews"] },
```

**`docker-compose.yml`:** lägg till en tjänst bland de andra remotes:

```yaml
  mfe-reviews:
    <<: *web
    build: { <<: *web-build, args: { APP: mfe-reviews } }
    image: mfe-store/mfe-reviews:latest
    ports: ['8094:80']
```

och under `shell.environment`:

```yaml
      MFE_REMOTE_MFE_REVIEWS: ${MFE_REVIEWS_URL:-http://localhost:8094/remoteEntry.json}
```

**`.github/CODEOWNERS`:**

```text
/apps/mfe-reviews/      @your-org/team-catalog
```

**`README.md`:** lägg till remoten i tabellen under *Team och appar*.

## Steg 8: Kontrollera

```bash
npx nx run-many -t build lint test -p mfe-reviews shell
npm start
```

Öppna <http://localhost:4200> och kontrollera att:

- **Recensioner** finns i menyn och `/reviews` visar sidan, inom en MFE-gräns märkt `mfe-reviews · v1.0.0`
  (slå på *Visa MFE-gränser*).
- Widgeten **Senaste recensioner** finns i katalogen på `/admin`.
- <http://localhost:4204> visar "mfe-reviews körs bara i shellen".

## Steg 9: Release

Remoten släpps för sig, som alla appar ([ADR 0001](../adr/0001-release-per-app.md)). Ta ut
`release/mfe-reviews/1.0.0` från `develop` så bygger och deployar release-pipelinen bara den. Shellen behöver
släppas med de nya raderna i `app.routes.ts` och `navigation.ts` för att remoten ska synas, och miljöns
federation-manifest måste peka på remotens URL.
