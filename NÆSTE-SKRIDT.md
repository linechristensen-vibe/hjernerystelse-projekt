# Næste skridt (skrevet 14. september 2026)

## Del app er færdig

Knappen "Del app" ligger i toplinjen. Den er gemt og lagt på GitHub Pages:
https://linechristensen-vibe.github.io/hjernerystelse-projekt/

## Sådan arbejder du med Claude Code fra din bærbar

Claude Code kører kun på den computer, du sidder ved. Når din stationære er
slukket, sker der intet derhjemme. Men du kan arbejde videre fra den bærbare:

1. Installér Claude-appen på den bærbare og log ind med samme konto.
2. Installér git. Åbn PowerShell og skriv:
   winget install Git.Git
3. Lav en tom mappe til projektet, åbn en Claude Code-session i den, og skriv:
   "hent https://github.com/linechristensen-vibe/hjernerystelse-projekt"

Så husker Claude alt om projektet, fordi CLAUDE.md ligger i mappen.

Du kan skifte frit mellem de to computere. Det eneste krav: der skal altid laves
commit og push til sidst i en session, så den anden computer kan hente det nyeste.
Det gør Claude allerede efter hver godkendt ændring.

## Wireframe-visning med historik (næste opgave)

Ja, det kan bygges. Claude skal bare have det præcist, før der bygges.

Første spørgsmål til dig: hvad skal "historik" vise? Claudes forslag: en separat
side (fx proces.html), der viser appens skærme som simple wireframes, én række per
version, så man kan bladre fra første udgave til den nyeste. Er det rigtigt forstået,
eller tænker du noget andet?

Start næste session med at svare på det, så fortsætter Claude derfra.
