# @mfe/shared/ui

Presentational building blocks and the design system glue shared by every microfrontend.

- `src/lib/*` – small standalone components (`PageHeader`, `StatCard`, `EmptyState`, `MfeBoundary`)
- `src/styles/_theme.scss` – the single Angular Material 3 theme, included by every app's `styles.scss`
- `src/styles/tailwind-theme.css` – maps Tailwind colors to Material's `--mat-sys-*` tokens

Owned by Team Platform. May only depend on `type:util` libs.
