import "../../style/detailsTraitement.css";
import React, { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";

function DetailsTraitement({ traitementId }) {
  const [traitement, setTraitement] = useState(null);
  const [dateDebut, setDateDebut] = useState("");
  const [etalement, setEtalement] = useState("quotidien"); // Valeur par défaut
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

  const annuler = () => {
    window.location.reload();
  };

  const fetchTraitementDetails = async () => {
    try {
      const response = await axios.get(
        `traitements/one/${traitementId}`
      );
      setTraitement(response.data);
    } catch (error) {
      console.error("Error fetching traitement details:", error);
    }
  };

  useEffect(() => {
    fetchTraitementDetails();
  }, [traitementId]);
  const handleUpdateTraitement = async () => {
    try {
      const token = localStorage.getItem("token"); // Récupérer le token JWT du stockage local
      const response = await axios.put(
        `traitements/update/${traitementId}`,
        {
          dateDebut: dateDebut,
          etalement: etalement,
        },
        {
          headers: {
            Authorization: ` ${token}`, // Attacher le token à l'en-tête Authorization
          },
        }
      );
      // Mise à jour réussie, actualiser la page ou faire d'autres actions nécessaires
      console.log("Traitement updated:", response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error updating traitement:", error);
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
  if (traitement && traitement.dateDebut === null) {
    return (
      <div className="boxDetailsTraitement">
        <div className="groupDetailsTraitement">
          <div className="overDetailsTraitement">
            <div className="nouveau-DetailsPrise-wrapperDetailsPrise">
              <div className="nouveau-DetailsPrise">
                {" "}
                Details prise en charge
              </div>
            </div>
            <div className="nouveau-DetailsTraitement-wrapperDetailsTraitement">
              <div className="nouveau-DetailsTraitement">
                {" "}
                Details du traitement de radiothérapie
              </div>
            </div>
            <button
              style={{ marginLeft: 720 }}
              className="exit-button"
              onClick={annuler}
            >
              <span className="line"></span>
              <span className="line"></span>
            </button>

            <div className="patient">Patient(e) :</div>
            <div className="patientNom">
              {traitement &&
                traitement.Patient &&
                `${traitement.Patient.nom} ${traitement.Patient.prenom}`}
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
              <div className="inputrqPrescription2">
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
              <div className="lign">Remarque Importation du scanner:</div>
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
              <div className="lign">Remarque Dosimétrie:</div>
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
            <div className="rqQualite">
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
            <div className="rqQualite">
              <div className="avatar avatar-sm" id="avatar">
                <img
                  alt=""
                  src={
                    traitement &&
                    traitement.Qualite &&
                    traitement.Qualite.User &&
                    `${traitement.Qualite.User.image}`
                  }
                  className="rounded-circle"
                />
                <div className="overlay">
                  {traitement &&
                    traitement.Qualite &&
                    traitement.Qualite.User &&
                    `${traitement.Qualite.User.nom}`}{" "}
                  {traitement &&
                    traitement.Qualite &&
                    traitement.Qualite.User &&
                    `${traitement.Qualite.User.prenom}`}
                </div>
              </div>
              <div className="lign">Remarque contrôle qualite:</div>
            </div>
            <div className="inputrqPrescription">
              <div className="inputrqPrescription2" type="textarea">
                {traitement && traitement.Qualite && traitement.Qualite.remarque
                  ? traitement.Qualite.remarque
                  : "Pas de remarque pour qualite"}
              </div>
            </div>
            <div style={{ marginTop: -640, marginLeft: 500 }}>
              <div className="detailTraitement">Localisation</div>
              <div className="inputdetailTraitement">
                {traitement && traitement.localisation}
              </div>
              <div className="detailTraitement">Indication</div>
              <div className="inputdetailTraitement">
                {traitement && traitement.indication}
              </div>
              <div className="detailTraitement">
                Chimiothérapie concomitante
              </div>
              <div className="inputdetailTraitement">
                {traitement && traitement.chimio ? "Oui" : "Non"}
              </div>

              <div className="detailTraitement">Volume cible</div>
              <div className="inputdetailTraitement">
                {traitement &&
                  traitement.Prescription &&
                  traitement.Prescription.volume}
              </div>
              <div className="detailTraitement">Technique</div>
              <div className="inputdetailTraitement">
                {traitement &&
                  traitement.Prescription &&
                  traitement.Prescription.technique}
              </div>
              <div className="detailTraitement">Dose totale</div>
              <div className="inputdetailTraitement">
                {traitement &&
                  traitement.Prescription &&
                  traitement.Prescription.doseTotale}
                Gy
              </div>
              <div className="detailTraitement">Dose/séance</div>
              <div className="inputdetailTraitement">
                {traitement &&
                  traitement.Prescription &&
                  traitement.Prescription.doseSeance}
                Gy
              </div>
            </div>
            <div style={{ marginTop: -570, marginLeft: 900 }}>
              <div className="detailTraitement">Nombre de séance</div>
              <div className="inputdetailTraitement">
                {traitement && traitement.nombreSeances}
              </div>
              <div className="medecin2">
                <div
                  className="avatar avatar-sm"
                  style={{ marginTop: "60px", marginLeft: "40px" }}
                >
                  <img
                    alt=""
                    src={loggedInUserImage}
                    className="rounded-circle"
                  />
                </div>
                <div className="med">
                  {loggedInUserNom} {loggedInUserPrenom}
                </div>
              </div>
              <div className="detailTraitement">
                Date de début du traitement
              </div>
              <input
                type="date"
                className="inputdetailTraitement"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
              />
              <div className="detailTraitement">Etalement</div>
              <select
                className="inputdetailetalementTraitement"
                value={etalement}
                onChange={(e) => setEtalement(e.target.value)}
              >
                <option value="quotidien">Quotidien</option>
              </select>
            </div>

            <div className="divDetailsTraitement">
              <button
                className="champ-textDetailsTraitement"
                onClick={handleUpdateTraitement}
              >
                <label className="text-wrapperDetailsTraitement">Valider</label>
              </button>
              <button
                className="div-wrapperDetailsTraitement"
                onClick={annuler}
              >
                <label className="text-wrapperDetailsTraitement">Annuler</label>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="boxDetailsTraitement">
      <div className="groupDetailsTraitement">
        <div className="overDetailsTraitement">
          <div className="nouveau-DetailsPrise-wrapperDetailsPrise">
            <div className="nouveau-DetailsPrise"> Details prise en charge</div>
          </div>
          <div className="nouveau-DetailsTraitement-wrapperDetailsTraitement">
            <div className="nouveau-DetailsTraitement">
              {" "}
              Details du traitement de radiothérapie
            </div>
          </div>
          <button
            style={{ marginLeft: 720 }}
            className="exit-button"
            onClick={annuler}
          >
            <span className="line"></span>
            <span className="line"></span>
          </button>

          <div className="patient">Patient(e) :</div>
          <div className="patientNom">
            {traitement &&
              traitement.Patient &&
              `${traitement.Patient.nom} ${traitement.Patient.prenom}`}
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
            <div className="inputrqPrescription2">
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
          <div className="rqQualite">
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
                : "Pas de remarque pour qualite"}
            </div>
          </div>
          <div className="rqQualite">
            <div className="avatar avatar-sm" id="avatar">
              <img
                alt=""
                src={
                  traitement &&
                  traitement.Qualite &&
                  traitement.Qualite.User &&
                  `${traitement.Qualite.User.image}`
                }
                className="rounded-circle"
              />
              <div className="overlay">
                {traitement &&
                  traitement.Qualite &&
                  traitement.Qualite.User &&
                  `${traitement.Qualite.User.nom}`}{" "}
                {traitement &&
                  traitement.Qualite &&
                  traitement.Qualite.User &&
                  `${traitement.Qualite.User.prenom}`}
              </div>
            </div>
            <div className="lign">Remarque Qualite:</div>
          </div>
          <div className="inputrqPrescription">
            <div className="inputrqPrescription2" type="textarea">
              {traitement && traitement.Qualite && traitement.Qualite.remarque
                ? traitement.Qualite.remarque
                : "Pas de remarque pour qualite"}
            </div>
          </div>
          <div style={{ marginTop: -680, marginLeft: 500 }}>
            <div className="detailTraitement">Localisation</div>
            <div className="inputdetailTraitement">
              {traitement && traitement.localisation}
            </div>
            <div className="detailTraitement">Indication</div>
            <div className="inputdetailTraitement">
              {traitement && traitement.indication}
            </div>
            <div className="detailTraitement">Chimiothérapie concomitante</div>
            <div className="inputdetailTraitement">
              {traitement && traitement.chimio ? "Oui" : "Non"}
            </div>

            <div className="detailTraitement">Volume cible</div>
            <div className="inputdetailTraitement">
              {traitement &&
                traitement.Prescription &&
                traitement.Prescription.volume}
            </div>
            <div className="detailTraitement">Technique</div>
            <div className="inputdetailTraitement">
              {traitement &&
                traitement.Prescription &&
                traitement.Prescription.technique}
            </div>
            <div className="detailTraitement">Dose totale</div>
            <div className="inputdetailTraitement">
              {traitement &&
                traitement.Prescription &&
                traitement.Prescription.doseTotale}
              Gy
            </div>
            <div className="detailTraitement">Dose/séance</div>
            <div className="inputdetailTraitement">
              {traitement &&
                traitement.Prescription &&
                traitement.Prescription.doseSeance}
              Gy
            </div>
          </div>
          <div style={{ marginTop: -570, marginLeft: 900 }}>
            <div className="detailTraitement">Nombre de séances</div>
            <div className="inputdetailTraitement">
              {traitement && traitement.nombreSeances}
            </div>
            <div className="medecin2">
              <div
                className="avatar avatar-sm"
                style={{ marginTop: "60px", marginLeft: "40px" }}
              >
                <img
                  alt=""
                  src={loggedInUserImage}
                  className="rounded-circle"
                />
              </div>
              <div className="med">
                {loggedInUserNom} {loggedInUserPrenom}
              </div>
            </div>
            <div className="detailTraitement">Date de début du traitement</div>
            <div className="inputdetailTraitement">
              {traitement && traitement.dateDebut
                ? formatDate(traitement.dateDebut)
                : "Date de début non disponible"}
            </div>

            <div className="detailTraitement">Etalement</div>
            <div className="inputdetailTraitement">Quotidien</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsTraitement;
