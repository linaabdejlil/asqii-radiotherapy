import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout, theme } from "antd";
import logo from "../assets/images/logo.png";

const { Header } = Layout;

const Nav = () => {
  const [loggedInUserNom, setLoggedInUserNom] = useState("");
  const [loggedInUserPrenom, setLoggedInUserPrenom] = useState("");
  const [loggedInUserImage, setLoggedInUserImage] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const isActive = (path) => location.pathname === path;

  const goToProfile = () => {
    navigate("/Profile");
  };

  const navigateToNotes = () => {
    navigate("/Notes");
  };

  const navigateToMessages = () => {
    navigate("/Discussions");
  };

  const navigateToStatistique = () => {
    navigate("/Statistique");
  };
  const navigateToFormulaire = () => {
    navigate("/Form");
  };

  const navigateToApp = () => {
    navigate("/App");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const iconStyle = {
    position: "relative",
    marginRight: "60px",
    marginTop: "10px",
    cursor: "pointer",
    paddingBottom: "10px", // Adjust to move the underline down
    color: "#ffffffb7",
  };

  const activeIconStyle = {
    color: "#0083DA",
  };

  const underlineStyle = {
    content: '""',
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    bottom: "-4px",
    height: "3px",
    width: "60px",
    backgroundColor: "#0083DA",
  };

  const dropdownMenuStyle = {
    position: "absolute",
    top: "60px",
    right: "10px",
    backgroundColor: "rgba(200, 228, 255, 0.9)",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "4px",
    zIndex: 1000,
    transition: "background-color #ffffff", // Transition effect for background color change
  };

  const dropdownItemStyle = {
    color: "rgb(36, 33, 228)",
    padding: "0px 40px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #ddd", // Bordure entre les éléments
    transition: "background-color 0.2s", // Transition douce pour l'effet de survol
  };
  const [isUp, setIsUp] = useState(false);

  const toggleArrow = () => {
    setIsUp(!isUp);
  };

  return (

    <Layout style={{ height: "100vh", width: "100vw" }}>
      <Header className="headerG" >
        <div className="menuPos">
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              alt="logo"
              src={logo}
              style={{ height: 50, width: 50, marginRight: 10 }}
            />
            <span
              style={{ marginRight: "460px", fontSize: 20 }}
              className="navecrire"
            >
              Beam Boost
            </span>
            <div
              style={
                isActive("/App")
                  ? { ...iconStyle, ...activeIconStyle }
                  : iconStyle
              }
              onClick={navigateToApp}
            >
              <i className="gg-home"></i>
              {isActive("/App") && <div style={underlineStyle}></div>}
            </div>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <div
              style={
                isActive("/Notes")
                  ? { ...iconStyle, ...activeIconStyle }
                  : iconStyle
              }
              onClick={navigateToNotes}
            >
              <i className="gg-attachment"></i>
              {isActive("/Notes") && <div style={underlineStyle}></div>}
            </div>
            &nbsp;&nbsp;&nbsp;
            <div
              style={
                isActive("/Statistique")
                  ? { ...iconStyle, ...activeIconStyle }
                  : iconStyle
              }
              onClick={navigateToStatistique}
            >
              <i className="gg-align-bottom"></i>
              {isActive("/Statistique") && <div style={underlineStyle}></div>}
            </div>
            &nbsp;&nbsp;&nbsp;
            <div
              style={
                isActive("/Discussions")
                  ? { ...iconStyle, ...activeIconStyle }
                  : iconStyle
              }
              onClick={navigateToMessages}
            >
              <i className="gg-comment"></i>
              {isActive("/Discussions") && <div style={underlineStyle}></div>}
            </div>
            &nbsp;&nbsp;&nbsp;
            <div
              style={
                isActive("/Form")
                  ? { ...iconStyle, ...activeIconStyle }
                  : iconStyle
              }
              onClick={navigateToFormulaire}
            >
            <i class="gg--ereader"></i>
              {isActive("/Form") && <div style={underlineStyle}></div>}
            </div>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <div
              onClick={toggleDropdown}
              className="avatar avatar-sm"
              style={{
                marginRight: "15px",
                marginLeft: 380,
                position: "relative",
              }}
            >
              <img
                alt=""
                src={loggedInUserImage}
                onClick={goToProfile}
                className="rounded-circle"
              />
            </div>
            <div
              onClick={goToProfile}
              style={{ color: "#ffffffb7", marginRight: 30, marginLeft: 10 }}
            >
              {loggedInUserNom} {loggedInUserPrenom}
            </div>
            <input
              id="checkbox2"
              type="checkbox"
              checked={dropdownVisible}
              onChange={toggleDropdown}
            />
            <label className="toggle toggle2" htmlFor="checkbox2">
              <div id="bar4" className="bars"></div>
              <div id="bar5" className="bars"></div>
              <div id="bar6" className="bars"></div>
            </label>
            {dropdownVisible && (
              <div style={dropdownMenuStyle}>
                <div>
                  <div
                    style={dropdownItemStyle}
                    className="drop-item"
                    onClick={goToProfile}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      style={{ height: 25, width: 25 }}
                    >
                      <path
                        fill="#233368"
                        d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
                      />
                    </svg>
                    <span className="notification-text">Profile</span>
                  </div>
                  <div
                    style={dropdownItemStyle}
                    className="drop-item"
                    onClick={navigateToApp}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      style={{ height: 25, width: 25 }}
                    >
                      <path
                        fill="#233368"
                        d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
                      />
                    </svg>
                    <span className="notification-text">Dashboard</span>
                  </div>
                  <div
                    style={dropdownItemStyle}
                    className="drop-item"
                    onClick={navigateToNotes}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      style={{ height: 25, width: 25 }}
                    >
                      <path
                        fill="#233368"
                        d="M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z"
                      />
                    </svg>
                    <span className="notification-text">Notes</span>
                  </div>
                  <div
                    style={dropdownItemStyle}
                    className="drop-item"
                    onClick={navigateToMessages}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      style={{ height: 25, width: 25 }}
                    >
                      <path
                        fill="#233368"
                        d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
                      />
                    </svg>
                    <span className="notification-text">Messages</span>
                  </div>
                  <div
                    style={dropdownItemStyle}
                    className="drop-item"
                    onClick={navigateToFormulaire}
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  <path    fill="#233368"

                  d="M0 48C0 21.5 21.5 0 48 0l0 48 0 393.4 130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4 336 48 48 48 48 0 336 0c26.5 0 48 21.5 48 48l0 440c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488L0 48z"/></svg>
                    <span className="notification-text">Formulaires</span>
                  </div>
                  <div
                    style={dropdownItemStyle}
                    className="drop-item"
                    onClick={navigateToStatistique}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      style={{ height: 25, width: 25 }}
                    >
                      <path
                        fill="#233368"
                        d="M32 32c17.7 0 32 14.3 32 32V400c0 8.8 7.2 16 16 16H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H80c-44.2 0-80-35.8-80-80V64C0 46.3 14.3 32 32 32zM160 224c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32s-32-14.3-32-32V256c0-17.7 14.3-32 32-32zm128-64V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V160c0-17.7 14.3-32 32-32s32 14.3 32 32zm64 32c17.7 0 32 14.3 32 32v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V224c0-17.7 14.3-32 32-32zM480 96V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V96c0-17.7 14.3-32 32-32s32 14.3 32 32z"
                      />
                    </svg>
                    <span className="notification-text">Statistiques</span>
                  </div>
                  <div
                    style={dropdownItemStyle}
                    className="drop-item"
                    onClick={handleLogout}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      style={{ height: 25, width: 25 }}
                    >
                      <path
                        fill="#233368"
                        d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
                      />
                    </svg>
                    <span className="notification-text">Logout</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Header>
    </Layout>
  );
};

export default Nav;
