/**Inicijalna deklaracija promjenljivih koje su vezane za konkretan lejer */
const layername = "drvece_v",
  layertitle = "Žbunje";
const tipGeometrije = lineString;
let opisSlike = "";

var rasterLayer = new ol.layer.Image({
  title: layertitle,
  name: layername,
  source: new ol.source.ImageWMS({
    url: wmsUrl,
    params: {
      LAYERS: "winsoft:" + layername,
    },
    ratio: 1,
    serverType: "geoserver",
  }),
});

/**Popunjavanje komponenti u divu za prikaz atributa, nakon pročitanog odgovora za WMS objekat */
function popuniKontrole(odgovor) {
  let atributi = odgovor.features[0]["properties"];
  idObjekta = atributi["id"];
  document.querySelector("#idObjekta").value = idObjekta;
  document.querySelector("#latinskiNaziv").value = atributi["latinski_naziv"];
  document.querySelector("#narodniNaziv").value = atributi["narodni_naziv"];
  setujDdlVrijednost("#tip", atributi["tip"]);
  setujDdlVrijednost("#zdravstvenoStanje", atributi["zdravstveno_stanje"]);
  document.querySelector("#napomena").value = atributi["napomena"];

  //slika
  let slika = atributi["url_fotografije"];
  slika.length && (slika = slika.substring(slika.lastIndexOf("/") + 1, slika.length));
  slika.length && (slikaUrl = imageUrl + slika);
  opisSlike = atributi["latinski_naziv"] + " - " + atributi["narodni_naziv"];
  if (akcija === "izmijeni") {
    //Ako se radi o izmjeni geometrije, čita objekad za idObjekta i postavlja ga kao vektor na mapi
    wfsZaEdit(idObjekta);
  }
}

//TODO: Ovo napraviti
/** Unos izmijenjenih vrijednosti atributa, nove fotografije ili unos svih podataka za novu geometriju */
function sacuvaj() {
  if (document.querySelector("#dodavanjeSlike").files.length > 0) {
    loadshp({
      url: document.querySelector("#dodavanjeSlike").files[0]
    }, function (geojson) {
      // geojson returned
      console.log(geojson);
    });
  }



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
}

/**Smještanje mape u div sa id-jem "map" */
let map = new ol.Map({
  target: "map",
  layers: [osmBaseMap, rasterLayer],
  view: view,
});

/** Prikaz razmjere na mapi */
/*let razmjera = new ol.control.ScaleLine({
  target: document.querySelector("#razmjera")
});*/
//Sve ovo je nepotrebno u OL3, u šestici prikazuje i scale bar
let razmjera = new ol.control.ScaleLine({
  target: document.querySelector("#razmjera"),
  units: "metric",
  bar: true,
  steps: 4,
  text: true,
  minWidth: 100,
});
map.addControl(razmjera);

/** Dodavanje vektorskih lejera za crtanje i edit geometrije na mapu */
featureLineOverlay.setMap(map);
featurePointOverlay.setMap(map);
featurePolygonOverlay.setMap(map);
featureTekuciOverlay.setMap(map);

/**Podešava kada da se omogući crtanje i izmjena i na kojim lejerima */
function podesiInterakciju() {
  //uklanja draw i modify
  map.removeInteraction(draw);
  map.removeInteraction(modify);

  if (akcija === point) {
    draw = new ol.interaction.Draw({
      features: featuresPoint,
      type: akcija,
    });
    modify = new ol.interaction.Modify({
      features: featuresPoint,
      deleteCondition: function (event) {
        return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
      },
    });
    map.addInteraction(draw);
    map.addInteraction(modify);
  }
  if (akcija === lineString) {
    draw = new ol.interaction.Draw({
      features: featuresLine,
      type: lineString,
    });
    modify = new ol.interaction.Modify({
      features: featuresLine,
      deleteCondition: function (event) {
        return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
      },
    });
    map.addInteraction(draw);
    map.addInteraction(modify);
  }
  if (akcija === polygon) {
    draw = new ol.interaction.Draw({
      features: featuresPolygon,
      type: polygon,
    });
    modify = new ol.interaction.Modify({
      features: featuresPolygon,
      deleteCondition: function (event) {
        return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
      },
    });
    map.addInteraction(draw);
    map.addInteraction(modify);
  }
  if (akcija === "izmijeni") {
    modify = new ol.interaction.Modify({
      features: featuresTekuci,
      deleteCondition: function (event) {
        return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
      },
    });
    map.addInteraction(modify);
    modify.on("modifyend", function (e) {
      modifikovan = true;
      console.log("feature geometrija", wktGeometrije(e.features.getArray()[0]));
    });
  }
  if (akcija === "dodaj") {
    draw = new ol.interaction.Draw({
      features: featuresTekuci,
      type: tipGeometrije,
    });
    modify = new ol.interaction.Modify({
      features: featuresTekuci,
      deleteCondition: function (event) {
        return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
      },
    });
    draw.on("drawend", function (e) {
      nacrtan = true;
      //TODO: ovo možda dodati u promjeni akcije i poništi
      featureTekuciOverlay.getSource().clear(); //Samo jedan može da se crta
      console.log("feature nova geometrija", wktGeometrije(e.feature));
    });
    modify.on("modifyend", function (e) {
      //Iz nekog razloga na brisanje čvora ne očitava odmah izmjenu
      console.log("broj geometrija", e.features.getArray().length);
      console.log("feature nova mijenjana geometrija", wktGeometrije(e.features.getArray()[0]));
    });
    map.addInteraction(draw);
    map.addInteraction(modify);
  }
}

map.on("pointermove", onMouseMove);

function onMouseMove(evt) {
  let position = ol.proj.transform(evt.coordinate, "EPSG:3857", "EPSG:4326");
  document.querySelector("#koordinate").innerHTML = "X:" + position[0] + " Y:" + position[1];
  if (evt.dragging) {
    return;
  }
  map.getTargetElement().style.cursor = "";
  var pixel = map.getEventPixel(evt.originalEvent);
  var hit = map.forEachLayerAtPixel(pixel, function (layer, feature) {
    if (layer === rasterLayer) {
      map.getTargetElement().style.cursor = "pointer";
      return false;
    }
  });
}

/**Omogućava dodavanje novog vektor lejera drag-drop metodom */
var vektorSource = new ol.source.Vector();
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
  //TODO: fitExtent ne radi kako bi trebalo. Pogledati da se ispravi.
  view.fit(vectorSource.getExtent(), map.getSize());
});
map.addInteraction(dragAndDrop);

//Klik na feature
map.on("click", onMouseClick);

function onMouseClick(browserEvent) {
  if (akcija === "atributi" || akcija === "izmijeni") {
    var coordinate = browserEvent.coordinate;
    var pixel = map.getPixelFromCoordinate(coordinate);

    var url = rasterLayer.getSource().getFeatureInfoUrl(browserEvent.coordinate, map.getView().getResolution(), "EPSG:3857", {
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
}

function izbrisi() {
  confirmModal("UKLANJANJE", "Da li ste sigurni da želite da uklonite odabrani objekat?");
}

/**Metoda koja će sve resetovati na početne vrijednosti */
function ponisti() {
  console.log("ponisti");
  //Isprazniti source za crtanje i edit geometrije
  modifikovan = false;
  nacrtan = false;
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
  let params = rasterLayer.getSource().getParams();
  params.CQL_FILTER = cqlFilter;
  rasterLayer.getSource().updateParams(params);
  wfsFilter();
}

/** Filtriranje po atributima */
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

//TODO: Ovo bi trebalo da omogući zumiranje, ali nešto ne radi kako treba. Pogledati i ako proradi, koristiti kod filtriranja WMS-a
function wfsFilter() {
  $.ajax({
    method: "POST",
    url: wfsUrl,
    data: {
      service: "WFS",
      request: "GetFeature",
      typename: "winsoft:" + layername,
      outputFormat: "application/json",
      srsname: "EPSG:3857",
      //"maxFeatures": 50,
      CQL_FILTER: cqlFilter,
    },
    success: function (response) {
      console.log(response);
      var features = new ol.format.GeoJSON().readFeatures(response);
      console.log(features);
      vektorSource.clear();
      vektorSource.addFeatures(features);
      console.log(vektorSource.getExtent());
      /*var boundingExtent = ol.extent.boundingExtent(vektorSource.getExtent());
      boundingExtent = ol.proj.transformExtent(boundingExtent, ol.proj.get("EPSG:4326"), ol.proj.get("EPSG:3857"));
      console.log(boundingExtent);
      console.log("size", map.getSize());*/
      map.getView().fit(vektorSource.getExtent(), map.getSize());
    },
    fail: function (jqXHR, textStatus) {
      console.log("Request failed: " + textStatus);
    },
  });
}

/**Vraća jedan objekat čiji se id predaje i čija geometrija će se mijenjati */
function wfsZaEdit(id) {
  if (id === "") {
    poruka("Upozorenje", "Nije odabran objekat čija geometrija se želi mijenjati.");
    return false;
  }
  $.ajax({
    method: "POST",
    url: wfsUrl,
    data: {
      service: "WFS",
      request: "GetFeature",
      typename: "winsoft:" + layername,
      outputFormat: "application/json",
      srsname: "EPSG:3857",
      //"maxFeatures": 50,
      CQL_FILTER: "id=" + id.toString(),
    },
    success: function (response) {
      var features = new ol.format.GeoJSON().readFeatures(response);
      featureTekuciOverlay.getSource().clear(); //Ispraznimo prethodne zapise da bi imali samo jedan koji ćemo editovati
      featureTekuciOverlay.getSource().addFeatures(features);
    },
    fail: function (jqXHR, textStatus) {
      console.log("Request failed: " + textStatus);
    },
  });
}

/** Download WFS-a u zavisnosti od predatog formata */
function wfsDownload(format) {
  let dodajCqlFilter = "";
  cqlFilter !== "" && (dodajCqlFilter = "&cql_filter=" + cqlFilter);
  window.open(wfsUrl + "?version=1.0.0&request=GetFeature&typeName=winsoft:" + layername + "&outputformat=" + format + dodajCqlFilter, "_blank");
  return false;
}

/**Povezivanje kontrola koje zavise od lejera sa akcijama */
document.querySelector("#btnSacuvaj").addEventListener("click", sacuvaj);
document.querySelector("#btnPonisti").addEventListener("click", ponisti);
document.querySelector("#btnIzbrisi").addEventListener("click", izbrisi);
document.querySelector("#btnFilter").addEventListener("click", filtriranje);