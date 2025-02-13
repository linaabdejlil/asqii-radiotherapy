import React, { useState } from "react";
import axios from "axios";

function SupprimerUser({ closeModal, userId }) {
  const [error, setError] = useState(null);

  const annuler = () => {
    closeModal();
  };

  const supprimerUser = async () => {
    try {
      // Retrieve the token from local storage
      const token = localStorage.getItem("token");

      // Configure axios to include the token in the request headers
      const config = {
        headers: {
          Authorization: `${token}`,
        },
      };

      // Sending a DELETE request to the backend to delete the user
      await axios.delete(
        `users/deleteUser/${userId}`,
        config
      );

      // Close the modal after successful deletion
      closeModal();
      window.location.reload();
    } catch (error) {
      setError(
        "Une erreur s'est produite lors de la suppression du utilisateur."
      );
    }
  };

  return (
    <div className="group select-none w-[435px] flex flex-col p-4 relative items-center justify-center bg-gray-800 border border-gray-800 shadow-lg rounded-2xl">
      <div className="">
        <div className="text-center p-3 flex-auto justify-center">
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            className="group-hover:animate-bounce w-12 h-12 flex items-center text-gray-600 fill-red-500 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              fillRule="evenodd"
            ></path>
          </svg>
          <h2 className="text-xl font-bold py-4 text-gray-200">
            Vous êtes sûr ?
          </h2>
          <p className="font-bold text-sm text-gray-500 px-2">
            Vous pouvez vraiment supprimer cet utilisateur ? <br></br>Ce
            processus ne peut pas être annulé.
          </p>
        </div>
        <div className="p-2 mt-2 text-center space-x-1 md:block">
          <button
            onClick={annuler}
            className="mb-2 mr-6 md:mb-0 bg-gray-700 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border-2 border-gray-600 hover:border-gray-700 text-gray-300 rounded-full hover:shadow-lg hover:bg-gray-800 transition ease-in duration-300"
          >
            Annuler
          </button>
          <button
            onClick={supprimerUser}
            className="bg-red-500  hover:bg-transparent px-5 ml-4 py-2 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-red-500 hover:border-red-500 text-white hover:text-red-500 rounded-full transition ease-in duration-300"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}

export default SupprimerUser;
