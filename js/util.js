document.querySelector("#imgModal").onclick = function () {
  window.open(slikaUrl, "_blank");
};

function slika() {
  if (slikaUrl === "") {
    poruka("Upozorenje", "Nije odabran objekat na mapi za koji želite da se prikaže fotografija.");
  } else {

    akcija = "slika";

    document.querySelector("#modalFotografija").style.display = "block";
    document.querySelector("#imgModal").src = slikaUrl;
    document.querySelector("#naslovFotografija").innerHTML = opisSlike;

    document.querySelector("#zatvoriModalFotografija").onclick = function () {
      document.querySelector("#modalFotografija").style.display = "none";
    };
    setujAktivnu("#slika");
  }
}

function crtajTacku() {
  akcija = "marker";
  oblik = "Point";
  setujAktivnu("#marker");
}

function crtajLiniju() {
  akcija = "linija";
  oblik = "LineString";
  setujAktivnu("#linija");
}

function crtajPoligon() {
  akcija = "poligon";
  oblik = "Polygon";
  setujAktivnu("#poligon");
}

function wktGeometrije(feature) {
  //var geom11 = feature.getGeometry().transform("EPSG:3857", "EPSG:4326");
  //var coords = feature.getGeometry().getCoordinates();
  var format = new ol.format.WKT();

  /*var feature = format.readFeature(wkt, {
    dataProjection: "EPSG:4326",
    featureProjection: "EPSG:3857",
  });*/

  var wktRepresenation = format.writeGeometry(feature.getGeometry(), {
    dataProjection: "EPSG:4326",
    featureProjection: "EPSG:3857",
  });
  //console.log("bbbb", wktRepresenation);
  return wktRepresenation;
}

/**Funkcija koja prolazi kroz nizove tačaka, linija i polgiona i kreira CQL uslov u zavisnosti od odabranih opcija */
function kreiranjeCqlFilteraProstorno() {
  let retVal = "";
  let pretragaTacka = document.querySelector("#pretragaTacke").checked;
  let pretragaTackaUdaljenost = document.querySelector("#pretragaTackeUdaljenost").value;
  let pretragaLinije = document.querySelector("#pretragaLinije").checked;
  let pretragaPoligonObuhvata = document.querySelector("#pretragaPoligonObuhvata").checked;
  let pretragaPoligonPresijeca = document.querySelector("#pretragaPoligonPresijeca").checked;
  if (pretragaTacka && pretragaTackaUdaljenost === "") {
    poruka("Upozorenje", "Potrebno je unijeti udaljenost od iscrtanih tačaka na kojoj će se prikazivati objekti iz sloja koji se pretražuje.");
    return false;
  }
  if (pretragaTacka && tacke.length === 0) {
    poruka("Upozorenje", "Potrebno je nacrtati bar jednu tačku za pretragu objekata po udaljenosti.");
    return false;
  }
  if (pretragaLinije && linije.length === 0) {
    poruka("Upozorenje", "Potrebno je nacrtati bar jednu liiju za pretragu objekata koje linija presijeca.");
    return false;
  }
  if ((pretragaPoligonPresijeca || pretragaPoligonObuhvata) && poligoni.length === 0) {
    poruka("Upozorenje", "Potrebno je nacrtati bar jedan poligon za pretragu objekata koje poligon presijeca ili obuhvata.");
    return false;
  }

  pretragaTacka &&
    tacke.forEach((item) => {
      if (retVal === "") {
        retVal = "DWITHIN(geom," + item + "," + pretragaTackaUdaljenost + ",meters) ";
      } else {
        retVal += " OR DWITHIN(geom," + item + "," + pretragaTackaUdaljenost + ",meters) ";
      }
    });

  pretragaLinije &&
    linije.forEach((item) => {
      if (retVal === "") {
        retVal = "INTERSECTS(geom," + item + ") ";
      } else {
        retVal += " OR INTERSECTS(geom," + item + ") ";
      }
    });

  (pretragaPoligonObuhvata || pretragaPoligonPresijeca) &&
  poligoni.forEach((item) => {
    if (retVal === "") {
      if (pretragaPoligonPresijeca) {
        retVal = "INTERSECTS(geom," + item + ") ";
      } else {
        retVal = "WITHIN(geom," + item + ") ";
      }
    } else {
      if (pretragaPoligonPresijeca) {
        retVal += " OR INTERSECTS(geom," + item + ") ";
      } else {
        retVal += " OR WITHIN(geom," + item + ") ";
      }
    }
  });

  return retVal;
}

function setujAktivnu(element) {
  var els = document.querySelectorAll(".active");
  for (var i = 0; i < els.length; i++) {
    els[i].classList.remove("active");
  }
  document.querySelector(element).classList.add("active");
  podesiInterakciju();
  zatvoriHamburger();
}

function zatvoriHamburger() {
  var x = document.querySelector("#topNav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

function closeDiv(nazivDiva) {
  document.querySelector(nazivDiva).style.width = "0";
}

function showDiv(nazivDiva) {
  document.querySelector(nazivDiva).style.width = "500px";
}

function poruka(naslov, tekst) {
  //Mogao bih kao klasu da predajem naslov, ali može da dođe do greške u kucanju, pa da se ne prikazuje ništa
  let klasa = naslov.toLowerCase().trim();
  klasa !== "uspjeh" && klasa !== "upozorenje" && klasa !== "greska" && (klasa = "obavjestenje");
  let komponenta = document.querySelector("#toast");
  komponenta.innerHTML = tekst;
  komponenta.className = klasa;
  //uklanja div posle 3 sekunde
  setTimeout(function () {
    komponenta.className = "";
    komponenta.innerHTML = "";
  }, 3000);
}

function confirmModal(naslov, text, funkcija) {
  document.querySelector('#modalConfirmHeader').innerHTML = naslov;
  document.querySelector('#modalConfirmText').innerHTML = text;
  document.querySelector('#modalConfirm').style.display = 'block'
}

function confirmPotvrdi(funkcija) {
  document.querySelector('#modalConfirm').style.display = 'none';
  brisanje();
}

function confirmOdustani() {
  document.querySelector('#modalConfirm').style.display = 'none';
}