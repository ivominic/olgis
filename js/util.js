document.querySelector("#imgModal").onclick = function () {
  window.open(slikaUrl, "_blank");
}

function slika() {
  if (slikaUrl === "") {
    poruka("Upozorenje", "Nije odabran objekat na mapi za koji želite da se prikaže fotografija.");
  } else {
    setujAktivnu("#slika");
    akcija = "slika";

    document.querySelector("#modalFotografija").style.display = "block";
    document.querySelector("#imgModal").src = slikaUrl;
    document.querySelector("#naslovFotografija").innerHTML = opisSlike;

    document.querySelector("#zatvoriModalFotografija").onclick = function () {
      document.querySelector("#modalFotografija").style.display = "none";
    }
  }
}

function crtajTacku() {
  setujAktivnu("#marker");
  akcija = "marker";
  oblik = "Point";
  podesiInterakciju();
}

function crtajLiniju() {
  setujAktivnu("#linija");
  akcija = "linija";
  oblik = "LineString";
  podesiInterakciju();
}

function crtajPoligon() {
  setujAktivnu("#poligon");
  akcija = "poligon";
  oblik = "Polygon";
  podesiInterakciju();
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
}

function poruka(naslov, tekst) {
  alert(tekst);
}