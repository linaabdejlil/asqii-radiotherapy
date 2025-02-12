// IMPORTATION.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../style/importation.css";

function IMPORTATION({ closeModal, importationId, traitementId, patientId }) {
  const today = new Date().toISOString().substr(0, 10);
  const [importation, setImportation] = useState(null);
  const [traitement, setTraitement] = useState(null);
  const [patient, setPatient] = useState(null);
  const [isImportationNotFound, setIsImportationNotFound] = useState(false);
  const [newImportationDate, setNewImportationDate] = useState(today);
  const [newImportationRemarque, setNewImportationRemarque] = useState("");
  const [loggedInUser, setLoggedInUser] = useState({
    nom: "",
    prenom: "",
    image: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:4001/users/profile",
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setLoggedInUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  const annuler = () => {
    window.location.reload();
  };
  useEffect(() => {
    const fetchDetailsPatient = async () => {
      console.log("ppppp", patientId);
      try {
        const response = await axios.get(
          `http://localhost:4001/patients/${patientId}`
        );
        setPatient(response.data);
      } catch (error) {
        console.error("Error fetching patients details:", error);
      }
    };

    fetchDetailsPatient();
  }, [patientId]);

  useEffect(() => {
    const fetchDetailsTraitement = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4001/traitements/one/${traitementId}`
        );
        setTraitement(response.data);
      } catch (error) {
        console.error("Error fetching traitement details:", error);
      }
    };
    fetchDetailsTraitement();
  }, [traitementId]);

  useEffect(() => {
    const fetchImportationDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4001/importations/${importationId}`,
          {
            params: { include: "User" },
          }
        );
        const importationData = {
          ...response.data,
          patient: response.data.Traitement.Patient,
        };
        setImportation(importationData);
      } catch (error) {
        console.error("Error fetching importation details:", error);
        setIsImportationNotFound(true);
      }
    };
    fetchImportationDetails();
  }, [importationId, traitementId]);

  const handleAddImportation = async () => {
    try {
      if (!traitementId) {
        console.error("TraitementId is not defined");
        return;
      }
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:4001/importations/add/${traitementId}`,
        {
          date: newImportationDate,
          etat: true,
          remarque: newImportationRemarque,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setImportation(response.data);
      setIsImportationNotFound(false);
      setNewImportationDate(today);
      setNewImportationRemarque("");
      window.location.reload();
    } catch (error) {
      console.error("Error adding Importation:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("fr-FR", options).replace(",", " à");
  };

  if (importation && !isImportationNotFound) {
    return (
      <div className="boxImportation">
        <div className="groupImportation">
          <div className="Importation-wrapper">
            <div className="Importation">Importation du scanner</div>
          </div>
          <button className="exit-button" onClick={annuler}>
            <span className="line"></span>
            <span className="line"></span>
          </button>
          <div className="medecin">
            <div
              className="avatar avatar-sm"
              style={{ marginTop: "100px", marginLeft: "10px" }}
            >
              <img
                alt=""
                src={importation && importation.User && importation.User.image}
                className="rounded-circle"
              />
            </div>
            <div className="med">
              {importation &&
                importation.User &&
                `${importation.User.nom} ${importation.User.prenom}`}
            </div>
          </div>
          <div className="realise">Réalisée Par :</div>
          <div className="patient">Patient(e) :</div>
          <div className="patientNom">
            {traitement &&
              traitement.Patient &&
              `${traitement.Patient.nom} ${traitement.Patient.prenom}`}
          </div>
          <div className="container">
            <div className="loc">Localisation:</div>
            <div className="locinput">
              {traitement && traitement.localisation}
            </div>
            <div className="indication">Indication:</div>
            <div className="indicationinput">
              {traitement && traitement.indication}
            </div>
            <div className="chimio">Chimiothérapie Concomittant:</div>
            <div className="chimioinput">
              {traitement && traitement.chimio ? "Oui" : "Non"}
            </div>
            <div className="nb">Nb Séances:</div>
            <div className="nbinput">
              {traitement && traitement.nombreSeances}
            </div>
            <div className="doseT">Dose Totale:</div>
            <div className="doseTinput">
              {traitement &&
                traitement.Prescription &&
                traitement.Prescription.doseTotale}{" "}
              Gy
            </div>
            <div className="doseS">Dose/Séance:</div>
            <div className="doseSinput">
              {traitement &&
                traitement.Prescription &&
                traitement.Prescription.doseSeance}{" "}
              Gy
            </div>
            <div className="doseS">Volume Cible:</div>
            <div className="doseSinput">
              {traitement &&
                traitement.Prescription &&
                traitement.Prescription.volume}
            </div>
            <div className="technique">Technique:</div>
            <div className="techniqueinput">
              {traitement &&
                traitement.Prescription &&
                traitement.Prescription.technique}
            </div>
          </div>

          <div className="dateImportation">Date Importation</div>
          <div className="inputdateImportation">
            <input
              className="inputdateImportation2"
              type="text"
              value={formatDate(importation.date)}
              readOnly
            />
          </div>
          <div className="rqImportation">Remarque Importation</div>
          <div className="inputrqImportation">
            <textarea
              className="inputrqImportation2"
              type="textarea"
              value={importation.remarque}
              readOnly
            ></textarea>
          </div>
          <div className="rqPrescription">
            <div className="avatar avatar-sm" id="avatar">
              <img
                alt=""
                src={
                  traitement &&
                  traitement.Prescription &&
                  traitement.Prescription.User &&
                  `${traitement.Prescription.User.image}`
                }
                className="rounded-circle"
              />
              <div className="overlay">
                {traitement &&
                  traitement.Prescription &&
                  traitement.Prescription.User &&
                  `${traitement.Prescription.User.nom}`}{" "}
                {traitement &&
                  traitement.Prescription &&
                  traitement.Prescription.User &&
                  `${traitement.Prescription.User.prenom}`}
              </div>
            </div>
            <div className="lign">Remarque Prescription</div>
          </div>

          <div className="inputrqPrescription">
            <div className="inputrqPrescription2" type="textarea">
              {traitement &&
              traitement.Prescription &&
              traitement.Prescription.remarque
                ? traitement.Prescription.remarque
                : "Pas de remarque pour prescription"}
            </div>
          </div>

          <div className="rqScanner">
            <div className="avatar avatar-sm" id="avatar">
              <img
                alt=""
                src={
                  traitement &&
                  traitement.Scanner &&
                  traitement.Scanner.User &&
                  `${traitement.Scanner.User.image}`
                }
                className="rounded-circle"
              />
              <div className="overlay">
                {traitement &&
                  traitement.Scanner &&
                  traitement.Scanner.User &&
                  `${traitement.Scanner.User.nom}`}{" "}
                {traitement &&
                  traitement.Scanner &&
                  traitement.Scanner.User &&
                  `${traitement.Scanner.User.prenom}`}
              </div>
            </div>
            <div className="lign">Remarque Scanner de simulation :</div>
          </div>
          <div className="inputrqPrescription">
            <div className="inputrqScanner2" type="textarea">
              {traitement && traitement.Scanner && traitement.Scanner.remarque
                ? traitement.Scanner.remarque
                : "Pas de remarque pour scanner de simulation"}{" "}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="boxImportation">
      <div className="groupImportation">
        <div className="Importation-wrapper">
          <div className="Importation">Importation du scanner</div>
        </div>
        <button className="exit-button" onClick={annuler}>
          <span className="line"></span>
          <span className="line"></span>
        </button>
        <div className="medecin2">
          <div
            className="avatar avatar-sm"
            style={{ marginTop: "100px", marginLeft: "10px" }}
          >
            <img alt="" src={loggedInUser.image} className="rounded-circle" />
          </div>
          <div className="med">{`${loggedInUser.nom} ${loggedInUser.prenom}`}</div>
        </div>
        <div className="realise"></div>
        <div className="patient">Patient(e) :</div>
        <div className="patientNom">
          {traitement &&
            traitement.Patient &&
            `${traitement.Patient.nom} ${traitement.Patient.prenom}`}
        </div>
        <div className="container">
          <div className="loc">Localisation:</div>
          <div className="locinput">
            {traitement && traitement.localisation}
          </div>
          <div className="indication">Indication:</div>
          <div className="indicationinput">
            {traitement && traitement.indication}
          </div>
          <div className="chimio">Chimiothérapie Concomittant:</div>
          <div className="chimioinput">
            {traitement && traitement.chimio ? "Oui" : "Non"}
          </div>
          <div className="nb">Nb Séances:</div>
          <div className="nbinput">
            {traitement && traitement.nombreSeances}
          </div>
          <div className="doseT">Dose Totale:</div>
          <div className="doseTinput">
            {traitement &&
              traitement.Prescription &&
              traitement.Prescription.doseTotale}{" "}
            Gy
          </div>
          <div className="doseS">Dose/Séance:</div>
          <div className="doseSinput">
            {traitement &&
              traitement.Prescription &&
              traitement.Prescription.doseSeance}{" "}
            Gy
          </div>
          <div className="doseS">Volume Cible:</div>
          <div className="doseSinput">
            {traitement &&
              traitement.Prescription &&
              traitement.Prescription.volume}
          </div>
          <div className="technique">Technique:</div>
          <div className="techniqueinput">
            {traitement &&
              traitement.Prescription &&
              traitement.Prescription.technique}
          </div>
        </div>

        <div className="dateImportation">Date Importation </div>
        <div className="inputdateImportation">
          <input
            className="inputdateImportation2"
            type="date"
            value={newImportationDate}
            onChange={(e) => setNewImportationDate(e.target.value)}
          ></input>
        </div>
        <div className="rqImportation">Remarque Importation </div>
        <div className="inputrqImportation">
          <textarea
            className="inputrqImportation2"
            type="textarea"
            placeholder="Ajoutez une remarque pour Importation"
            value={newImportationRemarque}
            onChange={(e) => setNewImportationRemarque(e.target.value)}
          ></textarea>
        </div>

        <div className="rqPrescription">
          <div className="avatar avatar-sm" id="avatar">
            <img
              alt=""
              src={
                traitement &&
                traitement.Prescription &&
                traitement.Prescription.User &&
                `${traitement.Prescription.User.image}`
              }
              className="rounded-circle"
            />
            <div className="overlay">
              {traitement &&
                traitement.Prescription &&
                traitement.Prescription.User &&
                `${traitement.Prescription.User.nom}`}{" "}
              {traitement &&
                traitement.Prescription &&
                traitement.Prescription.User &&
                `${traitement.Prescription.User.prenom}`}
            </div>
          </div>
          <div className="lign">Remarque Prescription:</div>
        </div>
        <div className="inputrqPrescription">
          <div className="inputrqPrescription2" type="textarea">
            {traitement &&
            traitement.Prescription &&
            traitement.Prescription.remarque
              ? traitement.Prescription.remarque
              : "Pas de remarque pour prescription"}
          </div>
        </div>

        <div className="rqScanner">
          <div className="avatar avatar-sm" id="avatar">
            <img
              alt=""
              src={
                traitement &&
                traitement.Scanner &&
                traitement.Scanner.User &&
                `${traitement.Scanner.User.image}`
              }
              className="rounded-circle"
            />
            <div className="overlay">
              {traitement &&
                traitement.Scanner &&
                traitement.Scanner.User &&
                `${traitement.Scanner.User.nom}`}{" "}
              {traitement &&
                traitement.Scanner &&
                traitement.Scanner.User &&
                `${traitement.Scanner.User.prenom}`}
            </div>
          </div>
          <div className="lign">Remarque Scanner de simulation :</div>
        </div>
        <div className="inputrqPrescription">
          <div className="inputrqScanner2">
            {traitement && traitement.Scanner && traitement.Scanner.remarque
              ? traitement.Scanner.remarque
              : "Pas de remarque pour scanner de simulation"}{" "}
          </div>
        </div>
        <div className="divImportation">
          <button className="champ-textImportation">
            <label
              className="text-wrapperImportation"
              onClick={handleAddImportation}
            >
              Valider
            </label>
          </button>
          <button className="div-wrapperImportation" onClick={annuler}>
            <label className="text-wrapperImportation">Annuler</label>
          </button>
        </div>
      </div>
    </div>
  );
}

export default IMPORTATION;
