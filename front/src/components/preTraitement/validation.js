import "../../style/validation.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

function VALIDATION({ closeModal, validationId, traitementId }) {
  const today = new Date().toISOString().substr(0, 10);
  const [validation, setValidation] = useState(null);
  const [traitement, setTraitement] = useState(null);

  const [isValidationNotFound, setIsValidationNotFound] = useState(false);
  const [newValidationDate, setNewValidationDate] = useState(today);
  const [newValidationEtat, setNewValidationEtat] = useState("");
  const [newValidationRemarque, setNewValidationRemarque] = useState("");
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

  const annuler = async () => {
    window.location.reload();
  };
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
    const fetchValidationDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4001/validations/${validationId}`,
          {
            params: { include: "User" }, // Ajoutez ceci pour inclure les données de l'utilisateur
          }
        );
        console.log("Validation data:", response.data);
        setValidation(response.data);
        setValidation({
          ...response.data,
          patient: response.data.Traitement.Patient,
        });
      } catch (error) {
        console.error("Error fetching Validation details:", error);
      }
    };

    fetchValidationDetails();
  }, [validationId, traitementId]);

  const handleAddValidation = async () => {
    try {
      if (!traitementId) {
        console.error("TraitementId is not defined");
        return;
      }
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `http://localhost:4001/validations/add/${traitementId}`,
        {
          date: newValidationDate,
          etat: true,
          remarque: newValidationRemarque,
        },
        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );

      setValidation(response.data);
      setIsValidationNotFound(false);

      setNewValidationDate(today);
      setNewValidationEtat("");
      setNewValidationRemarque("");
      window.location.reload();
    } catch (error) {
      console.error("Error adding Validation:", error);
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

  if (validation && !isValidationNotFound) {
    return (
      <div className="boxValidation">
        <div className="groupValidation">
          <div className="Validation-wrapper">
            <div className="Validation">Validation</div>
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
                src={validation && validation.User && validation.User.image}
                className="rounded-circle"
              />
            </div>
            <div className="med">
              {validation &&
                validation.User &&
                `${validation.User.nom} ${validation.User.prenom}`}
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
          <div className="dateValidation">Date validation</div>
          <div className="inputdateValidation">
            <input
              className="inputdateValidation2"
              type="text"
              value={formatDate(validation.date)}
              readOnly
            />
          </div>
          <div className="rqValidation">Remarque validation</div>
          <div className="inputrqValidation">
            <textarea
              className="inputrqValidation2"
              type="textarea"
              value={validation.remarque}
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
          <div className="rqDosimetrie">
            <div className="avatar avatar-sm" id="avatar">
              <img
                alt=""
                src={
                  traitement &&
                  traitement.Dosimetrie &&
                  traitement.Dosimetrie.User &&
                  `${traitement.Dosimetrie.User.image}`
                }
                className="rounded-circle"
              />
              <div className="overlay">
                {traitement &&
                  traitement.Dosimetrie &&
                  traitement.Dosimetrie.User &&
                  `${traitement.Dosimetrie.User.nom}`}{" "}
                {traitement &&
                  traitement.Dosimetrie &&
                  traitement.Dosimetrie.User &&
                  `${traitement.Dosimetrie.User.prenom}`}
              </div>
            </div>
            <div className="lign">Remarque Dosimetrie:</div>
          </div>
          <div className="inputrqPrescription">
            <div className="inputrqPrescription2" type="textarea">
              {traitement &&
              traitement.Dosimetrie &&
              traitement.Dosimetrie.remarque
                ? traitement.Dosimetrie.remarque
                : "Pas de remarque pour dosimetrie"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="boxValidation">
      <div className="groupValidation">
        <div className="Validation-wrapper">
          <div className="Validation">Validation</div>
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
        <div className="dateValidation">Date Validation : </div>
        <div className="inputdateValidation">
          <input
            className="inputdateValidation2"
            type="date"
            value={newValidationDate}
            onChange={(e) => setNewValidationDate(e.target.value)}
          ></input>
        </div>
        <div className="rqValidation">Remarque Validation :</div>
        <div className="inputrqValidation">
          <textarea
            className="inputrqValidation2"
            type="textarea"
            placeholder="Ajoutez une remarque pour Validation"
            value={newValidationRemarque}
            onChange={(e) => setNewValidationRemarque(e.target.value)}
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
        <div className="rqDosimetrie">
          <div className="avatar avatar-sm" id="avatar">
            <img
              alt=""
              src={
                traitement &&
                traitement.Dosimetrie &&
                traitement.Dosimetrie.User &&
                `${traitement.Dosimetrie.User.image}`
              }
              className="rounded-circle"
            />
            <div className="overlay">
              {traitement &&
                traitement.Dosimetrie &&
                traitement.Dosimetrie.User &&
                `${traitement.Dosimetrie.User.nom}`}{" "}
              {traitement &&
                traitement.Dosimetrie &&
                traitement.Dosimetrie.User &&
                `${traitement.Dosimetrie.User.prenom}`}
            </div>
          </div>
          <div className="lign">Remarque Dosimetrie:</div>
        </div>
        <div className="inputrqPrescription">
          <div className="inputrqPrescription2" type="textarea">
            {traitement &&
            traitement.Dosimetrie &&
            traitement.Dosimetrie.remarque
              ? traitement.Dosimetrie.remarque
              : "Pas de remarque pour dosimetrie"}
          </div>
        </div>

        <div className="divValidation">
          <button className="champ-textValidation">
            <label
              className="text-wrapperValidation"
              onClick={handleAddValidation}
            >
              Valider
            </label>
          </button>
          <button className="div-wrapperValidation" onClick={annuler}>
            <label className="text-wrapperValidation">Annuler</label>
          </button>
        </div>
      </div>
    </div>
  );
}

export default VALIDATION;
