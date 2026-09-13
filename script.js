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
}

// Skjul "Gemt" igen, når man begynder at rette i profilen
profilForm.addEventListener("input", function () {
  profilKvittering.hidden = true;
});

visProfilIFormular();
opdaterForside();
