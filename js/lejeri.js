let antenskiStub = kreirajNoviImageWmsLejer("Antenski stub", "antenski_stub_v", "ekip:antenski_stub_v");
let tkkCijev = kreirajNoviImageWmsLejer("Tkk cijev", "tkk_cijev_v", "ekip:tkk_cijev_v");
let tkkKabl = kreirajNoviImageWmsLejer("Tkk kabl", "tkk_kabl_v", "ekip:tkk_kabl_v");
let tkkNastavak = kreirajNoviImageWmsLejer("Tkk nastavak", "tkk_nastavak_v", "ekip:tkk_nastavak_v");
let tkkOkna = kreirajNoviImageWmsLejer("Tkk okna", "tkk_okna_v", "ekip:tkk_okna_v");
let tkkTrasa = kreirajNoviImageWmsLejer("Tkk trasa", "tkk_trasa_v", "ekip:tkk_trasa_v");
let tkkZavrsetak = kreirajNoviImageWmsLejer("Tkk završetak", "tkk_zavrsetak_v", "ekip:tkk_zavrsetak_v");
let vvKabl = kreirajNoviImageWmsLejer("VV kabl", "vv_kabl_v", "ekip:vv_kabl_v");
let vvNastavak = kreirajNoviImageWmsLejer("VV nastavak", "vv_nastavak_v", "ekip:vv_nastavak_v");
let vvStub = kreirajNoviImageWmsLejer("VV stub", "vv_stub_v", "ekip:vv_stub_v");
let vvTrasa = kreirajNoviImageWmsLejer("VV trasa", "vv_trasa_v", "ekip:vv_trasa_v");
let vvZavrsetak = kreirajNoviImageWmsLejer("VV završetak", "vv_zavrsetak_v", "ekip:vv_zavrsetak_v");
let zgrada = kreirajNoviImageWmsLejer("Zgrada", "zgrada_v", "ekip:zgrada_v");

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


/*** FILTRIRANJE */

/**Povezivanje kontrola koje zavise od lejera sa akcijama */
document.querySelector("#btnFilter").addEventListener("click", filtriranje);

function filtriranje() {
  let ddlValue = document.querySelector("#ddlLejerPretraga").value,
    prostorniFilter = "",
    atributniFilter = "";
  prostorniFilter = kreiranjeCqlFilteraProstorno();
  //Atributi se pretražuju samo ako je odabran lejer. Za sve lejere se radi samo prostorna selekcija
  (ddlValue !== "") && (atributniFilter = kreiranjeCqlFilteraAtributiZaJavnuStranicu(ddlValue));
  if (prostorniFilter !== "" && atributniFilter !== "") {
    cqlFilter = "(" + prostorniFilter + ") AND " + atributniFilter;
  } else {
    cqlFilter = prostorniFilter + atributniFilter;
  }
  if (cqlFilter === "") {
    return false;
  }

  if (ddlValue === "") {
    //TODO filter svih prikazanih lejera
    map.getLayers().forEach(function (layer) {
      if (layer instanceof ol.layer.Image) {
        if (layer.get("visible")) {
          let params = layer.getSource().getParams();
          params.CQL_FILTER = cqlFilter;
          layer.getSource().updateParams(params);
        }
      }

    });

  } else {
    if (ddlValue === "antenskiStub") {
      let params = antenskiStub.getSource().getParams();
      params.CQL_FILTER = cqlFilter;
      antenskiStub.getSource().updateParams(params);
    }
    if (ddlValue === "tkkCijev") {
      let params = tkkCijev.getSource().getParams();
      params.CQL_FILTER = cqlFilter;
      tkkCijev.getSource().updateParams(params);
    }
    if (ddlValue === "tkkKabl") {
      let params = tkkKabl.getSource().getParams();
      params.CQL_FILTER = cqlFilter;
      tkkKabl.getSource().updateParams(params);
    }
    if (ddlValue === "tkkNastavak") {
      let params = tkkNastavak.getSource().getParams();
      params.CQL_FILTER = cqlFilter;
      tkkNastavak.getSource().updateParams(params);
    }
    if (ddlValue === "tkkOkna") {
      let params = tkkOkna.getSource().getParams();
      params.CQL_FILTER = cqlFilter;
      tkkOkna.getSource().updateParams(params);
    }
    if (ddlValue === "tkkTrasa") {
      let params = tkkTrasa.getSource().getParams();
      params.CQL_FILTER = cqlFilter;
      tkkTrasa.getSource().updateParams(params);
    }
    if (ddlValue === "tkkZavrsetak") {
      let params = tkkZavrsetak.getSource().getParams();
      params.CQL_FILTER = cqlFilter;
      tkkZavrsetak.getSource().updateParams(params);
    }
    if (ddlValue === "vvKabl") {
      let params = vvKabl.getSource().getParams();
      params.CQL_FILTER = cqlFilter;
      vvKabl.getSource().updateParams(params);
    }
    if (ddlValue === "vvNastavak") {
      let params = vvNastavak.getSource().getParams();
      params.CQL_FILTER = cqlFilter;
      vvNastavak.getSource().updateParams(params);
    }
    if (ddlValue === "vvStub") {
      let params = vvStub.getSource().getParams();
      params.CQL_FILTER = cqlFilter;
      vvStub.getSource().updateParams(params);
    }
    if (ddlValue === "vvTrasa") {
      let params = vvTrasa.getSource().getParams();
      params.CQL_FILTER = cqlFilter;
      vvTrasa.getSource().updateParams(params);
    }
    if (ddlValue === "vvZavrsetak") {
      let params = vvZavrsetak.getSource().getParams();
      params.CQL_FILTER = cqlFilter;
      vvZavrsetak.getSource().updateParams(params);
    }
    if (ddlValue === "zgrada") {
      let params = zgrada.getSource().getParams();
      params.CQL_FILTER = cqlFilter;
      zgrada.getSource().updateParams(params);
    }
  }
}

/** Filtriranje po atributima */
function kreiranjeCqlFilteraAtributiZaJavnuStranicu(ddlValue) {
  let retVal = "";

  if (ddlValue === "antenskiStub") {
    document.querySelector("#pretragaASnazivLok").value !== "" && (retVal += "naziv_lok ILIKE '%" + document.querySelector("#pretragaASnazivLok").value + "%' AND ");
    document.querySelector("#pretragaASopstina").value !== "" && (retVal += "opstina ILIKE '%" + document.querySelector("#pretragaASopstina").value + "%' AND ");
    document.querySelector("#pretragaASnazivAs").value !== "" && (retVal += "naziv_as = '" + document.querySelector("#pretragaASnazivAs").value + "' AND ");
    document.querySelector("#pretragaAStip").value !== "" && (retVal += "tip = '" + document.querySelector("#pretragaAStip").value + "' AND ");
    document.querySelector("#pretragaASidAs").value !== "" && (retVal += "id_as = '" + document.querySelector("#pretragaASidAs").value + "' AND ");
    document.querySelector("#pretragaASidOperato").value !== "" && (retVal += "id_operato = '" + document.querySelector("#pretragaASidOperato").value + "' AND ");
  }
  if (ddlValue === "tkkCijev") {
    document.querySelector("#pretragaTCcevTip").value !== "" && (retVal += "cev_tip = '" + document.querySelector("#pretragaTCcevTip").value + "' AND ");
    document.querySelector("#pretragaTCcevStatus").value !== "" && (retVal += "cev_status = '" + document.querySelector("#pretragaTCcevStatus").value + "' AND ");
    document.querySelector("#pretragaTCkorisnik").value !== "" && (retVal += "korisnik = '" + document.querySelector("#pretragaTCkorisnik").value + "' AND ");
    document.querySelector("#pretragaTCcevParent").value !== "" && (retVal += "cev_parent = '" + document.querySelector("#pretragaTCcevParent").value + "' AND ");
    document.querySelector("#pretragaTCidCev").value !== "" && (retVal += "id_cev = '" + document.querySelector("#pretragaTCidCev").value + "' AND ");
    document.querySelector("#pretragaTCpopPresekOd").value !== "" && (retVal += "pop_presek >= " + document.querySelector("#pretragaTCpopPresekOd").value + " AND ");
    document.querySelector("#pretragaTCpopPresekDo").value !== "" && (retVal += "pop_presek <= " + document.querySelector("#pretragaTCpopPresekDo").value + " AND ");
    document.querySelector("#pretragaTCprohodnost").value !== "" && (retVal += "prohodnost = " + document.querySelector("#pretragaTCprohodnost").value + " AND ");
    document.querySelector("#pretragaTCidOperato").value !== "" && (retVal += "id_operato = '" + document.querySelector("#pretragaTCidOperato").value + "' AND ");
  }
  if (ddlValue === "tkkKabl") {
    document.querySelector("#pretragaTKnamena").value !== "" && (retVal += "namena ILIKE '%" + document.querySelector("#pretragaTKnamena").value + "%' AND ");
    document.querySelector("#pretragaTKpolaganje").value !== "" && (retVal += "polaganje ILIKE '%" + document.querySelector("#pretragaTKpolaganje").value + "%' AND ");
    document.querySelector("#pretragaTKoznaka").value !== "" && (retVal += "oznaka = '" + document.querySelector("#pretragaTKoznaka").value + "' AND ");
    document.querySelector("#pretragaTKtip").value !== "" && (retVal += "tip = '" + document.querySelector("#pretragaTKtip").value + "' AND ");
    document.querySelector("#pretragaTKstatus").value !== "" && (retVal += "status = '" + document.querySelector("#pretragaTKstatus").value + "' AND ");
    document.querySelector("#pretragaTKidOperato").value !== "" && (retVal += "id_operato = '" + document.querySelector("#pretragaTKidOperato").value + "' AND ");
  }
  if (ddlValue === "tkkNastavak") {
    document.querySelector("#pretragaTNpolozaj").value !== "" && (retVal += "polozaj = '" + document.querySelector("#pretragaTNpolozaj").value + "' AND ");
    document.querySelector("#pretragaTNtipNastav").value !== "" && (retVal += "tip_nastav = '" + document.querySelector("#pretragaTNtipNastav").value + "' AND ");
    document.querySelector("#pretragaTNidNas").value !== "" && (retVal += "id_nas = '" + document.querySelector("#pretragaTNidNas").value + "' AND ");
    document.querySelector("#pretragaTNidOperato").value !== "" && (retVal += "id_operato = '" + document.querySelector("#pretragaTNidOperato").value + "' AND ");
  }
  if (ddlValue === "tkkOkna") {
    document.querySelector("#pretragaTOtipOkn").value !== "" && (retVal += "tip_okn = '" + document.querySelector("#pretragaTOtipOkn").value + "' AND ");
    document.querySelector("#pretragaTOidOkn").value !== "" && (retVal += "id_okn = '" + document.querySelector("#pretragaTOidOkn").value + "' AND ");
    document.querySelector("#pretragaTOidOperato").value !== "" && (retVal += "id_operato = '" + document.querySelector("#pretragaTOidOperato").value + "' AND ");
  }
  if (ddlValue === "tkkTrasa") {
    document.querySelector("#pretragaTTopstina").value !== "" && (retVal += "opstina ILIKE '%" + document.querySelector("#pretragaTTopstina").value + "%' AND ");
    document.querySelector("#pretragaTTlokacija").value !== "" && (retVal += "lokacija ILIKE '%" + document.querySelector("#pretragaTTlokacija").value + "%' AND ");
    document.querySelector("#pretragaTTmrPrisN").value !== "" && (retVal += "mr_pris_n ILIKE '%" + document.querySelector("#pretragaTTmrPrisN").value + "%' AND ");
    document.querySelector("#pretragaTTgeodSnTr").value !== "" && (retVal += "geod_sn_tr ILIKE '%" + document.querySelector("#pretragaTTgeodSnTr").value + "%' AND ");
    document.querySelector("#pretragaTTtrasa").value !== "" && (retVal += "trasa = '" + document.querySelector("#pretragaTTtrasa").value + "' AND ");
    document.querySelector("#pretragaTTprenosniP").value !== "" && (retVal += "prenosni_p = '" + document.querySelector("#pretragaTTprenosniP").value + "' AND ");
    document.querySelector("#pretragaTTidTrasa").value !== "" && (retVal += "id_trasa = '" + document.querySelector("#pretragaTTidTrasa").value + "' AND ");
    document.querySelector("#pretragaTTidOperato").value !== "" && (retVal += "id_operato = '" + document.querySelector("#pretragaTTidOperato").value + "' AND ");
  }
  if (ddlValue === "tkkZavrsetak") {
    document.querySelector("#pretragaTZmestoOpis").value !== "" && (retVal += "mesto_opis ILIKE '%" + document.querySelector("#pretragaTZmestoOpis").value + "%' AND ");
    document.querySelector("#pretragaTZtipZavrse").value !== "" && (retVal += "tip_zavrse = '" + document.querySelector("#pretragaTZtipZavrse").value + "' AND ");
    document.querySelector("#pretragaTZidZav").value !== "" && (retVal += "id_zav = '" + document.querySelector("#pretragaTZidZav").value + "' AND ");
    document.querySelector("#pretragaTZidOperato").value !== "" && (retVal += "id_operato = '" + document.querySelector("#pretragaTZidOperato").value + "' AND ");
  }
  if (ddlValue === "vvKabl") {
    document.querySelector("#pretragaVKnamena").value !== "" && (retVal += "namena ILIKE '%" + document.querySelector("#pretragaVKnamena").value + "%' AND ");
    document.querySelector("#pretragaVKpolaganje").value !== "" && (retVal += "polaganje ILIKE '%" + document.querySelector("#pretragaVKpolaganje").value + "%' AND ");
    document.querySelector("#pretragaVKoznaka").value !== "" && (retVal += "oznaka = '" + document.querySelector("#pretragaVKoznaka").value + "' AND ");
    document.querySelector("#pretragaVKtip").value !== "" && (retVal += "tip = '" + document.querySelector("#pretragaVKtip").value + "' AND ");
    document.querySelector("#pretragaVKstatus").value !== "" && (retVal += "status = '" + document.querySelector("#pretragaVKstatus").value + "' AND ");
    document.querySelector("#pretragaVKidOperato").value !== "" && (retVal += "id_operato = '" + document.querySelector("#pretragaVKidOperato").value + "' AND ");
  }
  if (ddlValue === "vvNastavak") {
    document.querySelector("#pretragaVNpolozaj").value !== "" && (retVal += "polozaj = '" + document.querySelector("#pretragaVNpolozaj").value + "' AND ");
    document.querySelector("#pretragaVNtipNastav").value !== "" && (retVal += "tip_nastav = '" + document.querySelector("#pretragaVNtipNastav").value + "' AND ");
    document.querySelector("#pretragaVNtipSpojn").value !== "" && (retVal += "tip_spojn = '" + document.querySelector("#pretragaVNtipSpojn").value + "' AND ");
    document.querySelector("#pretragaVNidNas").value !== "" && (retVal += "id_nas = '" + document.querySelector("#pretragaVNidNas").value + "' AND ");
    document.querySelector("#pretragaVNidOperato").value !== "" && (retVal += "id_operato = '" + document.querySelector("#pretragaVNidOperato").value + "' AND ");
  }
  if (ddlValue === "vvStub") {
    document.querySelector("#pretragaVStip").value !== "" && (retVal += "tip = '" + document.querySelector("#pretragaVStip").value + "' AND ");
    document.querySelector("#pretragaVSidVvStub").value !== "" && (retVal += "id_vv_stub = '" + document.querySelector("#pretragaVSidVvStub").value + "' AND ");
    document.querySelector("#pretragaVSidOperato").value !== "" && (retVal += "id_operato = '" + document.querySelector("#pretragaVSidOperato").value + "' AND ");
  }
  if (ddlValue === "vvTrasa") {
    document.querySelector("#pretragaVTopstina").value !== "" && (retVal += "opstina ILIKE '%" + document.querySelector("#pretragaVTopstina").value + "%' AND ");
    document.querySelector("#pretragaVTlokacija").value !== "" && (retVal += "lokacija ILIKE '%" + document.querySelector("#pretragaVTlokacija").value + "%' AND ");
    document.querySelector("#pretragaVTmrPrisN").value !== "" && (retVal += "mr_pris_n ILIKE '%" + document.querySelector("#pretragaVTmrPrisN").value + "%' AND ");
    document.querySelector("#pretragaVTgeodSnTr").value !== "" && (retVal += "geod_sn_tr ILIKE '%" + document.querySelector("#pretragaVTgeodSnTr").value + "%' AND ");
    document.querySelector("#pretragaVTtrasa").value !== "" && (retVal += "trasa = '" + document.querySelector("#pretragaVTtrasa").value + "' AND ");
    document.querySelector("#pretragaVTprenosniP").value !== "" && (retVal += "prenosni_p = '" + document.querySelector("#pretragaVTprenosniP").value + "' AND ");
    document.querySelector("#pretragaVTidTrasa").value !== "" && (retVal += "id_vv_tras = '" + document.querySelector("#pretragaVTidTrasa").value + "' AND ");
    document.querySelector("#pretragaVTidOperato").value !== "" && (retVal += "id_operato = '" + document.querySelector("#pretragaVTidOperato").value + "' AND ");
  }
  if (ddlValue === "vvZavrsetak") {
    document.querySelector("#pretragaVZmestoOpis").value !== "" && (retVal += "mesto_opis ILIKE '%" + document.querySelector("#pretragaVZmestoOpis").value + "%' AND ");
    document.querySelector("#pretragaVZtipZavrse").value !== "" && (retVal += "tip_zavrse = '" + document.querySelector("#pretragaVZtipZavrse").value + "' AND ");
    document.querySelector("#pretragaVZidZav").value !== "" && (retVal += "id_vv_zav = '" + document.querySelector("#pretragaVZidZav").value + "' AND ");
    document.querySelector("#pretragaVZidOperato").value !== "" && (retVal += "id_operato = '" + document.querySelector("#pretragaVZidOperato").value + "' AND ");
  }
  if (ddlValue === "zgrada") {
    document.querySelector("#pretragaZGnazivLok").value !== "" && (retVal += "naziv_lok ILIKE '%" + document.querySelector("#pretragaZGnazivLok").value + "%' AND ");
    document.querySelector("#pretragaZGopstina").value !== "" && (retVal += "opstina ILIKE '%" + document.querySelector("#pretragaZGopstina").value + "%' AND ");
    document.querySelector("#pretragaZGnazivZgr").value !== "" && (retVal += "naziv_zgr ILIKE '%" + document.querySelector("#pretragaZGnazivZgr").value + "%' AND ");
    document.querySelector("#pretragaZGtipZgr").value !== "" && (retVal += "tip_zgr = '" + document.querySelector("#pretragaZGtipZgr").value + "' AND ");
    document.querySelector("#pretragaZGukIznaOd").value !== "" && (retVal += "uk_izna >= " + document.querySelector("#pretragaZGukIznaOd").value + " AND ");
    document.querySelector("#pretragaZGukIznaDo").value !== "" && (retVal += "uk_izna <= " + document.querySelector("#pretragaZGukIznaDo").value + " AND ");
    document.querySelector("#pretragaZGidZgr").value !== "" && (retVal += "id_zgr = '" + document.querySelector("#pretragaZGidZgr").value + "' AND ");
    document.querySelector("#pretragaZGidOperato").value !== "" && (retVal += "id_operato = '" + document.querySelector("#pretragaZGidOperato").value + "' AND ");
  }

  retVal.length > 5 && (retVal = retVal.substring(0, retVal.length - 5));
  return retVal;
}