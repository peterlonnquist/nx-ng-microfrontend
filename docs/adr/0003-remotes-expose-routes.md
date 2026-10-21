---
status: accepted
---

# Remotes exponerar route-moduler, inte en app-komponent

En remote laddas in i shellen antingen som en komponent (`loadComponent`) eller som en route-modul
(`loadChildren`). Vi exponerar route-moduler: varje modul exporterar `routes` med remotens `App` som
rotkomponent och domänens routes som barn, så att remoten äger sina egna undersidor medan shellen bara
monterar ett URL-prefix per domän.

```ts
export const routes: Route[] = [{ path: '', component: App, children: ordersRoutes }];
```

## Övervägda alternativ

- **Exponera `App` som komponent.** Enklast att koppla in, men varje undersida måste då registreras i shellen,
  eller så får remoten sköta sin egen navigering inne i komponenten och tappar djuplänkar, guards,
  resolvers, `title` och bakåtknappen. Providers kan bara ligga på komponentnivå, utan egen environment
  injector, och en remote med flera domäner (ADR 0002) kan inte ge varje domän ett eget prefix.

## Konsekvenser

- Shellen ändras inte när ett team lägger till en sida. Den känner bara till `remote` + exponerad nyckel.
- `App` är fortfarande med som rot i route-trädet, så remotens Tailwind-stilar (`app.css`,
  `ViewEncapsulation.None`) och eventuell gemensam layout följer med.
- Komponenter exponeras bara för det shellen själv placerar ut, alltså widgets via `./widgets`.
