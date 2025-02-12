import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import PRESCRIPTION from "../preTraitement/prescription";
import DOSIMETRIE from "../preTraitement/dosimetrie";
import Scanner from "../preTraitement/scanner";
import CONTOURAGE from "../preTraitement/contourage";
import IMPORTATION from "../preTraitement/importation";
import QUALITE from "../preTraitement/qualite";
import VALIDATION from "../preTraitement/validation";
import "../../style/tableau.css";
import "../../style/search.css";

const RenderCheckbox = ({ traitement, patient }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedModal, setSelectedModal] = useState(null);
  const [selectedContourageId, setSelectedContourageId] = useState(null);
  const [selectedDosimetrieId, setSelectedDosimetrieId] = useState(null);
  const [selectedImportationId, setSelectedImportationId] = useState(null);
  const [selectedQualiteId, setSelectedQualiteId] = useState(null);
  const [selectedValidationId, setSelectedValidationId] = useState(null);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
  const [selectedTraitementId, setSelectedTraitementId] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedScannerId, setSelectedScannerId] = useState(null);
  const [selectedMachineId, setSelectedMachineId] = useState(null);

  const openModalPrescription = (
    modalType,
    prescriptionId,
    traitementId,
    patientId
  ) => {
    console.log(modalType, prescriptionId);
    setSelectedModal(modalType);
    setSelectedTraitementId(traitementId);
    setSelectedPatientId(patientId);

    setSelectedPrescriptionId(prescriptionId);

    setModalIsOpen(true);
  };
  const closeModalPrescription = () => {
    setSelectedModal(null);
    setSelectedPrescriptionId(null);

    setModalIsOpen(false);
  };
  const openModal = (modalType, contourageId, traitementId, patientId) => {
    console.log(modalType, contourageId, traitementId);
    setSelectedModal(modalType);
    setSelectedContourageId(contourageId);
    setSelectedTraitementId(traitementId);
    setSelectedPatientId(patientId);

    setModalIsOpen(true);
  };
  const closeModal = () => {
    setSelectedModal(null);
    setSelectedContourageId(null);

    setModalIsOpen(false);
  };
  const openModal1 = (modalType, dosimetrieId, traitementId, patientId) => {
    console.log(modalType, dosimetrieId, traitementId);
    setSelectedModal(modalType);
    setSelectedDosimetrieId(dosimetrieId);
    setSelectedTraitementId(traitementId);
    setSelectedPatientId(patientId);

    setModalIsOpen(true);
  };
  const closeModal1 = () => {
    setSelectedModal(null);
    setSelectedDosimetrieId(null);

    setModalIsOpen(false);
  };
  const openModal2 = (modalType, importationIdId, traitementId, patientId) => {
    console.log(modalType, importationIdId, traitementId);
    setSelectedModal(modalType);
    setSelectedImportationId(importationIdId);
    setSelectedTraitementId(traitementId);
    setSelectedPatientId(patientId);

    setModalIsOpen(true);
  };
  const closeModal2 = () => {
    setSelectedModal(null);
    setSelectedImportationId(null);

    setModalIsOpen(false);
  };

  const openModal3 = (modalType, qualiteId, traitementId, patientId) => {
    console.log(modalType, qualiteId, traitementId);
    setSelectedModal(modalType);
    setSelectedQualiteId(qualiteId);
    setSelectedTraitementId(traitementId);
    setSelectedPatientId(patientId);

    setModalIsOpen(true);
  };
  const closeModal3 = () => {
    setSelectedModal(null);
    setSelectedQualiteId(null);

    setModalIsOpen(false);
  };
  const openModalValidation = (
    modalType,
    validationId,
    traitementId,
    patientId
  ) => {
    console.log(modalType, validationId, traitementId);
    setSelectedModal(modalType);
    setSelectedValidationId(validationId);
    setSelectedTraitementId(traitementId);
    setSelectedPatientId(patientId);

    setModalIsOpen(true);
  };
  const closeModalValidation = () => {
    setSelectedModal(null);
    setSelectedValidationId(null);

    setModalIsOpen(false);
  };
  const openModal6 = (
    modalType,
    scannerId,
    traitementId,
    machineId,
    patientId,
    prescriptionId
  ) => {
    console.log(modalType, scannerId, machineId, traitementId, patientId);
    setSelectedModal(modalType);
    setSelectedScannerId(scannerId);
    setSelectedTraitementId(traitementId);
    setSelectedMachineId(machineId);
    setSelectedPatientId(patientId);
    setSelectedPrescriptionId(prescriptionId);

    setModalIsOpen(true);
  };

  const closeModal6 = () => {
    setSelectedModal(null);
    setModalIsOpen(false);
  };

  return (
    <>
      <React.Fragment key={traitement.id}>
        {/* Checkbox Prescription */}
        <input
          type="checkbox"
          className={`checkprescription`}
          onClick={(e) => {
            e.preventDefault();
            openModalPrescription(
              "prescription",
              traitement?.Prescription?.id,
              traitement?.id,
              patient?.id
            );
          }}
          defaultChecked={
            traitement &&
            traitement.Prescription &&
            traitement.Prescription.etat
          }
        />
        <span className="high-dash">&mdash;&mdash;&mdash;&mdash;&mdash;</span>

        <input
          type="checkbox"
          className={`check${
            !traitement ||
            !traitement.Prescription ||
            !traitement.Prescription.etat
              ? ""
              : " checkAttent"
          }`}
          onClick={(e) => {
            e.preventDefault();
            if (
              traitement &&
              traitement.Prescription &&
              traitement.Prescription.etat
            ) {
              openModal6(
                "scanner",
                traitement?.Scanner?.id,
                traitement?.id,
                Scanner?.machineId,
                patient?.id,
                traitement.Prescription?.id
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
          defaultChecked={
            traitement && traitement.Scanner && traitement.Scanner.etat
          }
        />

        <span className="high-dash">&mdash;&mdash;&mdash;&mdash;</span>

        <input
          type="checkbox"
          className={`check${
            !traitement || !traitement.Scanner || !traitement.Scanner.etat
              ? ""
              : " checkAttent"
          }`}
          onClick={(e) => {
            e.preventDefault();
            if (traitement && traitement.Scanner && traitement.Scanner.etat) {
              openModal2(
                "importation",
                traitement?.Importation?.id,
                traitement?.id,
                patient?.id
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
          defaultChecked={
            traitement && traitement.Importation && traitement.Importation.etat
          }
        />
        <span className="high-dash">&mdash;&mdash;&mdash;&mdash;&mdash;</span>

        <input
          type="checkbox"
          className={`check${
            !traitement ||
            !traitement.Importation ||
            !traitement.Importation.etat
              ? ""
              : " checkAttent"
          }`}
          onClick={(e) => {
            e.preventDefault();
            if (
              traitement &&
              traitement.Importation &&
              traitement.Importation.etat
            ) {
              openModal(
                "contourage",
                traitement?.Contourage?.id,
                traitement?.id,
                patient?.id
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
          defaultChecked={
            traitement && traitement.Contourage && traitement.Contourage.etat
          }
        />
        <span className="high-dash">&mdash;&mdash;&mdash;&mdash;&mdash;</span>

        <input
          type="checkbox"
          className={`check${
            !traitement || !traitement.Contourage || !traitement.Contourage.etat
              ? ""
              : " checkAttent"
          }`}
          onClick={(e) => {
            e.preventDefault();
            if (
              traitement &&
              traitement.Contourage &&
              traitement.Contourage.etat
            ) {
              openModal1(
                "dosimetrie",
                traitement?.Dosimetrie?.id,
                traitement?.id,
                patient?.id
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
          defaultChecked={
            traitement && traitement.Dosimetrie && traitement.Dosimetrie.etat
          }
        />
        <span className="high-dash">&mdash;&mdash;&mdash;&mdash;</span>

        <input
          type="checkbox"
          className={`check${
            !traitement || !traitement.Dosimetrie || !traitement.Dosimetrie.etat
              ? ""
              : " checkAttent"
          }`}
          onClick={(e) => {
            e.preventDefault();
            if (
              traitement &&
              traitement.Dosimetrie &&
              traitement.Dosimetrie.etat
            ) {
              openModalValidation(
                "validation",
                traitement?.Validation?.id,
                traitement?.id,
                patient?.id
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
          defaultChecked={
            traitement && traitement.Validation && traitement.Validation.etat
          }
        ></input>
        <span className="high-dash">&mdash;&mdash;&mdash;&mdash;&mdash;</span>

        <input
          type="checkbox"
          className={`check${
            !traitement || !traitement.Validation || !traitement.Validation.etat
              ? ""
              : " checkAttent"
          }`}
          onClick={(e) => {
            e.preventDefault();
            if (
              traitement &&
              traitement.Validation &&
              traitement.Validation.etat
            ) {
              openModal3(
                "qualite",
                traitement?.Qualite?.id,
                traitement?.id,
                patient?.id
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
          defaultChecked={
            traitement && traitement.Qualite && traitement.Qualite.etat
          }
        />
      </React.Fragment>
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
          traitementId={selectedTraitementId}
          patientId={selectedPatientId}
        />
      </Modal>
      <Modal
        isOpen={modalIsOpen && selectedModal === "qualite"}
        onRequestClose={closeModal3}
        contentLabel="qualite Modal"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <QUALITE
          closeModal={closeModal3}
          qualiteId={selectedQualiteId}
          traitementId={selectedTraitementId}
          patientId={selectedPatientId}
        />
      </Modal>
      <Modal
        isOpen={modalIsOpen && selectedModal === "validation"}
        onRequestClose={closeModalValidation}
        contentLabel="validation Modal"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <VALIDATION
          closeModal={closeModalValidation}
          validationId={selectedValidationId}
          traitementId={selectedTraitementId}
          patientId={selectedPatientId}
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
          patientId={selectedPatientId}
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
          closeModal6={closeModal6}
          scannerId={selectedScannerId}
          traitementId={selectedTraitementId}
          machineId={selectedMachineId}
          patientId={selectedPatientId}
          prescriptionId={selectedPrescriptionId}
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
          patientId={selectedPatientId}
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
          patientId={selectedPatientId}
        />
      </Modal>
    </>
  );
};
export default RenderCheckbox;
