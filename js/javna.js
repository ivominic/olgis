/**Inicijalna deklaracija promjenljivih koje su vezane za konkretan lejer */
const layername = "antenski_stub_v",
  fulllayername = "ekip:" + layername,
  layertitle = "Antenski stubovi";
const tipGeometrije = point;
let opisSlike = "";

let rasterLayer = new ol.layer.Image({
  title: layertitle,
  name: layername,
  source: new ol.source.ImageWMS({
    url: wmsUrl,
    params: {
      LAYERS: fulllayername,
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
  document.querySelector("#objectid").value = atributi["objectid"];
  document.querySelector("#nazivAs").value = atributi["naziv_as"];
  document.querySelector("#nazivLok").value = atributi["naziv_lok"];
  document.querySelector("#opstina").value = atributi["opstina"];
  document.querySelector("#nadVisina").value = atributi["nad_visina"];
  document.querySelector("#tip").value = atributi["tip"];
  document.querySelector("#dimOsnove").value = atributi["dim_osnove"];
  document.querySelector("#visStuba").value = atributi["vis_stuba"];
  document.querySelector("#visinaObj").value = atributi["visina_obj"];
  document.querySelector("#fotoSever").value = atributi["foto_sever"];
  document.querySelector("#fotoIstok").value = atributi["foto_istok"];
  document.querySelector("#fotoJug").value = atributi["foto_jug"];
  document.querySelector("#fotoZapad").value = atributi["foto_zapad"];
  document.querySelector("#idAs").value = atributi["id_as"];
  document.querySelector("#idOperato").value = atributi["id_operato"];
  document.querySelector("#ekipId").value = atributi["ekip_id"];
  document.querySelector("#userId").value = atributi["user_id"];

  //setujDdlVrijednost("#tip", atributi["tip"]);

  if (akcija === "izmijeni") {
    //Ako se radi o izmjeni geometrije, čita objekad za idObjekta i postavlja ga kao vektor na mapi
    wfsZaEdit(idObjekta);
  }
}


/** Unos izmijenjenih vrijednosti atributa, nove fotografije ili unos svih podataka za novu geometriju */
function sacuvaj() {
  if (akcija === "dodaj" && geometrijaZaBazuWkt === "") {
    poruka("Upozorenje", "Potrebno je nacrtati objekat.");
    return false
  }
  if (akcija === "izmijeni" && (geometrijaZaBazuWkt === "" || idObjekta === 0)) {
    poruka("Upozorenje", "Potrebno je izmijeniti geometriju odabranog objekta.");
    return false
  }
  if (akcija === "atributi" && idObjekta === 0) {
    poruka("Upozorenje", "Potrebno je odabrati objekat čije atribute mijenjate.");
    return false
  }

  let podaciForme = new FormData();
  podaciForme.append("id", idObjekta);
  podaciForme.append("akcija", akcija);
  podaciForme.append("geom", geometrijaZaBazuWkt);
  podaciForme.append("objectid", document.querySelector("#objectid").value);
  podaciForme.append("nazivAs", document.querySelector("#nazivAs").value);
  podaciForme.append("nazivLok", document.querySelector("#nazivLok").value);
  podaciForme.append("opstina", document.querySelector("#opstina").value);
  podaciForme.append("nadVisina", document.querySelector("#nadVisina").value);
  podaciForme.append("tip", document.querySelector("#tip").value);
  podaciForme.append("dimOsnove", document.querySelector("#dimOsnove").value);
  podaciForme.append("visStuba", document.querySelector("#visStuba").value);
  podaciForme.append("visinaObj", document.querySelector("#visinaObj").value);
  podaciForme.append("fotoSever", document.querySelector("#fotoSever").value);
  podaciForme.append("fotoIstok", document.querySelector("#fotoIstok").value);
  podaciForme.append("fotoJug", document.querySelector("#fotoJug").value);
  podaciForme.append("fotoZapad", document.querySelector("#fotoZapad").value);
  podaciForme.append("idAs", document.querySelector("#idAs").value);
  podaciForme.append("idOperato", document.querySelector("#idOperato").value);
  podaciForme.append("ekipId", document.querySelector("#ekipId").value);
  podaciForme.append("userId", document.querySelector("#userId").value);
  if (document.querySelector("#dodavanjeSlike").files.length > 0) {
    podaciForme.append("file", document.querySelector("#dodavanjeSlike").files[0]);
  }

  let xhr = new XMLHttpRequest();
  xhr.open('POST', sacuvajZapisUrl, true);
  xhr.timeout = 100000;
  xhr.ontimeout = function () {
    poruka("Greska", "Akcija je prekinuta jer je trajala predugo.");
  };
  xhr.send(podaciForme);
  openModalSpinner();
  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        let jsonResponse = JSON.parse(xhr.responseText);
        if (jsonResponse["success"] === true) {
          poruka("Uspjeh", jsonResponse["message"]);
          restartovanje();
        } else {
          poruka("Upozorenje", jsonResponse["message"]);
        }
        closeModalSpinner();
      } else {
        poruka("Greska", xhr.statusText);
        closeModalSpinner();
      }
    }
  };
}

/** Sve podešava na početne vrijednosti*/
function restartovanje() {
  idObjekta = 0;
  document.querySelector("#idObjekta").value = "";
  document.querySelector("#objectid").value = "";
  document.querySelector("#nazivAs").value = "";
  document.querySelector("#nazivLok").value = "";
  document.querySelector("#opstina").value = "";
  document.querySelector("#nadVisina").value = "";
  document.querySelector("#tip").value = "";
  document.querySelector("#dimOsnove").value = "";
  document.querySelector("#visStuba").value = "";
  document.querySelector("#visinaObj").value = "";
  document.querySelector("#fotoSever").value = "";
  document.querySelector("#fotoIstok").value = "";
  document.querySelector("#fotoJug").value = "";
  document.querySelector("#fotoZapad").value = "";
  document.querySelector("#idAs").value = "";
  document.querySelector("#idOperato").value = "";
  document.querySelector("#ekipId").value = "";
  document.querySelector("#userId").value = "";
  document.querySelector("#dodavanjeSlike").value = "";
  slikaUrl = "";
  opisSlike = "";
  slikeUrl = [];

  isprazniGeometrije();
}

/** Prazni sve promjenljive vezane za crtanje i edit geometrije*/
function isprazniGeometrije() {
  featureTekuciOverlay.getSource().clear();
  geometrijaZaBazuWkt = "";
  nacrtan = false;
  modifikovan = false;
  let paramsRestart = rasterLayer.getSource().getParams();
  rasterLayer.getSource().updateParams(paramsRestart);
}


/**Smještanje mape u div sa id-jem "map" */
let map = new ol.Map({
  target: "map",
  //interactions: ol.interaction.defaults().extend([new ol.interaction.PinchZoom(), new ol.interaction.DragPan()]),
  layers: [osmBaseMap, rasterLayer],
  view: view,
});

/** Prikaz razmjere na mapi */
/*let razmjera = new ol.control.ScaleLine({
  target: document.querySelector("#razmjera")
});*/
//Sve ovo je nepotrebno u OL3, u šestici prikazuje i scale bar
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
    modify.on('modifyend', function (e) {
      modifikovan = true;
      geometrijaZaBazuWkt = wktGeometrije(e.features.getArray()[0]);
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
    draw.on('drawend', function (e) {
      nacrtan = true;
      //TODO: ovo možda dodati u promjeni akcije i poništi
      featureTekuciOverlay.getSource().clear(); //Samo jedan može da se crta
      geometrijaZaBazuWkt = wktGeometrije(e.feature);
      showDiv("#atributiDiv");
      console.log("feature nova geometrija", geometrijaZaBazuWkt);
    });
    modify.on('modifyend', function (e) {
      //Iz nekog razloga na brisanje čvora ne očitava odmah izmjenu
      console.log("broj geometrija", e.features.getArray().length);
      geometrijaZaBazuWkt = wktGeometrije(e.features.getArray()[0]);
      showDiv("#atributiDiv");
      console.log("feature nova mijenjana geometrija", geometrijaZaBazuWkt);
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
  let pixel = map.getEventPixel(evt.originalEvent);
}

/**Omogućava dodavanje novog vektor lejera drag-drop metodom */
let vektorSource = new ol.source.Vector();
let dragAndDrop = new ol.interaction.DragAndDrop({
  formatConstructors: [ol.format.GPX, ol.format.GeoJSON, ol.format.IGC, ol.format.KML, ol.format.TopoJSON],
});
dragAndDrop.on("addfeatures", function (event) {
  let vectorSource = new ol.source.Vector({
    features: event.features,
    projection: event.projection,
  });
  map.getLayers().push(
    new ol.layer.Vector({
      source: vectorSource,
      style: vectorStyle,
    })
  );
  view.fit(vectorSource.getExtent(), map.getSize());
});
map.addInteraction(dragAndDrop);

//Klik na feature
map.on("click", onMouseClick);

function onMouseClick(browserEvent) {
  if (akcija === "atributi" || akcija === "izmijeni") {
    //let coordinate = browserEvent.coordinate;
    //let pixel = map.getPixelFromCoordinate(coordinate);

    let url = rasterLayer.getSource().getGetFeatureInfoUrl(browserEvent.coordinate, map.getView().getResolution(), "EPSG:3857", {
      INFO_FORMAT: "application/json",
    });
    if (url) {
      fetch(url)
        .then(function (response) {
          restartovanje();
          return response.text();
        })
        .then(function (json) {
          let odgovor = JSON.parse(json);
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
  restartovanje();
}

function brisanje() {
  let podaciForme = new FormData();
  podaciForme.append("id", idObjekta);
  let xhr = new XMLHttpRequest();
  xhr.open('POST', izbrisiZapisUrl, true);
  xhr.timeout = 100000;
  xhr.ontimeout = function () {
    poruka("Greska", "Akcija je prekinuta jer je trajala predugo.");
  };
  xhr.send(podaciForme);
  openModalSpinner();

  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        let jsonResponse = JSON.parse(xhr.responseText);
        if (jsonResponse["success"] === true) {
          poruka("Uspjeh", jsonResponse["message"]);
          restartovanje();
        } else {
          poruka("Upozorenje", jsonResponse["message"]);
        }
        closeModalSpinner();
      } else {
        poruka("Greska", xhr.statusText);
        closeModalSpinner();
      }
    }
  };
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
}

/** Filtriranje po atributima */
function kreiranjeCqlFilteraAtributi() {
  let retVal = "";

  document.querySelector("#pretragaIdObjekta").value !== "" && (retVal += "id = " + document.querySelector("#pretragaIdObjekta").value + " AND ");
  document.querySelector("#pretragaObjectid").value !== "" && (retVal += "objectid = " + document.querySelector("#pretragaObjectid").value + " AND ");

  document.querySelector("#pretragaNazivAs").value !== "" && (retVal += "naziv_as ILIKE '%" + document.querySelector("#pretragaNazivAs").value + "%' AND ");
  document.querySelector("#pretragaFotoSever").value !== "" && (retVal += "foto_sever ILIKE '%" + document.querySelector("#pretragaFotoSever").value + "%' AND ");
  document.querySelector("#pretragaFotoIstok").value !== "" && (retVal += "foto_istok ILIKE '%" + document.querySelector("#pretragaFotoIstok").value + "%' AND ");
  document.querySelector("#pretragaFotoJug").value !== "" && (retVal += "foto_jug ILIKE '%" + document.querySelector("#pretragaFotoJug").value + "%' AND ");
  document.querySelector("#pretragaFotoZapad").value !== "" && (retVal += "foto_zapad ILIKE '%" + document.querySelector("#pretragaFotoZapad").value + "%' AND ");

  document.querySelector("#pretragaIdAs").value !== "" && (retVal += "id_as = '" + document.querySelector("#pretragaIdAs").value + "' AND ");
  document.querySelector("#pretragaIdOperato").value !== "" && (retVal += "id_operato = '" + document.querySelector("#pretragaIdOperato").value + "' AND ");
  document.querySelector("#pretragaOpstina").value !== "" && (retVal += "opstina = '" + document.querySelector("#pretragaOpstina").value + "' AND ");
  document.querySelector("#pretragaTip").value !== "" && (retVal += "tip = '" + document.querySelector("#pretragaTip").value + "' AND ");
  document.querySelector("#pretragaNadVisina").value !== "" && (retVal += "nad_visina = '" + document.querySelector("#pretragaNadVisina").value + "' AND ");
  document.querySelector("#pretragaDimOsnove").value !== "" && (retVal += "dim_osnove = '" + document.querySelector("#pretragaDimOsnove").value + "' AND ");
  document.querySelector("#pretragaVisStuba").value !== "" && (retVal += "vis_stuba = '" + document.querySelector("#pretragaVisStuba").value + "' AND ");
  document.querySelector("#pretragaVisinaObj").value !== "" && (retVal += "visina_obj = " + document.querySelector("#pretragaVisinaObj").value + " AND ");
  document.querySelector("#pretragaEkipId").value !== "" && (retVal += "ekip_id = '" + document.querySelector("#pretragaEkipId").value + "' AND ");
  document.querySelector("#pretragaUserId").value !== "" && (retVal += "user_id = '" + document.querySelector("#pretragaUserId").value + "' AND ");

  retVal.length > 5 && (retVal = retVal.substring(0, retVal.length - 5));
  return retVal;
}


function wfsFilter() {
  $.ajax({
    method: "POST",
    url: wfsUrl,
    data: {
      service: "WFS",
      request: "GetFeature",
      typename: fulllayername,
      outputFormat: "application/json",
      srsname: "EPSG:3857",
      //"maxFeatures": 50,
      CQL_FILTER: cqlFilter,
    },
    success: function (response) {
      console.log(response);
      let features = new ol.format.GeoJSON().readFeatures(response);
      console.log(features);
      vektorSource.addFeatures(features);
      console.log(vektorSource.getExtent());
      let boundingExtent = ol.extent.boundingExtent(vektorSource.getExtent());
      boundingExtent = ol.proj.transformExtent(boundingExtent, ol.proj.get("EPSG:4326"), ol.proj.get("EPSG:3857"));
      console.log(boundingExtent);
      console.log("size", map.getSize());
      //map.getView().fit(boundingExtent, map.getSize());
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
      typename: fulllayername,
      outputFormat: "application/json",
      srsname: "EPSG:3857",
      //"maxFeatures": 50,
      CQL_FILTER: "id=" + id.toString(),
    },
    success: function (response) {
      let features = new ol.format.GeoJSON().readFeatures(response);
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
  window.open(wfsUrl + "?version=1.0.0&request=GetFeature&typeName=" + fulllayername + "&outputformat=" + format + dodajCqlFilter, "_blank");
  return false;
}

/**Povezivanje kontrola koje zavise od lejera sa akcijama */
document.querySelector("#btnSacuvaj").addEventListener("click", sacuvaj);
document.querySelector("#btnIzbrisi").addEventListener("click", izbrisi);
document.querySelector("#btnFilter").addEventListener("click", filtriranje);