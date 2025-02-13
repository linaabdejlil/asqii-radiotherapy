import "../../style/patient.css";
import React, { useState } from "react";
import axios from "axios";

function Patient({ closeModal1 }) {
  const [newPatientNom, setNewPatientNom] = useState("");
  const [newPatientPrenom, setNewPatientPrenom] = useState("");
  const [newPatientMail, setNewPatientMail] = useState("");
  const [newPatientNumTel, setNewPatientNumTel] = useState("");
  const [newPatientAutres, setNewPatientAutres] = useState("");
  const [newPatientDateNaissance, setNewPatientDateNaissance] = useState("");
  const [newPatientSexe, setNewPatientSexe] = useState("homme"); // Default value set to 'homme'
  const [newPatientCin, setNewPatientCin] = useState("");
  const [newPatientAdresse, setNewPatientAdresse] = useState("");
  const [newPatientSecuriteSociale, setNewPatientSecuriteSociale] =
    useState("CNAM");
  const [newPatientDMI, setNewPatientDMI] = useState("");
  const [newPatientNationalite, setNewPatientNationalite] = useState("");

  const annuler = async () => {
    window.location.reload();
  };

  const handleAddPatient = async () => {
    try {
      // Send a POST request to add a new patient
      const response = await axios.post(`patients/add`, {
        nom: newPatientNom,
        prenom: newPatientPrenom,
        mail: newPatientMail,
        numTel: newPatientNumTel,
        autres: newPatientAutres,
        dateNaissance: newPatientDateNaissance,
        sexe: newPatientSexe,
        DMI: newPatientDMI,
        Cin: newPatientCin,
        adresse: newPatientAdresse,
        securiteSociale: newPatientSecuriteSociale,
        nationalite: newPatientNationalite,
      });

      // Handle the response or update the UI as needed
      console.log("Patient added successfully:", response.data);

      // Clear input fields after adding a patient
      setNewPatientNom("");
      setNewPatientPrenom("");
      setNewPatientMail("");
      setNewPatientNumTel("");
      setNewPatientAutres("");
      setNewPatientDateNaissance("");
      setNewPatientSexe("homme"); // Reset gender to 'homme'
      setNewPatientDMI("");
      setNewPatientCin("");
      setNewPatientAdresse("");
      setNewPatientSecuriteSociale("");
      setNewPatientNationalite("");

      window.location.reload();
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };

  return (
    <div className="boxPatient">
      <div className="groupPatient">
        <div className="overlapPatient">
          <div className="nouveau-patient-wrapperPatient">
            <div className="nouveau-patient">NOUVEAU PATIENT</div>
          </div>
          <div className="divPatient">
            <button className="champ-textPatient" onClick={handleAddPatient}>
              <label className="text-wrapperPatient">Valider</label>
            </button>
            <button className="div-wrapperPatient" onClick={annuler}>
              <label className="text-wrapperPatient">Annuler</label>
            </button>
          </div>
          <div className="group-2Patient">
            <div className="group-wrapperPatient">
              <div className="group-3Patient">
                <label className="text-wrapper-2Patient">Nom</label>
              </div>
            </div>
            <input
              type="text"
              className="rectanglePatient"
              placeholder="Enter nom du patient"
              value={newPatientNom}
              onChange={(e) => setNewPatientNom(e.target.value)}
            />
          </div>
          <div className="rectangle-2Patient" />
          <div className="group-4Patient">
            <div className="group-5Patient">
              <div className="group-6Patient">
                <label className="text-wrapper-3Patient">Prénom</label>
              </div>
            </div>
            <input
              type="text"
              className="rectanglePatient"
              placeholder="Enter prenom du patient"
              value={newPatientPrenom}
              onChange={(e) => setNewPatientPrenom(e.target.value)}
            />
          </div>
          <div className="group-7Patient">
            <div className="group-wrapperPatient">
              <div className="group-3Patient">
                <label className="text-wrapper-2Patient">Email</label>
              </div>
            </div>
            <input
              className="rectanglePatient"
              placeholder="Entrer adresse mail du patient"
              value={newPatientMail}
              onChange={(e) => setNewPatientMail(e.target.value)}
            />
          </div>
          <div className="overlap-group-wrapperPatient">
            <div className="overlap-groupPatient">
              <div className="group-8Patient">
                <div className="date-de-naissance-wrapperPatient">
                  <label className="date-de-naissancePatient">DDN</label>
                </div>
              </div>
              <input
                type="date"
                className="rectanglePatient"
                value={newPatientDateNaissance}
                onChange={(e) => setNewPatientDateNaissance(e.target.value)}
              />
            </div>
          </div>
          <div className="group-9Patient">
            <div className="group-10Patient">
              <div className="group-3Patient">
                <label className="text-wrapper-2Patient">CIN</label>
              </div>
            </div>
            <input
              type="text"
              className="rectanglePatient"
              placeholder="Entrer Numéro du carte CIN du patient"
              value={newPatientCin}
              onChange={(e) => setNewPatientCin(e.target.value)}
            />
          </div>

          <div className="wrapperg">
            <input
              type="radio"
              name="select"
              id="option-1"
              checked={newPatientSexe === "homme"}
              onChange={() => setNewPatientSexe("homme")}
            />
            <input
              type="radio"
              name="select"
              id="option-2"
              checked={newPatientSexe === "femme"}
              onChange={() => setNewPatientSexe("femme")}
            />
            <label for="option-1" className="option option-1">
              <span>Homme</span>
            </label>
            <label for="option-2" className="option option-2">
              <span>Femme</span>
            </label>
          </div>
          <div className="group-11Patient">
            <div className="group-wrapperPatient">
              <div className="group-3Patient">
                <label className="text-wrapper-2Patient">DMI</label>
              </div>
            </div>
            <input
              type="text"
              className="rectanglePatient"
              placeholder="Enter dossier médical informatisé"
              value={newPatientDMI}
              onChange={(e) => setNewPatientDMI(e.target.value)}
            />
          </div>
          <div className="group-12Patient">
            <div className="group-13Patient">
              <div className="s-curit-sociale-wrapperPatient">
                <label className="text-wrapper-4Patient">
                  Sécurité Sociale
                </label>
              </div>
            </div>
            <select
              className="rectanglePatientS"
              value={newPatientSecuriteSociale}
              onChange={(e) => setNewPatientSecuriteSociale(e.target.value)}
            >
              <option value="CNAM">CNAM</option>
              <option value="CI">CI</option>
              <option value="Payant">Payant</option>
              <option value="Assurance privée">Assurance privée</option>
              <option value="Malade étranger">Malade étranger</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <input
            type="text"
            className="rectangle-5Patient"
            placeholder="20 230 589"
            value={newPatientNumTel}
            onChange={(e) => setNewPatientNumTel(e.target.value)}
          />
          <div className="rectangle-6Patient" />
          <div className="group-14Patient">
            <div className="group-15Patient">
              <div className="group-16Patient">
                <label className="text-wrapper-5Patient">Adresse</label>
              </div>
            </div>
            <input
              type="text"
              className="rectangle-7Patient"
              placeholder="Enter adresse du patient"
              value={newPatientAdresse}
              onChange={(e) => setNewPatientAdresse(e.target.value)}
            />
          </div>
          <div className="group-NPatient">
            <div className="group-15Patient">
              <div className="group-16Patient">
                <label className="text-wrapper-5Patient">Nationalité</label>
              </div>
            </div>
            <input
              type="text"
              className="rectangle-7Patient"
              placeholder="Enter nationalité du patient"
              value={newPatientNationalite}
              onChange={(e) => setNewPatientNationalite(e.target.value)}
            />
          </div>
          <div className="group-17Patient">
            <div className="group-15Patient">
              <div className="group-16Patient">
                <label className="text-wrapper-5Patient">Autre</label>
              </div>
            </div>
            <input
              type="textarea"
              className="rectangle-8Patient"
              placeholder="Enter autre remarque pour patient"
              value={newPatientAutres}
              onChange={(e) => setNewPatientAutres(e.target.value)}
            />
          </div>
          <div className="group-18Patient">
            <label className="text-wrapper-2Patient">Genre</label>
          </div>
          <div className="num-ro-de-telephone-wrapperPatient">
            <label className="text-wrapper-4Patient">Num Tel</label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Patient;
