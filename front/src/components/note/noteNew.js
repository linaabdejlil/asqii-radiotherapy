import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import NoteTime from "./noteTime";
import "./Notes.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faFilePen, faRobot } from "@fortawesome/free-solid-svg-icons";
import SpeechToTextDemo from "./speachToText";
import NoteManuel from "./noteManuel";
import ChatComponent from "./ChatComponent";

function NoteNew({ report, setReport, userData, handleValueClick, refreshNotes }) {
  const [selectedIcon, setSelectedIcon] = useState("microphone");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedModal, setSelectedModal] = useState(null);
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [rappel, setRappel] = useState("");
  const [type, setType] = useState("privé"); // Defaulting to 'privé'
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titre || !contenu) {
      alert("Please fill in both the title and content fields.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("titre", titre);
    formData.append("contenu", contenu);
    formData.append("rappel", rappel);
    formData.append("type", type);

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage

      const response = await axios.post(
        "notes/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${token}`, // Ensure Bearer token format
          },
        }
      );

      console.log(response.data);
      refreshNotes();
      setLoading(false);

      // Reset form fields after successful submission
      setTitre("");
      setContenu("");
      setRappel("");
      setFiles([]);
    } catch (error) {
      console.error("Error creating note:", error);
      setLoading(false);
      alert("Failed to create the note. Please try again.");
    }
  };

  const handleNoteTimeSelect = (noteTime) => {
    setRappel(noteTime);
  };

  const openModalNoteTime = (modalType) => {
    setSelectedModal(modalType);
    setModalIsOpen(true);
  };

  const closeModalNoteTime = () => {
    setSelectedModal(null);
    setModalIsOpen(false);
  };

  const renderComponent = () => {
    switch (selectedIcon) {
      case "microphone":
        return <SpeechToTextDemo userData={userData} />;
      case "pen":
        return (
          <NoteManuel
            report={report}
            setReport={setReport}
            userData={userData}
            handleValueClick={handleValueClick}
          />
        );
      case "robot":
        return <ChatComponent userData={userData} />;
      default:
        return null;
    }
  };

  return (
    <div className="cardNote">
      <div className="contentNote">
        <div className="choixOutil">
          {["microphone", "pen", "robot"].map((icon) => (
            <button
              key={icon}
              className={`btnNote ${selectedIcon === icon ? "active" : ""}`}
              onClick={() => setSelectedIcon(icon)}
            >
              <FontAwesomeIcon
                icon={
                  icon === "pen"
                    ? faFilePen
                    : icon === "microphone"
                    ? faMicrophone
                    : faRobot
                }
              />
            </button>
          ))}
        </div>

        <div className="type" style={{ marginTop: -465, marginLeft: 410 }}>
          <input
            type="radio"
            name="selecttype"
            id="privé"
            checked={type === "privé"}
            onChange={() => setType("privé")}
          />
          <input
            type="radio"
            name="selecttype"
            id="publique"
            checked={type === "publique"}
            onChange={() => setType("publique")}
          />
          <label htmlFor="privé" className="optiontype privé">
            <span>privé</span>
          </label>
          <label htmlFor="publique" className="optiontype publique">
            <span>publique</span>
          </label>
        </div>

        <div className="titreNote">
          <div className="titreNotetitre">Titre</div>
          <input
            className="inputtitreNote"
            type="text"
            placeholder="Entrer un titre pour votre note"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
          />
        </div>

        <div className="rapportGenerer">{renderComponent()}</div>

        <div>
          <label>Files:</label>
          <input type="file" multiple onChange={handleFileChange} />
        </div>

        <div className="actions-row" style={{ marginTop: -30 }}>
          <button
            className="ajouterNote"
            onClick={() => openModalNoteTime("noteTime")}
            style={{ marginLeft: 115, width: 400, height: 40 }}
            disabled={loading}
          >
            Choisir date et temps pour vous rappeler du note
          </button>
          <input
            className="inputNoteTime"
            type="text"
            value={rappel}
            onChange={(e) => setRappel(e.target.value)}
          />
          <button
            className="ajouterNote"
            style={{ marginLeft: -40, width: 150, height: 40 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span>Loading...</span>
            ) : (
              <>
                <div className="svg-wrapper-1">
                  <div className="svg-wrapper">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path
                        fill="currentColor"
                        d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                      ></path>
                    </svg>
                  </div>
                </div>
                <span>Note</span>
              </>
            )}
          </button>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen && selectedModal === "noteTime"}
        onRequestClose={closeModalNoteTime}
        contentLabel="Note Time Modal"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <NoteTime
          closeModal={closeModalNoteTime}
          onNoteTimeSelect={handleNoteTimeSelect}
        />
      </Modal>
    </div>
  );
}

export default NoteNew;
