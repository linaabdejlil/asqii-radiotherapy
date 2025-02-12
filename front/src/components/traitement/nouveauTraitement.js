import "../../style/nouveauTraitement.css";
import React, { useState } from "react";
import axios from "axios";

function NouveauTraitement({ closeModal, patientId, setTraitements }) {
  const [localisation, setLocalisation] = useState("");
  const [indication, setIndication] = useState("");
  const [chimio, setChimio] = useState("");

  const handleAddTraitement = async () => {
    try {
      const response = await axios.post(
        `http://localhost:4001/traitements/add/${patientId}`,
        {
          localisation: localisation,
          indication: indication,
          chimio: chimio,
        }
      );
      console.log(response.data);
      setTraitements((Traitements) => [...Traitements, response.data]);
      // Réinitialiser les champs du formulaire après l'ajout du traitement
      setLocalisation("");
      setIndication("");
      setChimio("");

      // Fermer le modal NouveauTraitement
      closeModal();
    } catch (error) {
      console.error("Error adding traitement:", error);
    }
  };

  const annuler = () => {
    closeModal();
  };

  return (
    <div className="boxNouveauTraitement">
      <div className="groupNouveauTraitement">
        <div className="nouveau-Traitement-wrapperTraitement">
          <div className="nouveau-Traitement">Nouveau Traitement</div>
        </div>
        <div className="localisation">Localisation</div>
        <input
          className="inputlocalisation"
          value={localisation}
          onChange={(e) => setLocalisation(e.target.value)}
        />
        <div className="indication">Indication</div>
        <input
          className="inputindication"
          value={indication}
          onChange={(e) => setIndication(e.target.value)}
        />
        <div className="chimio">Chimiothérapie Concomittant</div>
        <input
          type="checkbox"
          className="inputchimio checkmark"
          checked={chimio}
          onChange={(e) => setChimio(e.target.checked)}
        />
        <div className="divNouveauTraitement">
          <button
            className="champ-textNouveauTraitement"
            onClick={handleAddTraitement}
          >
            <label className="text-wrapperNouveauTraitement">Valider</label>
          </button>
          <button className="div-wrapperNouveauTraitement" onClick={annuler}>
            <label className="text-wrapperNouveauTraitement">Annuler</label>
          </button>
        </div>
      </div>
    </div>
  );
}

export default NouveauTraitement;
