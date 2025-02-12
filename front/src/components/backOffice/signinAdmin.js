import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../style/signin.css";
import backoffice from "../../assets/images/backoffice.png";
import MDP from "../user/mdp";
import Modal from "react-modal";

function SigninAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [modalIsOpenMdp, setModalIsOpenMdp] = useState(false);
  const [error, setError] = useState("");

  const openModalMdp = () => {
    setModalIsOpenMdp(true);
  };

  const closeModalMdp = () => {
    setModalIsOpenMdp(false);
  };

  // Function to handle sign in
  const handleSignIn = async () => {
    try {
      // Send sign-in request
      const response = await axios.post(
        "http://localhost:4001/users/signin",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      // Extract token and user ID from response
      const { token, id } = response.data;

      // Store token and user ID in local storage
      localStorage.setItem("token", token);
      localStorage.setItem("user", id);

      // Navigate to desired route
      navigate("/Statistiques");
    } catch (error) {
      setError("Identifiants invalides. Veuillez réessayer.");
      console.error("Connection error:", error.response.data);
    }
  };

  const sendResetPasswordEmail = async () => {
    if (!email) {
      alert("Veuillez fournir votre adresse e-mail.");
      return;
    }

    try {
      // Envoyer une demande de réinitialisation de mot de passe
      await axios.post(
        "http://localhost:4001/mdp/forgot-password",
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      // Afficher un message à l'utilisateur pour confirmer l'envoi de l'e-mail
      alert("Un e-mail de réinitialisation de mot de passe a été envoyé.");
      // Ouvrir le modal de réinitialisation de mot de passe
      openModalMdp();
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi de l'e-mail de réinitialisation:",
        error.response.data
      );
      alert(
        "Erreur lors de l'envoi de l'e-mail de réinitialisation. Veuillez réessayer plus tard."
      );
    }
  };

  // Function to navigate to sign-up page
  const inscrire = () => {
    navigate("/SignupAdmin");
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backoffice})`,
        backgroundSize: "cover",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div className="boxSignin">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          style={{ height: 120, width: 120, marginLeft: 250, marginTop: 20 }}
        >
          <path
            fill="#1b50ff"
            d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"
          />
        </svg>{" "}
        <div className="adresseMail">Adresse Mail</div>
        <input
          className="inputadresseMail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="motDePasse">Mot de passe</div>
        <input
          className="inputmotDePasse"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* Sign-in button */}
        <button className="champ-textConnexion" onClick={handleSignIn}>
          <label className="text-wrapperConnexion">se connecter</label>
        </button>
        <div className="mot-de-passe-oubli-e">
          <button onClick={sendResetPasswordEmail}>Mot de passe oubliée</button>
        </div>
        {/* Sign-up link */}
        <div className="s-inscrire" onClick={inscrire}>
          S’inscrire{" "}
        </div>
        <div className="si-vous-ne-poss-dez-encore-du-compte">
          si vous ne possédez encore du compte
        </div>
      </div>
      {/* Forgotten password modal */}
      <Modal
        isOpen={modalIsOpenMdp}
        onRequestClose={closeModalMdp}
        contentLabel="Mdp Modal"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <MDP closeModalMdp={closeModalMdp} email={email} />
      </Modal>
    </div>
  );
}

export default SigninAdmin;
