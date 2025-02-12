import axios from 'axios';
import React, { useEffect, useState } from 'react';

function ProtectedComponent() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fonction asynchrone pour récupérer les données de la route protégée
    const fetchData = async () => {
      try {
        // Récupérer le jeton JWT du stockage local
        const token = localStorage.getItem('token');

        const response = await axios.get('http://localhost:4001/users/protected', {
          headers: {
            Authorization: ` ${token}`
          }
        });
        
        // Mettre à jour l'état userData avec les données reçues
        setUserData(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données protégées:', error);
        // Définir userData sur null en cas d'erreur
        setUserData(null);
      }
    };

    // Appeler la fonction fetchData pour récupérer les données de la route protégée
    fetchData();
  }, []); // Utilisez un tableau vide de dépendances pour exécuter cette fonction une seule fois après le montage du composant

  return (
    <div>
      {userData ? (
        <div>
          <h1>Données de l'utilisateur protégées:</h1>
          <p>Message: {userData.message}</p>
          <p>Utilisateur: {JSON.stringify(userData.user)}</p>
        </div>
      ) : (
        <p>Chargement en cours...</p>
      )}
    </div>
  );
}

export default ProtectedComponent;
