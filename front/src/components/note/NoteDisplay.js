import React from 'react';

const NoteDisplay = ({ note, onClose }) => {
  const { titre, type, contenu, rappel, fichiers = [] } = note;

  const handleRedirect = (url) => {
    // Open the file link in a new tab
    window.open(url, '_blank');
  };

  return (
    <div className="cardNote">
      <div className="contentNote">
      <button
              style={{ marginLeft: 300 , marginTop: -50}}
              className="exit-button"
              onClick={onClose}
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
           
          />
          <input
            type="radio"
            name="selecttype"
            id="publique"
            checked={type === "publique"}
            
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
            value={titre}
            readOnly
          />
        </div>

        <div className="speech-to-text-container" style={{marginLeft: 110}}>
          <div className="rapportspeachtotext">
            {contenu}
          </div>
        </div>

        <div className="containerNoteFile">
          {fichiers.length > 0 ? (
            fichiers.map((fichier, index) => (
              <div key={index} className="cardNoteFile">
                {/* Display the file based on its type */}
                {fichier.type.startsWith("image/") && (
                  <img
                    src={fichier.lien}
                    alt={`Image ${index}`}
                    style={{ maxWidth: "100%", marginTop: "10px", cursor: 'pointer' }}
                    onClick={() => handleRedirect(fichier.lien)}
                  />
                )}
                {fichier.type === "application/pdf" && (
                  <div
                    style={{ cursor: 'pointer', marginTop: "10px" }}
                    onClick={() => handleRedirect(fichier.lien)}
                  >
                    <p>PDF File (Click to view)</p>
                  </div>
                )}
                {fichier.type.startsWith("text/") && (
                  <iframe
                    src={fichier.lien}
                    style={{ width: "100%", height: "300px", cursor: 'pointer' }}
                    onClick={() => handleRedirect(fichier.lien)}
                  />
                )}
                {!fichier.type.startsWith("image/") && fichier.type !== "application/pdf" && !fichier.type.startsWith("text/") && (
                  <div className="unsupported-file">
                    <p>Unsupported file type: {fichier.type}</p>
                    <a
                      href={fichier.lien}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="download-link"
                      onClick={(e) => e.preventDefault()} // Prevent default action
                    >
                      View
                    </a>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="cardNoteFile">
              <p>No files attached.</p>
            </div>
          )}
        </div>

       
      </div>
    </div>
  );
};

export default NoteDisplay;
