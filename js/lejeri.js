let antenskiStub = new ol.layer.Image({
  title: "Antenski stub",
  name: "antenski_stub_v",
  source: new ol.source.ImageWMS({
    url: wmsUrl,
    params: {
      LAYERS: "ekip:antenski_stub_v",
    },
    ratio: 1,
    serverType: "geoserver",
  }),
});

let tkkCijev = new ol.layer.Image({
  title: "Tkk cijev",
  name: "tkk_cijev_v",
  source: new ol.source.ImageWMS({
    url: wmsUrl,
    params: {
      LAYERS: "ekip:tkk_cijev_v",
    },
    ratio: 1,
    serverType: "geoserver",
  }),
});

let tkkKabl = new ol.layer.Image({
  title: "Tkk kabl",
  name: "tkk_kabl_v",
  source: new ol.source.ImageWMS({
    url: wmsUrl,
    params: {
      LAYERS: "ekip:tkk_kabl_v",
    },
    ratio: 1,
    serverType: "geoserver",
  }),
});

let tkkNastavak = new ol.layer.Image({
  title: "Tkk nastavak",
  name: "tkk_nastavak_v",
  source: new ol.source.ImageWMS({
    url: wmsUrl,
    params: {
      LAYERS: "ekip:tkk_nastavak_v",
    },
    ratio: 1,
    serverType: "geoserver",
  }),
});

let tkkOkna = new ol.layer.Image({
  title: "Tkk okna",
  name: "tkk_okna_v",
  source: new ol.source.ImageWMS({
    url: wmsUrl,
    params: {
      LAYERS: "ekip:tkk_okna_v",
    },
    ratio: 1,
    serverType: "geoserver",
  }),
});

let tkkTrasa = new ol.layer.Image({
  title: "Tkk trasa",
  name: "tkk_trasa_v",
  source: new ol.source.ImageWMS({
    url: wmsUrl,
    params: {
      LAYERS: "ekip:tkk_trasa_v",
    },
    ratio: 1,
    serverType: "geoserver",
  }),
});

let tkkZavrsetak = new ol.layer.Image({
  title: "Tkk završetak",
  name: "tkk_zavrsetak_v",
  source: new ol.source.ImageWMS({
    url: wmsUrl,
    params: {
      LAYERS: "ekip:tkk_zavrsetak_v",
    },
    ratio: 1,
    serverType: "geoserver",
  }),
});

let vvKabl = new ol.layer.Image({
  title: "VV kabl",
  name: "vv_kabl_v",
  source: new ol.source.ImageWMS({
    url: wmsUrl,
    params: {
      LAYERS: "ekip:vv_kabl_v",
    },
    ratio: 1,
    serverType: "geoserver",
  }),
});

let vvNastavak = new ol.layer.Image({
  title: "VV nastavak",
  name: "vv_nastavak_v",
  source: new ol.source.ImageWMS({
    url: wmsUrl,
    params: {
      LAYERS: "ekip:vv_nastavak_v",
    },
    ratio: 1,
    serverType: "geoserver",
  }),
});

let vvStub = new ol.layer.Image({
  title: "VV stub",
  name: "vv_stub_v",
  source: new ol.source.ImageWMS({
    url: wmsUrl,
    params: {
      LAYERS: "ekip:vv_stub_v",
    },
    ratio: 1,
    serverType: "geoserver",
  }),
});

let vvTrasa = new ol.layer.Image({
  title: "VV trasa",
  name: "vv_trasa_v",
  source: new ol.source.ImageWMS({
    url: wmsUrl,
    params: {
      LAYERS: "ekip:vv_trasa_v",
    },
    ratio: 1,
    serverType: "geoserver",
  }),
});

let vvZavrsetak = new ol.layer.Image({
  title: "VV završetak",
  name: "vv_zavrsetak_v",
  source: new ol.source.ImageWMS({
    url: wmsUrl,
    params: {
      LAYERS: "ekip:vv_zavrsetak_v",
    },
    ratio: 1,
    serverType: "geoserver",
  }),
});

let zgrada = new ol.layer.Image({
  title: "Zgrada",
  name: "zgrada_v",
  source: new ol.source.ImageWMS({
    url: wmsUrl,
    params: {
      LAYERS: "ekip:zgrada_v",
    },
    ratio: 1,
    serverType: "geoserver",
  }),
});

map.addLayer(antenskiStub);
map.addLayer(tkkCijev);
map.addLayer(tkkKabl);
map.addLayer(tkkNastavak);
map.addLayer(tkkOkna);
map.addLayer(tkkTrasa);
map.addLayer(tkkZavrsetak);
map.addLayer(vvKabl);
map.addLayer(vvNastavak);
map.addLayer(vvStub);
map.addLayer(vvTrasa);
map.addLayer(vvZavrsetak);
map.addLayer(zgrada);

document.querySelector("#chkAntenskiStub").addEventListener("change", function () {
  if (this.checked) {
    antenskiStub.setVisible(true);
  } else {
    antenskiStub.setVisible(false);
  }
});
document.querySelector("#chkTkkCijev").addEventListener("change", function () {
  if (this.checked) {
    tkkCijev.setVisible(true);
  } else {
    tkkCijev.setVisible(false);
  }
});
document.querySelector("#chkTkkKabl").addEventListener("change", function () {
  if (this.checked) {
    tkkKabl.setVisible(true);
  } else {
    tkkKabl.setVisible(false);
  }
});
document.querySelector("#chkTkkNastavak").addEventListener("change", function () {
  if (this.checked) {
    tkkNastavak.setVisible(true);
  } else {
    tkkNastavak.setVisible(false);
  }
});
document.querySelector("#chkTkkOkna").addEventListener("change", function () {
  if (this.checked) {
    tkkOkna.setVisible(true);
  } else {
    tkkOkna.setVisible(false);
  }
});
document.querySelector("#chkTkkTrasa").addEventListener("change", function () {
  if (this.checked) {
    tkkTrasa.setVisible(true);
  } else {
    tkkTrasa.setVisible(false);
  }
});
document.querySelector("#chkTkkZavrsetak").addEventListener("change", function () {
  if (this.checked) {
    tkkZavrsetak.setVisible(true);
  } else {
    tkkZavrsetak.setVisible(false);
  }
});
document.querySelector("#chkVvKabl").addEventListener("change", function () {
  if (this.checked) {
    vvKabl.setVisible(true);
  } else {
    vvKabl.setVisible(false);
  }
});
document.querySelector("#chkVvNastavak").addEventListener("change", function () {
  if (this.checked) {
    vvNastavak.setVisible(true);
  } else {
    vvNastavak.setVisible(false);
  }
});
document.querySelector("#chkVvStub").addEventListener("change", function () {
  if (this.checked) {
    vvStub.setVisible(true);
  } else {
    vvStub.setVisible(false);
  }
});
document.querySelector("#chkVvTrasa").addEventListener("change", function () {
  if (this.checked) {
    vvTrasa.setVisible(true);
  } else {
    vvTrasa.setVisible(false);
  }
});
document.querySelector("#chkVvZavrsetak").addEventListener("change", function () {
  if (this.checked) {
    vvZavrsetak.setVisible(true);
  } else {
    vvZavrsetak.setVisible(false);
  }
});
document.querySelector("#chkZgrada").addEventListener("change", function () {
  if (this.checked) {
    zgrada.setVisible(true);
  } else {
    zgrada.setVisible(false);
  }
});

document.querySelector("#radioOsm").addEventListener("change", function () {
  map.getLayers().setAt(0, osmBaseMap);
});
document.querySelector("#radioSatelit").addEventListener("change", function () {
  map.getLayers().setAt(0, satelitBaseMap);
});
document.querySelector("#radioTopo").addEventListener("change", function () {
  map.getLayers().setAt(0, topoMap);
});
document.querySelector("#radioHiker").addEventListener("change", function () {
  map.getLayers().setAt(0, hikerMap);
});


/***** PRETRAGA LEJERA */
document.querySelector("#ddlLejerPretraga").addEventListener("change", function () {
  prikaziDivPretraga(this.value);
});

function prikaziDivPretraga(ddlValue) {
  sakrijSveDivPretrage();
  if (ddlValue === "antenskiStub") {
    document.querySelector("#divAntenskiStub").style.display = "block";
    document.querySelector("#chkAntenskiStub").checked = true;
    antenskiStub.setVisible(true);
  }
  if (ddlValue === "tkkCijev") {
    document.querySelector("#divTkkCijev").style.display = "block";
    document.querySelector("#chkTkkCijev").checked = true;
    tkkCijev.setVisible(true);
  }
  if (ddlValue === "tkkKabl") {
    document.querySelector("#divTkkKabl").style.display = "block";
    document.querySelector("#chkTkkKabl").checked = true;
    tkkKabl.setVisible(true);
  }
  if (ddlValue === "tkkNastavak") {
    document.querySelector("#divTkkNastavak").style.display = "block";
    document.querySelector("#chkTkkNastavak").checked = true;
    tkkNastavak.setVisible(true);
  }
  if (ddlValue === "tkkOkna") {
    document.querySelector("#divTkkOkna").style.display = "block";
    document.querySelector("#chkTkkOkna").checked = true;
    tkkOkna.setVisible(true);
  }
  if (ddlValue === "tkkTrasa") {
    document.querySelector("#divTkkTrasa").style.display = "block";
    document.querySelector("#chkTkkTrasa").checked = true;
    tkkTrasa.setVisible(true);
  }
  if (ddlValue === "tkkZavrsetak") {
    document.querySelector("#divTkkZavrsetak").style.display = "block";
    document.querySelector("#chkTkkZavrsetak").checked = true;
    tkkZavrsetak.setVisible(true);
  }
  if (ddlValue === "vvKabl") {
    document.querySelector("#divVvKabl").style.display = "block";
    document.querySelector("#chkVvKabl").checked = true;
    vvKabl.setVisible(true);
  }
  if (ddlValue === "vvNastavak") {
    document.querySelector("#divVvNastavak").style.display = "block";
    document.querySelector("#chkVvNastavak").checked = true;
    vvNastavak.setVisible(true);
  }
  if (ddlValue === "vvStub") {
    document.querySelector("#divVvStub").style.display = "block";
    document.querySelector("#chkVvStub").checked = true;
    vvStub.setVisible(true);
  }
  if (ddlValue === "vvTrasa") {
    document.querySelector("#divVvTrasa").style.display = "block";
    document.querySelector("#chkVvTrasa").checked = true;
    vvTrasa.setVisible(true);
  }
  if (ddlValue === "vvZavrsetak") {
    document.querySelector("#divVvZavrsetak").style.display = "block";
    document.querySelector("#chkVvZavrsetak").checked = true;
    vvZavrsetak.setVisible(true);
  }
  if (ddlValue === "zgrada") {
    document.querySelector("#divZgrada").style.display = "block";
    document.querySelector("#chkZgrada").checked = true;
    zgrada.setVisible(true);
  }
}

function sakrijSveDivPretrage() {
  document.querySelector("#divAntenskiStub").style.display = "none";
  document.querySelector("#divTkkCijev").style.display = "none";
  document.querySelector("#divTkkKabl").style.display = "none";
  document.querySelector("#divTkkNastavak").style.display = "none";
  document.querySelector("#divTkkOkna").style.display = "none";
  document.querySelector("#divTkkTrasa").style.display = "none";
  document.querySelector("#divTkkZavrsetak").style.display = "none";
  document.querySelector("#divVvKabl").style.display = "none";
  document.querySelector("#divVvNastavak").style.display = "none";
  document.querySelector("#divVvStub").style.display = "none";
  document.querySelector("#divVvTrasa").style.display = "none";
  document.querySelector("#divVvZavrsetak").style.display = "none";
  document.querySelector("#divZgrada").style.display = "none";
}