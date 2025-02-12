import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import axios from "axios";
import NoteTime from "./noteTime";
import "./Notes.css";
import { useNavigate } from "react-router-dom";

function NouvelleNote({ closeModal }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedModal, setSelectedModal] = useState(null);
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [rappel, setRappel] = useState("");
  const [type, setType] = useState("privé"); // Defaulting to 'privé'
  const [selectedFiles, setSelectedFiles] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("Press the button and start speaking");
  const recognitionRef = useRef(null);
  const speechToTextRef = useRef(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "fr-FR";
  
      recognition.onresult = (event) => {
        const newTranscript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setRecognizedText(newTranscript);
      };
  
      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        alert("An error occurred during speech recognition. Please try again.");
      };
  
      recognitionRef.current = recognition;
    }
  }, []);
  

  useEffect(() => {
    if (!isListening) {
      setCursorToEnd();
    }
  }, [isListening]);

  const setCursorToEnd = () => {
    const el = speechToTextRef.current;
    if (el) {
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(el);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
      el.focus();
    }
  };

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (recognition) {
      if (!isListening) {
        recognition.start();
      } else {
        recognition.stop();
      }
      setIsListening((prevState) => !prevState);
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const triggerFileSelect = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileClick = (file) => {
    navigate("/FileViewer", { state: { file } });
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

    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:4001/notes/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${token}`, // Assurez-vous d'utiliser 'Bearer' pour les tokens
          },
        }
      );

      console.log(response.data);
      window.location.reload();
      setLoading(false);
      setTitre("");
      setContenu("");
      setRappel("");
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error creating note:", error);
      setLoading(false);
      alert("Failed to create the note. Please try again.");
    }
  };

  const handleNoteTimeSelect = (selectedTime) => {
    setRappel(selectedTime); // Met à jour l'état 'rappel'
    closeModalNoteTime(); // Ferme la modale après sélection
  };

  const openModalNoteTime = () => {
    setSelectedModal("noteTime");
    setModalIsOpen(true);
  };

  const closeModalNoteTime = () => {
    setSelectedModal(null);
    setModalIsOpen(false);
  };

  return (
    <div className="cardNote">
      <div className="contentNote">
      <button
              style={{ marginLeft: 300 , marginTop: -50}}
              className="exit-button"
              onClick={closeModal}
            >
              <span className="line"></span>
              <span className="line"></span>
            </button>
        <div className="type" style={{ marginTop: -465, marginLeft: -140 }}>
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
          <input
            className="inputtitreNote"
            type="text"
            placeholder="Entrer un titre pour votre note"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
          />
        </div>

        <div className="speech-to-text-container">
          <div className="speech-control-container">
            <button onClick={toggleListening} className="bouttonListening">
              {isListening ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  <path
                    fill="#1b50ff"
                    d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z"
                  />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                  <path
                    fill="#1b50ff"
                    d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L472.1 344.7c15.2-26 23.9-56.3 23.9-88.7V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 21.2-5.1 41.1-14.2 58.7L416 300.8V96c0-53-43-96-96-96s-96 43-96 96v54.3L38.8 5.1zm362.5 407l-43.1-33.9C346.1 382 333.3 384 320 384c-70.7 0-128-57.3-128-128v-8.7L144.7 210c-.5 1.9-.7 3.9-.7 6v40c0 89.1 66.2 162.7 152 174.4V464H248c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H344V430.4c20.4-2.8 39.7-9.1 57.3-18.2z"
                  />
                </svg>
              )}
            </button>

            <div
  className="rapportspeachtotext"
  contentEditable
  suppressContentEditableWarning
  ref={speechToTextRef}
  onInput={(e) => {
    setRecognizedText(e.currentTarget.textContent);
    setContenu(e.currentTarget.textContent); // Met à jour l'état 'contenu'
    setCursorToEnd(); // Maintient le curseur à la fin
  }}
>
  {recognizedText}
</div>

          </div>
        </div>

        <div className="containerNoteFile">
          {selectedFiles.length > 0 ? (
            selectedFiles.map((file, index) => (
              <div key={index} className="cardNoteFile" onClick={() => handleFileClick(file)}>
                {file.type.startsWith("image/") && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    style={{ maxWidth: "100%", marginTop: "10px" }}
                  />
                )}
                {file.type === "application/pdf" && (
                  <embed
                    src={URL.createObjectURL(file)}
                    type="application/pdf"
                    width="100%"
                    height="500px"
                  />
                )}
                {file.type.startsWith("text/") && (
                  <iframe
                    src={URL.createObjectURL(file)}
                    style={{ width: "100%", height: "300px" }}
                  />
                )}
                {!file.type.startsWith("image/") && file.type !== "application/pdf" && !file.type.startsWith("text/") && (
                  <div className="unsupported-file">
                    <p>Unsupported file type: {file.name}</p>
                    <a
                      href={URL.createObjectURL(file)}
                      download={file.name}
                      className="download-link"
                    >
                      Download {file.name}
                    </a>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="cardNoteFile">
              <p>No files selected yet.</p>
            </div>
          )}
          <div className="cardNoteFile">
            <div className="addFileNote" onClick={triggerFileSelect}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p>Browse Files to upload!</p>
            </div>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleFileSelect}
              multiple
            />
          </div>
        </div>

        <div className="actions-row" style={{ marginTop: -30 }}>
        <button
        className="ajouterNote"
        onClick={openModalNoteTime}
        style={{ marginLeft: 115, width: 400, height: 40 }}
        disabled={loading}
      >
        Choisir date et temps pour vous rappeler du note
      </button>
      <input
      className="inputNoteTime"
      type="datetime-local"
      value={rappel}
      onChange={(e) => {
        // Validate if the input is a correct date-time string
        const dateValue = new Date(e.target.value);
        if (!isNaN(dateValue.getTime())) {
          setRappel(e.target.value);
        } else {
          console.error("Invalid date format");
        }
      }}
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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
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

export default NouvelleNote;
