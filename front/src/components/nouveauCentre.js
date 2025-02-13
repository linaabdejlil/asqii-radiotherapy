import '../style/nouveauCentre.css';
import React, { useState } from 'react';
import axios from 'axios';


function NouveauCentre({ closeModalNouveauCentre }) {
  const [newCentreNom, setNewCentreNom] = useState('');
  const [newCentreLocalisation, setNewCentreLocalisation] = useState('');
  const [newCentreMail, setNewCentreMail] = useState('');
  const [newCentreNumTel, setNewCentreNumTel] = useState('');

 

  const annuler = async () => {
    window.location.reload()

  };

  const handleAddCentre = async () => {
    try {
      // Send a POST request to add a new patient
      const response = await axios.post(`centreTraitements/add`, {
        nom: newCentreNom,
        localisation: newCentreLocalisation,
        mail: newCentreMail,
        numTel: newCentreNumTel,

     

      });

      console.log('centre de traitement added successfully:', response.data);

      setNewCentreNom('');
      setNewCentreLocalisation('');
      setNewCentreMail('');
      setNewCentreNumTel('');

      

      window.location.reload()


    } catch (error) {
      console.error('Error adding centre de traitement:', error);
    }
  };

  return (
    <div className="boxCentre">
      <div className="groupCentre">
        <div className="overlapCentre">
          <div className="nouveau-Centre-wrapperCentre">
            <div className="nouveau-Centre">NOUVEAU Centre De Traitement</div>
          </div>
          <div className="nomCentre">Nom</div>
        <input className="inputnomCentre" value={newCentreNom} onChange={(e) => setNewCentreNom(e.target.value)} />
        <div className="localisationCentre">Localisation</div>
        <input className="inputlocalisationCentre" value={newCentreLocalisation} onChange={(e) => setNewCentreLocalisation(e.target.value)} />
        <div className="mailCentre">Email</div>
        <input className="inputmailCentre" value={newCentreMail} onChange={(e) => setNewCentreMail(e.target.value)} />
        <div className="numTelCentre">Num Tel</div>
        <input className="inputnumTelCentre" value={newCentreNumTel} onChange={(e) => setNewCentreNumTel(e.target.value)} />
    
        <div className="divNouveauCentre">
          <button className="champ-textNouveauCentre" onClick={handleAddCentre}>
            <label className="text-wrapperNouveauCentre">Valider</label>
          </button>
          <button className="div-wrapperNouveauCentre" onClick={annuler}>
            <label className="text-wrapperNouveauCentre">Annuler</label>
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default NouveauCentre;
