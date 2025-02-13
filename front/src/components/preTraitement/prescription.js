import "../../style/prescription.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

function PRESCRIPTION({ closeModal, prescriptionId, traitementId, patientId }) {
  const today = new Date().toISOString().substr(0, 10);
  const [prescription, setPrescription] = useState(null);
  const [traitement, setTraitement] = useState(null);
  const [patient, setPatient] = useState(null);
  const [centresTraitement, setCentresTraitement] = useState([]);
  const [selectedCentre, setSelectedCentre] = useState("");
  const [selectedCentreTraitementId, setSelectedCentreTraitementId] =
    useState(null);
  const [isPrescriptionNotFound, setIsPrescriptionNotFound] = useState(false);
  const [newPrescriptionDate, setNewPrescriptionDate] = useState(today);
  const [newPrescriptionDoseTotale, setNewPrescriptionDoseTotale] =
    useState("");
  const [newPrescriptionDoseSeance, setNewPrescriptionDoseSeance] =
    useState("");
  const [newTraitementNbSeance, setNewTraitementNbSeance] = useState("");
  const [newPrescriptionRemarque, setNewPrescriptionRemarque] = useState("");
  const [newPrescriptionVolume, setNewPrescriptionVolume] = useState("");
  const [newPrescriptionTechnique, setNewPrescriptionTechnique] =
    useState("3D");
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
    const fetchCentres = async () => {
      try {
        const response = await axios.get(
          "centreTraitements/getAll"
        );
        setCentresTraitement(response.data);
      } catch (error) {
        console.error("Error fetching centreTraitements:", error);
      }
    };

    fetchCentres();
  }, []);
  const handleSelectedCentreChange = (event) => {
    setSelectedCentre(event.target.value);
    // Trouver l'objet de centre de traitement correspondant en fonction du nom de centre sélectionné
    const selectedCentreObject = centresTraitement.find(
      (centre) => centre.nom === event.target.value
    );
    if (selectedCentreObject) {
      setSelectedCentreTraitementId(selectedCentreObject.id);
    } else {
      setSelectedCentreTraitementId(null);
    }
  };

  useEffect(() => {
    const fetchDetailsPatient = async () => {
      try {
        const response = await axios.get(
          `patients/${patientId}`
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
          `traitements/one/${traitementId}`
        );
        setTraitement(response.data);
      } catch (error) {
        console.error("Error fetching traitement details:", error);
      }
    };
    fetchDetailsTraitement();
  }, [traitementId]);

  // Utiliser useEffect pour effectuer la requête GET une fois que le composant est monté
  useEffect(() => {
    const fetchPrescriptionDetails = async () => {
      try {
        const token = localStorage.getItem("token"); // Récupérer le token JWT depuis le stockage local

        const response = await axios.get(
          `prescriptions/${prescriptionId}/${traitementId}`,
          {
            headers: {
              Authorization: ` ${token}`, // Ajouter le token JWT à l'en-tête 'Authorization'
            },
          }
        );

        // Mettre à jour l'état de la prescription avec les données récupérées
        setPrescription(response.data);
        setIsPrescriptionNotFound(false); // Indiquer que la prescription a été trouvée
      } catch (error) {
        console.error("Error fetching prescription details:", error);
        setIsPrescriptionNotFound(true); // Indiquer que la prescription n'a pas été trouvée
      }
    };

    // Appeler la fonction pour effectuer la requête GET
    fetchPrescriptionDetails();
  }, [prescriptionId, traitementId]); // Déclencher l'effet lorsque les IDs de la prescription et du traitement changent

  const handleAddPrescription = async () => {
    console.log("props ", traitementId, patientId);
    try {
      if (!traitementId || !patientId || !selectedCentreTraitementId) {
        console.error(
          "TraitementId, patientId, or selectedCentreTraitementId is not defined"
        );
        return;
      }
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `prescriptions/addprescriptionAndUpdateTraitement/${traitementId}/${patientId}/${selectedCentreTraitementId}`,
        {
          date: newPrescriptionDate,
          etat: true,
          remarque: newPrescriptionRemarque,
          doseTotale: newPrescriptionDoseTotale,
          doseSeance: newPrescriptionDoseSeance,
          volume: newPrescriptionVolume,
          technique: newPrescriptionTechnique,
          nombreSeances: newTraitementNbSeance,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      setPrescription(response.data);
      setIsPrescriptionNotFound(false);

      // Reset form fields
      setNewPrescriptionDate("");
      setNewPrescriptionRemarque("");
      setNewPrescriptionDoseTotale("");
      setNewPrescriptionDoseSeance("");
      setNewTraitementNbSeance("");
      setNewPrescriptionVolume("");
      setNewPrescriptionTechnique("");

      // Reload the page (this may not be necessary depending on your app's logic)
      window.location.reload();
    } catch (error) {
      console.error("Error adding prescription:", error);
    }
  };
  useEffect(() => {
    if (newPrescriptionDoseTotale && newTraitementNbSeance) {
      const doseParSeance =
        parseFloat(newPrescriptionDoseTotale) / parseInt(newTraitementNbSeance);
      setNewPrescriptionDoseSeance(doseParSeance.toFixed(2));
    }
  }, [newPrescriptionDoseTotale, newTraitementNbSeance]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    const formattedDate = date.toLocaleDateString("fr-FR", options);
    return formattedDate.replace(",", " à");
  };

  if (prescription && !isPrescriptionNotFound) {
    return (
      <div className="boxPrescription">
        <div className="groupPrescription">
          <div className="overlapPrescription">
            <div className="nouveau-Prescription-wrapperPrescription">
              <div className="nouveau-Prescription">Prescription</div>
            </div>
            <div className="close">
              <button className="exit-button" onClick={annuler}>
                <span className="line"></span>
                <span className="line"></span>
              </button>
            </div>
            <div className="separation"></div>
            <div className="medecin">
              <div
                className="avatar avatar-sm"
                style={{ marginTop: "60px", marginLeft: "40px" }}
              >
                <img
                  alt=""
                  src={
                    prescription &&
                    prescription.User &&
                    `${prescription.User.image}`
                  }
                  className="rounded-circle"
                />
              </div>
              <div className="med">
                {" "}
                {prescription &&
                  prescription.User &&
                  `${prescription.User.nom} ${prescription.User.prenom}`}
              </div>
            </div>
            <div className="realise">Réalisée par :</div>

            <div className="patient">Patient(e) :</div>
            <div className="patientNom">
              {prescription &&
                prescription.Patient &&
                `${prescription.Patient.nom} ${prescription.Patient.prenom}`}
            </div>
            <div className="localisation">
              <div className="loc">Localisation :</div>
              <input
                type="text"
                className="locinput"
                value={
                  prescription &&
                  prescription.Traitement &&
                  prescription.Traitement.localisation
                }
                readOnly
              />
            </div>
            <div className="datePrescription">Date prescription</div>
            <input
              type="text"
              className="inputdatePrescription"
              value={formatDate(prescription.date)}
              readOnly
            />
            <div className="dosePrescription">Dose totale (Gy)</div>
            <input
              type="text"
              className="inputdosePrescription"
              value={prescription.doseTotale}
              readOnly
            ></input>
            <div className="fractionementPrescription">Nombre de séanes</div>
            <input
              type="text"
              className="inputfractionementPrescription"
              value={prescription.Traitement.nombreSeances}
              readOnly
            />
            <div className="etalementPrescription">Dose par séance (Gy)</div>
            <input
              type="text"
              className="inputetalementPrescription"
              value={prescription.doseSeance}
              readOnly
            ></input>

            <div className="techniquePrescription">Technique</div>
            <input
              className="inputtechniquePrescription"
              value={prescription.technique}
              readOnly
            ></input>
            <div className="volumePrescription">Volume cible</div>
            <input
              type="text"
              className="inputvolumePrescription"
              value={prescription.volume}
              readOnly
            ></input>

            <div className="remarquePrescription">Remarque</div>
            <textarea
              className="inputremarquePrescription"
              value={prescription.remarque}
              readOnly
            ></textarea>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="boxPrescription">
      <div className="groupPrescription">
        <div className="overlapPrescription">
          <div className="nouveau-Prescription-wrapperPrescription">
            <div className="nouveau-Prescription">Prescription</div>
          </div>
          <div className="close">
            <button className="exit-button" onClick={annuler}>
              <span className="line"></span>
              <span className="line"></span>
            </button>
          </div>
          <div className="separation"></div>
          <div className="medecin2">
            <div
              className="avatar avatar-sm"
              style={{ marginTop: "60px", marginLeft: "40px" }}
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
            {patient && `${patient.nom} ${patient.prenom}`}
          </div>
          <div className="localisation">
            <div className="loc">Localisation :</div>
            <input
              type="text"
              className="locinput"
              value={traitement && traitement.localisation}
              readOnly
            />
          </div>
          <div>
            <label className="CentrePrescription" htmlFor="centreDropdown">
              Centre de traitement
            </label>
            <select
              className="inputcentreTraitement"
              id="centreDropdown"
              value={selectedCentre}
              onChange={handleSelectedCentreChange}
            >
              <option value="">Sélectionnez un centre</option>
              {centresTraitement.map((centre) => (
                <option key={centre.id} value={centre.nom}>
                  {centre.nom}
                </option>
              ))}
            </select>
          </div>
          <div className="datePrescription">Date prescription</div>
          <input
            type="date"
            className="inputdatePrescription"
            value={newPrescriptionDate}
            onChange={(e) => setNewPrescriptionDate(e.target.value)}
          />

          <div className="dosePrescription">Dose totale (Gy)</div>
          <input
            type="text"
            className="inputdosePrescription"
            placeholder="entrer Dose Total en Gy"
            value={newPrescriptionDoseTotale}
            onChange={(e) => setNewPrescriptionDoseTotale(e.target.value)}
          />
          <div className="fractionementPrescription">Nombre de séances</div>
          <input
            type="text"
            className="inputfractionementPrescription"
            placeholder="entrer nombre de séance "
            value={newTraitementNbSeance}
            onChange={(e) => setNewTraitementNbSeance(e.target.value)}
          />
          <div className="etalementPrescription">Dose par séance (Gy)</div>
          <input
            type="text"
            className="inputetalementPrescription"
            placeholder="entrer Dose par Séance en Gy"
            value={newPrescriptionDoseSeance}
            onChange={(e) => setNewPrescriptionDoseSeance(e.target.value)}
          />

          <div className="techniquePrescription">Technique</div>
          <div>
            <select
              style={{
                marginLeft: "750px",
                marginTop: "-38px",
                borderColor: "#0069d900",
                backgroundColor: "#dcebfd",
                borderRadius: "12px",
                height: "40px",
                position: "absolute",
                width: "300px",
              }}
              value={newPrescriptionTechnique}
              onChange={(e) => setNewPrescriptionTechnique(e.target.value)}
            >
              <option value="3D">3D</option>
              <option value="IMRT">IMRT</option>
              <option value="VMAT">VMAT</option>
              <option value="Stéréotaxie">Stéréotaxie</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div className="volumePrescription">Volume cible</div>
          <input
            type="text"
            className="inputvolumePrescription"
            placeholder="entrer le volume cible"
            value={newPrescriptionVolume}
            onChange={(e) => setNewPrescriptionVolume(e.target.value)}
          />

          <div className="remarquePrescription">Remarque</div>
          <textarea
            className="inputremarquePrescription"
            placeholder="entrer votre remarque pour prescription"
            value={newPrescriptionRemarque}
            onChange={(e) => setNewPrescriptionRemarque(e.target.value)}
          />
          <div className="divPrescription">
            <button
              className="champ-textPrescription"
              onClick={handleAddPrescription}
            >
              <label className="text-wrapperPrescription">Valider</label>
            </button>
            <button className="div-wrapperPrescription" onClick={annuler}>
              <label className="text-wrapperPrescription">Annuler</label>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PRESCRIPTION;
