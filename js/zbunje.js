var domainUrl = location.origin; //"http://localhost"; //"http://167.172.171.249"; //location.origin;
var wmsUrl = domainUrl + "/geoserver/winsoft/wms";
var imageUrl = domainUrl + "/slike/";
var tiledRaster = new ol.layer.Tile({
  source: new ol.source.OSM(),
  name: "Podloga",
});
/*var overlay = new ol.Overlay({
  position: "bottom-center",
  element: document.querySelector("#overlay")
});*/

var draw, modify;
var idObjekta,
  akcija = "pan",
  oblik = "linija",
  slikaUrl = "",
  opisSlike = "";
var poligoni = [],
  linije = [],
  tacke = [];
var cqlFilter = "";

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

/**Povezivanje kontrola sa akcijama */
document.querySelector("#pan").addEventListener("click", pan);
document.querySelector("#odaberi").addEventListener("click", odaberi);
document.querySelector("#dodaj").addEventListener("click", dodaj);
document.querySelector("#izbrisi").addEventListener("click", izbrisi);
document.querySelector("#izmijeni").addEventListener("click", izmijeni);
document.querySelector("#atributi").addEventListener("click", atributi);
document.querySelector("#slika").addEventListener("click", slika);
document.querySelector("#marker").addEventListener("click", crtajTacku);
document.querySelector("#linija").addEventListener("click", crtajLiniju);
document.querySelector("#poligon").addEventListener("click", crtajPoligon);
document.querySelector("#pretraga").addEventListener("click", pretraga);
document.querySelector("#podloga_osm").addEventListener("click", pan);
document.querySelector("#podloga_topo").addEventListener("click", pan);

document.querySelector("#btnSacuvaj").addEventListener("click", sacuvaj);
document.querySelector("#btnPonisti").addEventListener("click", ponisti);
document.querySelector("#btnIzbrisi").addEventListener("click", brisanje);

document.querySelector("#btnFilter").addEventListener("click", filtriranje);

function popuniKontrole(odgovor) {
  var atributi = odgovor.features[0]["properties"];
  idObjekta = odgovor.features[0]["id"];
  console.log(odgovor);
  document.querySelector("#latinskiNaziv").value = atributi["latinski_naziv"];
  document.querySelector("#narodniNaziv").value = atributi["narodni_naziv"];
  setujDdlVrijednost("#tip", atributi["tip"]);
  setujDdlVrijednost("#zdravstvenoStanje", atributi["zdravstveno_stanje"]);
  document.querySelector("#napomena").value = atributi["napomena"];

  //slika
  var slika = atributi["url_fotografije"];
  slika.length && (slika = slika.substring(slika.lastIndexOf("/") + 1, slika.length));
  slika.length && (slikaUrl = imageUrl + slika);
  opisSlike = atributi["latinski_naziv"] + " - " + atributi["narodni_naziv"];
}

function sacuvaj() {
  return false;
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
      napomena: document.querySelector("#napomena").value,
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
    },
  });
}

function restartovanje() {
  idObjekta = "";
  document.querySelector("#idObjekta").value = "";
  document.querySelector("#latinskiNaziv").value = "";
  document.querySelector("#narodniNaziv").value = "";
  document.querySelector("#tip").value = "";
  document.querySelector("#zdravstvenoStanje").value = "";
  document.querySelector("#napomena").value = "";
  slikaUrl = "";
  opisSlike = "";

  //overlay.getElement().innerHTML = "";
}

var rasterLayer = new ol.layer.Image({
  title: "Žbunje",
  name: "zbunje",
  source: new ol.source.ImageWMS({
    url: wmsUrl,
    params: {
      LAYERS: "winsoft:zbunje",
    },
    ratio: 1,
    serverType: "geoserver",
  }),
});

var center = ol.proj.transform([19.26, 42.443], "EPSG:4326", "EPSG:3857");
var view = new ol.View({
  center: center,
  zoom: 17,
});

var map = new ol.Map({
  target: "map",
  layers: [tiledRaster, rasterLayer], //
  view: view,
});

var featuresLine = new ol.Collection();
var featureLineOverlay = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: featuresLine,
  }),
  style: vectorStyle,
});
featureLineOverlay.setMap(map);
featureLineOverlay.getSource().on("addfeature", (evt) => linije.push(wktGeometrije(evt.feature)));

var featuresPoint = new ol.Collection();
var featurePointOverlay = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: featuresPoint,
  }),
  style: vectorStyle,
});
featurePointOverlay.setMap(map);
featurePointOverlay.getSource().on("addfeature", (evt) => tacke.push(wktGeometrije(evt.feature)));

var featuresPolygon = new ol.Collection();
var featurePolygonOverlay = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: featuresPolygon,
  }),
  style: vectorStyle,
});
featurePolygonOverlay.setMap(map);
featurePolygonOverlay.getSource().on("addfeature", (evt) => poligoni.push(wktGeometrije(evt.feature)));

/**Za crtanje i izmjenu geometrije */
var featuresTekuci = new ol.Collection();
var featureTekuciOverlay = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: featuresTekuci,
  }),
  style: vectorStyle,
});
featureTekuciOverlay.setMap(map);

function podesiInterakciju() {
  //uklanja draw i modify
  map.removeInteraction(draw);
  map.removeInteraction(modify);

  if (akcija === "marker") {
    draw = new ol.interaction.Draw({
      features: featuresPoint,
      type: "Point",
    });
    map.addInteraction(draw);
  }
  if (akcija === "linija") {
    draw = new ol.interaction.Draw({
      features: featuresLine,
      type: "LineString",
    });
    map.addInteraction(draw);
  }
  if (akcija === "poligon") {
    draw = new ol.interaction.Draw({
      features: featuresPolygon,
      type: "Polygon",
    });
    map.addInteraction(draw);
  }
  if (akcija === "izmijeni") {
    if (oblik === "Point") {
      modify = new ol.interaction.Modify({
        features: featuresPoint,
        deleteCondition: function (event) {
          return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
        },
      });
    }
    if (oblik === "LineString") {
      modify = new ol.interaction.Modify({
        features: featuresLine,
        deleteCondition: function (event) {
          return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
        },
      });
    }
    if (oblik === "Polygon") {
      modify = new ol.interaction.Modify({
        features: featuresPolygon,
        deleteCondition: function (event) {
          return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
        },
      });
    }
    map.addInteraction(modify);
  }
}

//addInteraction();

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
    if (layer.B.name === "zbunje") {
      console.log(layer.B);
      console.log("ima");
      map.getTargetElement().style.cursor = "pointer";
      return false;
    }
  });
  //map.getTargetElement().style.cursor = hit ? "pointer" : "";
}

var dragAndDrop = new ol.interaction.DragAndDrop({
  formatConstructors: [ol.format.GPX, ol.format.GeoJSON, ol.format.IGC, ol.format.KML, ol.format.TopoJSON],
});

dragAndDrop.on("addfeatures", function (event) {
  var vectorSource = new ol.source.Vector({
    features: event.features,
    projection: event.projection,
  });
  map.getLayers().push(
    new ol.layer.Vector({
      source: vectorSource,
      style: vectorStyle,
    })
  );
  view.fitExtent(vectorSource.getExtent(), map.getSize());
});
map.addInteraction(dragAndDrop);

//Klik na feature
map.on("click", onMouseClick);

function onMouseClick(browserEvent) {
  if (akcija === "atributi" || akcija === "odaberi") {
    var coordinate = browserEvent.coordinate;
    var pixel = map.getPixelFromCoordinate(coordinate);

    var url = rasterLayer.getSource().getGetFeatureInfoUrl(browserEvent.coordinate, map.getView().getResolution(), "EPSG:3857", {
      INFO_FORMAT: "application/json",
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
            showDiv("#atributiDiv");
          }
        });
    }
  }

  //overlay.setPosition(coordinate);
  //map.addOverlay(overlay);
}

function pan() {
  setujAktivnu("#pan");
  akcija = "pan";
}

function odaberi() {
  setujAktivnu("#odaberi");
  akcija = "odaberi";
}

function dodaj() {
  setujAktivnu("#dodaj");
  akcija = "dodaj";
  oblik = "LineString";
}

function izbrisi() {
  setujAktivnu("#izbrisi");
  akcija = "izbrisi";
}

function izmijeni() {
  setujAktivnu("#izmijeni");
  akcija = "izmijeni";
  //oblik = 'LineString';
  podesiInterakciju();
}

function atributi() {
  setujAktivnu("#atributi");
  showDiv("#atributiDiv");
  closeDiv("#pretragaDiv");
  akcija = "atributi";
}

function pretraga() {
  setujAktivnu("#pretraga");
  closeDiv("#atributiDiv");
  showDiv("#pretragaDiv");
  akcija = "pretraga";
}

function sacuvaj() {
  console.log("sacuvaj");
}

function ponisti() {
  console.log("ponisti");
  restartovanje();
}

function filtriranje() {
  cqlFilter = kreiranjeCqlFilteraProstorno();
  //TODO: Dodati u drugoj funkciji atributske filtere
  var params = rasterLayer.getSource().getParams();
  console.log("cql filter", cqlFilter);
  params.CQL_FILTER = cqlFilter;
  //"INTERSECTS(geom, POLYGON((19.256479740142822 42.44482842458774,19.252864122390747 42.44164566810562,19.260900020599365 42.441748595596266,19.259709119796753 42.44445631961446,19.256479740142822 42.44482842458774)))";
  // Uncomment line below and comment line above if you prefer using sld
  // params.sld_body = "yourxmlfiltercontent";
  rasterLayer.getSource().updateParams(params);
  /*featuresPoint.forEach(function (entry) {
    console.log(entry.B);
  });*/
  //console.log(featuresPoint);
}

function brisanje() {
  console.log("brisanje");
}