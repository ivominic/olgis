var domainUrl = location.origin; //"http://localhost"; //"http://167.172.171.249"; //location.origin;
//
var wmsUrl = domainUrl + "/geoserver/winsoft/wms";
var wfsUrl = domainUrl + "/geoserver/winsoft/wfs";
var imageUrl = domainUrl + "/slike/";
var tiledRaster = new ol.layer.Tile({
  source: new ol.source.OSM(),
  name: "Podloga",
});
/*var overlay = new ol.Overlay({
  position: "bottom-center",
  element: document.querySelector("#overlay")
});*/

var osmBaseMap = new ol.layer.Tile({
  title: "Open Street Maps",
  type: "base",
  visible: true,
  source: new ol.source.OSM(),
});
var satelitBaseMap = new ol.layer.Tile({
  title: "Satelitski snimak",
  type: "base",
  source: new ol.source.XYZ({
    url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    maxZoom: 23,
  }),
});
//Iskoristiti iz rastera "Image" ukoliko se tako bolje pokaže
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
document.querySelector("#izmijeni").addEventListener("click", izmijeni);
document.querySelector("#atributi").addEventListener("click", atributi);
document.querySelector("#slika").addEventListener("click", slika);
document.querySelector("#marker").addEventListener("click", crtajTacku);
document.querySelector("#linija").addEventListener("click", crtajLiniju);
document.querySelector("#poligon").addEventListener("click", crtajPoligon);
document.querySelector("#pretraga").addEventListener("click", pretraga);
document.querySelector("#podloga_osm").addEventListener("click", osmPodloga);
document.querySelector("#podloga_topo").addEventListener("click", topoPodloga);
document.querySelector("#podloga_satelit").addEventListener("click", satelitPodloga);

document.querySelector("#btnSacuvaj").addEventListener("click", sacuvaj);
document.querySelector("#btnPonisti").addEventListener("click", ponisti);
document.querySelector("#btnIzbrisi").addEventListener("click", izbrisi);

document.querySelector("#btnSacuvaj").addEventListener("click", sacuvaj);
document.querySelector("#btnPonisti").addEventListener("click", ponisti);
document.querySelector("#btnIzbrisi").addEventListener("click", izbrisi);

document.querySelector("#btnFilter").addEventListener("click", filtriranje);

document.querySelector("#confirmPotvrdi").addEventListener("click", confirmPotvrdi);
document.querySelector("#confirmOdustani").addEventListener("click", confirmOdustani);

function popuniKontrole(odgovor) {
  var atributi = odgovor.features[0]["properties"];
  idObjekta = atributi["id"];
  console.log(odgovor);
  document.querySelector("#idObjekta").value = idObjekta;
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
      LAYERS: "winsoft:zbunje_v",
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


var vektorSource = new ol.source.Vector();

/*var featuresTekuci = new ol.Collection();
var featureTekuciOverlay = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: featuresTekuci,
  }),
  style: vectorStyle,
});*/

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

map.on("pointermove", onMouseMove);

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
    //console.log('ln', layer.B.name);
    if (layer.B.name === "zbunje") {
      //console.log(layer.B);
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
  akcija = "pan";
  setujAktivnu("#pan");
}

function odaberi() {
  akcija = "odaberi";
  setujAktivnu("#odaberi");
}

function dodaj() {
  akcija = "dodaj";
  oblik = "LineString";
  setujAktivnu("#dodaj");
}

function izbrisi() {
  confirmModal("UKLANJANJE", "Da li ste sigurni da želite da uklonite odabrani objekat?");
}

function izmijeni() {
  akcija = "izmijeni";
  //oblik = 'LineString';
  setujAktivnu("#izmijeni");
}

function atributi() {
  showDiv("#atributiDiv");
  closeDiv("#pretragaDiv");
  akcija = "atributi";
  setujAktivnu("#atributi");
}

function pretraga() {
  closeDiv("#atributiDiv");
  showDiv("#pretragaDiv");
  akcija = "pretraga";
  setujAktivnu("#pretraga");
}

function sacuvaj() {
  console.log("sacuvaj");
}

function ponisti() {
  console.log("ponisti");
  restartovanje();
}

function brisanje() {
  console.log("brisanje");
}

/* Filter wms-a po prostornim i atributskim podacima*/
function filtriranje() {
  let prostorniFilter = kreiranjeCqlFilteraProstorno();
  let atributniFilter = kreiranjeCqlFilteraAtributi();
  if (prostorniFilter !== "" && atributniFilter !== "") {
    cqlFilter = "(" + prostorniFilter + ") AND " + atributniFilter;
  } else {
    cqlFilter = prostorniFilter + atributniFilter;
  }
  if (cqlFilter === "") {
    return false;
  }
  console.log("cql filter", cqlFilter);
  let params = rasterLayer.getSource().getParams();
  params.CQL_FILTER = cqlFilter;
  //"INTERSECTS(geom, POLYGON((19.256479740142822 42.44482842458774,19.252864122390747 42.44164566810562,19.260900020599365 42.441748595596266,19.259709119796753 42.44445631961446,19.256479740142822 42.44482842458774)))";
  // Uncomment line below and comment line above if you prefer using sld
  // params.sld_body = "yourxmlfiltercontent";
  rasterLayer.getSource().updateParams(params);
  /*featuresPoint.forEach(function (entry) {
    console.log(entry.B);
  });*/
  //console.log(featuresPoint);
  //wfsFilter();

}

function kreiranjeCqlFilteraAtributi() {
  let retVal = "";

  document.querySelector("#pretragaIdObjekta").value !== "" && (retVal += "id = " + document.querySelector("#pretragaIdObjekta").value + " AND ");
  document.querySelector("#pretragaLatinskiNaziv").value !== "" && (retVal += "latinski_naziv ILIKE '%" + document.querySelector("#pretragaLatinskiNaziv").value + "%' AND ");
  document.querySelector("#pretragaNarodniNaziv").value !== "" && (retVal += "narodni_naziv ILIKE '%" + document.querySelector("#pretragaNarodniNaziv").value + "%' AND ");
  document.querySelector("#pretragaTip").value !== "" && (retVal += "tip = '" + document.querySelector("#pretragaTip").value + "' AND ");
  document.querySelector("#pretragaZdravstvenoStanje").value !== "" && (retVal += "zdravstveno_stanje = '" + document.querySelector("#pretragaZdravstvenoStanje").value + "' AND ");
  document.querySelector("#pretragaNapomena").value !== "" && (retVal += "napomena ILIKE '%" + document.querySelector("#pretragaNapomena").value + "%' AND ");
  retVal.length > 5 && (retVal = retVal.substring(0, retVal.length - 5));
  return retVal;
}

function wfsFilter() {

  //window.open(wfsUrl + "?version=1.0.0&request=GetFeature&typeName=wisnoft:zbunje_v&outputformat=SHAPE-ZIP", "_blank");
  //return false;
  $.ajax({
    method: 'POST',
    url: wfsUrl,
    data: {
      "service": "WFS",
      "request": "GetFeature",
      "typename": "winsoft:zbunje_v",
      //"outputFormat": "application/json",
      "outputFormat": "SHAPE-ZIP",
      "srsname": "EPSG:3857",
      //"maxFeatures": 50,
      "CQL_FILTER": cqlFilter
    },
    success: function (response) {
      console.log(response);
      var features = new ol.format.GeoJSON().readFeatures(response);
      console.log(features);
      vektorSource.addFeatures(features);
      console.log(vektorSource.getExtent());
      var boundingExtent = ol.extent.boundingExtent(vektorSource.getExtent());
      boundingExtent = ol.proj.transformExtent(boundingExtent, ol.proj.get('EPSG:4326'), ol.proj.get('EPSG:3857'));
      console.log(boundingExtent);
      console.log('size', map.getSize());
      //map.getView().fit(boundingExtent, map.getSize());
    },
    fail: function (jqXHR, textStatus) {
      console.log("Request failed: " + textStatus);
    }
  });
};

function osmPodloga() {
  map.getLayers().setAt(0, osmBaseMap);
}

function topoPodloga() {
  map.getLayers().setAt(0, katastarBaseMap);
}

function satelitPodloga() {
  map.getLayers().setAt(0, satelitBaseMap);
}