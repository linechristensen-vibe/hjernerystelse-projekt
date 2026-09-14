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

### Hvad appen er

Appen hedder **Hovedro** (foreløbigt, gruppen kan omdøbe den senere). Fravalgt:
Bedring, Pusterum, Klar, Tempo, og alt med "hjerne" i.

En dansk app til voksne (over 18) med hjernerystelse. Der mangler strukturerede forløb
i Danmark, og folk googler sig til svar. Appen samler evidensbaseret viden, en nem
symptomlog og træning ét sted. Det adskiller den fra DCFH's app "Hjernerystelse – din
guide" (79 kr, kun viden og værktøjer). Ankerkilde: den nationale kliniske retningslinje
for hjernerystelse (2021).

**Fire faner i bunden:** I dag, Log, Viden, Træning. Profil bag et ikon øverst til højre.

* **I dag** (forsiden): "Dag X efter din hjernerystelse" (regnet fra profilens dato),
  én stor knap "Udfyld dagens log", et kort råd der passer til fasen (første 48 timer,
  første måned, derefter), og en altid synlig knap "Hvornår skal jeg søge læge?".
* **Log** (symptomlog, bygget): 15 trin, ét spørgsmål per skærm med ikon i farvet
  cirkel og fremgangslinje. Tolv symptomer på RPQ-skalaen 0 til 4 (slet ikke, lidt,
  moderat, meget, rigtig meget): hovedpine, svimmelhed, kvalme, træthed, nakkesmerter
  (ikke i RPQ, Lines ønske), koncentration, lysfølsomhed, støjfølsomhed, irritabilitet,
  nedtrykthed, glemsomhed, synsproblemer. Udeladt fra RPQ: frustration, langsom
  tænkning, rastløshed (overlapper). Derefter søvn og bevægelse (tæller ikke med i
  niveauet). Til sidst medicin: Panodil og Ipren med antal, plus "Jeg har taget min
  vanlige medicin". Ingen "andet"-felt. "Færdig" gemmer når som helst. Flere
  udfyldninger om dagen er tilladt, oversigten bruger den seneste. Symptomniveau =
  sum af de tolv (0 til 48). Kvitteringen viser sekunder brugt. Oversigten: ugestribe
  med flueben, blød kurve over 7 dage (hul ved tomme dage, kun dagens tal skrevet på),
  fire pastelfliser (niveau, søvn, bevægelse, medicin) og "Se alle dagens svar" bag en
  knap. Gemmes i localStorage under "hovedro-log".
* **Testdata (bygget):** to små tekstlinks nederst på forsiden. "Udfyld testdata"
  lægger profil (Test, dag 12), 11 dages log med faldende symptomer og ét hul, og otte
  træninger med stigende niveau ind. "Ryd testdata" sletter alt, appen har gemt
  (alle nøgler, der starter med "hovedro-"). Begge genindlæser siden.
* **Viden (bygget):** Ingen AI. Chatfelt, hvor appen matcher nøgleord mod artiklerne
  (den artikel med flest ord, der matcher, vinder) og viser hele artiklen som svar.
  Intet match giver "Det har jeg ikke noget om". Otte emneknapper åbner artiklen på en
  egen skærm med "Tilbage". Artiklerne ligger i script.js i listen ARTIKLER med id,
  titel, ikon, farve, nøgleord, tekst (HTML-afsnit) og kilde. De otte: søge læge, de
  første dage, skærm og lys, søvn, smertestillende, bevægelse, arbejde/studie, hvor
  længe varer det. Teksterne er UDKAST skrevet konservativt efter DCFH, sundhed.dk og
  retningslinjen, og hver artikel viser "Udkast. Gruppen skal gennemgå teksten mod
  kilderne." Gruppen skriver de endelige tekster. "Hvem kan hjælpe" (egen læge, 112 og
  lægevagt, hjerneskadekoordinator, Hjernerystelsesforeningen, DCFH) og kildelisten
  ligger nederst. Forsidens "Hvornår skal jeg søge læge?" åbner den artikel, og
  "Dagens råd" vælges efter fasen (dag 1 til 2, dag 3 til 30, derefter) og linker til
  en artikel.
* **Træning:** fem kort navngivet efter retningslinjen: Gradueret fysisk aktivitet,
  Balance og svimmelhed, Øjne og samsyn, Hukommelse og koncentration, Ro og åndedræt.
  "Øjne og samsyn" åbner demospillet **Følg prikken** (bygget 13. september 2026 som
  demo, så Line kan se mulighederne): prikken bevæger sig i en blød bane i 30
  sekunder, bliver mørk 5 gange i 1,5 sekund, brugeren trykker på feltet. Resultat:
  træffere af mulige og gennemsnitlig reaktionstid. Gemmes i localStorage under
  "hovedro-traening". Mærket "Demo, ikke gennemgået mod kilderne". De fire andre kort
  er pladsholdere. Balance kan ikke måles i en browser (kræver bevægelsessensor), kun
  instruktioner. Byg ikke flere spil, før gruppen har researchet, hvilke der er
  evidens for.
* **Gamification (bygget, principper fra research):** belønner jævnhed og fornuft,
  aldrig mængde. Ingen streaks, point, ranglister eller "du missede". Øverst på
  Træning: ugestribe mandag til søndag (flueben = trænet, pausetegn = hviledag),
  "3 af 4 denne uge" og ugemål brugeren selv vælger (2 til 5, gemt under
  "hovedro-ugemaal", standard 4). En dag uden træning, hvor dagens symptomniveau er
  24 eller over (af 48), tæller som planlagt pause og viser kortet "I dag: tag det
  roligt". Kortet "Din udvikling": bedste reaktionstid, bedste træfsikkerhed, antal
  træninger, og kurve over reaktionstiden de seneste 10 gange. Kun mod sig selv.
  **Niveauer** i Følg prikken: tre (NIVEAUER i script.js: fart og vindue), næste
  låses op efter 80 % træffere to gange på niveauet før. Valg på introskærmen, låste
  vises grå med forklaring. Resultatet gemmer niveau. **Milepæle** (MILEPAELE i
  script.js): Første træning, 5, 10, 25 træninger, Første fulde uge (huskes under
  "hovedro-fuld-uge"), Niveau 2 og 3 låst op. Vises som lukket fold-ud-liste på
  Træning, og som én rolig linje på resultatskærmen, når noget nyt er nået. Ingen
  pokaler, ingen konfetti. **Hvorfor-tekst** ("Hvad træner det / Hvorfor") står på
  introskærmen til Følg prikken. De fire pladsholdere får det, når de bygges.
* **Profil (bygget):** navn, alder, dato for hjernerystelsen, været til lægen (ja/nej)
  og dato. Gemmes i localStorage under "hovedro-profil". Mørk tilstand kommer her
  senere, når resten af appen er på plads.
* **Del app (bygget 14. september 2026):** knappen "Del app" i toplinjen ved siden af
  profil-ikonet. Åbner en skærm, der fylder hele telefonen: kryds øverst til højre,
  QR-kode til GitHub Pages-adressen, adressen som tekst og "Kopiér link" (kvitterer
  "Link kopieret"). QR-koden er ikke et billede: mønstret ligger som 33 tekstlinjer i
  QR_FELTER i script.js og tegnes som SVG. Mønstret er regnet ud og testet mod en
  QR-læser. Ændres adressen, skal mønstret regnes om (bed Claude om det).

**Fælde:** `hidden` virker ikke på elementer med egne display-regler. Derfor står
`[hidden] { display: none !important; }` øverst i style.css. Lav aldrig display-regler,
der omgår det.

**Udseende og UX-principper** (fra research, se kilderne i appen):
* Dæmpet lys baggrund (aldrig rent hvid), skrift mindst 18 px, ingen animationer.
* Faner har ikon plus tekst. Alle knapper mindst 48 px høje med luft imellem.
* Ét emne per skærm. Loggen er én skærm per spørgsmål med fem store knapper, en
  tæller ("3 af 10") og "Færdig" altid synlig. Mål: hele loggen under 60 sekunder.
* Efter loggen: rolig kvittering ("Gemt. Godt gået.") og en simpel graf over de sidste
  7 dage. Ingen røde advarsler i grafen, kun positiv feedback.
* Forsiden hilser med navn ("Hej Line, dag 4") og viser tydeligt, om dagens log er udfyldt.
* Plain sprog, samme navigation overalt, tydelig kvittering når noget gemmes, intet
  skjult i menuer, intet der kræver at brugeren husker fra én skærm til den næste.
* Ingen push-påmindelser (kræver server).
* Kort ansvarsfraskrivelse ("erstatter ikke lægen") på forsiden.
* Visuel retning (fra Lines inspirationsbilleder, wellness-apps i pastel): varm beige
  baggrund, kort i dæmpede pasteller (grøn, lavendel, fersken, blå), runde hjørner,
  hilsen med navn, ansigtsrække, ugestribe, statistik-fliser. Kun én skrifttype:
  systemets sans serif (ingen serif, ingen Google Fonts). Overskrifter er bare fede. Skru ned i forhold til inspirationen: én illustration per
  skærm, ingen mættede farver (orange, pink), ingen AI-mærkater eller notifikationsklokker.
* Al grafik tegnes selv i SVG (ikoner, enkle flade illustrationer, grafer). Ingen
  billedfiler udefra. Line beslutter senere, om hun vil lave figur-illustrationer med et
  AI-billedværktøj. Appen er et sideprojekt, hold tidsforbruget nede.

**Rækkefølge for bygning:** 1. Skal, 2. Profil, 3. Log, 4. Viden, 5. Træning. Alle fem
er bygget. Prototypen er klar til gruppens feedback. Herfra arbejdes der i dybden ét
sted ad gangen.

**Fælde:** en generel regel som `.knap { width: 100% }` står sent i style.css og
vinder over specifikke klasser med samme vægt. Brug en mere specifik vælger
(fx `.chat-form .chat-knap`), ikke `!important`.

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
* Line følger med i appen i Claudes browserpanel. Start derfor en lokal testserver
  tidligt i hver session og lad den køre hele sessionen (luk den ikke efter test):
  en lille PowerShell HttpListener på port 8765, der serverer projektmappen med
  rigtige content-types for html, css og js. Åbn http://localhost:8765/index.html i
  panelet i telefonstørrelse (mobile). Åbn aldrig filen via file://, panelet viser den
  uden CSS. Python findes ikke på maskinen.
* Afklar før du bygger. Når Line beskriver en ny funktion, så stil spørgsmål (ét ad gangen), indtil du er sikker på, hvad den første udgave skal være. Opsummer den kort, få hendes godkendelse, og byg først derefter. Det sparer iterationer i koden.

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
* Git blev installeret 13. september 2026 med winget. Hvis `git` ikke findes i terminalen, så genindlæs PATH fra systemet først, i stedet for at konkludere at git mangler.

## Beslutninger

Her skriver du de beslutninger, der er truffet undervejs, nyeste nederst.
Kort, én til to linjer per beslutning.

* Ren statisk webapp uden framework, byggetrin, backend og brugerdata.
* Appen ligger på GitHub Pages: https://linechristensen-vibe.github.io/hjernerystelse-projekt/ (repo: github.com/linechristensen-vibe/hjernerystelse-projekt, gren master). Efter hvert godkendt commit køres `git push`, så er URL'en opdateret efter cirka et minut.
* GitHub CLI (gh) er installeret og logget ind som linechristensen-vibe. Handlinger, der lægger noget offentligt, kan blive blokeret af sikkerhedstjekket. Så giv Line kommandoen til at køre selv, med PATH sat først: `$env:Path = "C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;" + $env:Path; ...`

* Appen er på dansk. Målgruppe: voksne over 18 med hjernerystelse.
* Appen designes udelukkende til telefon. Slutbrugeren bruger aldrig computer. Line tester fra computer, så den skal bare ikke gå i stykker på en bred skærm.
* "Coachen" er ikke en AI-chat (umuligt uden backend og API-nøgle). Den er en nøgleordssøgning i gruppens egne danske artikler, pakket ind som chat, plus emneknapper og kildefane.
* **Prototypen er frosset fra 14. september 2026**, hvor den sendes til gruppen. Ingen ændringer i appen, før gruppens feedback er kommet og Line siger til. Næste session starter med at tage feedbacken op, ét punkt ad gangen.

## Åbne punkter

Punkter, der skal afklares med Line, og som du skal huske at tage op, når de bliver
relevante. Slet et punkt herfra, når det er afgjort, og skriv beslutningen ovenfor.

* Hvilket ét af de fem træningsspil der bygges rigtigt (kræver research først).
* "Ugens tjek": det fulde RPQ (16 spørgsmål, om de sidste 7 dage, officiel ordlyd og
  score) som en separat ugentlig udfyldning ved siden af den daglige log. Line og jeg
  er enige om, at det giver mening, men det bygges først, når resten af appen er på
  plads.
* Testdata-linkene på forsiden ("Udfyld testdata" og "Ryd testdata", funktionerne
  udfyldTestdata og rydTestdata i script.js) skal fjernes, når gruppen ikke længere
  skal bruge dem. Line siger til.
