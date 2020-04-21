var overlay = new ol.Overlay({
  position: "bottom-center",
  element: document.querySelector("#overlay")
});
//overlay.setPosition(coordinate);
//map.addOverlay(overlay);

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

function wktGeometrije(feature) {
  //let geom11 = feature.getGeometry().transform("EPSG:3857", "EPSG:4326");
  //let coords = feature.getGeometry().getCoordinates();
  let format = new ol.format.WKT();

  /*let feature = format.readFeature(wkt, {
    dataProjection: "EPSG:4326",
    featureProjection: "EPSG:3857",
  });*/

  let wktRepresenation = format.writeGeometry(feature.getGeometry(), {
    dataProjection: "EPSG:4326",
    featureProjection: "EPSG:3857",
  });
  //console.log("bbbb", wktRepresenation);
  return wktRepresenation;
}

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