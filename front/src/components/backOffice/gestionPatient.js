import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import LeftBar from "./leftBar";
import backoffice from "../../assets/images/backoffice.png";
import "./style/gestionUser.css";
import SupprimerPatient from "./supprimerPatient";
import ModifierPatient from "./modifierPatient";
import Modal from "react-modal";
import axios from "axios";

function GestionPatient() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedModal, setSelectedModal] = useState(null);

  const openModalSupprimerPatient = (modalType, patientId) => {
    console.log(modalType, patientId);
    setSelectedModal(modalType);
    setSelectedPatientId(patientId);
    setModalIsOpen(true);
  };

  const closeModalSupprimerPatient = () => {
    setSelectedModal(null);
    setSelectedPatientId(null);
    setModalIsOpen(false);
  };
  const openModalModifierPatient = (modalType, patientId) => {
    console.log(modalType, patientId);
    setSelectedModal(modalType);
    setSelectedPatientId(patientId);
    setModalIsOpen(true);
  };

  const closeModalModifierPatient = () => {
    setSelectedModal(null);
    setSelectedPatientId(null);
    setModalIsOpen(false);
  };


  useEffect(() => {
    // Fonction pour récupérer les Patients
    const fetchPatients = async () => {
      try {
        // Récupérer le jeton JWT du stockage local
        const token = localStorage.getItem("token");

        const response = await axios.get("http://localhost:4001/patients/all", {
          headers: {
            Authorization: ` ${token}`,
          },
        });

        setPatients(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des Patients :", error);
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const columns = [
    {
      field: "Edit",
      headerName: "",
      width: 80,
      renderCell: (params) => (
        <button class="buttonEdit"   onClick={() =>
          openModalModifierPatient("modifierPatient", params.row.id)
        }>
          <svg
            class="svg-icon"
            fill="none"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g stroke="#a649da" stroke-linecap="round" stroke-width="2">
              <path d="m20 20h-16"></path>
              <path
                clip-rule="evenodd"
                d="m14.5858 4.41422c.781-.78105 2.0474-.78105 2.8284 0 .7811.78105.7811 2.04738 0 2.82843l-8.28322 8.28325-3.03046.202.20203-3.0304z"
                fill-rule="evenodd"
              ></path>
            </g>
          </svg>
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
          onClick={() =>
            openModalSupprimerPatient("supprimerPatient", params.row.id)
          }
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
    { field: "DMI", headerName: "DMI", width: 150 },
    {
      field: "fullName",
      headerName: "Nom et Prénom",
      width: 200,
      valueGetter: (params) => `${params.row.nom} ${params.row.prenom}`,
    },
    {
      field: "dateNaissance",
      headerName: "Date de Naissance",
      width: 150,
      valueGetter: (params) => {
        const date = new Date(params.row.dateNaissance);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day < 10 ? "0" + day : day}/${
          month < 10 ? "0" + month : month
        }/${year}`;
      },
    },
    { field: "sexe", headerName: "Sexe", width: 90 },
    { field: "mail", headerName: "Email", width: 200 },
    { field: "securiteSociale", headerName: "Sécurité Sociale", width: 200 },
    { field: "numTel", headerName: "Téléphone", width: 150 },
    { field: "adresse", headerName: "Adresse", width: 200 },
    { field: "Cin", headerName: "CIN", width: 150 },
    { field: "nationalite", headerName: "Nationalité", width: 150 },
    { field: "autres", headerName: "Autres Informations", width: 200 },

  
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
      <div className="tableauUsers">
        <DataGrid
          rows={patients}
          columns={columns}
          loading={loading}
          pageSize={5}
          components={{ Toolbar: GridToolbar }}
        />
      </div>
      <Modal
        isOpen={modalIsOpen && selectedModal === "supprimerPatient"}
        onRequestClose={closeModalSupprimerPatient}
        contentLabel="supprimerPatient Modal"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <SupprimerPatient
          closeModal={closeModalSupprimerPatient}
          patientId={selectedPatientId}
        />
      </Modal>
      <Modal
        isOpen={modalIsOpen && selectedModal === "modifierPatient"}
        onRequestClose={closeModalModifierPatient}
        contentLabel="modifierPatient Modal"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <ModifierPatient
          closeModal={closeModalModifierPatient}
          patientId={selectedPatientId}
        />
      </Modal>
    </div>
  );
}

export default GestionPatient;
