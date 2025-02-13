// profile.js
import "../../style/profile.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import crayon from "../../assets/images/crayon.png";
import Nav from "../nav";

import { Layout, theme } from "antd";

const { Header, Content } = Layout;

function Profile({}) {
  const [loggedInUserNom, setLoggedInUserNom] = useState("");
  const [loggedInUserPrenom, setLoggedInUserPrenom] = useState("");
  const [loggedInUserImage, setLoggedInUserImage] = useState("");
  const [loggedInUserTel, setLoggedInUserTel] = useState("");
  const [loggedInUserRole, setLoggedInUserRole] = useState("");
  const [loggedInUserEmail, setLoggedInUserEmail] = useState("");
  const [loggedInUserDdn, setLoggedInUserDdn] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the JWT token from local storage

        const response = await axios.get(
          "users/profile",
          {
            headers: {
              Authorization: ` ${token}`, // Attach the token to the Authorization header
            },
          }
        );

        console.log("User profile:", response.data);
        // Update your state or UI with the user profile data
        setLoggedInUserNom(response.data.nom);
        setLoggedInUserPrenom(response.data.prenom);
        setLoggedInUserImage(response.data.image);
        setLoggedInUserRole(response.data.role);
        setLoggedInUserTel(response.data.tel);
        setLoggedInUserEmail(response.data.email);
        setLoggedInUserDdn(response.data.ddn);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate("/Profile");
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `users/update`,
        {
          nom: loggedInUserNom,
          prenom: loggedInUserPrenom,
          email: loggedInUserEmail,
          ddn: loggedInUserDdn,
          role: loggedInUserRole,
          oldPassword,
          newPassword,
          confirmNewPassword,
        },
        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );
      console.log("Profile updated successfully:", response.data);
      navigate("/Profile");
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  return (
    <Layout style={{ height: "100vh", width: "100vw" }}>
      <Nav></Nav>
      <Content>
        <div className="card">
          <div
            className="avatar avatar-sm rounded-circle"
            style={{
              height: "160px",
              width: "140px",
              marginTop: "-540px",
              marginRight: "160px",

              overflow: "hidden",
            }}
          >
            <img
              alt=""
              src={loggedInUserImage}
              className="rounded-circle"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div className="nomprenom">
            {loggedInUserNom} {loggedInUserPrenom}
          </div>
          <div className="role">{loggedInUserRole}</div>
          <div className="tel">+216 {loggedInUserTel}</div>
        </div>

        <div className="boxupdateUser">
          <div className="prenom">
            <div className="nomUser">Nom</div>
            <input
              className="inputnomUser"
              name="nom"
              value={loggedInUserNom}
              onChange={(e) => setLoggedInUserNom(e.target.value)}
            />
            <div className="prenomUser">Prénom</div>
            <input
              className="inputprenomUser"
              name="prenom"
              value={loggedInUserPrenom}
              onChange={(e) => setLoggedInUserPrenom(e.target.value)}
            ></input>
            <div className="ddnUser">DDN </div>
            <input
              type="date"
              className="inputddnUser"
              name="ddn"
              value={loggedInUserDdn}
              onChange={(e) => setLoggedInUserDdn(e.target.value)}
            />
          </div>

          <div className="user">
            <div className="pos">
              <div className="adresseMailUser">Adresse</div>
              <div className="adresseMailUser"> Mail</div>
            </div>
            <input
              className="inputadresseMailUser"
              name="adresseMail"
              value={loggedInUserEmail}
              onChange={(e) => setLoggedInUserEmail(e.target.value)}
            ></input>
            <div className="telUser">Tel</div>
            <input
              className="inputTelUser"
              name="tel"
              value={loggedInUserTel}
              onChange={(e) => setLoggedInUserTel(e.target.value)}
            ></input>
            <div className="roleUser">Fonction</div>
            <select
              className="inputroleUser"
              value={loggedInUserRole}
              onChange={(e) => setLoggedInUserRole(e.target.value)}
            >
              <option value="oncologue">Oncologue</option>
              <option value="technicien">Technicien</option>
              <option value="physicien">Physicien</option>
            </select>
          </div>

          <div className="user">
            <div className="pos">
              <div className="ancienmdpUser">Ancien</div>
              <div className="ancienmdpUser"> MDP</div>
            </div>
            <input
              className="inputancienmdpUser"
              placeholder="enrtez votre ancien mot de passe"
            ></input>
            <div className="pos">
              <div className="nouveaumdpUser">Nouveau</div>
              <div className="nouveaumdpUser"> MDP</div>
            </div>
            <input
              className="inputnouveaumdpUser"
              placeholder="enrtez nouveau mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            ></input>
            <div className="pos">
              <div className="confirmernouveaumdpUser">Confirmer</div>
              <div className="confirmernouveaumdpUser"> MDP</div>
            </div>
            <input
              className="inputconfirmernouveaumdpUser"
              placeholder="confirmez mot de passe"
            ></input>
          </div>

          <button
            className="champ-textCreerCompte"
            onClick={handleUpdateProfile}
          >
            <img src={crayon} style={{ height: "30px", width: "30px" }}></img>
            <label className="text-wrapperCreerCompte">Valider</label>
          </button>
        </div>
      </Content>
    </Layout>
  );
}

export default Profile;
