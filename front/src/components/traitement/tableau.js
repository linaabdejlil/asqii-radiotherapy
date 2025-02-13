// Tableau.js
import "../../style/tableau.css";
import "../../style/search.css";
import React, { useState, useEffect, useCallback } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import { GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import Modal from "react-modal";
import PATIENT from "./Patient";
import DetailsPatient from "./detailsPatient";
import Calendrier from "./calendrier";
import MEDECIN from "./medecin";
import AssignedUsers from "./assignedUsers";
import Cal from "../../assets/images/calendrier.png";
import DetailsTraitement from "./detailsTraitement";
import NouveauCentre from "../nouveauCentre";
import RenderCheckbox from "./renderCheckbox";

Modal.setAppElement("#root");

function Tableau() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDMI, setSearchDMI] = useState("");
  const [searchCentre, setSearchCentre] = useState("");
  const [searchMachine, setSearchMachine] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedModal, setSelectedModal] = useState(null);
  const [selectedTraitementId, setSelectedTraitementId] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [modalIsOpenNouveauCentre, setModalIsOpenNouveauCentre] =
    useState(false);
  const [startDate, setStartDate] = useState("");
  const [centreTraitement, setCentreTraitement] = useState("");
  const [nomMachine, setNomMachine] = useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [userData, setUserData] = useState(null);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterPrescriptionActive, setFilterPrescriptionActive] =
    useState(false);
  const [filterScannerActive, setFilterScannerActive] = useState(false);
  const [filterImportationActive, setFilterImportationActive] = useState(false);
  const [filterContourageActive, setFilterContourageActive] = useState(false);
  const [filterDosimetrieActive, setFilterDosimetrieActive] = useState(false);
  const [filterValidationActive, setFilterValidationActive] = useState(false);
  const [filterQualiteActive, setFilterQualiteActive] = useState(false);
  // This function assumes traitement is passed as a prop or derived from state
  const calculatePassedSessions = (traitement) => {
    if (!traitement.dateDebut) {
      return `0/${traitement.nombreSeances}`;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to remove time part
    const passedSessionsCount = traitement?.Seances.reduce((count, seance) => {
      const seanceDate = new Date(seance.date);
      const isPostponed = seance.reporte === true; // Ensure postponed is explicitly true

      if (seanceDate < today && !isPostponed) {
        return count + 1;
      }
      return count;
    }, 0);

    return `${passedSessionsCount}/${traitement?.nombreSeances}`;
  };

  useEffect(() => {
    // Fonction asynchrone pour récupérer les données de la route protégée
    const fetchData = async () => {
      try {
        // Récupérer le jeton JWT du stockage local
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "users/protected",
          {
            headers: {
              Authorization: ` ${token}`,
            },
          }
        );

        // Mettre à jour l'état userData avec les données reçues
        setUserData(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données protégées:",
          error
        );
        // Définir userData sur null en cas d'erreur
        setUserData(null);
      }
    };

    // Appeler la fonction fetchData pour récupérer les données de la route protégée
    fetchData();
  }, []); // Utilisez un tableau vide de dépendances pour exécuter cette fonction une seule fois après le montage du composant

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const searchByStartDate = useCallback(async () => {
    try {
      const response = await axios.get(
        `patients/searchDDT/${startDate}`
      );
      console.log("Patients data by start date from server:", response.data);
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching data by start date:", error);
    }
  }, [startDate]);

  useEffect(() => {
    const fetchAssignedUsers = async () => {
      try {
        const response = await fetch(
          `patients/assigned-users/${selectedPatientId}`
        );
        if (!response.ok) {
          throw new Error(
            "Erreur réseau - Impossible de récupérer les utilisateurs affectés"
          );
        }
        const data = await response.json();
        setAssignedUsers(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchAssignedUsers();
    return () => {
      // Code de nettoyage si nécessaire
    };
  }, [selectedPatientId]);

  // Ajoutez ce code à l'intérieur de votre composant Tableau après la déclaration de l'état assignedUsers

  useEffect(() => {
    if (!loading && !error && assignedUsers.length > 0) {
      console.log("Utilisateurs affectés récupérés :", assignedUsers);
      // Utilisez les utilisateurs affectés comme vous le souhaitez dans votre composant
      // Par exemple, vous pouvez les afficher dans une liste
    }
  }, [loading, error, assignedUsers]);

  const fetchDataAndSearch = useCallback(async () => {
    if (searchTerm.trim() !== "") {
      await searchByStartDate();
    } else {
      fetchData();
    }
  }, [searchTerm, searchByStartDate]);

  const fetchData = async () => {
    try {
      const response = await axios.get("patients/all");
      console.log("Patients data from server:", response.data);
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDataAndSearch();
  }, [fetchDataAndSearch]);

  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        const response = await axios.get(
          `patients/search/${searchTerm}`
        );
        console.log("Filtered Patients data from server:", response.data);
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
      }
    };

    if (searchTerm.trim() !== "") {
      fetchFilteredData();
    } else {
      fetchDataAndSearch();
    }
  }, [searchTerm, fetchDataAndSearch]);
  useEffect(() => {
    const fetchFilteredDataDMI = async () => {
      try {
        const response = await axios.get(
          `patients/searchDMI/${searchDMI}`
        );
        console.log("Filtered Patients data from server:", response.data);
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
      }
    };

    if (searchDMI.trim() !== "") {
      fetchFilteredDataDMI();
    } else {
      fetchDataAndSearch();
    }
  }, [searchDMI, fetchDataAndSearch]);
  useEffect(() => {
    const searchByCentreTraitement = async () => {
      try {
        const response = await axios.get(
          `patients/searchCT/${searchCentre}`
        );
        console.log("Filtered Patients data from server:", response.data);
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
      }
    };

    if (searchCentre.trim() !== "") {
      searchByCentreTraitement();
    } else {
      fetchDataAndSearch();
    }
  }, [searchCentre, fetchDataAndSearch]);

  useEffect(() => {
    const searchByMachine = async () => {
      try {
        const response = await axios.get(
          `patients/searchMachine/${searchMachine}`
        );
        console.log("Filtered Patients data from server:", response.data);
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
      }
    };

    if (searchMachine.trim() !== "") {
      searchByMachine();
    } else {
      fetchDataAndSearch();
    }
  }, [searchMachine, fetchDataAndSearch]);

  const openPatientModal = () => {
    setIsPatientModalOpen(true);
  };

  const closePatientModal = () => {
    setIsPatientModalOpen(false);
  };
  const openModalNouveauCentre = () => {
    setModalIsOpenNouveauCentre(true);
  };

  const closeModalNouveauCentre = () => {
    setModalIsOpenNouveauCentre(false);
  };

  const openModalTraitement = (modalType, traitementId, patientId) => {
    console.log(modalType, traitementId, patientId);
    setSelectedModal(modalType);
    setSelectedTraitementId(traitementId);
    setSelectedPatientId(patientId);

    setModalIsOpen(true);
  };
  const closeModalTraitement = (traitementId) => {
    setSelectedModal(null);
    setSelectedTraitementId(traitementId);
    setModalIsOpen(false);
  };
  const openModalDetailsTraitement = (modalType, traitementId) => {
    console.log(modalType, traitementId);
    setSelectedModal(modalType);
    setSelectedTraitementId(traitementId);

    setModalIsOpen(true);
  };
  const closeModalDetailsTraitement = (traitementId) => {
    setSelectedModal(null);
    setSelectedTraitementId(traitementId);
    setModalIsOpen(false);
  };

  const openModal5 = (modalType, patientId) => {
    console.log(modalType, patientId);
    setSelectedModal(modalType);
    setModalIsOpen(true);
    setSelectedPatientId(patientId); // Add this line to store the selected patientId
  };

  const closeModal5 = () => {
    setSelectedModal(null);
    setModalIsOpen(false);
  };

  const filterPatientsPrescription = () => {
    setFilterPrescriptionActive(!filterPrescriptionActive);
    setFilterScannerActive(false);
    setFilterImportationActive(false);
    setFilterContourageActive(false);
    setFilterDosimetrieActive(false);
    setFilterValidationActive(false);
    setFilterQualiteActive(false);

    if (!filterPrescriptionActive) {
      const filtered = patients.filter((patient) => {
        if (patient.Traitements && patient.Traitements.length > 0) {
          return patient.Traitements.some(
            (traitement) => !traitement.Prescription
          );
        }
        return false;
      });
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  };

  const filterPatientsScanner = () => {
    setFilterPrescriptionActive(false);
    setFilterScannerActive(!filterScannerActive);
    setFilterImportationActive(false);
    setFilterContourageActive(false);
    setFilterDosimetrieActive(false);
    setFilterValidationActive(false);
    setFilterQualiteActive(false);

    if (!filterScannerActive) {
      const filtered = patients.filter((patient) => {
        if (patient.Traitements && patient.Traitements.length > 0) {
          return patient.Traitements.some(
            (traitement) => !traitement.Scanner && traitement.Prescription
          );
        }
        return false;
      });
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  };

  const filterPatientsImportation = () => {
    setFilterPrescriptionActive(false);
    setFilterScannerActive(false);
    setFilterImportationActive(!filterImportationActive);
    setFilterContourageActive(false);
    setFilterDosimetrieActive(false);
    setFilterValidationActive(false);
    setFilterQualiteActive(false);

    if (!filterImportationActive) {
      const filtered = patients.filter((patient) => {
        if (patient.Traitements && patient.Traitements.length > 0) {
          return patient.Traitements.some(
            (traitement) => !traitement.Importation && traitement.Scanner
          );
        }
        return false;
      });
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  };

  const filterPatientsContourage = () => {
    setFilterPrescriptionActive(false);
    setFilterScannerActive(false);
    setFilterImportationActive(false);
    setFilterContourageActive(!filterContourageActive);
    setFilterDosimetrieActive(false);
    setFilterValidationActive(false);
    setFilterQualiteActive(false);

    if (!filterContourageActive) {
      const filtered = patients.filter((patient) => {
        if (patient.Traitements && patient.Traitements.length > 0) {
          return patient.Traitements.some(
            (traitement) => !traitement.Contourage && traitement.Importation
          );
        }
        return false;
      });
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  };

  const filterPatientsDosimetrie = () => {
    setFilterPrescriptionActive(false);
    setFilterScannerActive(false);
    setFilterImportationActive(false);
    setFilterContourageActive(false);
    setFilterDosimetrieActive(!filterDosimetrieActive);
    setFilterValidationActive(false);
    setFilterQualiteActive(false);

    if (!filterDosimetrieActive) {
      const filtered = patients.filter((patient) => {
        if (patient.Traitements && patient.Traitements.length > 0) {
          return patient.Traitements.some(
            (traitement) => !traitement.Dosimetrie && traitement.Contourage
          );
        }
        return false;
      });
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  };

  const filterPatientsValidation = () => {
    setFilterPrescriptionActive(false);
    setFilterScannerActive(false);
    setFilterImportationActive(false);
    setFilterContourageActive(false);
    setFilterDosimetrieActive(false);
    setFilterValidationActive(!filterValidationActive);
    setFilterQualiteActive(false);

    if (!filterValidationActive) {
      const filtered = patients.filter((patient) => {
        if (patient.Traitements && patient.Traitements.length > 0) {
          return patient.Traitements.some(
            (traitement) => !traitement.Validation && traitement.Dosimetrie
          );
        }
        return false;
      });
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  };

  const filterPatientsQualite = () => {
    setFilterPrescriptionActive(false);
    setFilterScannerActive(false);
    setFilterImportationActive(false);
    setFilterContourageActive(false);
    setFilterDosimetrieActive(false);
    setFilterValidationActive(false);
    setFilterQualiteActive(!filterQualiteActive);

    if (!filterQualiteActive) {
      const filtered = patients.filter((patient) => {
        if (patient.Traitements && patient.Traitements.length > 0) {
          return patient.Traitements.some(
            (traitement) => !traitement.Qualite && traitement.Validation
          );
        }
        return false;
      });
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  };

  return (
    <div>
      <div className="search-bar">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <label className="searchlabel" htmlFor="nameSearch">
          Patient
        </label>
        <div className="groupSearch">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="iconSearch">
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
          </svg>
          <input
            className="inputSearch"
            type="search"
            placeholder="nom prénom"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <label className="searchlabel" htmlFor="DMISearch">
          DMI
        </label>
        <div className="groupSearch">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="iconSearch">
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
          </svg>
          <input
            className="inputSearch"
            type="search"
            placeholder="DMI du patient"
            value={searchDMI}
            onChange={(e) => setSearchDMI(e.target.value)}
          />
        </div>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <label htmlFor="machineSearch" className="searchlabel">
          Machine
        </label>
        <div className="groupSearch">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="iconSearch">
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
          </svg>
          <input
            className="inputSearch"
            type="search"
            placeholder="nom du machine"
            value={searchMachine}
            onChange={(e) => setSearchMachine(e.target.value)}
          />
        </div>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <label htmlFor="centreSearch" className="searchlabel">
          Centre De Traitement
        </label>
        <div className="groupSearch">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="iconSearch">
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
          </svg>
          <input
            className="inputSearch"
            type="search"
            placeholder="centre de Traitement"
            value={searchCentre}
            onChange={(e) => setSearchCentre(e.target.value)}
          />
        </div>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <label htmlFor="centreSearch" className="searchlabel">
          Date Début
        </label>
        <div className="groupSearch">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="iconSearch">
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
          </svg>
          <input
            className="inputSearch"
            id="startDateSearch"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <button className="search-buttonDate" onClick={searchByStartDate}>
            &#x1F3F8;{" "}
          </button>
        </div>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button onClick={() => openPatientModal()} className="c-button ">
          <span className="c-main flex gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              className="h-5 w-6"
            >
              <path
                fill="#FFFF"
                d="M48 0C21.5 0 0 21.5 0 48V256H144c8.8 0 16 7.2 16 16s-7.2 16-16 16H0v64H144c8.8 0 16 7.2 16 16s-7.2 16-16 16H0v80c0 26.5 21.5 48 48 48H265.9c-6.3-10.2-9.9-22.2-9.9-35.1c0-46.9 25.8-87.8 64-109.2V271.8 48c0-26.5-21.5-48-48-48H48zM152 64h16c8.8 0 16 7.2 16 16v24h24c8.8 0 16 7.2 16 16v16c0 8.8-7.2 16-16 16H184v24c0 8.8-7.2 16-16 16H152c-8.8 0-16-7.2-16-16V152H112c-8.8 0-16-7.2-16-16V120c0-8.8 7.2-16 16-16h24V80c0-8.8 7.2-16 16-16zM512 272a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM288 477.1c0 19.3 15.6 34.9 34.9 34.9H541.1c19.3 0 34.9-15.6 34.9-34.9c0-51.4-41.7-93.1-93.1-93.1H381.1c-51.4 0-93.1 41.7-93.1 93.1z"
              />
            </svg>{" "}
            Nouveau Patient
          </span>
        </button>
      </div>

      <Paper sx={{ width: "100%", borderRadius: 10 }} className="Tableau">
        <TableContainer className="table-container" sx={{ borderRadius: 10 }}>
          <Table stickyHeader aria-label="sticky table">
            <thead className="sticky-header">
              <tr>
                <th colSpan="2">Patient</th>
                <th
                  colSpan="1"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  Etape de prise en charge
                </th>
                <th colSpan="3">Etape de Traitement</th>
                <th colSpan="3">Informations Traitement</th>
              </tr>

              <tr className="hela">
                <th>DMI</th>
                <th>Nom & Prenom</th>
                <th>
                  <button
                    className={filterPrescriptionActive ? "b active" : "b"}
                    onClick={filterPatientsPrescription}
                  >
                    Prescription
                  </button>
                  <span className="backdrop"></span>&#8594;
                  <button
                    className={filterScannerActive ? "b active" : "b"}
                    onClick={filterPatientsScanner}
                  >
                    Scanner
                  </button>
                  <span className="backdrop"></span>&#8594;
                  <button
                    className={filterImportationActive ? "b active" : "b"}
                    onClick={filterPatientsImportation}
                  >
                    Importation
                  </button>
                  <span className="backdrop"></span>&#8594;
                  <button
                    className={filterContourageActive ? "b active" : "b"}
                    onClick={filterPatientsContourage}
                  >
                    Contourage
                  </button>
                  <span className="backdrop"></span>&#8594;
                  <button
                    className={filterDosimetrieActive ? "b active" : "b"}
                    onClick={filterPatientsDosimetrie}
                  >
                    Dosimétrie
                  </button>
                  <span className="backdrop"></span>&#8594;
                  <button
                    className={filterValidationActive ? "b active" : "b"}
                    onClick={filterPatientsValidation}
                  >
                    Validation
                  </button>
                  <span className="backdrop"></span>&#8594;
                  <button
                    className={filterQualiteActive ? "b active" : "b"}
                    onClick={filterPatientsQualite}
                  >
                    Contrôle
                  </button>
                  <span className="backdrop"></span>
                </th>
                <th>Commencer Traitement</th>

                <th>Date debut</th>

                <th>Répartition RDV</th>
                <th>Clinique</th>
                <th>Machine RT</th>
                <th>Medecins REF</th>
              </tr>
            </thead>
            <TableBody className="table-body">
              {(filteredPatients.length > 0 ? filteredPatients : patients).map(
                (patient) => (
                  <tr key={patient.id}>
                    <td>
                      <button
                        className="patientNomPrenom"
                        onClick={() => openModal5("detailsPatient", patient.id)}
                      >
                        {patient.DMI}
                      </button>
                    </td>
                    <td>
                      <button
                        className="patientNomPrenom"
                        onClick={() => openModal5("detailsPatient", patient.id)}
                      >
                        {patient.nom} {patient.prenom}
                      </button>
                    </td>
                    {/* Colonne des traitements */}
                    <td>
                      {/* Rendu des cases à cocher des traitements */}
                      {patient.Traitements.map((traitement) => (
                        <tr key={traitement.id}>
                          {/* Affichage des cases à cocher */}
                          <td>
                            <RenderCheckbox
                              traitement={traitement}
                              patient={patient}
                            />
                          </td>
                        </tr>
                      ))}
                    </td>
                    <td>
                      {patient.Traitements.map((traitement) => (
                        <tr key={traitement.id}>
                          <button
                            className="cta"
                            onClick={() =>
                              openModalDetailsTraitement(
                                "detailsTraitement",
                                traitement.id
                              )
                            }
                          >
                            <div className="flex items-center">
                              <svg
                                width="15px"
                                height="10px"
                                viewBox="0 0 13 10"
                              >
                                <path d="M1,5 L11,5"></path>
                                <polyline points="8 1 12 5 8 9"></polyline>
                              </svg>
                              <span className="mr-2">Commencer</span>
                            </div>
                          </button>
                        </tr>
                      ))}
                    </td>
                    {/* Colonne pour la date de début */}
                    <td>
                      {patient.Traitements.map((traitement) => (
                        <tr key={traitement.id}>
                          {traitement.dateDebut ? (
                            <div style={{ marginBottom: 30 }}>
                              {new Date(
                                traitement.dateDebut
                              ).toLocaleDateString("en-CA", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              })}
                            </div>
                          ) : (
                            <div style={{ marginBottom: 30 }}>
                              Aucune date de début spécifiée
                            </div>
                          )}
                        </tr>
                      ))}
                    </td>

                    {/* Colonne pour le nombre de séances */}
                    <td>
                      {patient.Traitements.map((traitement) => (
                        <tr key={traitement.id}>
                          {traitement.Seances &&
                          traitement.Seances.length > 0 ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: 30,
                              }}
                              className="seances"
                            >
                              <div> {calculatePassedSessions(traitement)}</div>

                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                                style={{
                                  height: 30,
                                  width: 30,
                                  marginLeft: 10,
                                }}
                                onClick={() =>
                                  openModalTraitement(
                                    "calendrier",
                                    traitement.id,
                                    patient.id
                                  )
                                }
                              >
                                <path
                                  fill="#00C6BA"
                                  d="M75 75L41 41C25.9 25.9 0 36.6 0 57.9V168c0 13.3 10.7 24 24 24H134.1c21.4 0 32.1-25.9 17-41l-30.8-30.8C155 85.5 203 64 256 64c106 0 192 86 192 192s-86 192-192 192c-40.8 0-78.6-12.7-109.7-34.4c-14.5-10.1-34.4-6.6-44.6 7.9s-6.6 34.4 7.9 44.6C151.2 495 201.7 512 256 512c141.4 0 256-114.6 256-256S397.4 0 256 0C185.3 0 121.3 28.7 75 75zm181 53c-13.3 0-24 10.7-24 24V256c0 6.4 2.5 12.5 7 17l72 72c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-65-65V152c0-13.3-10.7-24-24-24z"
                                />
                              </svg>
                            </div>
                          ) : (
                            <div style={{ marginBottom: 30 }}>
                              aucun traitement{" "}
                            </div>
                          )}
                        </tr>
                      ))}
                    </td>
                    {/* Colonne pour le centre de traitement */}
                    <td>
                      {patient.Traitements.map((traitement) => (
                        <tr key={traitement.id}>
                          {traitement.CentreTraitement ? (
                            <div style={{ marginBottom: 30 }}>
                              {traitement.CentreTraitement.nom}
                            </div>
                          ) : (
                            <div style={{ marginBottom: 30 }}>
                              Aucun centre de traitement spécifié
                            </div>
                          )}
                        </tr>
                      ))}
                    </td>
                    {/* Colonne pour la machine */}
                    <td>
                      {patient.Traitements.map((traitement) => (
                        <tr key={traitement.id}>
                          {traitement.Scanner ? (
                            <div style={{ marginBottom: 30 }}>
                              {traitement.Scanner.Machine.nomMachine}
                            </div>
                          ) : (
                            <div style={{ marginBottom: 30 }}>
                              Aucune machine spécifiée
                            </div>
                          )}
                        </tr>
                      ))}
                    </td>
                    {/* Colonne pour l'avatar et le bouton */}
                    <td className="fixed-column">
                      <div className="avatar-group fixed-column">
                        <AssignedUsers patientId={patient.id} />
                      </div>
                    </td>
                  </tr>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={patients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </Paper>
      <Modal
        isOpen={modalIsOpen && selectedModal === "detailsTraitement"}
        onRequestClose={closeModalDetailsTraitement}
        contentLabel="DetailsTraitement Modal"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <DetailsTraitement
          closeModal={closeModalDetailsTraitement}
          traitementId={selectedTraitementId}
          patientId={selectedPatientId}
        />
      </Modal>
      <Modal
        isOpen={modalIsOpen && selectedModal === "calendrier"}
        onRequestClose={closeModalTraitement}
        contentLabel="Calendrier Modal"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <Calendrier
          closeModal={closeModalTraitement}
          traitementId={selectedTraitementId}
          patientId={selectedPatientId}
        />
      </Modal>

      <Modal
        isOpen={isPatientModalOpen}
        onRequestClose={closePatientModal}
        contentLabel="Patient Modal"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <PATIENT closeModal={closePatientModal} />
      </Modal>
      <Modal
        isOpen={modalIsOpenNouveauCentre}
        onRequestClose={closeModalNouveauCentre}
        contentLabel="Nouveau centre Modal"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <NouveauCentre closeModal={closeModalNouveauCentre} />
      </Modal>

      <Modal
        isOpen={modalIsOpen && selectedModal === "detailsPatient"}
        onRequestClose={closeModal5}
        contentLabel="detailsPatient Modal"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <DetailsPatient
          closeModal={closeModal5}
          patientId={selectedPatientId}
        />
      </Modal>
    </div>
  );
}

export default Tableau;
