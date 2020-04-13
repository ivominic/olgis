var domainUrl = 'http://localhost' //location.origin;
var wmsUrl = domainUrl + "/geoserver/winsoft/wms";
var imageUrl = domainUrl + "/slike/";
var tiledRaster = new ol.layer.Tile({
  source: new ol.source.OSM(),
  name: "Podloga"
});
/*var overlay = new ol.Overlay({
  position: "bottom-center",
  element: document.querySelector("#overlay")
});*/

var idObjekta;
document.querySelector("#pan").addEventListener("click", pan);
document.querySelector("#odaberi").addEventListener("click", odaberi);
document.querySelector("#dodaj").addEventListener("click", dodaj);
document.querySelector("#izbrisi").addEventListener("click", izbrisi);
document.querySelector("#izmijeni").addEventListener("click", izmijeni);
document.querySelector("#atributi").addEventListener("click", atributi);
document.querySelector("#marker").addEventListener("click", marker);
document.querySelector("#pretraga").addEventListener("click", pretraga);
document.querySelector("#podloga_osm").addEventListener("click", pan);
document.querySelector("#podloga_topo").addEventListener("click", pan);

document.querySelector("#btnSacuvaj").addEventListener("click", sacuvaj);
document.querySelector("#btnPonisti").addEventListener("click", ponisti);
document.querySelector("#btnFilter").addEventListener("click", filtriranje);
document.querySelector("#btnIzbrisi").addEventListener("click", brisanje);


function popuniKontrole(odgovor) {
  var atributi = odgovor.features[0]["properties"];
  idObjekta = odgovor.features[0]["id"];
  console.log(odgovor);
  document.querySelector("#latinskiNaziv").value = atributi["latinski_naziv"];
  document.querySelector("#narodniNaziv").value = atributi["narodni_naziv"];
  for (var i = 0; i < document.querySelector("#tip").length; i++) {
    document.querySelector("#tip").options[i].text === atributi["tip"] && (document.querySelector("#tip").options[i].selected = true);
  }
  document.querySelector("#zdravstvenoStanje").value = atributi["zdravstveno_stanje"];
  document.querySelector("#napomena").value = atributi["napomena"];


  //slika
  var slika = atributi["url_fotografije"];
  slika.length && (slika = slika.substring(slika.lastIndexOf("/") + 1, slika.length));
  //overlay.getElement().innerHTML = '<a target="_blank" href="' + imageUrl + slika + '"><img src="' + imageUrl + slika + '"></a>';

}

function sacuvaj() {
  if (!idObjekta) {
    alert("Potrebno je odabrati objekat za koji se unose podaci.");
    return false;
  }
  $.ajax({
    url: '${createLink(controller:"zbunje",action:"sacuvaj")}',
    data: {
      id: idObjekta,
      latinskiNaziv: document.querySelector("#latinskiNaziv").value,
      narodniNaziv: document.querySelector("#narodniNaziv").value,
      tip: document.querySelector("#tip").value,
      zdravstvenoStanje: document.querySelector("#zdravstvenoStanje").value,
      napomena: document.querySelector("#napomena").value
    },
    type: "GET",
    timeout: 10000,
    dataType: "json",
    async: false,
    error: function (response) {
      alert("Greška prilikom unosa podataka: \n" + response.message);
    },
    success: function (response) {
      restartovanje();
    }
  });
}

function restartovanje() {
  idObjekta = "";
  document.querySelector("#latinskiNaziv").value = "";
  document.querySelector("#narodniNaziv").value = "";
  document.querySelector("#tip").value = "";
  document.querySelector("#zdravstvenoStanje").value = "";
  document.querySelector("#napomena").value = "";

  //overlay.getElement().innerHTML = "";
}

var rasterLayer = new ol.layer.Image({
  title: "Žbunje",
  name: "zbunje",
  source: new ol.source.ImageWMS({
    url: wmsUrl,
    params: {
      LAYERS: "winsoft:zbunje"
    },
    ratio: 1,
    serverType: "geoserver"
  })
});

var center = ol.proj.transform([19.26, 42.443], "EPSG:4326", "EPSG:3857");
var view = new ol.View({
  center: center,
  zoom: 17
});

var map = new ol.Map({
  target: "map",
  layers: [tiledRaster, rasterLayer], //
  view: view
});

//map.on("pointermove", onMouseMove);

function onMouseMove(evt) {
  /*var coordinate = browserEvent.coordinate;
  var pixel = map.getPixelFromCoordinate(coordinate);
  var el = document.getElementById("name");
  el.innerHTML = "";
  map.forEachFeatureAtPixel(pixel, function (feature) {
    el.innerHTML += feature.get("broj") + "<br>";
  });*/
  if (evt.dragging) {
    return;
  }
  map.getTargetElement().style.cursor = "";
  var pixel = map.getEventPixel(evt.originalEvent);
  var hit = map.forEachLayerAtPixel(pixel, function (layer) {
    if (layer.B.name === 'zbunje') {
      console.log(layer.B);
      console.log("ima");
      map.getTargetElement().style.cursor = "pointer";
      return false;
    }
  });
  //map.getTargetElement().style.cursor = hit ? "pointer" : "";
}

var dragAndDrop = new ol.interaction.DragAndDrop({
  formatConstructors: [ol.format.GPX, ol.format.GeoJSON, ol.format.IGC, ol.format.KML, ol.format.TopoJSON]
});

dragAndDrop.on("addfeatures", function (event) {
  var vectorSource = new ol.source.Vector({
    features: event.features,
    projection: event.projection
  });
  map.getLayers().push(
    new ol.layer.Vector({
      source: vectorSource,
      style: vectorStyle
    })
  );
  view.fitExtent(vectorSource.getExtent(), map.getSize());
});
map.addInteraction(dragAndDrop);

//Klik na feature
map.on("click", onMouseClick);

function onMouseClick(browserEvent) {
  var coordinate = browserEvent.coordinate;
  var pixel = map.getPixelFromCoordinate(coordinate);

  var url = rasterLayer.getSource().getGetFeatureInfoUrl(browserEvent.coordinate, map.getView().getResolution(), "EPSG:3857", {
    INFO_FORMAT: "application/json"
  });
  if (url) {
    fetch(url)
      .then(function (response) {
        restartovanje();
        return response.text();
      })
      .then(function (json) {
        var odgovor = JSON.parse(json);
        if (odgovor.features.length > 0) {
          popuniKontrole(odgovor);
        }
      });
  }

  //overlay.setPosition(coordinate);
  //map.addOverlay(overlay);
}


function pan() {
  console.log("PAN");
}

function odaberi() {
  console.log("ODABERI");
}

function dodaj() {
  console.log("DODAJ");
}

function izbrisi() {
  console.log("IZBRISI");
}

function izmijeni() {
  console.log("IZMIJENI");
}

function atributi() {
  console.log("atributi");
}

function marker() {
  console.log("marker");
  showDiv("#pretragaDiv");
  //document.getElementById("pretragaDiv").style.width = sirinaDiva;
}

function pretraga() {
  console.log("pretraga");
  //document.getElementById("pretragaDiv").style.width = "0";
  closeDiv("#pretragaDiv");
}

function sacuvaj() {
  console.log("sacuvaj");
}

function ponisti() {
  console.log("ponisti");
}

function filtriranje() {
  console.log("filtriranje");
}

function brisanje() {
  console.log("brisanje");
}