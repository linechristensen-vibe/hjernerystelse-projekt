// ---------- Navigation ----------
// Skifter mellem siderne. Kun én side er synlig ad gangen.
function visSide(navn) {
  document.querySelectorAll(".side").forEach(function (side) {
    side.hidden = side.id !== "side-" + navn;
  });
  document.querySelectorAll(".fane").forEach(function (fane) {
    fane.classList.toggle("aktiv", fane.dataset.side === navn);
  });
  window.scrollTo(0, 0);
}

document.querySelectorAll(".fane").forEach(function (fane) {
  fane.addEventListener("click", function () {
    visSide(fane.dataset.side);
  });
});

document.getElementById("profil-knap").addEventListener("click", function () {
  visSide("profil");
});

// ---------- Profil ----------
// Profilen gemmes i browseren på telefonen. Intet sendes nogen steder hen.
var PROFIL_NOEGLE = "hovedro-profil";

function hentProfil() {
  try {
    return JSON.parse(localStorage.getItem(PROFIL_NOEGLE)) || {};
  } catch (fejl) {
    return {};
  }
}

function gemProfil(profil) {
  localStorage.setItem(PROFIL_NOEGLE, JSON.stringify(profil));
}

var profilForm = document.getElementById("profil-form");
var laegeValg = document.getElementById("laege-valg");
var laegedatoFelt = document.getElementById("laegedato-felt");
var profilKvittering = document.getElementById("profil-kvittering");

// Ja/nej-knapperne: kun én kan være valgt, og datofeltet vises kun ved "ja"
function saetLaegeValg(vaerdi) {
  laegeValg.querySelectorAll(".valg-knap").forEach(function (knap) {
    knap.classList.toggle("valgt", knap.dataset.vaerdi === vaerdi);
  });
  laegedatoFelt.hidden = vaerdi !== "ja";
}

laegeValg.addEventListener("click", function (hændelse) {
  var knap = hændelse.target.closest(".valg-knap");
  if (knap) saetLaegeValg(knap.dataset.vaerdi);
});

// Fyld formularen med det, der allerede er gemt
function visProfilIFormular() {
  var profil = hentProfil();
  profilForm.navn.value = profil.navn || "";
  profilForm.alder.value = profil.alder || "";
  profilForm.skadedato.value = profil.skadedato || "";
  profilForm.laegedato.value = profil.laegedato || "";
  saetLaegeValg(profil.laege || "");
}

profilForm.addEventListener("submit", function (hændelse) {
  hændelse.preventDefault();
  var valgtKnap = laegeValg.querySelector(".valg-knap.valgt");
  var laege = valgtKnap ? valgtKnap.dataset.vaerdi : "";
  gemProfil({
    navn: profilForm.navn.value.trim(),
    alder: profilForm.alder.value,
    skadedato: profilForm.skadedato.value,
    laege: laege,
    laegedato: laege === "ja" ? profilForm.laegedato.value : ""
  });
  profilKvittering.hidden = false;
  opdaterForside();
});

// ---------- Forsiden ----------
// Antal dage siden hjernerystelsen. Selve dagen tæller som dag 1.
function dagNummer(skadedato) {
  if (!skadedato) return null;
  var skade = new Date(skadedato + "T00:00:00");
  var idag = new Date();
  idag.setHours(0, 0, 0, 0);
  var dage = Math.round((idag - skade) / (1000 * 60 * 60 * 24)) + 1;
  return dage >= 1 ? dage : null;
}

function hilsenEfterTidspunkt() {
  var time = new Date().getHours();
  if (time < 10) return "Godmorgen";
  if (time < 17) return "Goddag";
  return "Godaften";
}

function opdaterForside() {
  var profil = hentProfil();
  document.getElementById("hilsen-tid").textContent = hilsenEfterTidspunkt();
  document.getElementById("hilsen-navn").textContent =
    profil.navn ? "Hej " + profil.navn : "Hej";

  var dag = dagNummer(profil.skadedato);
  document.getElementById("hilsen-dag").textContent = dag
    ? "Dag " + dag + " efter din hjernerystelse"
    : "Udfyld din profil, så appen kan tælle dagene for dig.";

  // Vis om dagens log er udfyldt
  var idag = senesteForDato(datoNoegle());
  document.getElementById("idag-log-status").hidden = !idag;
  document.getElementById("idag-log-knap").textContent = idag ? "Udfyld igen" : "Udfyld dagens log";
}

// Skjul "Gemt" igen, når man begynder at rette i profilen
profilForm.addEventListener("input", function () {
  profilKvittering.hidden = true;
});

// ---------- Symptomlog ----------
// Alle udfyldninger gemmes i browseren som en liste. Flere om dagen er tilladt.
var LOG_NOEGLE = "hovedro-log";

// Skalaen bygger på RPQ (Rivermead): 0 til 4
var SYMPTOM_SKALA = ["Slet ikke", "Lidt", "Moderat", "Meget", "Rigtig meget"];

// Spørgsmålene i den rækkefølge, de stilles. De otte første tæller med i
// symptomniveauet. Søvn og bevægelse er med for overblikkets skyld.
var SPOERGSMAAL = [
  { id: "hovedpine",      titel: "Hovedpine",               tekst: "Hvor meget hovedpine har du haft i dag?",          svar: SYMPTOM_SKALA, symptom: true },
  { id: "svimmelhed",     titel: "Svimmelhed",              tekst: "Hvor svimmel har du været?",                        svar: SYMPTOM_SKALA, symptom: true },
  { id: "kvalme",         titel: "Kvalme",                  tekst: "Hvor meget kvalme har du haft?",                    svar: SYMPTOM_SKALA, symptom: true },
  { id: "traethed",       titel: "Træthed",                 tekst: "Hvor træt har du været?",                           svar: SYMPTOM_SKALA, symptom: true },
  { id: "nakke",          titel: "Nakkesmerter",            tekst: "Hvor ondt har du haft i nakken?",                   svar: SYMPTOM_SKALA, symptom: true },
  { id: "koncentration",  titel: "Koncentration",           tekst: "Hvor svært har du haft ved at koncentrere dig?",    svar: SYMPTOM_SKALA, symptom: true },
  { id: "lys",            titel: "Lysfølsomhed",            tekst: "Hvor generet har du været af lys?",                 svar: SYMPTOM_SKALA, symptom: true },
  { id: "stoej",          titel: "Støjfølsomhed",           tekst: "Hvor generet har du været af lyde?",                svar: SYMPTOM_SKALA, symptom: true },
  { id: "soevn",          titel: "Søvn",                    tekst: "Hvor godt sov du i nat?",                           svar: ["Rigtig dårligt", "Dårligt", "Nogenlunde", "Godt", "Rigtig godt"] },
  { id: "aktivitet",      titel: "Bevægelse",               tekst: "Hvor meget har du bevæget dig i dag?",              svar: ["Slet ikke", "Lidt, fx en kort gåtur", "Moderat", "Meget", "Rigtig meget"] }
];
var ANTAL_TRIN = SPOERGSMAAL.length + 1; // plus medicin til sidst

function hentLog() {
  try {
    return JSON.parse(localStorage.getItem(LOG_NOEGLE)) || [];
  } catch (fejl) {
    return [];
  }
}

function gemLog(liste) {
  localStorage.setItem(LOG_NOEGLE, JSON.stringify(liste));
}

// Dato som "2026-09-13" i lokal tid
function datoNoegle(dato) {
  var d = dato || new Date();
  return d.getFullYear() + "-" +
    String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0");
}

// Seneste udfyldning for en given dato, eller null
function senesteForDato(noegle) {
  var liste = hentLog().filter(function (post) { return post.dato === noegle; });
  return liste.length ? liste[liste.length - 1] : null;
}

// Symptomniveau: summen af de otte symptomer (0 til 32). Ubesvarede tæller som 0.
function symptomNiveau(post) {
  return SPOERGSMAAL.filter(function (s) { return s.symptom; })
    .reduce(function (sum, s) { return sum + (post.svar[s.id] || 0); }, 0);
}

// --- Skemaet, ét spørgsmål ad gangen ---
var logOversigt = document.getElementById("log-oversigt");
var logSkema = document.getElementById("log-skema");
var logKvittering = document.getElementById("log-kvittering");
var logSvar = document.getElementById("log-svar");
var logMedicin = document.getElementById("log-medicin");
var logFaerdig = document.getElementById("log-faerdig");
var logTilbage = document.getElementById("log-tilbage");
var vanligKnap = document.getElementById("vanlig-medicin");

var aktuelPost = null;   // den udfyldning, der er i gang
var aktueltTrin = 0;
var startTidspunkt = 0;

function visLogDel(del) {
  logOversigt.hidden = del !== "oversigt";
  logSkema.hidden = del !== "skema";
  logKvittering.hidden = del !== "kvittering";
  window.scrollTo(0, 0);
}

function startLog() {
  aktuelPost = { dato: datoNoegle(), tidspunkt: new Date().toISOString(), svar: {}, medicin: { panodil: 0, ipren: 0, vanlig: false } };
  aktueltTrin = 0;
  startTidspunkt = Date.now();
  visSide("log");
  visLogDel("skema");
  visTrin();
}

function visTrin() {
  document.getElementById("log-taeller").textContent = (aktueltTrin + 1) + " af " + ANTAL_TRIN;
  logTilbage.hidden = aktueltTrin === 0;
  var erMedicin = aktueltTrin === SPOERGSMAAL.length;

  logSvar.hidden = erMedicin;
  logMedicin.hidden = !erMedicin;
  logFaerdig.textContent = erMedicin ? "Gem" : "Færdig";

  if (erMedicin) {
    document.getElementById("log-spoergsmaal").textContent = "Har du taget medicin i dag?";
    visMedicin();
    return;
  }

  var sp = SPOERGSMAAL[aktueltTrin];
  document.getElementById("log-spoergsmaal").textContent = sp.tekst;
  logSvar.innerHTML = "";
  sp.svar.forEach(function (tekst, vaerdi) {
    var knap = document.createElement("button");
    knap.type = "button";
    knap.className = "svar-knap" + (aktuelPost.svar[sp.id] === vaerdi ? " valgt" : "");
    knap.textContent = tekst;
    knap.addEventListener("click", function () {
      aktuelPost.svar[sp.id] = vaerdi;
      aktueltTrin++;
      visTrin();
    });
    logSvar.appendChild(knap);
  });
}

function visMedicin() {
  document.getElementById("tal-panodil").textContent = aktuelPost.medicin.panodil;
  document.getElementById("tal-ipren").textContent = aktuelPost.medicin.ipren;
  vanligKnap.classList.toggle("valgt", aktuelPost.medicin.vanlig);
}

logMedicin.addEventListener("click", function (hændelse) {
  var knap = hændelse.target.closest(".tael-knap");
  if (!knap) return;
  var navn = knap.dataset.medicin;
  var nyt = aktuelPost.medicin[navn] + Number(knap.dataset.retning);
  aktuelPost.medicin[navn] = Math.max(0, Math.min(12, nyt));
  visMedicin();
});

vanligKnap.addEventListener("click", function () {
  aktuelPost.medicin.vanlig = !aktuelPost.medicin.vanlig;
  visMedicin();
});

logTilbage.addEventListener("click", function () {
  if (aktueltTrin > 0) {
    aktueltTrin--;
    visTrin();
  }
});

// "Færdig" gemmer det, der er svaret indtil nu. Man behøver ikke svare på alt.
logFaerdig.addEventListener("click", function () {
  var liste = hentLog();
  liste.push(aktuelPost);
  gemLog(liste);

  var sekunder = Math.round((Date.now() - startTidspunkt) / 1000);
  document.getElementById("log-tid").textContent = "Det tog " + sekunder + " sekunder.";
  visLogDel("kvittering");
  opdaterLogOversigt();
  opdaterForside();
});

document.getElementById("log-luk").addEventListener("click", function () {
  visLogDel("oversigt");
});

document.getElementById("log-start").addEventListener("click", startLog);
document.getElementById("idag-log-knap").addEventListener("click", startLog);

// --- Oversigten ---
var UGEDAGE = ["S", "M", "T", "O", "T", "F", "L"];

function opdaterLogOversigt() {
  var idag = senesteForDato(datoNoegle());
  document.getElementById("log-status").textContent = idag
    ? "Du har udfyldt loggen i dag. Du kan udfylde den igen, hvis noget har ændret sig."
    : "Du har ikke udfyldt loggen i dag.";
  document.getElementById("log-start").textContent = idag ? "Udfyld igen" : "Udfyld dagens log";

  tegnGraf();

  var seneste = document.getElementById("log-seneste");
  seneste.hidden = !idag;
  if (idag) {
    var liste = document.getElementById("log-svarliste");
    liste.innerHTML = "";
    SPOERGSMAAL.forEach(function (sp) {
      if (idag.svar[sp.id] === undefined) return;
      var li = document.createElement("li");
      li.innerHTML = "<span>" + sp.titel + "</span><span>" + sp.svar[idag.svar[sp.id]] + "</span>";
      liste.appendChild(li);
    });
    var m = idag.medicin;
    var medicinTekst = [];
    if (m.panodil) medicinTekst.push(m.panodil + " Panodil");
    if (m.ipren) medicinTekst.push(m.ipren + " Ipren");
    if (m.vanlig) medicinTekst.push("vanlig medicin");
    var li = document.createElement("li");
    li.innerHTML = "<span>Medicin</span><span>" + (medicinTekst.length ? medicinTekst.join(", ") : "Ingen") + "</span>";
    liste.appendChild(li);
  }
}

// Søjlegraf over de sidste 7 dage. Én farve, tynde søjler, kun dagens tal skrevet på.
function tegnGraf() {
  var svg = document.getElementById("log-graf");
  var bredde = 320, hoejde = 150, top = 24, bund = 26, maks = 32;
  var grafHoejde = hoejde - top - bund;
  var kolonne = bredde / 7;
  var soejleBredde = 18;
  var dele = [];

  // grundlinje
  dele.push('<line x1="0" y1="' + (hoejde - bund) + '" x2="' + bredde + '" y2="' + (hoejde - bund) + '" stroke="#d9d1c4" stroke-width="1"/>');

  for (var i = 6; i >= 0; i--) {
    var dato = new Date();
    dato.setDate(dato.getDate() - i);
    var post = senesteForDato(datoNoegle(dato));
    var x = bredde - (i + 0.5) * kolonne;
    var erIdag = i === 0;

    dele.push('<text x="' + x + '" y="' + (hoejde - 8) + '" text-anchor="middle" font-size="13"' +
      (erIdag ? ' font-weight="600"' : '') + '>' + UGEDAGE[dato.getDay()] + '</text>');

    if (post) {
      var niveau = symptomNiveau(post);
      var h = Math.max(4, (niveau / maks) * grafHoejde);
      var y = hoejde - bund - h;
      dele.push('<rect x="' + (x - soejleBredde / 2) + '" y="' + y + '" width="' + soejleBredde + '" height="' + h +
        '" rx="4" fill="' + (erIdag ? '#4a7565' : '#9dbcae') + '"><title>' + niveau + ' af ' + maks + '</title></rect>');
      if (erIdag) {
        dele.push('<text x="' + x + '" y="' + (y - 8) + '" text-anchor="middle" font-size="14" font-weight="600">' + niveau + '</text>');
      }
    } else {
      // ingen udfyldning den dag: en lille prik på grundlinjen
      dele.push('<circle cx="' + x + '" cy="' + (hoejde - bund) + '" r="3" fill="#d9d1c4"/>');
    }
  }
  svg.innerHTML = dele.join("");
}

visProfilIFormular();
opdaterLogOversigt();
opdaterForside();
