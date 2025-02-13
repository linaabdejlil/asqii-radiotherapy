import "../../style/medecin.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

function Medecin({ closeModal1, patientId }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]); // Suivre les lignes sélectionnées

  const annuler = async () => {
    window.location.reload();
  };

  useEffect(() => {
    fetchData();
  }, []); // Dependency array left empty to run only once on mount

  const fetchData = async () => {
    try {
      // Assuming you have the token stored in localStorage or a similar place
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "users/getSurgeonsRadiologists",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the authorization header
          },
        }
      );
      setUsers(response.data); // Assume response.data is the array of users
      setFilteredUsers(response.data); // Set filtered users initially to all users
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data"); // Optionally, inform the user of the failure
    }
  };

  const handleSearch = (event) => {
    const searchText = event.target.value.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.nom.toLowerCase().includes(searchText) ||
        user.prenom.toLowerCase().includes(searchText) ||
        user.role.toLowerCase().includes(searchText)
    );
    setFilteredUsers(filtered);
  };

  const handleAffecterMedecin = async () => {
    try {
      if (!patientId) {
        console.error("PatientId is not defined");
        return;
      }

      // Vérifier si des utilisateurs sont sélectionnés
      if (selectedRows.length === 0) {
        console.error("No users selected");
        return;
      }

      // Récupérer les IDs des utilisateurs sélectionnés
      const selectedUserIds = selectedRows.map((row) => row.id);

      // Envoyer une requête POST au localhost pour affecter les utilisateurs sélectionnés à un patient
      await axios.post(
        `patients/assign-users/${patientId}`,
        {
          userIds: selectedUserIds,
        }
      );

      // Recharger la page après l'affectation
      window.location.reload();
    } catch (error) {
      console.error("Error while assigning users to patient:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleCheckboxChange = (event, user) => {
    const checked = event.target.checked;
    if (checked) {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, user]);
      console.log("User selected:", user);
    } else {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((selectedUser) => selectedUser.id !== user.id)
      );
    }
  };

  return (
    <div className="boxMedecin">
      <div className="groupMedecin">
        <div className="nouveau-Medecin-wrapperMedecin">
          <div className="nouveau-Medecin">Les Medecin Referents</div>
        </div>

        <div className="groupSearch" style={{ marginTop: 80, marginLeft: 180 }}>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="iconSearch">
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
          </svg>
          <input
            style={{ width: 500 }}
            className="inputSearch"
            id="search"
            type="text"
            placeholder="Enter name, prenom, or role"
            onChange={handleSearch}
          />
        </div>

        <Paper
          sx={{ width: "80%", marginLeft: 10, marginTop: 2 }}
          className="Tableau"
        >
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader aria-label="sticky table">
              <thead className="sticky-header">
                <tr>
                  <th>choix</th>
                  <th>Nom & Prenom</th>
                  <th>Role</th>
                </tr>
              </thead>
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <tr key={user.id}>
                      <td style={{ width: 30 }}>
                        <label className="container">
                          <input
                            type="checkbox"
                            onChange={(event) =>
                              handleCheckboxChange(event, user)
                            }
                          />
                          <div className="checkmark"></div>
                        </label>
                      </td>
                      <td>
                        <img
                          alt=""
                          src={user.image}
                          className="avatar avatar-sm rounded-circle"
                        />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {user.nom} {user.prenom}
                      </td>
                      <td>{user.role}</td>
                    </tr>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        <div className="divMedecin">
          <button className="champ-textMedecin" onClick={handleAffecterMedecin}>
            <label className="text-wrapperMedecin">Valider</label>
          </button>
          <button className="div-wrapperMedecin" onClick={annuler}>
            <label className="text-wrapperMedecin">Annuler</label>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Medecin;
