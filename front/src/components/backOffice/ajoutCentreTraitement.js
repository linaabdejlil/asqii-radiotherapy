import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../style/nouveauCentre.css";

const AjoutCentreTraitement = () => {
  return (
    <div>
      <div className="boxCentre">
        <div className="groupCentre">
          <div className="overlapCentre">
            <div className="nouveau-Centre-wrapperCentre">
              <div className="nouveau-Centre">NOUVEAU Centre De Traitement</div>
            </div>
            <div className="nomCentre">Nom</div>
            <input className="inputnomCentre" />
            <div className="localisationCentre">Latitude</div>
            <input className="inputlocalisationCentre" />
            <div className="mailCentre">langitude</div>
            <input className="inputmailCentre" />
            <div className="numTelCentre">pays</div>
            <input className="inputnumTelCentre" />
            <div className="numTelCentre">code postal</div>
            <input className="inputnumTelCentre" />

            <div className="divNouveauCentre">
              <button className="champ-textNouveauCentre">
                <label className="text-wrapperNouveauCentre">Valider</label>
              </button>
              <button className="div-wrapperNouveauCentre">
                <label className="text-wrapperNouveauCentre">Annuler</label>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AjoutCentreTraitement;
