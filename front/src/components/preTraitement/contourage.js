// CONTOURAGE.js
import "../../style/contourage.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

function CONTOURAGE({ closeModal2, contourageId, traitementId }) {
  const today = new Date().toISOString().substr(0, 10);
  const [contourage, setContourage] = useState(null);
  const [traitement, setTraitement] = useState(null);
  const [isContourageNotFound, setIsContourageNotFound] = useState(false);
  const [newContourageDate, setNewContourageDate] = useState(today);
  const [newContourageEtat, setNewContourageEtat] = useState("");
  const [newContourageRemarque, setNewContourageRemarque] = useState("");
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
    const fetchContourageDetails = async () => {
      try {
        const response = await axios.get(
          `contourages/${contourageId}`,
          {
            params: { include: "User" }, // Ajoutez ceci pour inclure les données de l'utilisateur
          }
        );
        console.log("Contourage data:", response.data);
        setContourage(response.data);
        setContourage({
          ...response.data,
          patient: response.data.Traitement.Patient,
        });
      } catch (error) {
        console.error("Error fetching contourage details:", error);
      }
    };

    fetchContourageDetails();
  }, [contourageId, traitementId]);

  const handleAddContourage = async () => {
    console.log("props ", traitementId);
    try {
      if (!traitementId) {
        console.error("TraitementId is not defined");

        return;
      }
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `contourages/add/${traitementId}`,
        {
          date: newContourageDate,
          etat: true,
          remarque: newContourageRemarque,
        },
        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );

      setContourage(response.data);
      setIsContourageNotFound(false);

      setNewContourageDate("");
      setNewContourageEtat("");
      setNewContourageRemarque("");
      window.location.reload();
    } catch (error) {
      console.error("Error adding contourage:", error);
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

  // Render the contourage details if available
  if (contourage && !isContourageNotFound) {
    return (
      <div className="boxContourage">
        <div className="groupContourage">
          <div className="Contourage-wrapper">
            <div className="Contourage">Contourage</div>
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
                src={contourage && contourage.User && contourage.User.image}
                className="rounded-circle"
              />
            </div>
            <div className="med">
              {contourage &&
                contourage.User &&
                `${contourage.User.nom} ${contourage.User.prenom}`}
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
          <div className="dateContourage">Date contourage</div>
          <div className="inputdateContourage">
            <input
              className="inputdateContourage2"
              type="text"
              value={formatDate(contourage.date)}
              readOnly
            />
          </div>
          <div className="rqContourage">Remarque contourage</div>
          <div className="inputrqContourage">
            <textarea
              className="inputrqContourage2"
              type="textarea"
              value={contourage.remarque}
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
        </div>
      </div>
    );
  }

  return (
    <div className="boxContourage">
      <div className="groupContourage">
        <div className="Contourage-wrapper">
          <div className="Contourage">Contourage</div>
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
        <div className="dateContourage">Date contourage</div>
        <div className="inputdateContourage">
          <input
            className="inputdateContourage2"
            type="date"
            value={newContourageDate}
            onChange={(e) => setNewContourageDate(e.target.value)}
          />
        </div>
        <div className="rqContourage">Remarque contourage</div>
        <div className="inputrqContourage">
          <textarea
            className="inputrqContourage2"
            type="textarea"
            placeholder="Ajoutez une remarque pour Contourage"
            value={newContourageRemarque}
            onChange={(e) => setNewContourageRemarque(e.target.value)}
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
        <div className="divContourage">
          <button className="champ-textContourage">
            <label
              className="text-wrapperContourage"
              onClick={handleAddContourage}
            >
              Valider
            </label>
          </button>
          <button className="div-wrapperContourage" onClick={annuler}>
            <label className="text-wrapperContourage">Annuler</label>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CONTOURAGE;
