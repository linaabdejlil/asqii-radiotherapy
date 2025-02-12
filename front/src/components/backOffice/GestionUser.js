import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import LeftBar from "./leftBar";
import backoffice from "../../assets/images/backoffice.png";
import "./style/gestionUser.css";
import SupprimerUser from "./supprimerUser";
import Modal from "react-modal";
import axios from "axios";
import NotificationList from "./notificationList";


function GestionUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedModal, setSelectedModal] = useState(null);

  const openModalSupprimerUser = (modalType, userId) => {
    console.log(modalType, userId);
    setSelectedModal(modalType);
    setSelectedUserId(userId);
    setModalIsOpen(true);
  };

  const closeModalSupprimerUser = () => {
    setSelectedModal(null);
    setSelectedUserId(null);
    setModalIsOpen(false);
  };

  useEffect(() => {
    // Fonction pour récupérer les utilisateurs
    const fetchUsers = async () => {
      try {
        // Récupérer le jeton JWT du stockage local
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:4001/users/getAllGestionUser",
          {
            headers: {
              Authorization: ` ${token}`,
            },
          }
        );

        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des utilisateurs :",
          error
        );
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleCompteValide = async (userId) => {
    try {
      const user = users.find((user) => user.id === userId);
      // Vérifier si le compte est déjà valide
      if (user.compteValide) {
        return;
      }
      const updatedUser = { ...user, compteValide: true };

      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:4001/users/validerCompte/${userId}`,
        { compteValide: true }, // Envoyer la nouvelle valeur de compteValide dans le corps de la requête
        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );

      const updatedUsers = users.map((user) =>
        user.id === userId ? updatedUser : user
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du compte valide :", error);
    }
  };

  const columns = [
    {
      field: "avatar",
      headerName: "Image",
      width: 80,
      renderCell: (params) => (
        <img
          src={params.row.image} // Assuming your image URL is stored in 'image' field
          alt="Avatar"
          style={{ width: "48px", height: "48px", borderRadius: "50%" }}
        />
      ),
    },
    {
      field: "fullName",
      headerName: "Nom et Prénom",
      width: 200,
      valueGetter: (params) => `${params.row.nom} ${params.row.prenom}`,
    },
    { field: "genre", headerName: "Genre", width: 120 },
    {
      field: "ddn",
      headerName: "Date de naissance",
      width: 150,
      valueGetter: (params) => {
        const date = new Date(params.row.ddn);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day < 10 ? "0" + day : day}/${
          month < 10 ? "0" + month : month
        }/${year}`;
      },
    },
    { field: "role", headerName: "Rôle", width: 140 },
    { field: "tel", headerName: "Téléphone", width: 140 },
    { field: "email", headerName: "Email", width: 240 },
    { field: "adresse", headerName: "Adresse", width: 300 },

    {
      field: "compteValide",
      headerName: "",
      width: 150,
      renderCell: (params) => (
        <button
          onClick={() => handleToggleCompteValide(params.row.id)}
          style={{
            backgroundColor: params.row.compteValide ? "#00C6BA" : "#ff8800",
            color: "white",
            padding: "5px 10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100px",
          }}
        >
          {params.row.compteValide ? "Valide" : "Invalide"}
        </button>
      ),
    },
    {
      field: "Supprimer",
      headerName: "",
      width: 80,
      renderCell: (params) => (
        <button
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "rgb(255, 95, 95)",
            cursor: "pointer",
            border: "2px solid rgb(255, 201, 201)",
            transitionDuration: "0.3s",
            position: "relative",
            overflow: "hidden",
          }}
          onClick={() => openModalSupprimerUser("supprimerUser", params.row.id)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 39 7"
            style={{
              width: "17px",
              transformOrigin: "right",
              transitionDuration: "0.3s",
              zIndex: "2",
            }}
          >
            <line strokeWidth="4" stroke="white" y2="5" x2="39" y1="5"></line>
            <line
              strokeWidth="3"
              stroke="white"
              y2="1.5"
              x2="26.0357"
              y1="1.5"
              x1="12"
            ></line>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 33 39"
            style={{ width: "15px", zIndex: "2" }}
          >
            <mask fill="white" id="path-1-inside-1_8_19">
              <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
            </mask>
            <path
              mask="url(#path-1-inside-1_8_19)"
              fill="white"
              d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
            ></path>
            <path strokeWidth="4" stroke="white" d="M12 6L12 29"></path>
            <path strokeWidth="4" stroke="white" d="M21 6V29"></path>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 89 80"
            style={{
              position: "absolute",
              width: "14px",
              height: "auto",
              zIndex: "1",
              opacity: "0",
              transition: "all 0.3s",
            }}
          >
            <path
              fill="white"
              d="M20.5 10.5L37.5 15.5L42.5 11.5L51.5 12.5L68.75 0L72 11.5L79.5 12.5H88.5L87 22L68.75 31.5L75.5066 25L86 26L87 35.5L77.5 48L70.5 49.5L80 50L77.5 71.5L63.5 58.5L53.5 68.5L65.5 70.5L45.5 73L35.5 79.5L28 67L16 63L12 51.5L0 48L16 25L22.5 17L20.5 10.5Z"
            ></path>
          </svg>
        </button>
      ),
    },
  ];

  return (
    <div
      style={{
        backgroundImage: `url(${backoffice})`,
        backgroundSize: "cover",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LeftBar />
      <div
        style={{
          position: "absolute", // Absolutely position this div inside the parent
          right: 20, // 20px from the right edge of the viewport
          bottom: 20, // 20px from the bottom edge of the viewport
        }}
      >
        <NotificationList />
      </div>
      <div className="tableauUsers">
        <DataGrid
          rows={users}
          columns={columns}
          loading={loading}
          pageSize={5}
          components={{ Toolbar: GridToolbar }}
        />
      </div>
      <Modal
        isOpen={modalIsOpen && selectedModal === "supprimerUser"}
        onRequestClose={closeModalSupprimerUser}
        contentLabel="supprimerUser Modal"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <SupprimerUser
          closeModal={closeModalSupprimerUser}
          userId={selectedUserId}
        />
      </Modal>
    </div>
  );
}

export default GestionUser;
