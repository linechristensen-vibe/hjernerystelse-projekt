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
