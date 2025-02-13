import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../style/qualite.css";

function QUALITE({ closeModal, qualiteId, traitementId }) {
  const today = new Date().toISOString().substr(0, 10);
  const [qualite, setQualite] = useState(null);
  const [traitement, setTraitement] = useState(null);
  const [isQualiteNotFound, setIsQualiteNotFound] = useState(false);
  const [newQualiteDate, setNewQualiteDate] = useState(today);
  const [newQualiteEtat, setNewQualiteEtat] = useState("");
  const [newQualiteRemarque, setNewQualiteRemarque] = useState("");
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
    const fetchQualiteDetails = async () => {
      try {
        const response = await axios.get(
          `qualites/${qualiteId}`,
          {
            params: { include: "User" }, // Ajoutez ceci pour inclure les données de l'utilisateur
          }
        );
        console.log("Qualite data:", response.data);
        setQualite(response.data);
        setQualite({
          ...response.data,
          patient: response.data.Traitement.Patient,
        });
      } catch (error) {
        console.error("Error fetching qualite details:", error);
        if (error.response && error.response.status === 404) {
          setIsQualiteNotFound(true);
        }
      }
    };
    fetchQualiteDetails();
  }, [qualiteId, traitementId]);

  const handleAddQualite = async () => {
    try {
      if (!traitementId) {
        console.error("TraitementId is not defined");
        return;
      }
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `qualites/add/${traitementId}`,
        {
          date: newQualiteDate,
          etat: true,
          remarque: newQualiteRemarque,
        },
        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );

      setQualite(response.data);
      setIsQualiteNotFound(false);
      setNewQualiteDate(today);
      setNewQualiteEtat("");
      setNewQualiteRemarque("");
      window.location.reload();
    } catch (error) {
      console.error("Error adding qualite:", error);
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

  if (qualite && !isQualiteNotFound) {
    return (
      <div className="boxQualite">
        <div className="groupQualite">
          <div className="Qualite-wrapper">
            <div className="Qualite">Contrôle qualité</div>
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
                src={qualite && qualite.User && qualite.User.image}
                className="rounded-circle"
              />
            </div>
            <div className="med">
              {qualite &&
                qualite.User &&
                `${qualite.User.nom} ${qualite.User.prenom}`}
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
          <div className="dateQualite">Date Qualite</div>
          <div className="inputdateQualite">
            <input
              className="inputdateQualite2"
              type="text"
              value={formatDate(qualite.date)}
              readOnly
            />
          </div>
          <div className="rqQualite">Remarque Qualite</div>
          <div className="inputrqQualite">
            <textarea
              className="inputrqQualite2"
              type="textarea"
              value={qualite.remarque}
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
          <div className="rqDosimetrie">
            <div className="avatar avatar-sm" id="avatar">
              <img
                alt=""
                src={
                  traitement &&
                  traitement.Validation &&
                  traitement.Validation.User &&
                  `${traitement.Validation.User.image}`
                }
                className="rounded-circle"
              />
              <div className="overlay">
                {traitement &&
                  traitement.Validation &&
                  traitement.Validation.User &&
                  `${traitement.Validation.User.nom}`}{" "}
                {traitement &&
                  traitement.Validation &&
                  traitement.Validation.User &&
                  `${traitement.Validation.User.prenom}`}
              </div>
            </div>
            <div className="lign">Remarque Validation:</div>
          </div>
          <div className="inputrqPrescription">
            <div className="inputrqPrescription2" type="textarea">
              {traitement &&
              traitement.Validation &&
              traitement.Validation.remarque
                ? traitement.Validation.remarque
                : "Pas de remarque pour validation"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="boxQualite">
      <div className="groupQualite">
        <div className="Qualite-wrapper">
          <div className="Qualite">Contrôle qualité</div>
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
        <div className="dateQualite">Date Qualite : </div>
        <div className="inputdateQualite">
          <input
            className="inputdateQualite2"
            type="date"
            value={newQualiteDate}
            onChange={(e) => setNewQualiteDate(e.target.value)}
          ></input>
        </div>
        <div className="rqQualite">Remarque Qualite :</div>
        <div className="inputrqQualite">
          <textarea
            className="inputrqQualite2"
            type="textarea"
            placeholder="Ajoutez une remarque pour Qualite"
            value={newQualiteRemarque}
            onChange={(e) => setNewQualiteRemarque(e.target.value)}
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
        <div className="rqDosimetrie">
          <div className="avatar avatar-sm" id="avatar">
            <img
              alt=""
              src={
                traitement &&
                traitement.Validation &&
                traitement.Validation.User &&
                `${traitement.Validation.User.image}`
              }
              className="rounded-circle"
            />
            <div className="overlay">
              {traitement &&
                traitement.Validation &&
                traitement.Validation.User &&
                `${traitement.Validation.User.nom}`}{" "}
              {traitement &&
                traitement.Validation &&
                traitement.Validation.User &&
                `${traitement.Validation.User.prenom}`}
            </div>
          </div>
          <div className="lign">Remarque validation:</div>
        </div>
        <div className="inputrqPrescription">
          <div className="inputrqPrescription2" type="textarea">
            {traitement &&
            traitement.Validation &&
            traitement.Validation.remarque
              ? traitement.Validation.remarque
              : "Pas de remarque pour validation"}
          </div>
        </div>

        <div className="divQualite">
          <button className="champ-textQualite">
            <label className="text-wrapperQualite" onClick={handleAddQualite}>
              Valider
            </label>
          </button>
          <button className="div-wrapperQualite" onClick={annuler}>
            <label className="text-wrapperQualite">Annuler</label>
          </button>
        </div>
      </div>
    </div>
  );
}

export default QUALITE;
