import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../style/nouveauMdp.css";

function NouveauMdp({ closeModalNouveauMdp, closeModalMdp, code, email }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      console.log(code);
      await axios.post(
        "http://localhost:4001/mdp/reset-password",
        { email, code, newPassword },
        { headers: { "Content-Type": "application/json" } }
      );
      alert("Le mot de passe a été réinitialisé avec succès.");
      closeModalNouveauMdp();
      closeModalMdp();
    } catch (error) {
      console.error(
        "Erreur lors de la réinitialisation du mot de passe:",
        error.response.data
      );
      alert(
        "Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer plus tard."
      );
    }
  };

  const annuler = () => {
    closeModalNouveauMdp();
  };

  return (
    <div className="boxMdp">
      <div className="groupMdp">
        <div className="Mdp-wrapperMdp">
          <div className="Mdp">Nouveau Mot De Passe</div>
        </div>
        <div className="nouveauMdp">Nouveau Mot De passe</div>
        <input
          className="inputnouveauMdp"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <div className="validernouveauMdp">Confirmer le mot de passe</div>
        <input
          className="inputvalidernouveauMdp"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div className="divMdp">
          <button className="champ-textMdp" onClick={handleChangePassword}>
            <label className="text-wrapperMdp">Valider</label>
          </button>
          <button className="div-wrapperMdp" onClick={annuler}>
            <label className="text-wrapperMdp">Annuler</label>
          </button>
        </div>
      </div>
    </div>
  );
}

export default NouveauMdp;
