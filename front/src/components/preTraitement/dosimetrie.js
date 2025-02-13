// DOSIMETRIE.js
import "../../style/dosimetrie.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

function DOSIMETRIE({ closeModal1, dosimetrieId, traitementId }) {
  const today = new Date().toISOString().substr(0, 10);
  const [dosimetrie, setDosimetrie] = useState(null);
  const [traitement, setTraitement] = useState(null);
  const [isDosimetrieNotFound, setIsDosimetrieNotFound] = useState(false);
  const [newDosimetrieDate, setNewDosimetrieDate] = useState(today);
  const [newDosimetrieEtat, setNewDosimetrieEtat] = useState("");
  const [newDosimetrieRemarque, setNewDosimetrieRemarque] = useState("");
  const [loggedInUserNom, setLoggedInUserNom] = useState("");
  const [loggedInUserPrenom, setLoggedInUserPrenom] = useState("");
  const [loggedInUserImage, setLoggedInUserImage] = useState("");

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
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  const annuler = async () => {
    window.location.reload();
  };
  useEffect(() => {
    const fetchDetailsTraitement = async () => {
      try {
        const response = await axios.get(
          `traitements/one/${traitementId}`
        );
        setTraitement(response.data);
      } catch (error) {
        console.error("Error fetching traitement details:", error);
      }
    };
    fetchDetailsTraitement();
  }, [traitementId]);
  useEffect(() => {
    const fetchDosimetrieDetails = async () => {
      try {
        const response = await axios.get(
          `dosimetries/${dosimetrieId}`,
          {
            params: { include: "User" }, // Ajoutez ceci pour inclure les données de l'utilisateur
          }
        );
        console.log("Dosimetrie data:", response.data);
        setDosimetrie(response.data);
        setDosimetrie({
          ...response.data,
          patient: response.data.Traitement.Patient,
        });
      } catch (error) {
        console.error("Error fetching dosimetrie details:", error);
      }
    };

    fetchDosimetrieDetails();
  }, [dosimetrieId, traitementId]);

  const handleAddDosimetrie = async () => {
    try {
      if (!traitementId) {
        console.error("TraitementId is not defined");
        return;
      }
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `dosimetries/add/${traitementId}`,
        {
          date: newDosimetrieDate,
          etat: true,
          remarque: newDosimetrieRemarque,
        },
        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );

      setDosimetrie(response.data);
      setIsDosimetrieNotFound(false);

      setNewDosimetrieDate("");
      setNewDosimetrieEtat("");
      setNewDosimetrieRemarque("");
      window.location.reload();
    } catch (error) {
      console.error("Error adding dosimetrie:", error);
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

  // Render the dosimetrie details if available
  if (dosimetrie && !isDosimetrieNotFound) {
    return (
      <div className="boxDosimetrie">
        <div className="groupDosimetrie">
          <div className="Dosimetrie-wrapper">
            <div className="Dosimetrie">Dosimetrie</div>
          </div>
          <button className="exit-button" onClick={annuler}>
            <span className="line"></span>
            <span className="line"></span>
          </button>
          <div className="medecin">
            <div
              className="avatar avatar-sm"
              style={{ marginTop: "80px", marginLeft: "10px" }}
            >
              <img
                alt=""
                src={dosimetrie && dosimetrie.User && dosimetrie.User.image}
                className="rounded-circle"
              />
            </div>
            <div className="med">
              {dosimetrie &&
                dosimetrie.User &&
                `${dosimetrie.User.nom} ${dosimetrie.User.prenom}`}
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
          <div className="dateDosimetrie">Date Dosimetrie</div>
          <div className="inputdateDosimetrie">
            <input
              className="inputdateDosimetrie2"
              type="text"
              value={formatDate(dosimetrie.date)}
              readOnly
            />
          </div>
          <div className="rqDosimetrie">Remarque dosimetrie</div>
          <div className="inputrqDosimetrie">
            <textarea
              className="inputrqDosimetrie2"
              type="textarea"
              value={dosimetrie.remarque}
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
          <div className="rqImportation">
            <div className="avatar avatar-sm" id="avatar">
              <img
                alt=""
                src={
                  traitement &&
                  traitement.Importation &&
                  traitement.Importation.User &&
                  `${traitement.Importation.User.image}`
                }
                className="rounded-circle"
              />
              <div className="overlay">
                {traitement &&
                  traitement.Importation &&
                  traitement.Importation.User &&
                  `${traitement.Importation.User.nom}`}{" "}
                {traitement &&
                  traitement.Importation &&
                  traitement.Importation.User &&
                  `${traitement.Importation.User.prenom}`}
              </div>
            </div>
            <div className="lign">Remarque Importation:</div>
          </div>
          <div className="inputrqPrescription">
            <div className="inputrqPrescription2" type="textarea">
              {traitement &&
              traitement.Importation &&
              traitement.Importation.remarque
                ? traitement.Importation.remarque
                : "Pas de remarque pour importation"}
            </div>
          </div>
          <div className="rqContourage">
            <div className="avatar avatar-sm" id="avatar">
              <img
                alt=""
                src={
                  traitement &&
                  traitement.Contourage &&
                  traitement.Contourage.User &&
                  `${traitement.Contourage.User.image}`
                }
                className="rounded-circle"
              />
              <div className="overlay">
                {traitement &&
                  traitement.Contourage &&
                  traitement.Contourage.User &&
                  `${traitement.Contourage.User.nom}`}{" "}
                {traitement &&
                  traitement.Contourage &&
                  traitement.Contourage.User &&
                  `${traitement.Contourage.User.prenom}`}
              </div>
            </div>
            <div className="lign">Remarque Contourage:</div>
          </div>
          <div className="inputrqPrescription">
            <div className="inputrqPrescription2" type="textarea">
              {traitement &&
              traitement.Contourage &&
              traitement.Contourage.remarque
                ? traitement.Contourage.remarque
                : "Pas de remarque pour contourage"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render the Dosimetrie addition form if not found
  return (
    <div className="boxDosimetrie">
      <div className="groupDosimetrie">
        <div className="Dosimetrie-wrapper">
          <div className="Dosimetrie">Dosimetrie</div>
        </div>
        <button className="exit-button" onClick={annuler}>
          <span className="line"></span>
          <span className="line"></span>
        </button>
        <div className="medecin2">
          <div
            className="avatar avatar-sm"
            style={{ marginTop: "80px", marginLeft: "10px" }}
          >
            <img alt="" src={loggedInUserImage} className="rounded-circle" />
          </div>
          <div className="med">
            {loggedInUserNom} {loggedInUserPrenom}
          </div>
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
        <div className="dateDosimetrie">Date Dosimetrie : </div>
        <div className="inputdateDosimetrie">
          <input
            className="inputdateDosimetrie2"
            type="date"
            value={newDosimetrieDate}
            onChange={(e) => setNewDosimetrieDate(e.target.value)}
          ></input>
        </div>
        <div className="rqDosimetrie">Remarque :</div>
        <div className="inputrqDosimetrie">
          <textarea
            className="inputrqDosimetrie2"
            type="textarea"
            placeholder="Ajoutez une remarque pour Dosimetrie"
            value={newDosimetrieRemarque}
            onChange={(e) => setNewDosimetrieRemarque(e.target.value)}
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
        <div className="rqImportation">
          <div className="avatar avatar-sm" id="avatar">
            <img
              alt=""
              src={
                traitement &&
                traitement.Importation &&
                traitement.Importation.User &&
                `${traitement.Importation.User.image}`
              }
              className="rounded-circle"
            />
            <div className="overlay">
              {traitement &&
                traitement.Importation &&
                traitement.Importation.User &&
                `${traitement.Importation.User.nom}`}{" "}
              {traitement &&
                traitement.Importation &&
                traitement.Importation.User &&
                `${traitement.Importation.User.prenom}`}
            </div>
          </div>
          <div className="lign">Remarque Importation:</div>
        </div>
        <div className="inputrqPrescription">
          <div className="inputrqPrescription2" type="textarea">
            {traitement &&
            traitement.Importation &&
            traitement.Importation.remarque
              ? traitement.Importation.remarque
              : "Pas de remarque pour importation"}
          </div>
        </div>
        <div className="rqContourage">
          <div className="avatar avatar-sm" id="avatar">
            <img
              alt=""
              src={
                traitement &&
                traitement.Contourage &&
                traitement.Contourage.User &&
                `${traitement.Contourage.User.image}`
              }
              className="rounded-circle"
            />
            <div className="overlay">
              {traitement &&
                traitement.Contourage &&
                traitement.Contourage.User &&
                `${traitement.Contourage.User.nom}`}{" "}
              {traitement &&
                traitement.Contourage &&
                traitement.Contourage.User &&
                `${traitement.Contourage.User.prenom}`}
            </div>
          </div>
          <div className="lign">Remarque Contourage:</div>
        </div>
        <div className="inputrqPrescription">
          <div className="inputrqPrescription2" type="textarea">
            {traitement &&
            traitement.Contourage &&
            traitement.Contourage.remarque
              ? traitement.Contourage.remarque
              : "Pas de remarque pour contourage"}
          </div>
        </div>
        <div className="divDosimetrie">
          <button className="champ-textDosimetrie">
            <label
              className="text-wrapperDosimetrie"
              onClick={handleAddDosimetrie}
            >
              Valider
            </label>
          </button>
          <button className="div-wrapperDosimetrie" onClick={annuler}>
            <label className="text-wrapperDosimetrie">Annuler</label>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DOSIMETRIE;
