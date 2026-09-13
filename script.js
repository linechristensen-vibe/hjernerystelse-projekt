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
  opdaterRaad();
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

// Små ikoner til hvert trin, så man kan se, at skærmen har skiftet
var S = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
var IKONER = {
  hovedpine:     '<svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="7" ' + S + '/><path d="M12 2v3M5 5l2 2M19 5l-2 2" ' + S + '/></svg>',
  svimmelhed:    '<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 1-9 9" ' + S + '/><path d="M12 8a4 4 0 1 1-4 4" ' + S + '/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>',
  kvalme:        '<svg viewBox="0 0 24 24"><path d="M3 8c3-3 6-3 9 0s6 3 9 0M3 13c3-3 6-3 9 0s6 3 9 0M3 18c3-3 6-3 9 0s6 3 9 0" ' + S + '/></svg>',
  traethed:      '<svg viewBox="0 0 24 24"><rect x="3" y="8" width="16" height="9" rx="2" ' + S + '/><path d="M21 11v3M6 11v3" ' + S + '/></svg>',
  nakke:         '<svg viewBox="0 0 24 24"><circle cx="12" cy="6" r="3" ' + S + '/><path d="M10 9v4M14 9v4M4 20c0-4 3-7 8-7s8 3 8 7" ' + S + '/></svg>',
  koncentration: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" ' + S + '/><circle cx="12" cy="12" r="5" ' + S + '/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>',
  lys:           '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" ' + S + '/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" ' + S + '/></svg>',
  stoej:         '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9z" ' + S + '/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" ' + S + '/></svg>',
  irritabel:     '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" ' + S + '/><path d="M8 15c1-1 2-1.5 4-1.5s3 .5 4 1.5M8 9l3 1.5M16 9l-3 1.5" ' + S + '/></svg>',
  trist:         '<svg viewBox="0 0 24 24"><path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z" ' + S + '/></svg>',
  glemsom:       '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" ' + S + '/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.7" ' + S + '/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg>',
  syn:           '<svg viewBox="0 0 24 24"><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z" ' + S + '/><circle cx="12" cy="12" r="3" ' + S + '/><path d="M4 4l16 16" ' + S + '/></svg>',
  soevn:         '<svg viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" ' + S + '/><path d="M17 3l.5 1.5L19 5l-1.5.5L17 7l-.5-1.5L15 5l1.5-.5z" fill="currentColor"/></svg>',
  aktivitet:     '<svg viewBox="0 0 24 24"><circle cx="13" cy="4" r="2" ' + S + '/><path d="M8 21l3-7-2-3-4 3M11 14l3 2 2 5M9 11l3-3 3 2 3-1" ' + S + '/></svg>',
  medicin:       '<svg viewBox="0 0 24 24"><rect x="3" y="9" width="18" height="7" rx="3.5" transform="rotate(-45 12 12)" ' + S + '/><path d="M9.5 9.5l5 5" ' + S + '/></svg>',
  advarsel:      '<svg viewBox="0 0 24 24"><path d="M12 3l10 18H2z" ' + S + '/><path d="M12 10v5" ' + S + '/><circle cx="12" cy="18" r="1" fill="currentColor"/></svg>'
};
var IKON_FARVER = ["#e3ede6", "#e8e3f0", "#f6e4dc", "#e0e8ef"];

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
  { id: "irritabel",      titel: "Irritabilitet",           tekst: "Hvor irritabel eller kort for hovedet har du været?", svar: SYMPTOM_SKALA, symptom: true },
  { id: "trist",          titel: "Nedtrykthed",             tekst: "Hvor trist eller nedtrykt har du været?",           svar: SYMPTOM_SKALA, symptom: true },
  { id: "glemsom",        titel: "Glemsomhed",              tekst: "Hvor glemsom har du været?",                        svar: SYMPTOM_SKALA, symptom: true },
  { id: "syn",            titel: "Synsproblemer",           tekst: "Hvor meget har du set sløret eller dobbelt?",       svar: SYMPTOM_SKALA, symptom: true },
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
  document.getElementById("log-fremgang").style.width = ((aktueltTrin + 1) / ANTAL_TRIN * 100) + "%";
  logTilbage.hidden = aktueltTrin === 0;
  var erMedicin = aktueltTrin === SPOERGSMAAL.length;

  logSvar.hidden = erMedicin;
  logMedicin.hidden = !erMedicin;
  logFaerdig.textContent = erMedicin ? "Gem" : "Færdig";

  // Ikonet og cirklens farve skifter for hvert trin
  var ikonNavn = erMedicin ? "medicin" : SPOERGSMAAL[aktueltTrin].id;
  var ikon = document.getElementById("log-ikon");
  ikon.innerHTML = IKONER[ikonNavn];
  ikon.style.background = IKON_FARVER[aktueltTrin % IKON_FARVER.length];

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
var MAKS_NIVEAU = SPOERGSMAAL.filter(function (s) { return s.symptom; }).length * 4;

// De sidste 7 dage som liste af { dato, noegle, post, erIdag }, ældste først
function sidste7Dage() {
  var dage = [];
  for (var i = 6; i >= 0; i--) {
    var dato = new Date();
    dato.setDate(dato.getDate() - i);
    var noegle = datoNoegle(dato);
    dage.push({ dato: dato, noegle: noegle, post: senesteForDato(noegle), erIdag: i === 0 });
  }
  return dage;
}

function opdaterLogOversigt() {
  var idag = senesteForDato(datoNoegle());
  document.getElementById("log-status").textContent = idag
    ? "Du har udfyldt loggen i dag. Du kan udfylde den igen, hvis noget har ændret sig."
    : "Du har ikke udfyldt loggen i dag.";
  document.getElementById("log-start").textContent = idag ? "Udfyld igen" : "Udfyld dagens log";

  tegnUge();
  tegnGraf();
  visFliser(idag);

  var seneste = document.getElementById("log-seneste");
  document.getElementById("log-vis-svar").hidden = !idag;
  seneste.hidden = true;
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

// Ugestriben: syv cirkler, flueben på udfyldte dage, i dag fremhævet
function tegnUge() {
  var flueben = '<svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.getElementById("log-uge").innerHTML = sidste7Dage().map(function (d) {
    return '<div class="uge-dag' + (d.post ? ' udfyldt' : '') + (d.erIdag ? ' idag' : '') + '">' +
      '<span>' + UGEDAGE[d.dato.getDay()] + '</span>' +
      '<div class="uge-cirkel">' + (d.post ? flueben : '') + '</div>' +
      '</div>';
  }).join("");
}

// Blød kurve over symptomniveauet de sidste 7 dage. Én farve, kun dagens tal skrevet på.
function tegnGraf() {
  var svg = document.getElementById("log-graf");
  var bredde = 320, hoejde = 140, top = 26, bund = 26;
  var grafHoejde = hoejde - top - bund;
  var kolonne = bredde / 7;
  var dele = [];

  var punkter = sidste7Dage().map(function (d, i) {
    var niveau = d.post ? symptomNiveau(d.post) : null;
    return {
      x: (i + 0.5) * kolonne,
      y: niveau === null ? null : hoejde - bund - (niveau / MAKS_NIVEAU) * grafHoejde,
      niveau: niveau,
      bogstav: UGEDAGE[d.dato.getDay()],
      erIdag: d.erIdag
    };
  });

  // grundlinje
  dele.push('<line x1="0" y1="' + (hoejde - bund) + '" x2="' + bredde + '" y2="' + (hoejde - bund) + '" stroke="#cfd9e2" stroke-width="1"/>');

  // Kurven tegnes kun mellem dage, der ligger lige efter hinanden og begge er
  // udfyldt. En tom dag giver et hul, så man kan se, at der mangler en udfyldning.
  var stykker = [];
  var aktuelt = [];
  punkter.forEach(function (p) {
    if (p.y === null) {
      if (aktuelt.length) stykker.push(aktuelt);
      aktuelt = [];
    } else {
      aktuelt.push(p);
    }
  });
  if (aktuelt.length) stykker.push(aktuelt);

  stykker.forEach(function (stykke) {
    if (stykke.length < 2) return;
    var linje = "M" + stykke[0].x + " " + stykke[0].y;
    for (var i = 1; i < stykke.length; i++) {
      var a = stykke[i - 1], b = stykke[i];
      var midt = (a.x + b.x) / 2;
      linje += " C" + midt + " " + a.y + ", " + midt + " " + b.y + ", " + b.x + " " + b.y;
    }
    var flade = linje + " L" + stykke[stykke.length - 1].x + " " + (hoejde - bund) + " L" + stykke[0].x + " " + (hoejde - bund) + " Z";
    dele.push('<path d="' + flade + '" fill="#4a7565" opacity="0.12"/>');
    dele.push('<path d="' + linje + '" fill="none" stroke="#4a7565" stroke-width="2.5" stroke-linecap="round"/>');
  });

  punkter.forEach(function (p) {
    dele.push('<text x="' + p.x + '" y="' + (hoejde - 8) + '" text-anchor="middle" font-size="13"' +
      (p.erIdag ? ' font-weight="600"' : '') + '>' + p.bogstav + '</text>');
    if (p.y === null) {
      dele.push('<circle cx="' + p.x + '" cy="' + (hoejde - bund) + '" r="3" fill="#cfd9e2"/>');
    } else {
      dele.push('<circle cx="' + p.x + '" cy="' + p.y + '" r="' + (p.erIdag ? 6 : 4) + '" fill="#4a7565" stroke="#e0e8ef" stroke-width="2"><title>' + p.niveau + ' af ' + MAKS_NIVEAU + '</title></circle>');
      if (p.erIdag) {
        dele.push('<text x="' + p.x + '" y="' + (p.y - 12) + '" text-anchor="middle" font-size="14" font-weight="600">' + p.niveau + '</text>');
      }
    }
  });

  svg.innerHTML = dele.join("");
}

// De fire fliser med dagens vigtigste tal
function visFliser(idag) {
  document.getElementById("log-fliser").hidden = !idag;
  if (!idag) return;

  var svarTekst = function (id) {
    var sp = SPOERGSMAAL.find(function (s) { return s.id === id; });
    return idag.svar[id] === undefined ? "–" : sp.svar[idag.svar[id]].split(",")[0];
  };

  document.getElementById("flise-niveau").textContent = symptomNiveau(idag);
  document.getElementById("flise-niveau-maks").textContent = "af " + MAKS_NIVEAU;
  document.getElementById("flise-soevn").textContent = svarTekst("soevn");
  document.getElementById("flise-aktivitet").textContent = svarTekst("aktivitet");

  var m = idag.medicin;
  var dele = [];
  if (m.panodil) dele.push(m.panodil + " Panodil");
  if (m.ipren) dele.push(m.ipren + " Ipren");
  if (m.vanlig) dele.push("Vanlig");
  document.getElementById("flise-medicin").textContent = dele.length ? dele.join(" + ") : "Ingen";
}

document.getElementById("log-vis-svar").addEventListener("click", function () {
  var liste = document.getElementById("log-seneste");
  liste.hidden = !liste.hidden;
  this.textContent = liste.hidden ? "Se alle dagens svar" : "Skjul dagens svar";
});

// ---------- Viden ----------
// Artiklerne er UDKAST. Gruppen skriver de endelige tekster ud fra kilderne.
// Nøgleordene bruges af chatfeltet: står et af ordene i spørgsmålet, vises artiklen.
var ARTIKLER = [
  {
    id: "laege",
    titel: "Hvornår skal jeg søge læge?",
    ikon: "advarsel",
    farve: 2,
    noegleord: ["læge", "lægen", "1813", "112", "akut", "farlig", "opkast", "kaste op", "forvirr", "kramp", "besvim", "bevidst", "værre", "forværr", "skadestue", "hospital"],
    tekst: [
      "<p>Ring 112 eller tag på skadestuen med det samme, hvis du får et eller flere af disse tegn:</p>",
      "<ul><li>Hovedpine, der bliver værre og værre</li><li>Gentagne opkastninger</li><li>Du bliver forvirret, usædvanligt søvnig eller svær at vække</li><li>Kramper</li><li>Svaghed eller følelsesløshed i arme eller ben</li><li>Utydelig tale eller synsforstyrrelser, der kommer pludseligt</li></ul>",
      "<p>Kontakt din egen læge, hvis symptomerne ikke er blevet bedre efter cirka to uger, eller hvis du er i tvivl. Lægen kan vurdere dig og henvise videre.</p>"
    ],
    kilde: { navn: "Patienthåndbogen, sundhed.dk", url: "https://www.sundhed.dk/borger/patienthaandbogen/akutte-sygdomme/sygdomme/hovedskader/hjernerystelse-hvad-er-det/" }
  },
  {
    id: "foerste-dage",
    titel: "De første dage",
    ikon: "soevn",
    farve: 0,
    noegleord: ["første", "starten", "lige sket", "i går", "hvile", "hvil", "ro ", "ligge", "sengen", "48"],
    tekst: [
      "<p>De første et til to døgn handler om ro. Hvil dig, sov når du er træt, og undgå ting, der kræver meget af hovedet.</p>",
      "<p>Fuldstændig mørke og total hvile i mange dage anbefales ikke længere. Efter de første døgn skal du langsomt begynde at gøre almindelige ting igen, i det tempo dine symptomer tillader.</p>",
      "<p>Hold øje med faresignalerne under \"Hvornår skal jeg søge læge?\".</p>"
    ],
    kilde: { navn: "Dansk Center for Hjernerystelse", url: "https://dcfh.dk/information-om-hjernerystelse-til-patienter-og-paaroerende/spoergsmaal-om-hjernerystelse/" }
  },
  {
    id: "skaerm",
    titel: "Skærm og lys",
    ikon: "lys",
    farve: 3,
    noegleord: ["skærm", "telefon", "mobil", "tv", "fjernsyn", "computer", "ipad", "tablet", "lys", "solbrille", "læse", "bog", "spil", "netflix"],
    tekst: [
      "<p>Du behøver ikke undgå skærme helt. Det vigtige er at bruge dem i korte perioder og holde pauser, før du bliver træt eller får hovedpine.</p>",
      "<p>Skru ned for lysstyrken, brug større skrift, og slå notifikationer fra. Er du følsom over for lys, kan solbriller udendørs hjælpe.</p>",
      "<p>Lange perioder uden kontakt til andre kan gøre humøret dårligere. Så brug gerne telefonen til at holde kontakt, bare i små bidder.</p>"
    ],
    kilde: { navn: "Dansk Center for Hjernerystelse", url: "https://dcfh.dk/information-om-hjernerystelse-til-patienter-og-paaroerende/spoergsmaal-om-hjernerystelse/" }
  },
  {
    id: "soevn",
    titel: "Søvn",
    ikon: "soevn",
    farve: 1,
    noegleord: ["søvn", "sove", "sover", "nat", "vågn", "træt", "udmattet", "energi", "middagslur", "lur"],
    tekst: [
      "<p>God søvn er noget af det vigtigste for, at hjernen kan komme sig. Gå i seng og stå op på nogenlunde samme tid hver dag, også i weekenden.</p>",
      "<p>Korte lure i dagtimerne er fint i starten, men hold dem korte (20 til 30 minutter), så du stadig kan sove om natten.</p>",
      "<p>Undgå skærm den sidste time før sengetid, og hold soveværelset mørkt og køligt.</p>"
    ],
    kilde: { navn: "Dansk Center for Hjernerystelse", url: "https://dcfh.dk/information-om-hjernerystelse-til-patienter-og-paaroerende/spoergsmaal-om-hjernerystelse/" }
  },
  {
    id: "smertestillende",
    titel: "Smertestillende",
    ikon: "medicin",
    farve: 2,
    noegleord: ["panodil", "paracetamol", "ipren", "ibuprofen", "smertestillende", "pille", "piller", "medicin", "tablet", "hovedpinepille", "treo", "kodimagnyl"],
    tekst: [
      "<p>Almindelig håndkøbsmedicin som Panodil (paracetamol) kan bruges mod hovedpine i de første dage. Følg doseringen på pakken.</p>",
      "<p>Vær opmærksom på, at smertestillende taget mange dage i træk i sig selv kan give hovedpine. Bruger du det mere end nogle få dage om ugen, så tal med din læge.</p>",
      "<p>Tag ikke andre smertestillende midler end dem, lægen eller apoteket anbefaler.</p>"
    ],
    kilde: { navn: "Patienthåndbogen, sundhed.dk", url: "https://www.sundhed.dk/borger/patienthaandbogen/akutte-sygdomme/sygdomme/hovedskader/hjernerystelse-hvad-er-det/" }
  },
  {
    id: "bevaegelse",
    titel: "Bevægelse og motion",
    ikon: "aktivitet",
    farve: 0,
    noegleord: ["gå", "gåtur", "træne", "træning", "motion", "løbe", "løb", "sport", "cykle", "cykel", "fitness", "aktivitet", "bevæge", "puls", "svømme", "fodbold", "håndbold", "yoga"],
    tekst: [
      "<p>Efter de første døgn er let bevægelse godt for dig. Start med korte gåture, og øg lidt ad gangen.</p>",
      "<p>Den nationale retningslinje anbefaler gradueret træning: du øger langsomt, styret af dine symptomer. Bliver symptomerne tydeligt værre, så skru ned igen næste gang.</p>",
      "<p>Vent med kontaktsport og aktiviteter med risiko for et nyt slag mod hovedet, til du er symptomfri og har talt med lægen.</p>"
    ],
    kilde: { navn: "National klinisk retningslinje (2021)", url: "https://dcfh.dk/vaerktoejer-til-behandling-af-hjernerystelse/national-klinisk-retningslinje/" }
  },
  {
    id: "arbejde",
    titel: "Tilbage på arbejde eller studie",
    ikon: "koncentration",
    farve: 3,
    noegleord: ["arbejde", "arbejd", "job", "studie", "studere", "skole", "uni", "universitet", "eksamen", "undervisning", "forelæsning", "sygemeld", "chef"],
    tekst: [
      "<p>Start gradvist. Nogle få timer om dagen med pauser er bedre end en hel dag og så to dage i sengen.</p>",
      "<p>Tal med din arbejdsplads eller dit studie om, hvad du kan i starten: kortere dage, færre møder, ingen skærm i lange stræk.</p>",
      "<p>Er du sygemeldt, så aftal med din læge, hvordan du vender tilbage.</p>"
    ],
    kilde: { navn: "Dansk Center for Hjernerystelse", url: "https://dcfh.dk/information-om-hjernerystelse-til-patienter-og-paaroerende/spoergsmaal-om-hjernerystelse/" }
  },
  {
    id: "varighed",
    titel: "Hvor længe varer det?",
    ikon: "glemsom",
    farve: 1,
    noegleord: ["varer", "længe", "hvornår", "rask", "bedre", "senfølger", "uger", "måneder", "normalt", "forløb", "langvarig"],
    tekst: [
      "<p>De fleste får det meget bedre i løbet af nogle uger. Symptomerne kan komme og gå undervejs, og det er normalt.</p>",
      "<p>Hos nogle varer symptomerne længere end en måned. Så er det vigtigt at få hjælp: lægen kan henvise til fysioterapeut, synstræning eller anden behandling, som retningslinjen anbefaler.</p>",
      "<p>Brug loggen her i appen til at følge din udvikling. Det gør det lettere at forklare lægen, hvordan det går.</p>"
    ],
    kilde: { navn: "National klinisk retningslinje (2021)", url: "https://dcfh.dk/vaerktoejer-til-behandling-af-hjernerystelse/national-klinisk-retningslinje/" }
  }
];

var chatTraad = document.getElementById("chat-traad");
var chatForm = document.getElementById("chat-form");
var chatFelt = document.getElementById("chat-felt");

function findArtikel(id) {
  return ARTIKLER.find(function (a) { return a.id === id; });
}

// Vis emneknapperne
document.getElementById("emner").innerHTML = ARTIKLER.map(function (a) {
  return '<button type="button" class="emne-knap" style="background:' + IKON_FARVER[a.farve] + '" data-artikel="' + a.id + '">' +
    IKONER[a.ikon] + '<span>' + a.titel + '</span></button>';
}).join("");

document.getElementById("emner").addEventListener("click", function (hændelse) {
  var knap = hændelse.target.closest(".emne-knap");
  if (knap) visArtikel(knap.dataset.artikel);
});

function visArtikel(id) {
  var a = findArtikel(id);
  if (!a) return;
  var ikon = document.getElementById("artikel-ikon");
  ikon.innerHTML = IKONER[a.ikon];
  ikon.style.background = IKON_FARVER[a.farve];
  document.getElementById("artikel-titel").textContent = a.titel;
  document.getElementById("artikel-tekst").innerHTML = a.tekst.join("");
  document.getElementById("artikel-kilde").innerHTML = 'Kilde: <a href="' + a.kilde.url + '" target="_blank" rel="noopener">' + a.kilde.navn + '</a>';
  visSide("viden");
  document.getElementById("viden-oversigt").hidden = true;
  document.getElementById("viden-artikel").hidden = false;
  window.scrollTo(0, 0);
}

document.getElementById("artikel-tilbage").addEventListener("click", function () {
  document.getElementById("viden-artikel").hidden = true;
  document.getElementById("viden-oversigt").hidden = false;
  window.scrollTo(0, 0);
});

// Chatten: ren nøgleordssøgning. Den artikel, hvor flest nøgleord matcher, vinder.
function soegArtikel(spoergsmaal) {
  var tekst = " " + spoergsmaal.toLowerCase() + " ";
  var bedste = null, bedsteScore = 0;
  ARTIKLER.forEach(function (a) {
    var score = a.noegleord.filter(function (ord) { return tekst.indexOf(ord.toLowerCase()) !== -1; }).length;
    if (score > bedsteScore) { bedste = a; bedsteScore = score; }
  });
  return bedste;
}

function tilfoejBesked(html, fraBruger) {
  var besked = document.createElement("div");
  besked.className = "besked " + (fraBruger ? "besked-bruger" : "besked-app");
  besked.innerHTML = html;
  chatTraad.appendChild(besked);
}

function undslip(tekst) {
  var div = document.createElement("div");
  div.textContent = tekst;
  return div.innerHTML;
}

chatForm.addEventListener("submit", function (hændelse) {
  hændelse.preventDefault();
  var spoergsmaal = chatFelt.value.trim();
  if (!spoergsmaal) return;
  tilfoejBesked("<p>" + undslip(spoergsmaal) + "</p>", true);
  chatFelt.value = "";

  var a = soegArtikel(spoergsmaal);
  if (a) {
    tilfoejBesked("<h3>" + a.titel + "</h3>" + a.tekst.join("") +
      '<p class="besked-kilde">Kilde: <a href="' + a.kilde.url + '" target="_blank" rel="noopener">' + a.kilde.navn + "</a></p>");
  } else {
    tilfoejBesked("<p>Det har jeg ikke noget om. Prøv et af emnerne herunder, eller spørg din læge.</p>");
  }
  chatTraad.lastElementChild.scrollIntoView({ block: "nearest" });
});

tilfoejBesked("<p>Hej. Spørg mig om hjernerystelse, eller vælg et emne herunder.</p>");

// ---------- Forsidens råd og lægeknap ----------
// Rådet vælges efter, hvor langt brugeren er i forløbet.
function opdaterRaad() {
  var dag = dagNummer(hentProfil().skadedato);
  var titel = document.getElementById("idag-raad-titel");
  var tekst = document.getElementById("idag-raad-tekst");
  var kort = document.getElementById("idag-raad");

  if (!dag) {
    titel.textContent = "Dagens råd";
    tekst.textContent = "Udfyld din profil, så rådet passer til, hvor du er i dit forløb.";
    kort.dataset.artikel = "foerste-dage";
  } else if (dag <= 2) {
    titel.textContent = "De første dage: ro";
    tekst.textContent = "Hvil dig, og sov når du er træt. Undgå ting, der kræver meget af hovedet.";
    kort.dataset.artikel = "foerste-dage";
  } else if (dag <= 30) {
    titel.textContent = "Den første måned: lidt ad gangen";
    tekst.textContent = "Begynd langsomt på almindelige ting igen. Korte gåture er gode. Skru ned, hvis symptomerne bliver værre.";
    kort.dataset.artikel = "bevaegelse";
  } else {
    titel.textContent = "Efter en måned: få hjælp";
    tekst.textContent = "Har du stadig symptomer, så tal med din læge om henvisning. Der findes behandling, der virker.";
    kort.dataset.artikel = "varighed";
  }
}

document.getElementById("idag-raad").addEventListener("click", function () {
  visArtikel(this.dataset.artikel);
});

document.getElementById("idag-laege").addEventListener("click", function () {
  visArtikel("laege");
});

visProfilIFormular();
opdaterLogOversigt();
opdaterForside();
opdaterRaad();
