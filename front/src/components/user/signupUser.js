import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../style/signupUser.css";
import backoffice from "../../assets/images/backoffice.png";
import AdresseUser from "./adresseUser";
import Modal from "react-modal";

function SignupUser({ closeModal }) {
  const navigate = useNavigate();

  const [newUserNom, setNewUserNom] = useState("");
  const [newUserPrenom, setNewUserPrenom] = useState("");
  const [newUserRole, setNewUserRole] = useState("Radiothérapeute");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserDdn, setNewUserDdn] = useState("");
  const [newUserTel, setNewUserTel] = useState("");
  const [newUserAdresse, setNewUserAdresse] = useState("");
  const [newUserImage, setNewUserImage] = useState(null);
  const [newUserGenre, setNewUserGenre] = useState("homme");
  const [newUserConfirmerPassword, setNewUserConfirmerPassword] = useState("");
  const [previewImage, setPreviewImage] = useState(null); // Nouvel état pour stocker l'URL de l'image sélectionnée
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedModal, setSelectedModal] = useState(null);
  const handleAddressSelect = (address) => {
    setNewUserAdresse(address);
  };
  const handleSignup = async () => {
    try {
      if (!newUserImage) {
        alert("Veuillez sélectionner une image.");
        return;
      }

      const formData = new FormData();
      formData.append("nom", newUserNom);
      formData.append("prenom", newUserPrenom);
      formData.append("role", newUserRole);
      formData.append("email", newUserEmail);
      formData.append("password", newUserPassword);
      formData.append("ddn", newUserDdn);
      formData.append("genre", newUserGenre);
      formData.append("tel", newUserTel);
      formData.append("adresse", newUserAdresse);
      formData.append("image", newUserImage);

      const response = await axios.post(
        `http://localhost:4001/users/signup`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Signup successfully:", response.data);
      navigate("/");
    } catch (error) {
      console.error(error.response.data);
    }
  };
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setNewUserImage(selectedImage);
    setPreviewImage(URL.createObjectURL(selectedImage));
  };

  const goToLogin = () => {
    navigate("/");
  };
  const openModalAdresseUser = (modalType) => {
    setSelectedModal(modalType);
    setModalIsOpen(true);
  };
  const closeModalAdresseUser = () => {
    setSelectedModal(null);
    setModalIsOpen(false);
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

        <div className="user">
          <div className="nomUser">Nom</div>
          <input
            className="inputnomUser"
            name="nom"
            value={newUserNom}
            onChange={(e) => setNewUserNom(e.target.value)}
          ></input>
          <div className="prenomUser">Prénom</div>
          <input
            className="inputprenomUser"
            name="prenom"
            value={newUserPrenom}
            onChange={(e) => setNewUserPrenom(e.target.value)}
          ></input>
        </div>

        <div className="user">
          <div className="roleUser">Fonction</div>
          <select
            className="inputroleUser"
            value={newUserRole}
            onChange={(e) => setNewUserRole(e.target.value)}
          >
            <option value="radiothérapeute">Radiothérapeute</option>
            <option value="chirurgien">Chirurgien</option>
            <option value="chimiothérapeute">Chimiothérapeute</option>
            <option value="technicien">Technicien</option>
            <option value="physicien">Physicien</option>
          </select>
          <div className="pos">
            <div className="ddnUser">Date de</div>
            <div className="ddnUser">naissaince </div>
          </div>

          <input
            type="date"
            className="inputddnUser"
            name="ddn"
            value={newUserDdn}
            onChange={(e) => setNewUserDdn(e.target.value)}
          ></input>
        </div>

        <div className="user">
          <div className="telUser">Tel</div>
          <input
            className="inputTelUser"
            name="tel"
            value={newUserTel}
            onChange={(e) => setNewUserTel(e.target.value)}
          ></input>
          <div className="adresseMailUser">Email</div>
          <input
            className="inputadresseMailUser"
            name="adresseMail"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
          ></input>
        </div>

        <div className="user">
          <div className="motDePasseUser">Mot de passe</div>
          <input
            className="inputmotDePasseUser"
            type="password"
            name="password"
            value={newUserPassword}
            onChange={(e) => setNewUserPassword(e.target.value)}
          ></input>
          <div className="pos">
            <div className="confirmerUser">Confirmer </div>
            <div className="confirmerUser"> mot de passe </div>
          </div>
          <input
            className="inputconfirmerUser"
            type="password"
            name="confirmerPassword"
            value={newUserConfirmerPassword}
            onChange={(e) => setNewUserConfirmerPassword(e.target.value)}
          ></input>
        </div>

        <div className="user">
          <label htmlFor="avatar" className="profile">
            Photo De <br /> profil
          </label>

          <div
            style={{ position: "relative", width: "150px", height: "150px" }}
          >
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  fontWeight: "bold",
                  borderColor: "rgba(124, 216, 255, 0)",
                  borderRadius: "50%",
                  padding: "0.5em",
                  marginLeft: "30px",
                  marginTop: "-150px",
                }}
              />
            )}
          </div>

          <label className="adresse">Adresse</label>
          <input
            className="inputadresseUser"
            type="textArea"
            value={newUserAdresse}
            onChange={(e) => setNewUserAdresse(e.target.value)}
          />
          <button
            className="plus-med"
            onClick={() => openModalAdresseUser("adresseUser")}
            style={{ right: 50, top: -50 }}
          ></button>
        </div>

        <div className="user">
          <div className="wrapperSingup">
            <input
              type="radio"
              name="select"
              id="option-1"
              checked={newUserGenre === "homme"}
              onChange={() => setNewUserGenre("homme")}
            />
            <input
              type="radio"
              name="select"
              id="option-2"
              checked={newUserGenre === "femme"}
              onChange={() => setNewUserGenre("femme")}
            />
            <label htmlFor="option-1" className="option option-1">
              <span>Homme</span>
            </label>
            <label htmlFor="option-2" className="option option-2">
              <span>Femme</span>
            </label>
          </div>
        </div>

        <div className="condition">
          En cliquant sur créer un compte, vous acceptez nos{" "}
          <span className="sousCondition"> Conditions </span> et indiqué que
          vous avez lu notre{" "}
          <span className="sousCondition">
            {" "}
            Politique d'utilisation des données{" "}
          </span>
          . Vous pourrez recevoir des notifications par texte de notre part et
          pouvez vous désabonner à tout moment
        </div>

        <button className="champ-textCreerCompte" onClick={handleSignup}>
          <label className="text-wrapperCreerCompte">Créer compte</label>
        </button>
        <div className="connecter">
          {" "}
          <div onClick={goToLogin} className="sous">
            Connectez
          </div>{" "}
          <div className="condition" style={{ marginTop: -16, marginLeft: 80 }}>
            {" "}
            , si vous avez déjà un compte{" "}
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen && selectedModal === "adresseUser"}
        onRequestClose={closeModalAdresseUser}
        contentLabel="Adresse User Modal"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <AdresseUser
          closeModal={closeModalAdresseUser}
          onAddressSelect={handleAddressSelect}
        />
      </Modal>
    </div>
  );
}

export default SignupUser;
