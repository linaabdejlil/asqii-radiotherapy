import "../../style/patient.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

function ModifierPatient({ closeModal, patientId }) {
  // État pour les données du patient
  const [patientData, setPatientData] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    sexe: "",
    mail: "",
    numTel: "",
    autres: "",
    adresse: "",
    DMI: "",
    Cin: "",
    securiteSociale: "",
    nationalite: ""
  });

  // Charger les données du patient au démarrage
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`patients/${patientId}`);
        const data = response.data;

        // Format date to yyyy-MM-dd
        const formattedDateNaissance = new Date(data.dateNaissance).toISOString().split('T')[0];
        
        setPatientData({
          ...data,
          dateNaissance: formattedDateNaissance
        });
      } catch (error) {
        console.error("Erreur lors du chargement des données du patient :", error);
      }
    };

    fetchPatientData();
  }, [patientId]);

  // Fonction pour gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData({ ...patientData, [name]: value });
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`patients/updatePatient/${patientId}`, patientData);
      closeModal();
      window.location.reload(); // Refresh the page (or trigger a fetch if you prefer to update the UI without a reload)

    } catch (error) {
      console.error("Erreur lors de la mise à jour du patient :", error);
    }
  };

  // Fonction pour annuler les modifications et fermer le modal
  const annuler = () => {
    closeModal();
  };

  return (
    <div className="boxPatient">
      <div className="groupPatient">
        <div className="overlapPatient">
          <div className="nouveau-patient-wrapperPatient">
            <div className="nouveau-patient">MODIFIER PATIENT</div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="divPatient">
              <button className="champ-textPatient" type="submit">
                <label className="text-wrapperPatient">Valider</label>
              </button>
              <button className="div-wrapperPatient" onClick={annuler} type="button">
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
                name="nom"
                value={patientData.nom}
                onChange={handleChange}
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
                name="prenom"
                value={patientData.prenom}
                onChange={handleChange}
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
                name="mail"
                value={patientData.mail}
                onChange={handleChange}
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
                  name="dateNaissance"
                  value={patientData.dateNaissance}
                  onChange={handleChange}
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
                name="Cin"
                value={patientData.Cin}
                onChange={handleChange}
              />
            </div>

            <div className="wrapperg">
              <input
                type="radio"
                name="sexe"
                id="option-1"
                value="homme"
                checked={patientData.sexe === "homme"}
                onChange={handleChange}
              />
              <input
                type="radio"
                name="sexe"
                id="option-2"
                value="femme"
                checked={patientData.sexe === "femme"}
                onChange={handleChange}
              />
              <label htmlFor="option-1" className="option option-1">
                <span>Homme</span>
              </label>
              <label htmlFor="option-2" className="option option-2">
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
                name="DMI"
                value={patientData.DMI}
                onChange={handleChange}
              />
            </div>
            <div className="group-12Patient">
              <div className="group-13Patient">
                <div className="s-curit-sociale-wrapperPatient">
                  <label className="text-wrapper-4Patient">Sécurité Sociale</label>
                </div>
              </div>
              <select
                className="rectanglePatientS"
                name="securiteSociale"
                value={patientData.securiteSociale}
                onChange={handleChange}
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
              name="numTel"
              value={patientData.numTel}
              onChange={handleChange}
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
                name="adresse"
                value={patientData.adresse}
                onChange={handleChange}
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
                name="nationalite"
                value={patientData.nationalite}
                onChange={handleChange}
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
                name="autres"
                value={patientData.autres}
                onChange={handleChange}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModifierPatient;
