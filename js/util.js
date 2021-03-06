/**Inicijalna deklaracija vrijednosti koje se korite u stranici*/
const domainUrl = location.origin;
//const domainUrl = "http://167.172.171.249";
const wmsUrl = domainUrl + "/geoserver/winsoft/wms";
const wfsUrl = domainUrl + "/geoserver/winsoft/wfs";
const imageUrl = domainUrl + "/slike/";
const point = "Point",
  lineString = "LineString",
  polygon = "Polygon",
  tacke = [],
  linije = [],
  poligoni = [];
let draw,
  modify,
  cqlFilter = "",
  idObjekta,
  akcija = "pan",
  slikaUrl = "";
let nacrtan = false,
  modifikovan = false;

/**Definisanje podloga */
let osmBaseMap = new ol.layer.Tile({
  title: "Open Street Maps",
  source: new ol.source.OSM(),
});
let satelitBaseMap = new ol.layer.Tile({
  title: "Satelitski snimak",
  source: new ol.source.XYZ({
    url: 'http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}',
    maxZoom: 23,
  }),
});
var katastarBaseMap = new ol.layer.Tile({
  title: "Katastar",
  name: "uzn",
  source: new ol.source.TileWMS({
    url: wmsUrl,
    params: {
      LAYERS: "winsoft:uzn",
    },
    ratio: 1,
    serverType: "geoserver",
  }),
});

/**Stilizacija vektora */
var fill = new ol.style.Fill({
  color: "rgba(255,0,0,0.3)",
});
var stroke = new ol.style.Stroke({
  color: "#ff0000",
  width: 2,
});
var circle = new ol.style.Circle({
  radius: 7,
  fill: fill,
  stroke: stroke,
});
var vectorStyle = new ol.style.Style({
  fill: fill,
  stroke: stroke,
  image: circle,
});

/**Setovanje centra mape */
let center = ol.proj.transform([19.26, 42.443], "EPSG:4326", "EPSG:3857");
let view = new ol.View({
  center: center,
  zoom: 17,
});

/** Vraća well known tekst reprezentaciju geometrije za predati feature */
function wktGeometrije(feature) {
  let format = new ol.format.WKT();
  let wktRepresenation = format.writeGeometry(feature.getGeometry(), {
    dataProjection: "EPSG:4326",
    featureProjection: "EPSG:3857",
  });
  return wktRepresenation;
}

/**Kreiranje vektorskih lejera za crtanje i kreiranje nove geometrije ili edit postojeće (point, linestring, polygon, new i edit) */
function kreirajVektorLejerZaCrtanje(olCollection) {
  return new ol.layer.Vector({
    source: new ol.source.Vector({
      features: olCollection,
    }),
    style: vectorStyle,
  });
}
/**Definisanje vektor lejera za crtanje figura i kreiranje i izmjenu tekuće geometrije */
let featuresPoint = new ol.Collection(),
  featuresLine = new ol.Collection(),
  featuresPolygon = new ol.Collection(),
  featuresTekuci = new ol.Collection();
let featurePointOverlay = kreirajVektorLejerZaCrtanje(featuresPoint),
  featureLineOverlay = kreirajVektorLejerZaCrtanje(featuresLine),
  featurePolygonOverlay = kreirajVektorLejerZaCrtanje(featuresPolygon),
  featureTekuciOverlay = kreirajVektorLejerZaCrtanje(featuresTekuci);
featureLineOverlay.getSource().on("addfeature", (evt) => linije.push(wktGeometrije(evt.feature)));
featurePointOverlay.getSource().on("addfeature", (evt) => tacke.push(wktGeometrije(evt.feature)));
featurePolygonOverlay.getSource().on("addfeature", (evt) => poligoni.push(wktGeometrije(evt.feature)));

let slikeUrl = [],
  slikeIndex = 0;
/** Klikom na modalnu sliku, otvara novi tab sa istom slikom */
document.querySelector("#imgModal").onclick = function () {
  window.open(slikeUrl[slikeIndex], "_blank");
};

/** Podešava vrijednost ddl liste */
function setujDdlVrijednost(ddl, vrijednost) {
  for (let i = 0; i < document.querySelector(ddl).length; i++) {
    document.querySelector(ddl).options[i].text === vrijednost && (document.querySelector(ddl).options[i].selected = true);
  }
}

/** Prikazuje sliku za odabrani objekat u modalnom prozoru */
function slika() {
  slikeIndex = 0;
  slikeUrl[0] = "https://cdn.pixabay.com/photo/2017/07/10/23/45/cubes-2492010_960_720.jpg";
  slikeUrl[1] = "https://cdn.pixabay.com/photo/2015/09/09/16/05/forest-931706_960_720.jpg";
  if (slikeUrl.length === 0) {
    poruka("Upozorenje", "Nije odabran objekat na mapi za koji želite da se prikaže fotografija.");
  } else {
    akcija = "slika";

    document.querySelector("#modalFotografija").style.display = "block";
    //document.querySelector("#imgModal").src = slikeUrl[0];
    prikaziSliku(0);
    document.querySelector("#naslovFotografija").innerHTML = opisSlike;

    document.querySelector("#zatvoriModalFotografija").onclick = function () {
      document.querySelector("#modalFotografija").style.display = "none";
    };
    setujAktivnu("#slika");
  }
}

function prikaziSliku(n) {
  slikeIndex += n;
  slikeIndex < 0 && (slikeIndex = slikeUrl.length - 1);
  slikeIndex >= slikeUrl.length && (slikeIndex = 0);
  document.querySelector("#imgModal").src = slikeUrl[slikeIndex];
}


function crtajTacku() {
  akcija = point;
  setujAktivnu("#marker");
}

function crtajLiniju() {
  akcija = lineString;
  setujAktivnu("#linija");
}

function crtajPoligon() {
  akcija = polygon;
  setujAktivnu("#poligon");
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

/**Prikaz toast poruke. Od naslova zavisi boja, tj klasa koja se dodjeljuje */
function poruka(naslov, tekst) {
  let klasa = naslov.toLowerCase().trim();
  klasa !== "uspjeh" && klasa !== "upozorenje" && klasa !== "greska" && (klasa = "obavjestenje");
  document.querySelector("#toast").innerHTML = tekst;
  document.querySelector("#toast").className = klasa;
  setTimeout(function () {
    document.querySelector("#toast").className = "";
    document.querySelector("#toast").innerHTML = "";
  }, 3000);
}

/** Akcija promjene ikonice u navbaru */
function setujAktivnu(element) {
  if (nacrtan || modifikovan) {
    poruka("Upozorenje", "Nije moguće promijeniti aktivnost dok ne poništite crtanje nove ili izmjenu postojeće geometrije.");
    return false;
  }
  let els = document.querySelectorAll(".active");
  for (let i = 0; i < els.length; i++) {
    els[i].classList.remove("active");
  }
  document.querySelector(element).classList.add("active");
  closeDiv("#pretragaDiv");
  closeDiv("#atributiDiv");
  closeDiv("#shpDiv");
  if (element === "#atributi" || element === "#dodaj") {
    showDiv("#atributiDiv");
  }
  if (element === "#pretraga") {
    showDiv("#pretragaDiv");
  }
  if (element === "#uvozshp") {
    showDiv("#shpDiv");
  }
  podesiInterakciju();
  zatvoriHamburger();
}

/** Zatvara meni nakon odabira akcije, na malim ekranima */
function zatvoriHamburger() {
  let x = document.querySelector("#topNav");
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

/**Tri funkcije koje rade sa konfirm modalom - za potvrdu akcija/brisanja */
function confirmModal(naslov, text, funkcija) {
  document.querySelector("#modalConfirmHeader").innerHTML = naslov;
  document.querySelector("#modalConfirmText").innerHTML = text;
  document.querySelector("#modalConfirm").style.display = "block";
}

function confirmPotvrdi(funkcija) {
  document.querySelector("#modalConfirm").style.display = "none";
  brisanje();
}

function confirmOdustani() {
  document.querySelector("#modalConfirm").style.display = "none";
}

/**Funkcije za setovanje podloga */
function osmPodloga() {
  map.getLayers().setAt(0, osmBaseMap);
  zatvoriHamburger();
}

function topoPodloga() {
  map.getLayers().setAt(0, katastarBaseMap);
  zatvoriHamburger();
}

function satelitPodloga() {
  map.getLayers().setAt(0, satelitBaseMap);
  zatvoriHamburger();
}

/**Funkcije za download WFS-a */
function shpDownload() {
  zatvoriHamburger();
  wfsDownload("SHAPE-ZIP");
}

function kmlDownload() {
  zatvoriHamburger();
  wfsDownload("KML");
}

function excelDownload() {
  zatvoriHamburger();
  wfsDownload("excel2007");
}

/** Funkcije za rad sa navigacionim barom*/
function pan() {
  akcija = "pan";
  setujAktivnu("#pan");
}

function dodaj() {
  akcija = "dodaj";
  setujAktivnu("#dodaj");
}

function izmijeni() {
  akcija = "izmijeni";
  setujAktivnu("#izmijeni");
}

function atributi() {
  akcija = "atributi";
  setujAktivnu("#atributi");
}

function pretraga() {
  akcija = "pretraga";
  setujAktivnu("#pretraga");
}

function uvozshp() {
  akcija = "uvozshp";
  setujAktivnu("#uvozshp");
}

function restart() {
  location.reload(true);
}

/**Povezivanje kontrola sa akcijama */
document.querySelector("#pan").addEventListener("click", pan);
document.querySelector("#dodaj").addEventListener("click", dodaj);
document.querySelector("#izmijeni").addEventListener("click", izmijeni);
document.querySelector("#atributi").addEventListener("click", atributi);
document.querySelector("#slika").addEventListener("click", slika);
document.querySelector("#marker").addEventListener("click", crtajTacku);
document.querySelector("#linija").addEventListener("click", crtajLiniju);
document.querySelector("#poligon").addEventListener("click", crtajPoligon);
document.querySelector("#pretraga").addEventListener("click", pretraga);
//document.querySelector("#uvozshp").addEventListener("click", uvozshp);
document.querySelector("#restart").addEventListener("click", restart);
document.querySelector("#podloga_osm").addEventListener("click", osmPodloga);
document.querySelector("#podloga_topo").addEventListener("click", topoPodloga);
document.querySelector("#podloga_satelit").addEventListener("click", satelitPodloga);
document.querySelector("#shp").addEventListener("click", shpDownload);
document.querySelector("#kml").addEventListener("click", kmlDownload);
document.querySelector("#excel").addEventListener("click", excelDownload);

document.querySelector("#confirmPotvrdi").addEventListener("click", confirmPotvrdi);
document.querySelector("#confirmOdustani").addEventListener("click", confirmOdustani);