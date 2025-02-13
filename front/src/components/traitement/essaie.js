// Tableau.js
import "../style/tableau.css";
import "../style/search.css";

import React, { useState, useEffect, useCallback } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button } from "antd";

import axios from "axios";
import Modal from "react-modal";
import DOSIMETRIE from "../preTraitement/dosimetrie";
import Scanner from "../preTraitement/scanner";
import CONTOURAGE from "../preTraitement/contourage";
import IMPORTATION from "../preTraitement/importation";
import IMPORTATIONMACHINE from "../preTraitement/qualite";
import PATIENT from "../Patient";
import PRESCRIPTION from "../preTraitement/prescription";
import DetailsPatient from "../detailsPatient";
import Calendrier from "./calendrier";
import MEDECIN from "./medecin";

Modal.setAppElement("#root");

function Essaie() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedModal, setSelectedModal] = useState(null);
  const [selectedContourageId, setSelectedContourageId] = useState(null);
  const [selectedDosimetrieId, setSelectedDosimetrieId] = useState(null);
  const [selectedImportationId, setSelectedImportationId] = useState(null);
  const [selectedImportationMachineId, setSelectedImportationMachineId] =
    useState(null);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
  const [selectedTraitementId, setSelectedTraitementId] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedScannerId, setSelectedScannerId] = useState(null);
  const [selecteMachienId, setSelectedMachineId] = useState(null);

  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [centreTraitement, setCentreTraitement] = useState("");
  const [nomMachine, setNomMachine] = useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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

  const searchByCentreTraitement = async (centreTraitementItem) => {
    setCentreTraitement(centreTraitementItem);
    try {
      const response = await axios.get(
        `patients/searchCT/${centreTraitementItem}`
      );
      console.log(
        "Filtered Patients data by centre traitement:",
        response.data
      );
      setPatients(response.data);
    } catch (error) {
      console.error(
        "Error fetching filtered data by centre traitement:",
        error
      );
    }
    // if (centreTraitement.trim() !== '') {
    //   searchByCentreTraitement();
    // }
  };

  useEffect(() => {
    const searchByMachine = async () => {
      try {
        const response = await axios.get(
          `patients/searchMachine/${nomMachine}`
        );
        console.log("Filtered Patients data by machine:", response.data);
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching filtered data by machine:", error);
      }
    };

    if (nomMachine.trim() !== "") {
      searchByMachine();
    }
  }, [nomMachine]);

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
  const renderCheckboxes = (patient) => {
    return (
      <React.Fragment>
        <input
          type="checkbox"
          className={`checkprescription`}
          onClick={(e) => {
            e.preventDefault();
            openModalPrescription(
              "prescription",
              patient?.Traitement?.Prescription?.id,
              patient?.id
            );
          }}
          checked={
            patient.Traitement &&
            patient.Traitement.Prescription &&
            patient.Traitement.Prescription.etat
          }
        />

        <span className="high-dash">&mdash;&mdash;&mdash;</span>

        <input
          type="checkbox"
          className={`check${
            !patient.Traitement ||
            !patient.Traitement.Prescription ||
            !patient.Traitement.Prescription.etat
              ? ""
              : " checkAttent"
          }`}
          onClick={(e) => {
            e.preventDefault();
            if (
              patient.Traitement &&
              patient.Traitement.Prescription &&
              patient.Traitement.Prescription.etat
            ) {
              openModal6(
                "scanner",
                patient?.Traitement?.Scanner?.id,
                patient?.Traitement?.id
              );
            } else {
              // Créez votre propre alerte personnalisée
              const alertDiv = document.createElement("div");
              alertDiv.style.position = "fixed";
              alertDiv.style.top = "50%";
              alertDiv.style.left = "50%";
              alertDiv.style.transform = "translate(-50%, -50%)";
              alertDiv.style.backgroundColor = "#c6000091";
              alertDiv.style.color = "white";
              alertDiv.style.borderRadius = "12px";
              alertDiv.style.padding = "10px";
              alertDiv.textContent = "Il faut vérifier l'état de prescription";
              document.body.appendChild(alertDiv);
              // Efface l'alerte après quelques secondes
              setTimeout(() => {
                alertDiv.remove();
              }, 3000);
            }
          }}
          checked={
            patient.Traitement &&
            patient.Traitement.Scanner &&
            patient.Traitement.Scanner.etat
          }
        />

        <span className="high-dash">&mdash;&mdash;&mdash;</span>

        <input
          type="checkbox"
          className={`check${
            !patient.Traitement ||
            !patient.Traitement.Scanner ||
            !patient.Traitement.Scanner.etat
              ? ""
              : " checkAttent"
          }`}
          onClick={(e) => {
            e.preventDefault();
            if (
              patient.Traitement &&
              patient.Traitement.Scanner &&
              patient.Traitement.Scanner.etat
            ) {
              openModal2(
                "importation",
                patient?.Traitement?.Importation?.id,
                patient?.Traitement?.id
              );
            } else {
              // Créez votre propre alerte personnalisée
              const alertDiv = document.createElement("div");
              alertDiv.style.position = "fixed";
              alertDiv.style.top = "50%";
              alertDiv.style.left = "50%";
              alertDiv.style.transform = "translate(-50%, -50%)";
              alertDiv.style.backgroundColor = "#c6000091";
              alertDiv.style.color = "white";
              alertDiv.style.borderRadius = "12px";
              alertDiv.style.padding = "10px";
              alertDiv.textContent = "Il faut vérifier l'état de scanner";
              document.body.appendChild(alertDiv);
              // Efface l'alerte après quelques secondes
              setTimeout(() => {
                alertDiv.remove();
              }, 3000);
            }
          }}
          checked={
            patient.Traitement &&
            patient.Traitement.Importation &&
            patient.Traitement.Importation.etat
          }
        />
        <span className="high-dash">&mdash;&mdash;&mdash;</span>

        <input
          type="checkbox"
          className={`check${
            !patient.Traitement ||
            !patient.Traitement.Importation ||
            !patient.Traitement.Importation.etat
              ? ""
              : " checkAttent"
          }`}
          onClick={(e) => {
            e.preventDefault();
            if (
              patient.Traitement &&
              patient.Traitement.Importation &&
              patient.Traitement.Importation.etat
            ) {
              openModal(
                "contourage",
                patient?.Traitement?.Contourage?.id,
                patient?.Traitement?.id
              );
            } else {
              // Créez votre propre alerte personnalisée
              const alertDiv = document.createElement("div");
              alertDiv.style.position = "fixed";
              alertDiv.style.top = "50%";
              alertDiv.style.left = "50%";
              alertDiv.style.transform = "translate(-50%, -50%)";
              alertDiv.style.backgroundColor = "#c6000091";
              alertDiv.style.color = "white";
              alertDiv.style.borderRadius = "12px";
              alertDiv.style.padding = "10px";
              alertDiv.textContent = "Il faut vérifier l'état de Importation";
              document.body.appendChild(alertDiv);
              // Efface l'alerte après quelques secondes
              setTimeout(() => {
                alertDiv.remove();
              }, 3000);
            }
          }}
          checked={
            patient.Traitement &&
            patient.Traitement.Contourage &&
            patient.Traitement.Contourage.etat
          }
        />
        <span className="high-dash">&mdash;&mdash;&mdash;</span>

        <input
          type="checkbox"
          className={`check${
            !patient.Traitement ||
            !patient.Traitement.Contourage ||
            !patient.Traitement.Contourage.etat
              ? ""
              : " checkAttent"
          }`}
          onClick={(e) => {
            e.preventDefault();
            if (
              patient.Traitement &&
              patient.Traitement.Contourage &&
              patient.Traitement.Contourage.etat
            ) {
              openModal1(
                "dosimetrie",
                patient?.Traitement?.Dosimetrie?.id,
                patient?.Traitement?.id
              );
            } else {
              // Créez votre propre alerte personnalisée
              const alertDiv = document.createElement("div");
              alertDiv.style.position = "fixed";
              alertDiv.style.top = "50%";
              alertDiv.style.left = "50%";
              alertDiv.style.transform = "translate(-50%, -50%)";
              alertDiv.style.backgroundColor = "#c6000091";
              alertDiv.style.color = "white";
              alertDiv.style.borderRadius = "12px";
              alertDiv.style.padding = "10px";
              alertDiv.textContent = "Il faut vérifier l'état de Contourage";
              document.body.appendChild(alertDiv);
              // Efface l'alerte après quelques secondes
              setTimeout(() => {
                alertDiv.remove();
              }, 3000);
            }
          }}
          checked={
            patient.Traitement &&
            patient.Traitement.Dosimetrie &&
            patient.Traitement.Dosimetrie.etat
          }
        />
        <span className="high-dash">&mdash;&mdash;&mdash;</span>

        <input
          type="checkbox"
          className={`check${
            !patient.Traitement ||
            !patient.Traitement.Dosimetrie ||
            !patient.Traitement.Dosimetrie.etat
              ? ""
              : " checkAttent"
          }`}
          onClick={(e) => {
            e.preventDefault();
            if (
              patient.Traitement &&
              patient.Traitement.Dosimetrie &&
              patient.Traitement.Dosimetrie.etat
            ) {
              openModal3(
                "importationMachine",
                patient?.Traitement?.ImportationMachine?.id,
                patient?.Traitement?.id
              );
            } else {
              // Créez votre propre alerte personnalisée
              const alertDiv = document.createElement("div");
              alertDiv.style.position = "fixed";
              alertDiv.style.top = "50%";
              alertDiv.style.left = "50%";
              alertDiv.style.transform = "translate(-50%, -50%)";
              alertDiv.style.backgroundColor = "#c6000091";
              alertDiv.style.color = "white";
              alertDiv.style.borderRadius = "12px";
              alertDiv.style.padding = "10px";
              alertDiv.textContent = "Il faut vérifier l'état de Dosimetrie";
              document.body.appendChild(alertDiv);
              // Efface l'alerte après quelques secondes
              setTimeout(() => {
                alertDiv.remove();
              }, 3000);
            }
          }}
          checked={
            patient.Traitement &&
            patient.Traitement.ImportationMachine &&
            patient.Traitement.ImportationMachine.etat
          }
        />
      </React.Fragment>
    );
  };

  const openModal = (modalType, contourageId, traitementId) => {
    console.log(modalType, contourageId, traitementId);
    setSelectedModal(modalType);
    setSelectedContourageId(contourageId);
    setSelectedTraitementId(traitementId);
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setSelectedModal(null);
    setSelectedContourageId(null);

    setModalIsOpen(false);
  };

  const openPatientModal = () => {
    setIsPatientModalOpen(true);
  };

  const closePatientModal = () => {
    setIsPatientModalOpen(false);
  };

  const openModalTraitement = (modalType, traitementId) => {
    console.log(modalType, traitementId);
    setSelectedModal(modalType);
    setSelectedTraitementId(traitementId);
    setModalIsOpen(true);
  };
  const closeModalTraitement = (traitementId) => {
    setSelectedModal(null);
    setSelectedTraitementId(traitementId);
    setModalIsOpen(false);
  };

  const openModal1 = (modalType, dosimetrieId, traitementId) => {
    console.log(modalType, dosimetrieId, traitementId);
    setSelectedModal(modalType);
    setSelectedDosimetrieId(dosimetrieId);
    setSelectedTraitementId(traitementId);
    setModalIsOpen(true);
  };
  const closeModal1 = () => {
    setSelectedModal(null);
    setSelectedDosimetrieId(null);

    setModalIsOpen(false);
  };
  const openModal2 = (modalType, importationIdId, traitementId) => {
    console.log(modalType, importationIdId, traitementId);
    setSelectedModal(modalType);
    setSelectedImportationId(importationIdId);
    setSelectedTraitementId(traitementId);
    setModalIsOpen(true);
  };
  const closeModal2 = () => {
    setSelectedModal(null);
    setSelectedImportationId(null);

    setModalIsOpen(false);
  };

  const openModal3 = (modalType, importationMachineId, traitementId) => {
    console.log(modalType, importationMachineId, traitementId);
    setSelectedModal(modalType);
    setSelectedImportationMachineId(importationMachineId);
    setSelectedTraitementId(traitementId);
    setModalIsOpen(true);
  };
  const closeModal3 = () => {
    setSelectedModal(null);
    setSelectedImportationMachineId(null);

    setModalIsOpen(false);
  };
  const openModalPrescription = (
    modalType,
    prescriptionId,
    patientId,
    traitementId
  ) => {
    console.log(modalType, prescriptionId);
    setSelectedModal(modalType);
    setSelectedPatientId(patientId);
    setSelectedTraitementId(traitementId);

    setSelectedPrescriptionId(prescriptionId);

    setModalIsOpen(true);
  };
  const closeModalPrescription = () => {
    setSelectedModal(null);
    setSelectedPrescriptionId(null);

    setModalIsOpen(false);
  };

  const openModalMedecin = (modalType, patientId) => {
    console.log(modalType, patientId);
    setSelectedModal(modalType);
    setSelectedPatientId(patientId);
    setModalIsOpen(true);
  };
  const closeModalMedecin = () => {
    setSelectedModal(null);
    setSelectedPatientId(null);

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

  const openModal6 = (modalType, scannerId, traitementId, machineId) => {
    console.log(modalType, scannerId, machineId, traitementId);
    setSelectedModal(modalType);
    setSelectedScannerId(scannerId);
    setSelectedTraitementId(traitementId);
    setSelectedMachineId(machineId);
    setModalIsOpen(true);
  };

  const closeModal6 = () => {
    setSelectedModal(null);
    setSelectedScannerId(null);
    setSelectedTraitementId(null); // Reset selectedTraitementId as well
    setSelectedMachineId(null);
    setModalIsOpen(false);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.prenom.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [colonnesVisibles, setColonnesVisibles] = useState(true); // État pour suivre si les colonnes sont visibles ou non

  const toggleColonnes = () => {
    setColonnesVisibles(!colonnesVisibles);
  };

  return (
    <div>
      <div className="search-bar">
        <label className="searchlabel" htmlFor="nameSearch">
          Patient
        </label>
        <input
          className="searchinput"
          id="nameSearch"
          type="text"
          placeholder="Enter name or prenom &#x1F3F8;	"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <label htmlFor="startDateSearch" className="searchlabel">
          Date Début Traitement
        </label>
        <input
          className="searchinputdate"
          id="startDateSearch"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <button className="search-buttonDate" onClick={searchByStartDate}>
          &#x1F3F8;{" "}
        </button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <label htmlFor="machineSearch" className="searchlabel">
          Machine
        </label>
        <input
          className="searchinput"
          id="machineSearch"
          type="text"
          placeholder="Enter nom machine  &#x1F3F8;	"
          value={nomMachine}
          onChange={(e) => setNomMachine(e.target.value)}
        />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <label htmlFor="centreSearch" className="searchlabel">
          Centre De Traitement
        </label>
        <input
          className="searchinput"
          id="centreSearch"
          type="text"
          placeholder="Enter centreTraitement &#x1F3F8;	"
          value={centreTraitement}
          onChange={(e) => searchByCentreTraitement(e.target.value)}
        />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button
          className="plus-button"
          onClick={() => openPatientModal()}
        ></button>
      </div>

      <Paper sx={{ width: "100%" }}>
        <TableContainer sx={{ maxHeight: 800 }}>
          <Table stickyHeader aria-label="sticky table">
            <DataGrid
              rows={filteredPatients}
              columns={[
                {
                  field: "nom",
                  headerName: "Nom",
                  width: 100,
                  headerClassName: "cc",
                },
                {
                  field: "prenom",
                  headerName: "Prenom",
                  width: 100,
                  headerClassName: "cc",
                },

                {
                  field: "actions",
                  headerName: (
                    <th>
                      Prescription&#8594;Scanner&#8594;Importation&#8594;Contourage&#8594;Dosimetrie&#8594;ImpMachine
                    </th>
                  ),
                  width: 600,
                  renderCell: (params) => (
                    <td>{renderCheckboxes(params.row)}</td>
                  ),
                },

                // Ajoutez une condition pour afficher ou masquer les colonnes d'étape de traitement
                ...(colonnesVisibles
                  ? [
                      {
                        field: "dateDebut",
                        type: "date",
                        headerName: "Date de début ",
                        width: 200,
                        renderCell: (params) => (
                          <td>
                            {params.row?.Traitement
                              ? params.row?.Traitement?.dateDebut
                                ? new Date(
                                    params.row?.Traitement?.dateDebut
                                  ).toLocaleDateString("fr-CA", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                  })
                                : "Aucune date de début spécifiée"
                              : "Aucun traitement"}
                          </td>
                        ),
                      },
                      {
                        field: "seances",
                        headerName: "Seances",
                        width: 200,
                        renderCell: (params) => (
                          <td
                            onClick={(e) => {
                              e.preventDefault();
                              openModalTraitement(
                                "calendrier",
                                params.row?.Traitement?.id
                              );
                            }}
                          >
                            {params.row?.Traitement ? (
                              params.row?.Traitement?.Seances &&
                              params.row?.Traitement?.Seances.length > 0 ? (
                                <text className="seances">
                                  {`${params.row?.Traitement?.Seances[0].numero_seance}/${params.row?.Traitement?.nombre_seances}`}
                                </text>
                              ) : (
                                "0 seances"
                              )
                            ) : (
                              "Aucun traitement"
                            )}
                          </td>
                        ),
                      },
                    ]
                  : []),
                {
                  field: "machine",
                  headerName: "Machine RT",
                  width: 200,
                  renderCell: (params) => (
                    <td>
                      {params.row?.Traitement
                        ? params.row?.Traitement?.Scanner
                          ? params.row?.Traitement?.Scanner?.Machine.nomMachine
                          : "Aucune machine spécifiée"
                        : "Aucun traitement"}
                    </td>
                  ),
                },
                {
                  field: "centreTraitement",
                  headerName: "Centre de traitement",
                  width: 200,
                  renderCell: (params) => (
                    <td>
                      {params.row?.Traitement
                        ? params.row?.Traitement?.CentreTraitement
                          ? params.row?.Traitement?.CentreTraitement.nom
                          : "Aucun centre de traitement spécifié"
                        : "Aucun traitement"}
                    </td>
                  ),
                },
              ]}
              columnGroupingModel={[
                {
                  groupId: "Patient",
                  children: [{ field: "nom" }, { field: "prenom" }],
                },
                {
                  groupId: (
                    <th
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ flexGrow: 1, textAlign: "center" }}>
                        Etape de prise en charge
                      </div>
                      <div>
                        <Button type="primary" onClick={toggleColonnes}>
                          {colonnesVisibles ? (
                            <MenuUnfoldOutlined />
                          ) : (
                            <MenuFoldOutlined />
                          )}
                        </Button>
                      </div>
                    </th>
                  ),

                  children: [{ field: "actions" }],
                },
                {
                  groupId: "Etape de Traitement",
                  cellClassName: "aa",

                  children: [{ field: "dateDebut" }, { field: "seances" }],
                },

                {
                  groupId: "Informations Traitement",

                  children: [
                    { field: "machine" },
                    { field: "centreTraitement" },
                  ],
                },
              ]}
              pagination
              pageSize={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[10, 25, 100]}
              rowCount={filteredPatients.length}
              onPageSizeChange={handleChangeRowsPerPage}
              experimentalFeatures={{ columnGrouping: true }}
              checkboxSelection
              components={{
                Toolbar: GridToolbar,
              }}
            />
          </Table>
        </TableContainer>
      </Paper>

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
        />
      </Modal>
      <Modal
        isOpen={modalIsOpen && selectedModal === "dosimetrie"}
        onRequestClose={closeModal1}
        contentLabel="Dosimetrie Modal"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <DOSIMETRIE
          closeModal={closeModal1}
          dosimetrieId={selectedDosimetrieId}
          traitementId={selectedTraitementId}
        />
      </Modal>
      <Modal
        isOpen={modalIsOpen && selectedModal === "scanner"}
        onRequestClose={closeModal6}
        contentLabel="Scanner Modal"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <Scanner
          closeModal={closeModal6}
          scannerId={selectedScannerId}
          traitementId={selectedTraitementId}
          machineId={selecteMachienId}
        />
      </Modal>
      <Modal
        isOpen={modalIsOpen && selectedModal === "contourage"}
        onRequestClose={closeModal}
        contentLabel="Contourage Modal"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <CONTOURAGE
          closeModal={closeModal}
          contourageId={selectedContourageId}
          traitementId={selectedTraitementId}
        />
      </Modal>
      <Modal
        isOpen={modalIsOpen && selectedModal === "importation"}
        onRequestClose={closeModal2}
        contentLabel="importation Modal"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <IMPORTATION
          closeModal={closeModal2}
          importationId={selectedImportationId}
          traitementId={selectedTraitementId}
        />
      </Modal>
      <Modal
        isOpen={modalIsOpen && selectedModal === "importationMachine"}
        onRequestClose={closeModal3}
        contentLabel="importationMachine Modal"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <IMPORTATIONMACHINE
          closeModal={closeModal3}
          importationMachineId={selectedImportationMachineId}
          traitementId={selectedTraitementId}
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
        isOpen={modalIsOpen && selectedModal === "prescription"}
        onRequestClose={closeModalPrescription}
        contentLabel="prescription Modal"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <PRESCRIPTION
          closeModal={closeModalPrescription}
          prescriptionId={selectedPrescriptionId}
          patientId={selectedPatientId}
          traitementId={selectedTraitementId}
        />
      </Modal>
      <Modal
        isOpen={modalIsOpen && selectedModal === "medecin"}
        onRequestClose={closeModalMedecin}
        contentLabel="medecin Modal"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <MEDECIN closeModal={closeModalMedecin} patientId={selectedPatientId} />
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

export default Essaie;
