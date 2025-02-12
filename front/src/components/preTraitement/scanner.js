// dosimetrie.js
import "../../style/scanner.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import corpsScan from "../../assets/images/corpsScan.png";
import cerebral from "../../assets/images/cerebral.png";
import cervicothoracique from "../../assets/images/cervicothoracique.png";
import pelvein from "../../assets/images/pelvein.png";
import thoracique from "../../assets/images/thoracique.png";
import thorcoabdominal from "../../assets/images/thoracoabdominal.png";
import abdominopelvein from "../../assets/images/abdominopelvein.png";

function Scanner({
  closeModal6,
  scannerId,
  machineId,
  traitementId,
  patientId,
  prescriptionId,
}) {
  const today = new Date().toISOString().substr(0, 10);
  const [scanner, setScanner] = useState(null);
  const [traitement, setTraitement] = useState(null);
  const [patient, setPatient] = useState(null);
  const [isScannerNotFound, setIsScannerNotFound] = useState(false);
  const [newScannerDate, setNewScannerDate] = useState(today);
  const [newScanneRemarque, setNewScanneRemarque] = useState("");
  const [newScannerType, setNewScannerType] = useState("D3");
  const [newScanneEpisseurCorps, setNewScanneEpisseurCorps] = useState("");
  const [newScannePositionBras, setNewScannePositionBras] = useState("");
  const [newScanneContentionSBRT, setNewScanneContentionSBRT] =
    useState("false");
  const [newScanneMarquage, setNewScanneMarquage] = useState("false");
  const [newScanneDocs, setNewScanneDocs] = useState("");
  const [newScannePositionMalade, setNewScannePositionMalade] =
    useState("dorsal");
  const [newScanneRemplissageVescale, setNewScanneRemplissageVescale] =
    useState("vide");
  const [newScanneNom, setNewScanneNom] = useState("");
  const [newScanneDetailcible, setNewScanneDetailcible] = useState("");
  const [newScannePlan, setNewScannePlan] = useState("incline");

  const [newScanneMasque, setNewScanneMasque] = useState("Pt3");
  const [newScanneCaleTete, setNewScanneCaleTete] = useState("false");
  const [newScanneBillotSousGenous, setNewScanneBillotSousGenous] =
    useState("false");
  const [newScanneCalePied, setNewScanneCalePied] = useState("false");
  const [newScanneCoussinSousVide, setNewScanneCoussinSousVide] =
    useState("false");
  const [newMachineNom, setNewMachineNom] = useState("");
  const [loggedInUserNom, setLoggedInUserNom] = useState("");
  const [loggedInUserPrenom, setLoggedInUserPrenom] = useState("");
  const [loggedInUserImage, setLoggedInUserImage] = useState("");
  const [prescription, setPrescription] = useState(null);
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
  const renderImage = () => {
    switch (newScanneNom) {
      case "cérébral":
        return (
          <img
            alt="Cérébral"
            src={cerebral}
            className=""
            style={{ marginLeft: -80, height: 400 }}
          />
        );
      case "thoracique":
        return (
          <img
            alt="Thoracique"
            src={thoracique}
            className=""
            style={{ marginLeft: -70, height: 400, width: 400 }}
          />
        );
      case "abdominopelvien":
        return (
          <img
            alt="Abdominopelvien"
            src={abdominopelvein}
            className=""
            style={{ marginLeft: -70, height: 400, width: 400 }}
          />
        );
      case "thoraco-abdominal":
        return (
          <img
            alt="Thoraco-Abdominal"
            src={thorcoabdominal}
            className=""
            style={{ marginLeft: -70, height: 400, width: 400 }}
          />
        );
      case "cervico-thoracique":
        return (
          <img
            alt="Cervico-Thoracique"
            src={cervicothoracique}
            className=""
            style={{ marginLeft: -70, height: 400, width: 400 }}
          />
        );
      case "pelvien":
        return (
          <img
            alt="Pelvien"
            src={pelvein}
            className=""
            style={{ marginLeft: -70, height: 400, width: 400 }}
          />
        );
      default:
        return <img alt="Corps Scan" src={corpsScan} className="" />;
    }
  };
  const renderImageExist = () => {
    switch (scanner.nom) {
      case "cérébral":
        return (
          <img
            alt="Cérébral"
            src={cerebral}
            className=""
            style={{ marginLeft: -80, height: 400 }}
          />
        );
      case "thoracique":
        return (
          <img
            alt="Thoracique"
            src={thoracique}
            className=""
            style={{ marginLeft: -70, height: 400, width: 400 }}
          />
        );
      case "abdominopelvien":
        return (
          <img
            alt="Abdominopelvien"
            src={abdominopelvein}
            className=""
            style={{ marginLeft: -70, height: 400, width: 400 }}
          />
        );
      case "thoraco-abdominal":
        return (
          <img
            alt="Thoraco-Abdominal"
            src={thorcoabdominal}
            className=""
            style={{ marginLeft: -70, height: 400, width: 400 }}
          />
        );
      case "cervico-thoracique":
        return (
          <img
            alt="Cervico-Thoracique"
            src={cervicothoracique}
            className=""
            style={{ marginLeft: -70, height: 400, width: 400 }}
          />
        );
      case "pelvien":
        return (
          <img
            alt="Pelvien"
            src={pelvein}
            className=""
            style={{ marginLeft: -70, height: 400, width: 400 }}
          />
        );
      default:
        return <img alt="Corps Scan" src={corpsScan} className="" />;
    }
  };
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
  // Utiliser useEffect pour effectuer la requête GET une fois que le composant est monté

  useEffect(() => {
    const fetchPrescriptionDetails = async () => {
      try {
        const token = localStorage.getItem("token"); // Récupérer le token JWT depuis le stockage local

        const response = await axios.get(
          `http://localhost:4001/prescriptions/${prescriptionId}/${traitementId}`,
          {
            headers: {
              Authorization: ` ${token}`, // Ajouter le token JWT à l'en-tête 'Authorization'
            },
          }
        );

        // Mettre à jour l'état de la prescription avec les données récupérées
        setPrescription(response.data);
      } catch (error) {
        console.error("Error fetching prescription details:", error);
      }
    };

    // Appeler la fonction pour effectuer la requête GET
    fetchPrescriptionDetails();
  }, [prescriptionId, traitementId]); // Déclencher l'effet lorsque les IDs de la prescription et du traitement changent

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
    const fetchScannerDetails = async () => {
      console.log("props ", traitementId, patientId);

      try {
        const response = await axios.get(
          `http://localhost:4001/scanners/${scannerId}`,
          {
            params: { include: "User" }, // Ajoutez ceci pour inclure les données de l'utilisateur
          }
        );
        setScanner(response.data);
        console.log(traitementId, scannerId, machineId);
      } catch (error) {
        console.error("Error fetching scanner details:", error);
      }
    };

    fetchScannerDetails();
  }, [scannerId, traitementId, machineId]);

  const handleDocumentCheckboxChange = (document) => {
    if (typeof newScanneDocs !== "string") {
      console.error("newScanneDocs is not a string");
      return;
    }

    // Vérifie si le document est déjà dans la liste des nouveaux documents sélectionnés
    const updatedDocs = [...newScanneDocs.split("/")]; // Convertir en tableau
    const index = updatedDocs.indexOf(document);

    if (index !== -1) {
      // Si le document est trouvé, retirez-le de la liste
      updatedDocs.splice(index, 1);
    } else {
      // Sinon, ajoutez-le à la liste
      updatedDocs.push(document);
    }

    // Convertir le tableau en chaîne de caractères séparée par des "/"
    const updatedDocsString = updatedDocs.join("/");

    setNewScanneDocs(updatedDocsString);
  };

  const handleAddScanner = async () => {
    try {
      if (!traitementId) {
        console.error("TraitementId is not defined");
        return;
      }
      const token = localStorage.getItem("token");

      // Assurez-vous que updatedDocsString est défini ici
      const updatedDocs = [...newScanneDocs.split("/")];
      const updatedDocsString = updatedDocs.join("/");

      const response = await axios.post(
        `http://localhost:4001/scanners/add/${traitementId}/${patientId}`,
        {
          date: newScannerDate,
          etat: true,
          remarque: newScanneRemarque,
          episseurCorps: newScanneEpisseurCorps,
          positionBras: newScannePositionBras,
          type: newScannerType,
          contentionSBRT: newScanneContentionSBRT,
          marquage: newScanneMarquage,
          docs: updatedDocsString,
          positionMalade: newScannePositionMalade,
          remplissageVescale: newScanneRemplissageVescale,
          nom: newScanneNom,
          detailcible: newScanneDetailcible,
          plan: newScannePlan,
          masque: newScanneMasque,
          caleTete: newScanneCaleTete,
          billotSousGenous: newScanneBillotSousGenous,
          calePied: newScanneCalePied,
          coussinSousVide: newScanneCoussinSousVide,
          machineNom: newMachineNom,
        },
        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );

      setScanner(response.data.scanner);
      setScanner({
        ...response.data,
        patient: response.data.Traitement.Patient,
      });
      setIsScannerNotFound(false);

      // Réinitialiser les valeurs à la fin
      setNewScannerDate("");
      setNewScanneRemarque("");
      setNewScanneEpisseurCorps("");
      setNewScannePositionBras("");
      setNewScannerType("");
      setNewScanneContentionSBRT("");
      setNewScanneDocs("");
      setNewScannePositionMalade("");
      setNewScanneRemplissageVescale("");
      setNewScanneNom("");
      setNewScanneDetailcible("");
      setNewScannePlan("");
      setNewScanneMasque("");
      setNewScanneCaleTete("");
      setNewScanneBillotSousGenous("");
      setNewScanneCalePied("");
      setNewScanneCoussinSousVide("");
      setNewMachineNom("");

      window.location.reload();
    } catch (error) {
      console.error("Error adding scanner:", error);
    }
  };

  if (scanner && !isScannerNotFound) {
    return (
      <div className="boxScanner">
        <div className="groupScanner">
          <div className="overlapScanner">
            <div className="nouveau-Scanner-wrapperScanner">
              <div className="nouveau-Scanner">SCANNER DE SIMULATION</div>
            </div>
            <div className="closeScanner">
              <button className="exit-button" onClick={annuler}>
                <span className="line"></span>
                <span className="line"></span>
              </button>
            </div>
            <div className="separationScanner"></div>
            <div className="medecin" style={{ marginLeft: 180 }}>
              <div
                className="avatar avatar-sm"
                style={{ marginTop: "60px", marginLeft: "40px" }}
              >
                <img
                  alt=""
                  src={scanner && scanner.User && `${scanner.User.image}`}
                  className="rounded-circle"
                />
              </div>
              <div className="med">
                {" "}
                {scanner &&
                  scanner.User &&
                  `${scanner.User.nom} ${scanner.User.prenom}`}
              </div>
            </div>
            <div className="realise">Réalisée Par :</div>

            <div className="patient">Patient(e):</div>
            <div className="patientNom">
              {patient && `${patient.nom} ${patient.prenom}`}
            </div>
            <div className="locContainer">
              <div className="loc">Localisation :</div>
              <input
                className="locinput"
                value={traitement && traitement.localisation}
                readOnly
              />
            </div>

            <div className="dateScanner">Date scanner de simulation</div>
            <input
              type="text"
              className="inputdateScanner"
              value={formatDate(scanner.date)}
              readOnly
            ></input>
            <div className="nomMachineScanner">Nom du machine</div>
            {patient.Traitements.map((traitement) => (
              <div
                type="text"
                className="inputnomMachineScanner"
                key={traitement.id}
              >
                {traitement.Scanner ? (
                  <div>{traitement.Scanner.Machine.nomMachine}</div>
                ) : (
                  <div>Aucune machine spécifiée</div>
                )}
              </div>
            ))}

            <div className="episseurScanner">Epaisseur des coupes(mm)</div>
            <input
              type="text"
              className="inputepisseurScanner"
              value={scanner.episseurCorps}
              readOnly
            ></input>
            <div className="posbrasScanner">Position des bras</div>
            <input
              type="text"
              className="inputposbrasScanner"
              value={scanner.positionBras}
              readOnly
            ></input>
            <div className="typeScanner">Type de scanner</div>
            <div className="type">
              <input
                type="radio"
                name="selecttype"
                id="D3"
                disabled
                checked={scanner.type === "D3"}
              />
              <input
                type="radio"
                name="selecttype"
                id="D4"
                disabled
                checked={scanner.type === "D4"}
              />

              <label for="D3" className="optiontype D3">
                <span>3D</span>
              </label>
              <label for="D4" className="optiontype D4">
                <span>4D</span>
              </label>
            </div>
            <div className="planScanner">Plan de scanner</div>
            <div className="plan">
              <input
                type="radio"
                name="selectplan"
                id="incline"
                disabled
                checked={scanner.plan === "incline"}
              />
              <input
                type="radio"
                name="selectplan"
                id="AIO"
                disabled
                checked={scanner.plan === "AIO"}
              />
              <input
                type="radio"
                name="selectplan"
                id="Aucun"
                disabled
                checked={scanner.plan === "Aucun"}
              />

              <label for="incline" className="optionplan incline">
                <span>incliné</span>
              </label>
              <label for="AIO" className="optionplan AIO">
                <span>AIO</span>
              </label>
              <label for="Aucun" className="optionplan Aucun">
                <span>Aucun</span>
              </label>
            </div>

            <div className="documentScanner"> Les documents à récupérer :</div>
            <textarea
              className="afficherdocumentScanner"
              value={scanner.docs ? scanner.docs.replace(/\//g, "\n") : ""}
              readOnly
            ></textarea>
            <div className="droite">
              <div className="nomScanner">Cible</div>
              <input
                className="inputnomScanner"
                value={scanner.nom}
                readOnly
              ></input>

              <div className="masqueScanner">Masque</div>
              <div className="masque">
                <input
                  type="radio"
                  name="selectmasque"
                  id="Pt3"
                  disabled
                  checked={scanner.masque === "Pt3"}
                />
                <input
                  type="radio"
                  name="selectmasque"
                  id="Pt4"
                  disabled
                  checked={scanner.masque === "Pt4"}
                />
                <input
                  type="radio"
                  name="selectmasque"
                  id="stéréro"
                  disabled
                  checked={scanner.masque === "stéréro"}
                />
                <input
                  type="radio"
                  name="selectmasque"
                  id="Qfix"
                  disabled
                  checked={scanner.masque === "Qfix"}
                />
                <label for="Pt3" className="optionmasque Pt3">
                  <span> 3Pt</span>
                </label>
                <label for="Pt4" className="optionmasque Pt4">
                  <span>5Pt</span>
                </label>
                <label for="stéréro" className="optionmasque stéréro">
                  <span>StéréroOrfit</span>
                </label>
                <label for="Qfix" className="optionmasque Qfix">
                  <span>Qfix</span>
                </label>
              </div>
              <div className="posmaladeScanner">Position du malade</div>
              <div className="posM">
                <input
                  type="radio"
                  name="selectpositionmalade"
                  id="dorsal"
                  disabled
                  checked={scanner.positionMalade === "dorsal"}
                />
                <input
                  type="radio"
                  name="selectpositionmalade"
                  id="ventral"
                  disabled
                  checked={scanner.positionMalade === "ventral"}
                />
                <input
                  type="radio"
                  name="selectpositionmalade"
                  id="lateral"
                  disabled
                  checked={scanner.positionMalade === "lateral"}
                />
                <label for="dorsal" className="optionpositionmalade dorsal">
                  <span> Décubitus Dorsal</span>
                </label>
                <label for="ventral" className="optionpositionmalade ventral">
                  <span> Décubitus Ventral</span>
                </label>
                <label for="lateral" className="optionpositionmalade lateral">
                  <span>Décubitus Lateral</span>
                </label>
              </div>
              <div className="protocoleScanner">
                Protocole de remplissage vésical
              </div>
              <div className="protocole">
                <input
                  type="radio"
                  name="selectporotocole"
                  id="vide"
                  disabled
                  checked={scanner.remplissageVescale === "vide"}
                />
                <input
                  type="radio"
                  name="selectporotocole"
                  id="semi-plein"
                  disabled
                  checked={scanner.remplissageVescale === "semi-plein"}
                />
                <input
                  type="radio"
                  name="selectporotocole"
                  id="plein"
                  disabled
                  checked={scanner.remplissageVescale === "plein"}
                />

                <label for="vide" className="optionporotocole vide">
                  <span> Vide</span>
                </label>
                <label for="semi-plein" className="optionporotocole semi-plein">
                  <span>SemiPlein</span>
                </label>
                <label for="plein" className="optionporotocole plein">
                  <span>Plein</span>
                </label>
              </div>

              <div className="contentionScanner">Contention SBRT</div>
              <div className="contention">
                <input
                  type="radio"
                  name="selectcontention"
                  id="contentionFalse"
                  disabled
                  checked={!scanner.contentionSBRT}
                />
                <input
                  type="radio"
                  name="selectcontention"
                  id="contentionTrue"
                  disabled
                  checked={scanner.contentionSBRT}
                />
                <label
                  for="contentionFalse"
                  className="optioncontention contentionFalse"
                >
                  <span>Non</span>
                </label>
                <label
                  for="contentionTrue"
                  className="optioncontention contentionTrue"
                >
                  <span>Oui</span>
                </label>
              </div>

              <div className="marquageScanner">Marquage/Tatouage</div>
              <div className="marquage">
                <input
                  type="radio"
                  name="selectmarquage"
                  id="marquageFalse"
                  disabled
                  checked={!scanner.marquage}
                />
                <input
                  type="radio"
                  name="selectmarquage"
                  id="marquageTrue"
                  disabled
                  checked={scanner.marquage}
                />
                <label
                  for="marquageFalse"
                  className="optionmarquage marquageFalse"
                >
                  <span>Non</span>
                </label>
                <label
                  for="marquageTrue"
                  className="optionmarquage marquageTrue"
                >
                  <span>Oui</span>
                </label>
              </div>

              <div className="caleteteScanner">Cale Tete</div>

              <div className="caleTete">
                <input
                  type="radio"
                  name="select"
                  id="option-1"
                  disabled
                  checked={!scanner.caleTete}
                />
                <input
                  type="radio"
                  name="select"
                  id="option-2"
                  disabled
                  checked={scanner.caleTete}
                />
                <label for="option-1" className="option option-1">
                  <span>Non</span>
                </label>
                <label for="option-2" className="option option-2">
                  <span>Oui</span>
                </label>
              </div>

              <div className="calepiedScanner">Cale Pied</div>
              <div className="calePied">
                <input
                  type="radio"
                  name="selectp"
                  id="calePiedFalse"
                  disabled
                  checked={!scanner.calePied}
                />
                <input
                  type="radio"
                  name="selectp"
                  id="calePiedTrue"
                  disabled
                  checked={scanner.calePied}
                />
                <label for="calePiedFalse" className="optionp calePiedFalse">
                  <span>Non</span>
                </label>
                <label for="calePiedTrue" className="optionp calePiedTrue">
                  <span>Oui</span>
                </label>
              </div>

              <div className="coussinScanner">Coussin Sous Vide</div>

              <div className="coussin">
                <input
                  type="radio"
                  name="selectcoussin"
                  id="coussinFalse"
                  disabled
                  checked={!scanner.coussinSousVide}
                />
                <input
                  type="radio"
                  name="selectcoussin"
                  id="coussinTrue"
                  disabled
                  checked={scanner.coussinSousVide}
                />
                <label
                  for="coussinFalse"
                  className="optioncoussin coussinFalse"
                >
                  <span>Non</span>
                </label>
                <label for="coussinTrue" className="optioncoussin coussinTrue">
                  <span>Oui</span>
                </label>
              </div>

              <div className="billotScanner">Billot sous les genous</div>

              <div className="billot">
                <input
                  type="radio"
                  name="selectbillot"
                  id="billotFalse"
                  disabled
                  checked={!scanner.billotSousGenous}
                />
                <input
                  type="radio"
                  name="selectbillot"
                  id="billotTrue"
                  disabled
                  checked={scanner.billotSousGenous}
                />
                <label for="billotFalse" className="optionbillot billotFalse">
                  <span>Non</span>
                </label>
                <label for="billotTrue" className="optionbillot billotTrue">
                  <span>Oui</span>
                </label>
              </div>
              <div className="remarqueScanner">Remarque</div>
              <textarea
                className="inputremarqueScanner"
                value={scanner.remarque}
                readOnly
              ></textarea>

              <div className="remarqueprescriptionScanner">
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

              <div>
                {prescription && prescription.remarque ? (
                  <textarea
                    className="inputremarqueprescriptionScanner"
                    value={prescription.remarque}
                    readOnly
                  ></textarea>
                ) : (
                  <p className="inputremarqueprescriptionScanner">
                    Pas de remarque pour prescription
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="" style={{ marginLeft: 700, marginTop: -700 }}>
            {scanner.nom && renderImageExist()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="boxScanner">
      <div className="groupScanner">
        <div className="overlapScanner">
          <div className="nouveau-Scanner-wrapperScanner">
            <div className="nouveau-Scanner">SCANNER DE SIMULATION</div>
          </div>
          <div className="closeScanner">
            <button className="exit-button" onClick={annuler}>
              <span className="line"></span>
              <span className="line"></span>
            </button>
          </div>
          <div className="separationScanner"></div>

          <div className="medecin">
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

          <div className="patient">Patient(e):</div>
          <div className="patientNom">
            {patient && `${patient.nom} ${patient.prenom}`}
          </div>
          <div className="locContainer">
            <div className="loc">Localisation :</div>
            <input
              className="locinput"
              value={traitement && traitement.localisation}
              readOnly
            />
          </div>

          <div className="dateScanner">Date scanner de simulation</div>
          <input
            type="date"
            className="inputdateScanner"
            value={newScannerDate}
            onChange={(e) => setNewScannerDate(e.target.value)}
          ></input>
          <div className="nomMachineScanner">Nom du machine</div>
          <input
            type="text"
            className="inputnomMachineScanner"
            placeholder="Entrer nom de la machine à utilisé"
            value={newMachineNom}
            onChange={(e) => setNewMachineNom(e.target.value)}
          ></input>

          <div className="episseurScanner">Epaisseur des coupes(mm)</div>
          <input
            type="text"
            className="inputepisseurScanner"
            placeholder="Entrer epaisseur coupes"
            value={newScanneEpisseurCorps}
            onChange={(e) => setNewScanneEpisseurCorps(e.target.value)}
          ></input>
          <div className="posbrasScanner">Position des bras</div>
          <input
            type="text"
            className="inputposbrasScanner"
            placeholder="Entrer position des bras"
            value={newScannePositionBras}
            onChange={(e) => setNewScannePositionBras(e.target.value)}
          ></input>
          <div className="typeScanner">Type du scanner</div>
          <div className="type">
            <input
              type="radio"
              name="selecttype"
              id="D3"
              checked={newScannerType === "D3"}
              onChange={() => setNewScannerType("D3")}
            />
            <input
              type="radio"
              name="selecttype"
              id="D4"
              checked={newScannerType === "D4"}
              onChange={() => setNewScannerType("D4")}
            />
            <label for="D3" className="optiontype D3">
              <span>3D</span>
            </label>
            <label for="D4" className="optiontype D4">
              <span>4D</span>
            </label>
          </div>
          <div className="planScanner">Plan du scanner</div>
          <div className="plan">
            <input
              type="radio"
              name="selectplan"
              id="incline"
              checked={newScannePlan === "incline"}
              onChange={() => setNewScannePlan("incline")}
            />
            <input
              type="radio"
              name="selectplan"
              id="AIO"
              checked={newScannePlan === "AIO"}
              onChange={() => setNewScannePlan("AIO")}
            />
            <input
              type="radio"
              name="selectplan"
              id="Aucun"
              checked={newScannePlan === "Aucun"}
              onChange={() => setNewScannePlan("Aucun")}
            />
            <label for="incline" className="optionplan incline">
              <span>incliné</span>
            </label>
            <label for="AIO" className="optionplan AIO">
              <span>AIO</span>
            </label>
            <label for="Aucun" className="optionplan Aucun">
              <span>Aucun</span>
            </label>
          </div>
          <div className="documentScanner">Les documents à récupérer :</div>
          <div className="inputdocumentScanner">
            <label className="labeldocumentScanner">
              <input
                type="checkbox"
                className="checkmark"
                style={{ margin: 10 }}
                value="Echo(et ou)mammographie"
                checked={newScanneDocs.includes("Echo(et ou)mammographie")}
                onChange={(e) => handleDocumentCheckboxChange(e.target.value)}
              />
              Echo(et ou)mammographie
            </label>
            <label className="labeldocumentScanner">
              <input
                type="checkbox"
                className="checkmark"
                style={{ margin: 10 }}
                value="Compte rendu histologique"
                checked={newScanneDocs.includes("Compte rendu histologique")}
                onChange={(e) => handleDocumentCheckboxChange(e.target.value)}
              />
              Compte rendu histologique
            </label>
            <label className="labeldocumentScanner">
              <input
                type="checkbox"
                className="checkmark"
                style={{ margin: 10 }}
                value="CR opératoire"
                checked={newScanneDocs.includes("CR opératoire")}
                onChange={(e) => handleDocumentCheckboxChange(e.target.value)}
              />
              CR opératoire
            </label>
            <label className="labeldocumentScanner">
              <input
                type="checkbox"
                className="checkmark"
                style={{ margin: 10 }}
                value="Imagerie avant la chirurgie ou la chimiothérapie"
                checked={newScanneDocs.includes(
                  "Imagerie avant la chirurgie ou la chimiothérapie"
                )}
                onChange={(e) => handleDocumentCheckboxChange(e.target.value)}
              />
              Imagerie avant la chirurgie ou la chimiothérapie
            </label>
            <label className="labeldocumentScanner">
              <input
                type="checkbox"
                className="checkmark"
                style={{ margin: 10 }}
                value="Imagerie après la chirurgie ou la chimiothérapie"
                checked={newScanneDocs.includes(
                  "Imagerie après la chirurgie ou la chimiothérapie"
                )}
                onChange={(e) => handleDocumentCheckboxChange(e.target.value)}
              />
              Imagerie après la chirurgie ou la chimiothérapie
            </label>
          </div>

          <div className="droite">
            <div className="nomScanner">Cible</div>
            <select
              className="inputnomScanner"
              value={newScanneNom}
              onChange={(e) => setNewScanneNom(e.target.value)}
            >
              <option value="">Sélectionnez cible</option>
              <option value="cérébral">cérébral</option>
              <option value="thoracique">thoracique</option>
              <option value="abdominopelvien">abdominopelvien</option>
              <option value="thoraco-abdominal">thoraco-abdominal</option>
              <option value="cervico-thoracique">cervico-thoracique</option>
              <option value="pelvien">pelvien</option>
            </select>

            <div className="masqueScanner">Masque</div>
            <div className="masque">
              <input
                type="radio"
                name="selectmasque"
                id="Pt3"
                checked={newScanneMasque === "Pt3"}
                onChange={() => setNewScanneMasque("Pt3")}
              />
              <input
                type="radio"
                name="selectmasque"
                id="Pt4"
                checked={newScanneMasque === "Pt4"}
                onChange={() => setNewScanneMasque("Pt4")}
              />
              <input
                type="radio"
                name="selectmasque"
                id="stéréro"
                checked={newScanneMasque === "stéréro"}
                onChange={() => setNewScanneMasque("stéréro")}
              />
              <input
                type="radio"
                name="selectmasque"
                id="Qfix"
                checked={newScanneMasque === "Qfix"}
                onChange={() => setNewScanneMasque("Qfix")}
              />
              <label for="Pt3" className="optionmasque Pt3">
                <span> 3Pt</span>
              </label>
              <label for="Pt4" className="optionmasque Pt4">
                <span>5Pt</span>
              </label>
              <label for="stéréro" className="optionmasque stéréro">
                <span>StéréroOrfit</span>
              </label>
              <label for="Qfix" className="optionmasque Qfix">
                <span>Qfix</span>
              </label>
            </div>
            <div className="posmaladeScanner">Position du malade</div>
            <div className="posM">
              <input
                type="radio"
                name="selectpositionmalade"
                id="dorsal"
                checked={newScannePositionMalade === "dorsal"}
                onChange={() => setNewScannePositionMalade("dorsal")}
              />
              <input
                type="radio"
                name="selectpositionmalade"
                id="ventral"
                checked={newScannePositionMalade === "ventral"}
                onChange={() => setNewScannePositionMalade("ventral")}
              />
              <input
                type="radio"
                name="selectpositionmalade"
                id="lateral"
                checked={newScannePositionMalade === "lateral"}
                onChange={() => setNewScannePositionMalade("lateral")}
              />
              <label for="dorsal" className="optionpositionmalade dorsal">
                <span> Décubitus Dorsal</span>
              </label>
              <label for="ventral" className="optionpositionmalade ventral">
                <span> Décubitus Ventral</span>
              </label>
              <label for="lateral" className="optionpositionmalade lateral">
                <span>Décubitus Lateral</span>
              </label>
            </div>
            <div className="protocoleScanner">
              Protocole de remplissage vésical
            </div>
            <div className="protocole">
              <input
                type="radio"
                name="selectporotocole"
                id="vide"
                checked={newScanneRemplissageVescale === "vide"}
                onChange={() => setNewScanneRemplissageVescale("vide")}
              />
              <input
                type="radio"
                name="selectporotocole"
                id="semi-plein"
                checked={newScanneRemplissageVescale === "semi-plein"}
                onChange={() => setNewScanneRemplissageVescale("semi-plein")}
              />
              <input
                type="radio"
                name="selectporotocole"
                id="plein"
                checked={newScanneRemplissageVescale === "plein"}
                onChange={() => setNewScanneRemplissageVescale("plein")}
              />

              <label for="vide" className="optionporotocole vide">
                <span> Vide</span>
              </label>
              <label for="semi-plein" className="optionporotocole semi-plein">
                <span>SemiPlein</span>
              </label>
              <label for="plein" className="optionporotocole plein">
                <span>Plein</span>
              </label>
            </div>
            <div className="contentionScanner">Contention SBRT</div>
            <div className="contention">
              <input
                type="radio"
                name="selectcontention"
                id="contentionFalse"
                checked={newScanneContentionSBRT === "false"}
                onChange={() => setNewScanneContentionSBRT("false")}
              />
              <input
                type="radio"
                name="selectcontention"
                id="contentionTrue"
                checked={newScanneContentionSBRT === "true"}
                onChange={() => setNewScanneContentionSBRT("true")}
              />
              <label
                for="contentionFalse"
                className="optioncontention contentionFalse"
              >
                <span>Non</span>
              </label>
              <label
                for="contentionTrue"
                className="optioncontention contentionTrue"
              >
                <span>Oui</span>
              </label>
            </div>

            <div className="marquageScanner">Marquage/Tatouage</div>
            <div className="marquage">
              <input
                type="radio"
                name="selectmarquage"
                id="marquageFalse"
                checked={newScanneMarquage === "false"}
                onChange={() => setNewScanneMarquage("false")}
              />
              <input
                type="radio"
                name="selectmarquage"
                id="marquageTrue"
                checked={newScanneMarquage === "true"}
                onChange={() => setNewScanneMarquage("true")}
              />
              <label
                for="marquageFalse"
                className="optionmarquage marquageFalse"
              >
                <span>Non</span>
              </label>
              <label for="marquageTrue" className="optionmarquage marquageTrue">
                <span>Oui</span>
              </label>
            </div>

            <div className="caleteteScanner">Câle tête</div>

            <div className="caleTete">
              <input
                type="radio"
                name="select"
                id="option-1"
                checked={newScanneCaleTete === "false"}
                onChange={() => setNewScanneCaleTete("false")}
              />
              <input
                type="radio"
                name="select"
                id="option-2"
                checked={newScanneCaleTete === "true"}
                onChange={() => setNewScanneCaleTete("true")}
              />
              <label for="option-1" className="option option-1">
                <span>Non</span>
              </label>
              <label for="option-2" className="option option-2">
                <span>Oui</span>
              </label>
            </div>

            <div className="calepiedScanner">Câle pied</div>
            <div className="calePied">
              <input
                type="radio"
                name="selectp"
                id="calePiedFalse"
                checked={newScanneCalePied === "false"}
                onChange={() => setNewScanneCalePied("false")}
              />
              <input
                type="radio"
                name="selectp"
                id="calePiedTrue"
                checked={newScanneCalePied === "true"}
                onChange={() => setNewScanneCalePied("true")}
              />
              <label for="calePiedFalse" className="optionp calePiedFalse">
                <span>Non</span>
              </label>
              <label for="calePiedTrue" className="optionp calePiedTrue">
                <span>Oui</span>
              </label>
            </div>

            <div className="coussinScanner">Coussin sous vide</div>

            <div className="coussin">
              <input
                type="radio"
                name="selectcoussin"
                id="coussinFalse"
                checked={newScanneCoussinSousVide === "false"}
                onChange={() => setNewScanneCoussinSousVide("false")}
              />
              <input
                type="radio"
                name="selectcoussin"
                id="coussinTrue"
                checked={newScanneCoussinSousVide === "true"}
                onChange={() => setNewScanneCoussinSousVide("true")}
              />
              <label for="coussinFalse" className="optioncoussin coussinFalse">
                <span>Non</span>
              </label>
              <label for="coussinTrue" className="optioncoussin coussinTrue">
                <span>Oui</span>
              </label>
            </div>

            <div className="billotScanner">Billot sous les genous</div>

            <div className="billot">
              <input
                type="radio"
                name="selectbillot"
                id="billotFalse"
                checked={newScanneBillotSousGenous === "false"}
                onChange={() => setNewScanneBillotSousGenous("false")}
              />
              <input
                type="radio"
                name="selectbillot"
                id="billotTrue"
                checked={newScanneBillotSousGenous === "true"}
                onChange={() => setNewScanneBillotSousGenous("true")}
              />
              <label for="billotFalse" className="optionbillot billotFalse">
                <span>Non</span>
              </label>
              <label for="billotTrue" className="optionbillot billotTrue">
                <span>Oui</span>
              </label>
            </div>
            <div className="remarqueScanner">Remarque</div>
            <textarea
              className="inputremarqueScanner"
              placeholder="Entrer une remarque pour scanner de simulation"
              value={newScanneRemarque}
              onChange={(e) => setNewScanneRemarque(e.target.value)}
            ></textarea>

            <div className="remarqueprescriptionScanner">
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
              <div className="lign">Remarque prescription</div>
            </div>

            <div>
              {prescription && prescription.remarque ? (
                <textarea
                  className="inputremarqueprescriptionScanner"
                  value={prescription.remarque}
                  readOnly
                ></textarea>
              ) : (
                <p className="inputremarqueprescriptionScanner">
                  Pas de remarque pour prescription
                </p>
              )}
            </div>
          </div>

          <div className="" style={{ marginLeft: 700, marginTop: -700 }}>
            {renderImage()}
          </div>

          <div className="divScanner">
            <button className="champ-textScanner">
              <label
                className="text-wrapperScanner"
                onClick={() => {
                  handleAddScanner();
                  window.location.href = "/app";
                }}
              >
                Valider
              </label>
            </button>
            <button className="div-wrapperScanner" onClick={annuler}>
              <label className="text-wrapperScanner">Annuler</label>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scanner;
