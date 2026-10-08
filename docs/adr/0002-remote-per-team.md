---
status: accepted
---

# En remote per team, inte per domän

Ett team äger ofta flera domäner, och varje remote kostar en image, en OpenShift-deployment, en release att
driva genom Jenkins och en version att hålla reda på i testmiljön. Vi låter därför en remote motsvara det som
behöver släppas oberoende, i praktiken ett team, och inte en domän. Ett team med flera domäner har en remote som
exponerar en route-modul per domän (`./cart`, `./orders`), och domänkoden ligger i `libs/<domän>/feature` med
egen `scope:`-tagg.

## Regler

- **Namn och URL:er efter domän, aldrig efter team.** Remoten heter efter det den gör (`mfe-ordering`), och
  shellen mountar varje domän under domänens egen URL (`/cart`, `/orders`). Team byter namn och ansvar
  oftare än domänerna gör.
- **Dela en remote bara när delarna måste släppas oberoende**, t.ex. för att olika team äger dem eller för
  att släpptakten skiljer sig mycket.
- **Domäner importerar inte varandra**, inte heller inom samma remote. Lint upprätthåller det via
  `scope:`-taggarna; bara remoten får använda alla sina domäner.
- **Widget-id:n följer domänen**, inte remoten, och ändras aldrig när en domän flyttar.

## Övervägda alternativ

- **En remote per domän.** Tydligast gräns, men overhead per domän (deployment, pipeline-körning, version i
  test, en `remoteEntry.json` till vid start) utan att någon behöver släppa domänerna var för sig.
- **En remote per team med domänerna som mappar i appen.** Mindre struktur, men utan lint-gräns mellan
  domänerna, och att flytta en domän till ett annat team kräver att koden flyttas och skrivs om.

## Konsekvenser

- En release av remoten tar med alla dess domäner. Det är avsiktligt: samma team, samma takt.
- Att flytta en domän till en annan remote är billigt: den nya remoten importerar libbet och exponerar dess
  routes, och shellen byter remote-namn i sin route.
