import React, { useState, useEffect, useRef } from "react";
import "./Notes.css";

function SpeechToText({ userData }) {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState(
    "Press the button and start speaking"
  );
  const [files, setFiles] = useState([]);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  
  useEffect(() => {
    //Vérification de la Disponibilité de l'API=>Cela vérifie si le navigateur supporte webkitSpeechRecognition.
    if ("webkitSpeechRecognition" in window) {
      //Création d'une Instance de Reconnaissance Vocale
      const recognition = new window.webkitSpeechRecognition();
      //La reconnaissance vocale continue d'écouter jusqu'à ce qu'elle soit explicitement arrêtée.
      recognition.continuous = true;
      //Permet d'obtenir des résultats intermédiaires pendant la reconnaissance.
      recognition.interimResults = true;
      // Définit la langue de la reconnaissance vocale au français.
      recognition.lang = "fr-FR";

      //onresult : Un événement déclenché à chaque fois que des résultats de reconnaissance vocale sont disponibles.
      recognition.onresult = (event) => {
        //Convertit les résultats en un texte complet.
        const newTranscript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setRecognizedText(newTranscript); // Remplace l'ancien texte au lieu d'ajouter
      };

      recognitionRef.current = recognition; // Sauvegarde la référence pour une utilisation ultérieure
    }
  }, []);
  //Démarrage et Arrêt de la Reconnaissance Vocale :
  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (recognition) {
      if (!isListening) {
        //Démarre la reconnaissance vocale.
        recognition.start();
      } else {
        recognition.stop();
      }
      setIsListening((prevState) => !prevState);
    }
  };

 
  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
    setRecognizedText(
      (prevText) =>
        `${prevText}\nAttached files: ${selectedFiles
          .map((file) => file.name)
          .join(", ")}`
    );
  };
  return (
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
        <button
          style={{ marginLeft: -60, marginRight: 20 }}
          title="Joindre un fichier"
          onClick={() => fileInputRef.current.click()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
            <path
              fill="rgb(244, 244, 250)"
              d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384v38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm16 80c0-8.8-7.2-16-16-16s-16 7.2-16 16v48H368c-8.8 0-16 7.2-16 16s7.2 16 16 16h48v48c0 8.8 7.2 16 16 16s16-7.2 16-16V384h48c8.8 0 16-7.2 16-16s-7.2-16-16-16H448V304z"
            />
          </svg>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          multiple
          onChange={handleFileSelect}
        />
        <div
          className="rapportspeachtotext"
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => setRecognizedText(e.currentTarget.textContent)}
        >
          {recognizedText}
          {files.map((file, index) => (
            <div key={index}>{file.name}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SpeechToText;
