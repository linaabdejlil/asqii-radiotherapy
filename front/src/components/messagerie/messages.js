// global.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Layout, theme } from "antd";
import Chat from "./chat";

const { Header, Sider, Content } = Layout;

const Messages = () => {
  const [loggedInUserNom, setLoggedInUserNom] = useState("");
  const [loggedInUserPrenom, setLoggedInUserPrenom] = useState("");
  const [loggedInUserImage, setLoggedInUserImage] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the JWT token from local storage

        const response = await axios.get(
          "http://localhost:4001/users/profile",
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
  return (
    <Layout style={{ height: "100vh", width: "100vw" }}>
      <Layout>
        <Header className="headerG">
          <div className="menuPos">
            <div style={{ display: "flex", alignItems: "center" }}>
              <i className="gg-align-left" style={{ marginRight: "10px" }}></i>
              <span style={{ marginRight: "700px" }}>Radithérapie</span>
              <i className="gg-home" style={{ marginRight: "5px" }}></i>
              <span className="navecrire">Dashboard</span>

              <i className="gg-attachment" style={{ marginRight: "5px" }}></i>
              <span className="navecrire">Notes</span>

              <i className="gg-calendar" style={{ marginRight: "5px" }}></i>
              <span className="navecrire">Calendrier</span>

              <i className="gg-comment" style={{ marginRight: "5px" }}></i>
              <span className="navecrire">Messagess</span>

              <i className="gg-bell" style={{ marginRight: "5px" }}></i>
              <span className="navecrire">Notifications</span>

              <div
                onClick={goToProfile}
                className="avatar avatar-sm"
                style={{ marginRight: "10px" }}
              >
                <img
                  alt=""
                  src={loggedInUserImage}
                  className="rounded-circle"
                />
              </div>
              <div onClick={goToProfile} style={{ color: "#90caf9" }}>
                {loggedInUserNom} {loggedInUserPrenom}
              </div>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            height: "100%", // Assurez-vous que Content occupe toute la hauteur disponible
          }}
        >
          <Chat></Chat>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Messages;
