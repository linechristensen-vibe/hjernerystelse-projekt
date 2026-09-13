# CLAUDE.md

Denne fil er projektets hukommelse. Den læses i starten af hver ny session.

## Ansvaret for denne fil

**Du vedligeholder denne fil. Ikke Line.**

Line skriver ikke i CLAUDE.md og redigerer den ikke. Det er dit ansvar at holde den
opdateret, uden at hun beder om det.

Du opdaterer filen, når:

* en beslutning bliver truffet i chatten (arkitektur, navngivning, hvad appen skal kunne, hvad den bevidst ikke skal kunne)
* en beslutning bliver ændret eller forkastet (så skriv det gamle ud, ikke bare det nye ind)
* en ny fil eller mappe bliver oprettet, som er værd at kende
* noget viser sig at være en fælde, du ville ønske du havde vidst i starten

Regler for opdateringen:

* Rediger filen, når beslutningen falder. Vent ikke til sessionen slutter.
* Sig kort i chatten, hvad du skrev ind, og hvad du fjernede. Aldrig kun hvad du tilføjede.
* Filen skal holdes kort og aktuel. Forældede afsnit slettes, de arkiveres ikke.
* Skriv beslutninger, ikke referat af samtalen.

## Om projektet

Semesterprojekt på et valgfag. En lille web app, der skal kunne bruges af Line og tre
medstuderende, og fremvises til en eksamen. Den udvikles over cirka to til tre måneder
med mange iterationer.

Line er den eneste, der ændrer i koden. De tre andre i studiegruppen er brugere og
giver feedback, de rører ikke filerne.

Appens indhold er endnu ikke fastlagt. Det bliver besluttet i en senere session og
skrevet ind her.

## Sådan arbejder Line

* Svar altid på dansk med rigtige danske bogstaver: æ, ø og å. Aldrig ae, oe eller aa.
* Brug aldrig tankestreger eller bindestreger som tegnsætning. Brug komma, kolon eller parentes.
* Ét skridt ad gangen. Læg ikke fem ting sammen i én omgang. Stop og få hendes accept, før du går videre til næste skridt.
* Stil spørgsmål ét ad gangen. Aldrig en samlet liste af spørgsmål hun skal svare på i ét svar. Det er umuligt for hende at holde styr på.
* Hun er ikke teknisk og læser ikke lange rapporter. Hold afrapportering kort.
* Hun godkender resultatet, ikke mekanikken. Hun vil se, hvad appen gør, ikke læse hvordan koden virker. Forklar kun teknik, hvis hun spørger.
* Giv direkte fagligt modspil. Hvis en idé er dårlig, så sig det og sig hvorfor. Ingen menu af ligeværdige muligheder, hvor du undlader at have en holdning.
* Ret altid årsagen, aldrig symptomet. Ingen lappeløsninger ét sted, når fejlen sidder et andet.
* Ved hver filændring: sig hvad der blev fjernet, ikke kun hvad der blev tilføjet.
* Teksten fra Line er ofte dikteret, så der er stavefejl og forkerte ord. Læs meningen. Er du i tvivl om, hvad hun mener, så stop og spørg i stedet for at gætte.

## Tekniske rammer, som er låst

* **Ren HTML, CSS og JavaScript.** Intet framework. Ikke React, ikke Vue, ikke Next.js, ikke Svelte.
* **Intet byggetrin.** Man skal kunne åbne index.html direkte i en browser og se appen. Ingen npm install, ingen node_modules, ingen bundler, ingen compiler.
* **Ingen backend.** Ingen server, ingen database, ingen API-nøgler.
* **Ingen brugerdata.** Ingen profiler, ingen login, ingen registrering, intet der gemmes centralt. Det brugerne indtaster, bliver i deres egen browser.
* **Få filer.** Hold antallet af filer nede, så Line kan overskue mappen. Del kun op, når en fil bliver uoverskuelig.
* **Ingen afhængigheder udefra**, med mindre Line godkender det udtrykkeligt i chatten.

Foreslå ikke at fravige nogen af disse rammer af hensyn til, hvad der er "bedste praksis"
i et rigtigt produktionsprojekt. Det her er et lille sideprojekt, ikke et produkt.

Hvis en ønsket funktion reelt ikke kan lade sig gøre inden for rammerne, så sig det
tydeligt og forklar hvorfor, før der skrives kode. Byg ikke uden om.

## Git

Projektet skal være under git fra start, så enhver ændring kan rulles tilbage.

* Lav et commit efter hver afsluttet ændring, Line har godkendt.
* Skriv commit-beskeder på dansk og i almindeligt sprog, så hun kan læse historikken og finde tilbage til en version, der virkede.
* Hvis noget går i stykker, så tilbyd at rulle tilbage, før du forsøger at reparere videre oven på det ødelagte.

## Beslutninger

Her skriver du de beslutninger, der er truffet undervejs, nyeste nederst.
Kort, én til to linjer per beslutning.

* Ren statisk webapp uden framework, byggetrin, backend og brugerdata.
* Appen skal kunne deles med studiegruppen via en URL, så de ikke skal have filer tilsendt. Hvordan, er ikke besluttet endnu.

## Åbne punkter

Punkter, der skal afklares med Line, og som du skal huske at tage op, når de bliver
relevante. Slet et punkt herfra, når det er afgjort, og skriv beslutningen ovenfor.

* Hvad appen skal kunne.
* Om brugerfladen skal være på dansk eller engelsk.
* Hvor appen skal ligge, så studiegruppen kan tilgå den.
