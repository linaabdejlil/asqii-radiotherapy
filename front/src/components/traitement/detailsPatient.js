import "../../style/detailsPatient.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import MEDECIN from "./medecin";
import NouveauTraitement from "./nouveauTraitement";
import SupprimerTraitement from "./supprimerTraitement";

import Modal from "react-modal";

function DetailsPatient({ closeModal, patientId }) {
  const [patient, setPatient] = useState(null);
  const [traitements, setTraitements] = useState(null);
  const [isPatientNotFound] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [localisation, setLocalisation] = useState("");
  const [indication, setIndication] = useState("");
  const [chimio, setChimio] = useState("");

  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedTraitementId, setSelectedTraitementId] = useState(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedModal, setSelectedModal] = useState(null);

  const refreshPatientData = async () => {
    try {
      // Récupérer les détails actualisés du patient depuis l'API
      const response = await axios.get(
        `http://localhost:4001/patients/${patientId}`
      );
      const updatedPatientData = response.data;

      // Mettre à jour les données du patient dans le composant
      setPatient(updatedPatientData);

      // Log pour vérifier si les données du patient sont correctement mises à jour
      console.log("Données du patient actualisées avec succès");
    } catch (error) {
      console.error("Error refreshing patient data:", error);
    }
  };

  // Utilisez useEffect pour appeler refreshPatientData lorsque patientId change
  useEffect(() => {
    refreshPatientData();
  }, [patientId]);

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
  const openModalNouveauTraitement = (modalType, patientId) => {
    console.log(modalType, patientId);
    setSelectedModal(modalType);
    setSelectedPatientId(patientId);
    setModalIsOpen(true);
  };
  const closeModalNouveauTraitement = () => {
    setSelectedModal(null);
    setSelectedPatientId(null);

    setModalIsOpen(false);
  };
  const openModalSupprimerTraitement = (modalType, traitementId) => {
    console.log(modalType, traitementId);
    setSelectedModal(modalType);
    setSelectedTraitementId(traitementId);
    setModalIsOpen(true);
  };
  const closeModalSupprimerTraitement = () => {
    setSelectedModal(null);
    setSelectedTraitementId(null);

    setModalIsOpen(false);
  };

  useEffect(() => {
    const fetchAssignedUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4001/patients/assigned-users/${patientId}`
        );
        setAssignedUsers(response.data);
      } catch (error) {
        console.error("Error fetching assigned users:", error);
      }
    };

    fetchAssignedUsers();
  }, [patientId]);

  useEffect(() => {
    const fetchDetailsPatient = async () => {
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
    const fetchTraitements = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4001/traitements/patient/${patientId}`
        );
        setTraitements(response.data);
      } catch (error) {
        console.error("Error fetching traitements:", error);
      }
    };

    fetchTraitements();
  }, [patientId]);

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

  const annuler = async () => {
    window.location.reload();
  };

  // Check if patient is null
  if (patient && !isPatientNotFound) {
    return (
      <div className="boxDetails">
        <div className="groupDetails">
          <div className="overlap-groupDetails">
            <div className="divDetails">
              <div className="medecins-referants">
                MEDECINS REFERANTS{" "}
                <button
                  className="plus-med"
                  style={{ right: 20, top: 10 }}
                  onClick={() => openModalMedecin("medecin", patient.id)}
                ></button>
              </div>
              <div className="d-tails-patient">DÉTAILS PATIENT </div>
              <div className="informations">
                INFORMATIONS GENERALES{" "}
                <button
                  className="plus-med"
                  style={{ right: 20, top: 10 }}
                  onClick={() =>
                    openModalNouveauTraitement("nouveauTraitement", patient.id)
                  }
                ></button>
              </div>
            </div>

            <div style={{ marginLeft: 450, marginTop: -50 }}>
              <button className="exit-button" onClick={annuler}>
                <span className="line"></span>
                <span className="line"></span>
              </button>
            </div>
            <div class="btn-conteiner" onClick={annuler}>
              <a class="btn-content" href="#">
                <span class="btn-title">Suivant</span>
                <span class="icon-arrow">
                  <svg
                    width="66px"
                    height="43px"
                    viewBox="0 0 66 43"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g
                      id="arrow"
                      stroke="none"
                      stroke-width="1"
                      fill="none"
                      fill-rule="evenodd"
                    >
                      <path
                        id="arrow-icon-one"
                        d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z"
                        fill="#FFFFFF"
                      ></path>
                      <path
                        id="arrow-icon-two"
                        d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z"
                        fill="#FFFFFF"
                      ></path>
                      <path
                        id="arrow-icon-three"
                        d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z"
                        fill="#FFFFFF"
                      ></path>
                    </g>
                  </svg>
                </span>
              </a>
            </div>
            <div className="group-2Details">
              <div className="div-wrapperDetails">
                <div className="text-wrapperDetails">Nom</div>
              </div>
            </div>
            <div className="group-4Details">
              <div className="group-wrapperDetails">
                <div className="group-5Details">
                  <div className="text-wrapperDetails">Prenom</div>
                </div>
              </div>
              <input
                className="rectangleDetails"
                value={patient.prenom}
                readOnly
              />
              <input
                className="rectangle-2Details"
                value={patient.nom}
                readOnly
              />
            </div>
            <div className="group-6Details">
              <div className="group-7Details">
                <div className="group-5Details">
                  <div className="text-wrapperDetails">DDN</div>
                </div>
              </div>
              <input
                placeholder="ddn"
                className="rectangle-2Details"
                value={formatDate(patient.dateNaissance)}
                readOnly
              />
            </div>
            <div className="group-8Details">
              <div className="group-7Details">
                <div className="group-5Details">
                  <div className="text-wrapperDetails">DMI</div>
                </div>
              </div>
              <input
                placeholder="dmi"
                className="rectangle-2Details"
                value={patient.DMI}
                readOnly
              />
            </div>
            <div className="group-9Details">
              <div className="group-7Details">
                <div className="group-5Details">
                  <div className="text-wrapperDetails">CIN</div>
                </div>
              </div>
              <input
                placeholder="cin"
                className="rectangle-2Details"
                value={patient.Cin}
                readOnly
              />
            </div>
            <div className="group-10Details">
              <div className="group-7Details">
                <div className="group-5Details">
                  <div className="text-wrapperDetails">
                    Sécurité <br />
                    sociale
                  </div>
                </div>
              </div>
              <input
                placeholder="securite sociale"
                className="rectangle-2Details"
                value={patient.securiteSociale}
                readOnly
              />
            </div>
          </div>

          <div className="rectangle-3Details">
            {assignedUsers
              .reduce((pairs, user, index) => {
                if (index % 2 === 0) {
                  pairs.push([user]);
                } else {
                  pairs[pairs.length - 1].push(user);
                }
                return pairs;
              }, [])
              .map((pair, index) => (
                <React.Fragment key={pair[0].id}>
                  <div className="user-info-pair">
                    {pair.map((user) => (
                      <div key={user.id} className="user-info">
                        <img
                          src={user.image}
                          alt={`${user.nom} ${user.prenom}`}
                          className="rounded-circle"
                          style={{ height: 60, width: 60 }}
                        />
                        <div className="user-text">
                          <p className="medRefNom">
                            {user.nom} {user.prenom}
                          </p>
                          <p className="medRefRole">{user.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {(index + 1) % 2 === 0 && <br />}{" "}
                  {/* Ajoute un saut de ligne après chaque deux utilisateurs */}
                </React.Fragment>
              ))}
          </div>

          {traitements && Array.isArray(traitements) && (
            <div className="traitements">
              {traitements.map((traitement) => (
                <div key={traitement.id} className="traitementGeneral">
                  <div style={{ display: "flex", padding: 15 }}>
                    <div className="localisationTraitement">Localisation </div>
                    <div className="inputlocalisationTraitement">
                      {" "}
                      {traitement.localisation}
                    </div>
                  </div>
                  <div style={{ display: "flex", padding: 15 }}>
                    <div className="indicationTraitement">Indication </div>
                    <div className="inputindicationTraitement">
                      {traitement.indication}
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", padding: 15, marginBottom: 15 }}
                  >
                    <div className="chimioTraitement">
                      Chimiothérapie Concomittant
                    </div>
                    <div className="inputchimioTraitement">
                      {" "}
                      {traitement.chimio ? "Oui" : "Non"}
                    </div>
                  </div>
                  <button
                    class="bin-button"
                    onClick={() =>
                      openModalSupprimerTraitement(
                        "supprimerTraitement",
                        traitement.id
                      )
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 39 7"
                      class="bin-top"
                    >
                      <line
                        stroke-width="4"
                        stroke="white"
                        y2="5"
                        x2="39"
                        y1="5"
                      ></line>
                      <line
                        stroke-width="3"
                        stroke="white"
                        y2="1.5"
                        x2="26.0357"
                        y1="1.5"
                        x1="12"
                      ></line>
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 33 39"
                      class="bin-bottom"
                    >
                      <mask fill="white" id="path-1-inside-1_8_19">
                        <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
                      </mask>
                      <path
                        mask="url(#path-1-inside-1_8_19)"
                        fill="white"
                        d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                      ></path>
                      <path
                        stroke-width="4"
                        stroke="white"
                        d="M12 6L12 29"
                      ></path>
                      <path stroke-width="4" stroke="white" d="M21 6V29"></path>
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 89 80"
                      class="garbage"
                    >
                      <path
                        fill="white"
                        d="M20.5 10.5L37.5 15.5L42.5 11.5L51.5 12.5L68.75 0L72 11.5L79.5 12.5H88.5L87 22L68.75 31.5L75.5066 25L86 26L87 35.5L77.5 48L70.5 49.5L80 50L77.5 71.5L63.5 58.5L53.5 68.5L65.5 70.5L45.5 73L35.5 79.5L28 67L16 63L12 51.5L0 48L16 25L22.5 17L20.5 10.5Z"
                      ></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Modal
          isOpen={modalIsOpen && selectedModal === "medecin"}
          onRequestClose={closeModalMedecin}
          contentLabel="medecin Modal"
          className="custom-modal"
          overlayClassName="custom-overlay"
        >
          <MEDECIN
            closeModal={closeModalMedecin}
            patientId={selectedPatientId}
          />
        </Modal>
        <Modal
          isOpen={modalIsOpen && selectedModal === "nouveauTraitement"}
          onRequestClose={closeModalNouveauTraitement}
          contentLabel="nouveauTraitement Modal"
          className="custom-modal"
          overlayClassName="custom-overlay"
        >
          <NouveauTraitement
            closeModal={closeModalNouveauTraitement}
            patientId={selectedPatientId}
            setTraitements={setTraitements}
          />
        </Modal>
        <Modal
          isOpen={modalIsOpen && selectedModal === "supprimerTraitement"}
          onRequestClose={closeModalSupprimerTraitement}
          contentLabel="supprimerraitement Modal"
          className="custom-modal"
          overlayClassName="custom-overlay"
        >
          <SupprimerTraitement
            closeModal={closeModalSupprimerTraitement}
            traitementId={selectedTraitementId}
            setTraitements={setTraitements}
          />
        </Modal>
      </div>
    );
  }
}

export default DetailsPatient;
