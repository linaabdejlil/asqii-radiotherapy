import React, { useEffect, useState } from "react";
import "../../style/calendrier.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import Modal from "react-modal";
import NouvelleNote from "./nouvelleNote";
import NoteDisplay from "./NoteDisplay"; // Import NoteDisplay

const localizer = momentLocalizer(moment);

function CalendrierNote() {
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedModal, setSelectedModal] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("http://localhost:4001/notes/all", {
          headers: {
            Authorization: `${token}`,
          },
        });
        const notes = response.data.notes;

        const events = notes.map((note) => ({
          id: note.id,
          title: note.titre,
          start: new Date(note.rappel),
          end: new Date(note.rappel),
          allDay: true,
          noteData: note // Store the note data for later use
        }));

        setEvents(events);
      } catch (error) {
        console.error("Erreur lors de la récupération des notes :", error);
      }
    };

    fetchNotes();
  }, []);

  const handleEventClick = async (event) => {
    try {
      const token = localStorage.getItem("token");
  
      // Fetch the note details by its ID
      const response = await axios.get(`http://localhost:4001/notes/note/${event.id}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
  
      const note = response.data.note;
      console.log('Note fetched:', note); // Log the note data to check if files are included
  
      setSelectedNote(note); // Set the full note data including files
      setSelectedModal("NoteDisplay");
      setModalIsOpen(true);
    } catch (error) {
      console.error("Erreur lors de la récupération de la note :", error);
    }
  };
  

  const openModalNouvelleNote = (modalType) => {
    setSelectedModal(modalType);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedNote(null);
    setSelectedModal(null);
    setModalIsOpen(false);
  };

  return (
    <div>
      <button
        className="buttonNote"
        onClick={() => openModalNouvelleNote("NouvelleNote")}
      >
        <svg
          className="svg-icon"
          width="24"
          viewBox="0 0 24 24"
          height="24"
          fill="none"
        >
          <g
            strokeWidth="2"
            strokeLinecap="round"
            stroke="#056dfa"
            fillRule="evenodd"
            clipRule="evenodd"
          >
            <path d="m3 7h17c.5523 0 1 .44772 1 1v11c0 .5523-.4477 1-1 1h-16c-.55228 0-1-.4477-1-1z"></path>
            <path d="m3 4.5c0-.27614.22386-.5.5-.5h6.29289c.13261 0 .25981.05268.35351.14645l2.8536 2.85355h-10z"></path>
          </g>
        </svg>
        <span className="lableNote">Nouvelle Note</span>
      </button>
      <div className="cal">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600, width: 1400, marginTop: 20, marginLeft: 200 }}
          selectable={true}
          onSelectEvent={handleEventClick} // Attach the click handler
        />
      </div>
      <Modal
        isOpen={modalIsOpen && selectedModal === "NouvelleNote"}
        onRequestClose={closeModal}
        contentLabel="Nouvelle Note Modal"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <NouvelleNote closeModal={closeModal} />
      </Modal>
      <Modal
        isOpen={modalIsOpen && selectedModal === "NoteDisplay"}
        onRequestClose={closeModal}
        contentLabel="Note Details Modal"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        {selectedNote && (
          <NoteDisplay
            note={selectedNote}
            onClose={closeModal}
          />
        )}
      </Modal>
    </div>
  );
}

export default CalendrierNote;
