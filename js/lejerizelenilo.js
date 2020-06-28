let drvece = kreirajNoviImageWmsLejer("Drveće", "drvece_v", "winsoft:drvece_v");
let zbunjeLinija = kreirajNoviImageWmsLejer("Žbunje linija", "zbunje_linija_v", "winsoft:zbunje_linija_v");
let zbunjeTacka = kreirajNoviImageWmsLejer("Žbunje tačka", "zbunje_tacka_v", "winsoft:zbunje_tacka_v");
let zelenePovrsine = kreirajNoviImageWmsLejer("Zelene površine", "zelene_povrsine_v", "winsoft:zelene_povrsine_v");
let urbaniMobilijar = kreirajNoviImageWmsLejer("Urbani mobilijar", "urbani_mobilijar_v", "winsoft:urbani_mobilijar_v");
let rekreativnePovrsine = kreirajNoviImageWmsLejer("Rekreativne površine", "rekreativne_povrsine_v", "winsoft:rekreativne_povrsine_v");

map.addLayer(rekreativnePovrsine);
map.addLayer(urbaniMobilijar);
map.addLayer(zelenePovrsine);
map.addLayer(zbunjeTacka);
map.addLayer(zbunjeLinija);
map.addLayer(drvece);

document.querySelector("#chkDrvece").addEventListener("change", function () {
  drvece.setVisible(this.checked);
});
document.querySelector("#chkZbunjeLinija").addEventListener("change", function () {
  zbunjeLinija.setVisible(this.checked);
});
document.querySelector("#chkZbunjeTacka").addEventListener("change", function () {
  zbunjeTacka.setVisible(this.checked);
});
document.querySelector("#chkZelenePovrsine").addEventListener("change", function () {
  zelenePovrsine.setVisible(this.checked);
});
document.querySelector("#chkUrbaniMobilijar").addEventListener("change", function () {
  urbaniMobilijar.setVisible(this.checked);
});
document.querySelector("#chkRekreativnePovrsine").addEventListener("change", function () {
  rekreativnePovrsine.setVisible(this.checked);
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
  if (ddlValue === "drvece") {
    document.querySelector("#divDrvece").style.display = "block";
    document.querySelector("#chkDrvece").checked = true;
    drvece.setVisible(true);
  }
  if (ddlValue === "zbunjeLinija") {
    document.querySelector("#divZbunjeLinija").style.display = "block";
    document.querySelector("#chkZbunjeLinija").checked = true;
    zbunjeLinija.setVisible(true);
  }
  if (ddlValue === "zbunjeTacka") {
    document.querySelector("#divZbunjeTacka").style.display = "block";
    document.querySelector("#chkZbunjeTacka").checked = true;
    zbunjeTacka.setVisible(true);
  }
  if (ddlValue === "zelenePovrsine") {
    document.querySelector("#divZelenePovrsine").style.display = "block";
    document.querySelector("#chkZelenePovrsine").checked = true;
    zelenePovrsine.setVisible(true);
  }
  if (ddlValue === "urbaniMobilijar") {
    document.querySelector("#divUrbaniMobilijar").style.display = "block";
    document.querySelector("#chkUrbaniMobilijar").checked = true;
    urbaniMobilijar.setVisible(true);
  }
  if (ddlValue === "rekreativnePovrsine") {
    document.querySelector("#divRekreativnePovrsine").style.display = "block";
    document.querySelector("#chkRekreativnePovrsine").checked = true;
    rekreativnePovrsine.setVisible(true);
  }
}

function sakrijSveDivPretrage() {
  document.querySelector("#divDrvece").style.display = "none";
  document.querySelector("#divZbunjeLinija").style.display = "none";
  document.querySelector("#divZbunjeTacka").style.display = "none";
  document.querySelector("#divZelenePovrsine").style.display = "none";
  document.querySelector("#divUrbaniMobilijar").style.display = "none";
  document.querySelector("#divRekreativnePovrsine").style.display = "none";
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
    if (ddlValue === "drvece") {
      let params = drvece.getSource().getParams();
      params.CQL_FILTER = cqlFilter;
      drvece.getSource().updateParams(params);
    }
    if (ddlValue === "zbunjeLinija") {
      let params = zbunjeLinija.getSource().getParams();
      params.CQL_FILTER = cqlFilter;
      zbunjeLinija.getSource().updateParams(params);
    }
    if (ddlValue === "zbunjeTacka") {
      let params = zbunjeTacka.getSource().getParams();
      params.CQL_FILTER = cqlFilter;
      zbunjeTacka.getSource().updateParams(params);
    }
    if (ddlValue === "zelenePovrsine") {
      let params = zelenePovrsine.getSource().getParams();
      params.CQL_FILTER = cqlFilter;
      zelenePovrsine.getSource().updateParams(params);
    }
    if (ddlValue === "urbaniMobilijar") {
      let params = urbaniMobilijar.getSource().getParams();
      params.CQL_FILTER = cqlFilter;
      urbaniMobilijar.getSource().updateParams(params);
    }
    if (ddlValue === "rekreativnePovrsine") {
      let params = rekreativnePovrsine.getSource().getParams();
      params.CQL_FILTER = cqlFilter;
      rekreativnePovrsine.getSource().updateParams(params);
    }
  }
}

/** Filtriranje po atributima */
function kreiranjeCqlFilteraAtributiZaJavnuStranicu(ddlValue) {
  let retVal = "";

  if (ddlValue === "drvece") {
    document.querySelector("#pretragaASnazivLok").value !== "" && (retVal += "naziv_lok ILIKE '%" + document.querySelector("#pretragaASnazivLok").value + "%' AND ");
    document.querySelector("#pretragaASopstina").value !== "" && (retVal += "opstina ILIKE '%" + document.querySelector("#pretragaASopstina").value + "%' AND ");
    document.querySelector("#pretragaASnazivAs").value !== "" && (retVal += "naziv_as = '" + document.querySelector("#pretragaASnazivAs").value + "' AND ");
    document.querySelector("#pretragaAStip").value !== "" && (retVal += "tip = '" + document.querySelector("#pretragaAStip").value + "' AND ");
    document.querySelector("#pretragaASidAs").value !== "" && (retVal += "id_as = '" + document.querySelector("#pretragaASidAs").value + "' AND ");
    document.querySelector("#pretragaASidOperato").value !== "" && (retVal += "id_operato = '" + document.querySelector("#pretragaASidOperato").value + "' AND ");
  }
  if (ddlValue === "zbunjeLinija") {
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
  if (ddlValue === "zbunjeTacka") {
    document.querySelector("#pretragaTKnamena").value !== "" && (retVal += "namena ILIKE '%" + document.querySelector("#pretragaTKnamena").value + "%' AND ");
    document.querySelector("#pretragaTKpolaganje").value !== "" && (retVal += "polaganje ILIKE '%" + document.querySelector("#pretragaTKpolaganje").value + "%' AND ");
    document.querySelector("#pretragaTKoznaka").value !== "" && (retVal += "oznaka = '" + document.querySelector("#pretragaTKoznaka").value + "' AND ");
    document.querySelector("#pretragaTKtip").value !== "" && (retVal += "tip = '" + document.querySelector("#pretragaTKtip").value + "' AND ");
    document.querySelector("#pretragaTKstatus").value !== "" && (retVal += "status = '" + document.querySelector("#pretragaTKstatus").value + "' AND ");
    document.querySelector("#pretragaTKidOperato").value !== "" && (retVal += "id_operato = '" + document.querySelector("#pretragaTKidOperato").value + "' AND ");
  }
  if (ddlValue === "zelenePovrsine") {
    document.querySelector("#pretragaTNpolozaj").value !== "" && (retVal += "polozaj = '" + document.querySelector("#pretragaTNpolozaj").value + "' AND ");
    document.querySelector("#pretragaTNtipNastav").value !== "" && (retVal += "tip_nastav = '" + document.querySelector("#pretragaTNtipNastav").value + "' AND ");
    document.querySelector("#pretragaTNidNas").value !== "" && (retVal += "id_nas = '" + document.querySelector("#pretragaTNidNas").value + "' AND ");
    document.querySelector("#pretragaTNidOperato").value !== "" && (retVal += "id_operato = '" + document.querySelector("#pretragaTNidOperato").value + "' AND ");
  }
  if (ddlValue === "urbaniMobilijar") {
    document.querySelector("#pretragaTOtipOkn").value !== "" && (retVal += "tip_okn = '" + document.querySelector("#pretragaTOtipOkn").value + "' AND ");
    document.querySelector("#pretragaTOidOkn").value !== "" && (retVal += "id_okn = '" + document.querySelector("#pretragaTOidOkn").value + "' AND ");
    document.querySelector("#pretragaTOidOperato").value !== "" && (retVal += "id_operato = '" + document.querySelector("#pretragaTOidOperato").value + "' AND ");
  }
  if (ddlValue === "rekreativnePovrsine") {
    document.querySelector("#pretragaTTopstina").value !== "" && (retVal += "opstina ILIKE '%" + document.querySelector("#pretragaTTopstina").value + "%' AND ");
    document.querySelector("#pretragaTTlokacija").value !== "" && (retVal += "lokacija ILIKE '%" + document.querySelector("#pretragaTTlokacija").value + "%' AND ");
    document.querySelector("#pretragaTTmrPrisN").value !== "" && (retVal += "mr_pris_n ILIKE '%" + document.querySelector("#pretragaTTmrPrisN").value + "%' AND ");
    document.querySelector("#pretragaTTgeodSnTr").value !== "" && (retVal += "geod_sn_tr ILIKE '%" + document.querySelector("#pretragaTTgeodSnTr").value + "%' AND ");
    document.querySelector("#pretragaTTtrasa").value !== "" && (retVal += "trasa = '" + document.querySelector("#pretragaTTtrasa").value + "' AND ");
    document.querySelector("#pretragaTTprenosniP").value !== "" && (retVal += "prenosni_p = '" + document.querySelector("#pretragaTTprenosniP").value + "' AND ");
    document.querySelector("#pretragaTTidTrasa").value !== "" && (retVal += "id_trasa = '" + document.querySelector("#pretragaTTidTrasa").value + "' AND ");
    document.querySelector("#pretragaTTidOperato").value !== "" && (retVal += "id_operato = '" + document.querySelector("#pretragaTTidOperato").value + "' AND ");
  }

  retVal.length > 5 && (retVal = retVal.substring(0, retVal.length - 5));
  return retVal;
}