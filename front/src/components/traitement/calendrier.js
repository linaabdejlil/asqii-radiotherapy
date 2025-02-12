import "../../style/calendrier.css";
import "./detailsSeance.css";
import "./detailsFutureSeance.css";
import React, { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import Modal from "react-modal";

const localizer = momentLocalizer(moment);

function Calendrier({ traitementId }) {
  const [traitement, setTraitement] = useState(null);
  const [newTraitementDateDebut, setNewTraitementDateDebut] = useState("");
  const [newTraitementNombreSeance, setNewTraitementNombreSeance] =
    useState("");
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loggedInUserNom, setLoggedInUserNom] = useState("");
  const [loggedInUserPrenom, setLoggedInUserPrenom] = useState("");
  const [loggedInUserImage, setLoggedInUserImage] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedModal, setSelectedModal] = useState(null);
  const [selectedTraitementId, setSelectedTraitementId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isRescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [isPostponedRemarkModalOpen, setPostponedRemarkModalOpen] =
    useState(false);
  const [remarque, setRemarque] = useState("");
  const handleRemarksChange = (e) => {
    setRemarque(e.target.value);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
    setRemarque("");
  };
  const handleSelectEvent = (event) => {
    const eventDate = new Date(event.start);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    setSelectedEvent(event);

    if (event.reporte) {
      setRemarque(event.remarque); // Set the remark for display in the modal
      setPostponedRemarkModalOpen(true); // Open the postponed remark modal
    } else if (eventDate >= today) {
      setRemarque("");
      setSelectedModal("futureSession");
      setModalIsOpen(true);
    } else {
      setSelectedModal("sessionDetails");
      setModalIsOpen(true);
    }
  };

  // Handler to open the reschedule modal
  const openRescheduleModal = () => {
    setRescheduleModalOpen(true);
  };

  // Handler to close the reschedule modal
  const closeRescheduleModal = () => {
    setRescheduleModalOpen(false);
  };

  // Add this function where you manage your button clicks
  const handleReschedule = () => {
    openRescheduleModal(); // Opens the modal for rescheduling
  };
  const [newRescheduleDate, setNewRescheduleDate] = useState("");

  // Handlers for modal

  const handleDateChange = (e) => {
    setNewRescheduleDate(e.target.value);
  };

  const rescheduleSeance = async () => {
    if (selectedEvent && newRescheduleDate) {
      try {
        const updatedData = {
          newDate: newRescheduleDate,
          remarque: remarque,
          reporte: true, // Marque comme reportée
        };
        
        // Mise à jour côté serveur
        const response = await axios.put(
          `http://localhost:4001/seances/reschedule/${selectedEvent.id}`,
          updatedData
        );
        console.log("Reschedule success:", response.data);
  
        // Mettre à jour l'événement reporté dans l'état
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === selectedEvent.id
              ? { ...event, reporte: true, remarque: remarque }
              : event
          )
        );
  
        // Ajouter un nouvel événement à la nouvelle date
        const newEvent = {
          ...selectedEvent,
          id: selectedEvent.id + "_rescheduled", // ID unique pour le nouvel événement
          start: new Date(newRescheduleDate),
          end: new Date(newRescheduleDate),
          reporte: false, // Ce nouvel événement n'est pas reporté
        };
  
        setEvents((prevEvents) => [...prevEvents, newEvent]);
  
        closeRescheduleModal(); // Fermer la modal
        setSelectedEvent(null); // Réinitialiser l'événement sélectionné
      } catch (error) {
        console.error("Error rescheduling seance:", error);
        alert(
          "Failed to reschedule seance: " + error.message || "Unknown error"
        );
      }
    }
  };
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:4001/users/profile",
          {
            headers: {
              Authorization: ` ${token}`,
            },
          }
        );

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
        `http://localhost:4001/traitements/one/${traitementId}`
      );
      setTraitement(response.data);
      setNewTraitementDateDebut(response.data.dateDebut);
      setNewTraitementNombreSeance(response.data.nombreSeances);
      setEvents(response.data.events);

      const seancesResponse = await axios.get(
        `http://localhost:4001/seances/${traitementId}`
      );
      const seances = seancesResponse.data;

      const seanceEvents = seances.map((seance) => ({
        id: seance.id,
        title: `Séance ${seance.numero_seance}`,
        remarque: `${seance.remarque}`,
        reporte: seance.reporte, // Ensure this attribute is included

        start: new Date(seance.date),
        end: new Date(seance.date),
        backgroundColor: "#ff8b3d",
      }));

      setEvents([...events, ...seanceEvents]);
    } catch (error) {
      console.error("Error fetching traitement details:", error);
    }
  };

  useEffect(() => {
    fetchTraitementDetails();
  }, [traitementId, selectedDate]);
  const updateSeance = async () => {
    if (selectedEvent) {
      const updatedSeanceData = {
        date: selectedEvent.start,
        remarque: remarque,
      };

      try {
        const response = await axios.put(
          `http://localhost:4001/seances/update/${selectedEvent.id}`,
          updatedSeanceData
        );
        console.log("Update success:", response.data);
        closeModal();
      } catch (error) {
        console.error("Error updating seance:", error);
        alert("Failed to update seance: " + error.message || "Unknown error");
      }
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
  const eventPropGetter = (event) => {
    const eventDate = new Date(event.start);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log(event); // Check the event object structure and values

    if (event.reporte) {
      return {
        style: {
          backgroundColor: "#ff0000", // Red color for postponed sessions
          color: "white",
        },
      };
    }
    if (eventDate < today) {
      return {
        style: {
          backgroundColor: "#00E4B0",
          color: "white",
        },
      };
    }
    if (eventDate > today) {
      return {
        style: {
          backgroundColor: "#ff8b3d",
          color: "white",
        },
      };
    }
    return {};
  };

  return (
    <div className="boxCalendrier">
      <div className="groupCalendrier">
        <div className="overCalendrier">
          <div className="nouveau-Calendrier-wrapperCalendrier">
            <div className="nouveau-Calendrier">Traitement Radiothérapie</div>
          </div>
          <button
            style={{ marginLeft: 720 }}
            className="exit-button"
            onClick={annuler}
          >
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
            <div className="nb">Nb Séances:</div>
            <div className="nbinput">{newTraitementNombreSeance}</div>
            <div className="nb">Date Début Traitement:</div>
            <div className="nbinput">{formatDate(newTraitementDateDebut)}</div>
            <div className="nb">Etalement:</div>
            <div className="nbinput">{traitement && traitement.etalement}</div>
          </div>
          <div className="cal">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500, width: "85%" }}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventPropGetter}
              selectable={true}
            />

            <Modal
              isOpen={modalIsOpen && selectedModal === "futureSession"}
              onRequestClose={closeModal}
              contentLabel="Future Session Details"
              className="custom-modal"
              overlayClassName="custom-overlay"
            >
              {selectedEvent && (
                <div className="detailsFutureSeance">
                  <div className="groupdetailsFutureSeance">
                    <div className="overdetailsFutureSeance">
                      <div className="nouveau-detailsFutureSeance-wrapperdetailsFutureSeance">
                        <div
                          className="nouveau-detailsFutureSeance"
                          style={{ marginLeft: -60 }}
                        >
                          Séance {selectedEvent.title.split(" ")[1]}
                        </div>
                      </div>
                      <button
                        style={{ marginLeft: -110 }}
                        className="exit-button"
                        onClick={closeModal}
                      >
                        <span className="line"></span>
                        <span className="line"></span>
                      </button>
                      <div className="dateSeance">Date de la Séance</div>
                      <div className="inputDateSeance">
                        {formatDate(selectedEvent.start)}
                      </div>
                      <div className="remarqueSeance">Remarque</div>
                      <textarea
                        className="inputRemarqueSeance"
                        placeholder="Entrer remarque pour cette seance"
                        value={remarque}
                        onChange={handleRemarksChange}
                      ></textarea>
                      <div className="divdetailsFutureSeance">
                        <button
                          className="champ-textdetailsFutureSeance"
                          onClick={updateSeance}
                        >
                          <label className="text-wrapperdetailsFutureSeance">
                            Valider
                          </label>
                        </button>
                        <button
                          className="div-wrapperdetailsFutureSeance"
                          onClick={handleReschedule}
                        >
                          <label className="text-wrapperdetailsFutureSeance">
                            Repporter
                          </label>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Modal>
            <Modal
              isOpen={isPostponedRemarkModalOpen}
              onRequestClose={() => setPostponedRemarkModalOpen(false)}
              contentLabel="Postponed Session Remark"
              className="custom-modal"
              overlayClassName="custom-overlay"
            >
              <div className="detailsFutureSeance">
                <div
                  className="groupdetailsFutureSeance"
                  style={{ height: 400 }}
                >
                  <div className="overdetailsFutureSeance">
                    <div className="nouveau-detailsFutureSeance-wrapperdetailsFutureSeance">
                      {selectedEvent && (
                        <div
                          className="nouveau-detailsFutureSeance"
                          style={{ marginLeft: -180, width: 370 }}
                        >
                          La séance {selectedEvent.title.split(" ")[1]} est
                          reporté &nbsp;&nbsp; à une date ultérieur
                        </div>
                      )}
                    </div>
                    <button
                      style={{ marginLeft: -110 }}
                      className="exit-button"
                      onClick={() => setPostponedRemarkModalOpen(false)}
                    >
                      <span className="line"></span>
                      <span className="line"></span>
                    </button>

                    <textarea
                      style={{
                        top: -100,
                        width: 450,
                        left: -150,
                        height: 200,
                      }}
                      className="inputRemarqueSeance"
                    >
                      {selectedEvent && selectedEvent.remarque}
                    </textarea>
                  </div>
                </div>
              </div>
            </Modal>

            {/* Reschedule Modal */}
            <Modal
              isOpen={isRescheduleModalOpen}
              onRequestClose={closeRescheduleModal}
              contentLabel="Reschedule Session"
              className="custom-modal"
              overlayClassName="custom-overlay"
            >
              <div className="detailsFutureSeance">
                <div className="groupdetailsFutureSeance">
                  <div className="overdetailsFutureSeance">
                    <div className="nouveau-detailsFutureSeance-wrapperdetailsFutureSeance">
                      {selectedEvent && (
                        <div
                          className="nouveau-detailsFutureSeance"
                          style={{ marginLeft: -160 }}
                        >
                          Repporter la séance{" "}
                          {selectedEvent.title.split(" ")[1]}
                        </div>
                      )}
                    </div>
                    <button
                      style={{ marginLeft: -110 }}
                      className="exit-button"
                      onClick={closeModal}
                    >
                      <span className="line"></span>
                      <span className="line"></span>
                    </button>
                    <div className="dateSeance" style={{ left: -70 }}>
                      Selectionner une nouvelle date
                    </div>
                    <input
                      style={{ top: 40, left: 30 }}
                      className="inputDateSeance"
                      type="date"
                      value={newRescheduleDate}
                      onChange={handleDateChange}
                    />
                    <textarea
                      style={{ top: -40, width: 450, left: -150 }}
                      className="inputRemarqueSeance"
                      placeholder="Pourquoi vous pouvez repporter cette séance ?"
                      value={remarque}
                      onChange={handleRemarksChange}
                    ></textarea>
                    <div className="divdetailsFutureSeance">
                      <button
                        className="champ-textdetailsFutureSeance"
                        onClick={rescheduleSeance}
                      >
                        <label className="text-wrapperdetailsFutureSeance">
                          Valider
                        </label>
                      </button>
                      <button
                        className="div-wrapperdetailsFutureSeance"
                        onClick={closeRescheduleModal}
                      >
                        <label className="text-wrapperdetailsFutureSeance">
                          Annuler
                        </label>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>

            <Modal
              isOpen={modalIsOpen && selectedModal === "sessionDetails"}
              onRequestClose={closeModal}
              contentLabel="Session Details"
              className="custom-modal"
              overlayClassName="custom-overlay"
            >
              {selectedEvent && (
                <div className="detailsSeance">
                  <div className="groupdetailsSeance">
                    <div className="overdetailsSeance">
                      <div className="nouveau-detailsSeance-wrapperdetailsSeance">
                        <div className="nouveau-detailsSeance">
                          Séance {selectedEvent.title.split(" ")[1]}
                        </div>
                      </div>
                      <button
                        style={{ marginLeft: -110 }}
                        className="exit-button"
                        onClick={closeModal}
                      >
                        <span className="line"></span>
                        <span className="line"></span>
                      </button>
                      <div className="dateSeance">Date de la Séance</div>
                      <div className="inputDateSeance">
                        {formatDate(selectedEvent.start)}
                      </div>
                      <div className="remarqueSeance">Remarque</div>
                      <textarea
                        className="inputRemarqueSeance"
                        value={
                          selectedEvent.remarque ||
                          "Aucune remarque pour cette séance"
                        }
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendrier;
