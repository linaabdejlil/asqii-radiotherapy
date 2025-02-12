import "../../style/mdp.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NOUVEAUMDP from "./nouveauMdp";
import Modal from "react-modal";

function Mdp({ closeModalMdp, email }) {
  const [modalIsOpenNouveauMdp, setModalIsOpenNouveauMdp] = useState(false);
  const [code, setCode] = useState(null);
  const annuler = () => {
    closeModalMdp();
  };
  const openModalNouveauMdp = (code) => {
    setModalIsOpenNouveauMdp(true);
    setCode(code);
  };

  const closeModalNouveauMdp = () => {
    setModalIsOpenNouveauMdp(false);
  };
  const validerCode = () => {
    const code = document.querySelector(".inputcode").value;
    // Envoi du code de vérification avec le nouveau mot de passe
    openModalNouveauMdp(code);
  };
  return (
    <div className="boxMdp">
      <div className="groupMdp">
        <div className="Mdp-wrapperMdp">
          <div className="Mdp">Mot De Passe Oubliée</div>
        </div>
        <div className="email">
          Nous avons envoyé un code de vérification à l'adresse e-mail
        </div>
        <div className="inputemail">{email}</div>
        <div className="code">
          Entrez le code pour réinitialiser votre mot de passe
        </div>
        <input className="inputcode" />

        <div className="divMdp">
          <button className="champ-textMdp">
            <label className="text-wrapperMdp" onClick={() => validerCode()}>
              Valider
            </label>
          </button>
          <button className="div-wrapperMdp" onClick={annuler}>
            <label className="text-wrapperMdp">Annuler</label>
          </button>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpenNouveauMdp}
        onRequestClose={closeModalNouveauMdp}
        contentLabel="Mdp Modal"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <NOUVEAUMDP
          closeModalNouveauMdp={closeModalNouveauMdp}
          closeModalMdp={closeModalMdp}
          email={email}
          code={code}
        />
      </Modal>
    </div>
  );
}

export default Mdp;
