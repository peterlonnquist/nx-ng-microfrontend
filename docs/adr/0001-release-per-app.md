---
status: accepted
---

# Release per app i monorepot

Vi arbetar enligt git flow med releasebrancher som stabiliseras i test innan produktion, och varje team ska kunna
släppa sin microfrontend utan att vänta på eller ta med andra team. Vi behåller monorepot och låter en release
gälla **en app**: branchen `release/<app>/<version>` tas ut från `develop`, och pipelinen bygger, testar och
deployar bara den app som branchnamnet anger. Övrig kod på branchen följer med i källkoden men byggs aldrig.
Oberoende deploy kommer från att varje app är en egen image, inte från att varje team har ett eget repo.

## Regler

- **Taggar visar produktion.** Varje deploy till produktion taggar `<app>@<version>`. `main` speglar inte längre
  produktion, eftersom en merge av en apps release dit skulle ta med andra teams oreleasade kod.
- **Hotfix från tagg.** `hotfix/<app>/<version>` tas ut från appens senaste produktionstagg och följer samma
  pipeline.
- **Merge tillbaka automatiskt.** Pipelinen öppnar en PR från release- eller hotfixbranchen till `develop`.
- **Shellen först för delade libs.** `libs/shared/*` är federation-singletons där shellens kopia gäller i
  runtime. En remote kör alltså mot den version av de delade libsen som finns i shellen i produktion, inte den
  den byggdes med. Innehåller en release ändringar i delade libs som inte finns i shellens senaste
  produktionstagg, stoppar pipelinen tills någon bekräftat att ändringen är bakåtkompatibel eller att shellen
  släpps först.
- **Shellen följer samma flöde** (`release/shell/<version>`) och ägs av Team Platform.

## Övervägda alternativ

- **Ett repo per team.** Ger branchar och rättigheter per team, men delade libs måste då publiceras och
  versioneras i ett npm-register, ändringar över flera team kräver PR:er i flera repon, och vi förlorar
  `nx affected`, lint-gränserna mellan team och möjligheten att köra allt lokalt med ett kommando. Problemet
  med delade libs försvinner inte, det flyttas bara till npm-versioner.
- **En gemensam releasebranch för hela repot.** Det vi hade. Varje release blir en release av alla appar, så
  team blir beroende av varandras tidplan.
- **Trunk-baserat med taggar, utan releasebrancher.** Minst administration, men kräver att `develop` alltid går
  att släppa. Vi behöver releasebrancher för att stabilisera i test, så det passar oss inte nu.

## Konsekvenser

- Flera releasebrancher kan leva samtidigt, en per app som håller på att släppas. En fix i ett delat lib på en
  apps releasebranch kommer inte med i en annan apps release förrän den mergats till `develop`.
- För att se vad som ligger i produktion läser man taggarna: `git tag -l '*@*' --sort=-v:refname`.
- Testmiljön kör varje app i den version som senast deployades dit, så samtidiga releaser testas tillsammans.
- Exempelpipeline för Jenkins: [tools/jenkins/release.Jenkinsfile](../../tools/jenkins/release.Jenkinsfile).
