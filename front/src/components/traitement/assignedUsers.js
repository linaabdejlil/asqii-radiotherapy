import React, { useEffect, useState } from "react";
import axios from "axios";
import MEDECIN from "./medecin";
import Modal from "react-modal";

function AssignedUsers({ patientId }) {
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedModal, setSelectedModal] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  const openModalMedecin = (modalType, patientId) => {
    console.log(modalType, patientId);
    setSelectedModal(modalType);
    setSelectedPatientId(patientId);
    setModalIsOpen(true);
  };
  const closeModalMedecin = () => {
    setSelectedModal(null);
    setSelectedPatientId(null);

    setModalIsOpen(false);
  };

  useEffect(() => {
    const fetchAssignedUsers = async () => {
      try {
        const response = await axios.get(
          `patients/assigned-users/${patientId}`
        );
        setAssignedUsers(response.data);
      } catch (error) {
        console.error("Error fetching assigned users:", error);
      }
    };

    fetchAssignedUsers();
  }, [patientId]);

  return (
    <div className="avatar-group">
      {assignedUsers.map((user) => (
        <div key={user.id} className="avatar avatar-sm">
          {user.image && (
            <img
              src={user.image}
              alt={`${user.nom} ${user.prenom}`}
              className="rounded-circle"
            />
          )}
          <div className="overlay">
            {user && `${user.nom}`} {user && `${user.prenom}`}
          </div>
        </div>
      ))}
      <div className="avatar avatar-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="rounded-circle"
          onClick={() => openModalMedecin("medecin", patientId)}
        >
          <path
            fill="#cbd5de"
            d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"
          />
        </svg>
        <div className="overlay">Ajouter</div>
      </div>
      <Modal
        isOpen={modalIsOpen && selectedModal === "medecin"}
        onRequestClose={closeModalMedecin}
        contentLabel="medecin Modal"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <MEDECIN closeModal={closeModalMedecin} patientId={selectedPatientId} />
      </Modal>
    </div>
  );
}

export default AssignedUsers;
