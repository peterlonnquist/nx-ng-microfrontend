# MFE Store

En webbutik byggd av en shell och microfrontends som ägs och släpps av olika team.

## Leverans

**App**:
En del av systemet som byggs och deployas för sig: shellen, en microfrontend eller en backendtjänst.
_Avoid_: modul, projekt (när deploybar enhet avses)

**Release**:
En ny version av en enda app som tas till produktion, oberoende av andra appar.
_Avoid_: systemrelease, gemensam release

**Produktionstagg**:
Markeringen av vilken version av en app som ligger i produktion.
_Avoid_: prod-branch
