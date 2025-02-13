import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../style/signupUser.css";
import backoffice from "../../assets/images/backoffice.png";

function SignupAdmin({ closeModal }) {
  const navigate = useNavigate();
  const [newAdminNom, setNewAdminNom] = useState("");
  const [newAdminPrenom, setNewAdminPrenom] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("Admin");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminTel, setNewAdminTel] = useState("");
  const [newAdminConfirmerPassword, setNewAdminConfirmerPassword] =
    useState("");
  const [error, setError] = useState("");

  const handleSignupAdmin = async () => {
    try {
      // Client-side validation
      if (
        !newAdminNom ||
        !newAdminPrenom ||
        !newAdminEmail ||
        !newAdminPassword ||
        !newAdminConfirmerPassword
      ) {
        setError("Veuillez remplir tous les champs");
        return;
      }

      if (newAdminPassword !== newAdminConfirmerPassword) {
        setError("Les mots de passe ne correspondent pas");
        return;
      }

      const formData = new FormData();
      formData.append("nom", newAdminNom);
      formData.append("prenom", newAdminPrenom);
      formData.append("role", newAdminRole);
      formData.append("email", newAdminEmail);
      formData.append("password", newAdminPassword);
      formData.append("tel", newAdminTel);

      const response = await axios.post(
        "users/signup",
        formData
      );

      console.log("Signup successfully:", response.data);
      navigate("/signinAdmin");
    } catch (error) {
      console.error("Signup failed:", error.response.data);
      setError(
        error.response.data.error ||
          "Une erreur s'est produite lors de la communication avec le serveur"
      );
    }
  };

  const goToLogin = () => {
    navigate("/signinAdmin");
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
      <div className="boxSignupUser">
        <div className="creerCompte">Créer un compte</div>

        {error && <div className="error">{error}</div>}

        <div className="user">
          <div className="nomUser">Nom</div>
          <input
            className="inputnomUser"
            name="nom"
            value={newAdminNom}
            onChange={(e) => setNewAdminNom(e.target.value)}
          ></input>
          <div className="prenomUser">Prénom</div>
          <input
            className="inputprenomUser"
            name="prenom"
            value={newAdminPrenom}
            onChange={(e) => setNewAdminPrenom(e.target.value)}
          ></input>
        </div>

        <div className="user">
          <div className="adresseMailUser">Email</div>
          <input
            className="inputadresseMailUser"
            name="adresseMail"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
          ></input>
          <div className="telUser">Tel</div>
          <input
            className="inputTelUser"
            name="tel"
            value={newAdminTel}
            onChange={(e) => setNewAdminTel(e.target.value)}
          ></input>
        </div>

        <div className="user">
          <div className="motDePasseUser">MDP</div>
          <input
            className="inputmotDePasseUser"
            type="password"
            name="password"
            value={newAdminPassword}
            onChange={(e) => setNewAdminPassword(e.target.value)}
          ></input>
          <div className="pos">
            <div className="confirmerUser">Confirmer </div>
            <div className="confirmerUser"> MDP </div>
          </div>
          <input
            className="inputconfirmerUser"
            type="password"
            name="confirmerPassword"
            value={newAdminConfirmerPassword}
            onChange={(e) => setNewAdminConfirmerPassword(e.target.value)}
          ></input>
        </div>

        <div className="condition">
          En cliquant sur créer un compte, vous acceptez nos{" "}
          <h className="sousCondition"> Conditions </h> et indiqué que vous avez
          lu notre{" "}
          <h className="sousCondition"> Politique d'utilisation des données </h>
          . Vous pourrez recevoir des notifications par texte de notre part et
          pouvez vous désabonner à tout moment
        </div>
        <button className="champ-textCreerCompte" onClick={handleSignupAdmin}>
          <label className="text-wrapperCreerCompte">Créer compte</label>
        </button>
        <div className="connecter">
          {" "}
          <h onClick={goToLogin} className="sous">
            Connectez
          </h>{" "}
          , si vous avez déjà un compte{" "}
        </div>
      </div>
    </div>
  );
}

export default SignupAdmin;
