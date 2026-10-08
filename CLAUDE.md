# MFE Store

Microfrontend PoC: Nx 23 monorepo, Angular 22 (zoneless, standalone, signals), Native Federation, Angular Material 3 + Tailwind 4. One shell plus team-owned remotes, each its own Docker image. Architecture, demos and runbooks: `README.md` (Swedish).

## Working in this repo

- Run every task through Nx (`npx nx <target> <project>`, `npx nx run-many`, `npx nx affected`) and scaffold with Nx generators.
- Respect team boundaries: a remote imports only `@mfe/shared/*`, the domain libs it hosts (`libs/<domain>/*`) and its own code. Domains never import each other, even inside one remote. Remotes talk through shared stores (`@mfe/shared/data-access`), `publishMfeEvent`, or plain router URLs. `nx lint` enforces this via project tags.
- `libs/shared/*` are federated singletons: the shell's copy wins at runtime, so keep their public API backwards compatible.
- In `apps/shell/src/main.ts`, import only `@angular-architects/native-federation` before `initFederation` resolves; Angular loads later via `bootstrap.ts`.
- Remotes run only inside the shell. A remote is a deployment unit per team, not per domain. With one domain it exposes `./routes` from `app.routes.ts`; with several it exposes `./<domain>` from `<domain>.routes.ts` per domain, and the domain code lives in `libs/<domain>/feature`. Every route module exports `routes` (the contract with the shell). Each remote also exposes `./widgets`; its `main.ts` is only the build entry and bootstraps nothing.
- Keep NF's default shared bundling in `federation.config.mjs`; `build: 'package'` races in the cache dir and breaks parallel builds.

## Styling

- A remote's global styles stay behind when it runs in the shell. Its Tailwind utilities ship through `app.css` on its root component `App` (`ViewEncapsulation.None`).
- Every widget component sets `encapsulation: ViewEncapsulation.None` and `styleUrl: '../app.css'`, since it renders outside its team's `App`.
- Tailwind lives in cascade layers and Material does not: override Material with `!`-prefixed utilities (`!w-64`).
- Colours come from Material tokens via `libs/shared/ui/src/styles/tailwind-theme.css` (`bg-surface-container`, `text-on-surface-variant`, …).

## Widgets

A widget id (`orders.recent`) is persisted in saved layouts: treat it as permanent and add a new id for a new widget. Contract: `WidgetDefinition` in `@mfe/shared/ui`; each remote exposes `./widgets`.

## Agent skills

### Issue tracker

Issues live in GitHub Issues for `peterlonnquist/nx-ng-microfrontend`, via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` and `docs/adr/` at the repo root, created lazily. See `docs/agents/domain.md`.
