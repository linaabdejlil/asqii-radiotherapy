// App.js
import "./App.css";
import React from "react";
import { createContext, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Patients from "./components/traitement/Patient";
import Calendar from "./components/traitement/calendar";

import Dashboard from "./components/traitement/dashboard"; // Import the Dashboard component
import Prescriptions from "./components/preTraitement/prescription";
import Global from "./components/traitement/global";
import LeftBar from "./components/backOffice/leftBar";

import Profile from "./components/user/profile";
import Tab from "./components/traitement/tab";
import Nav from "./components/nav";

// import Messages from './components/messagerie/messages';
// import Chat from './components/messagerie/chat';

import SignupUser from "./components/user/signupUser";
import SignupAdmin from "./components/backOffice/signupAdmin";
import SigninAdmin from "./components/backOffice/signinAdmin";
import DashboardAdmin from "./components/backOffice/dashboardAdmin";
import CentreTraitement from "./components/backOffice/centreTraitement";
import Statistiques from "./components/backOffice/statistiques";
import ListCentreTraitement from "./components/backOffice/listCentreTraitement";
import GestionUser from "./components/backOffice/GestionUser";
import GestionPatient from "./components/backOffice/gestionPatient";
import GestionRDV from "./components/backOffice/gestionRDV";
import Messageries from "./components/backOffice/messageries";

import AffichageCentreTraitement from "./components/backOffice/affichageCentreTraitement";
import Notification from "./components/backOffice/notificationList";

import Discussions from "./pages/discussion";
import DiscussionBetweenTwoItem from "./components/Discussion/DiscussionBetweenTwoItem";
import Signin from "./components/user/signin";
import Messages from "./components/chat/Messages";
import Notes from "./components/note/notes";
import FileViewer from "./components/note/FileViewer";

import Statistique from "./components/statistique/statistique";
import Calendrier from "./components/calendrier";
import Form from "./components/form";
import axios from "axios";

export const RecoveryContext = createContext();
const formSchema = {
  type: "default",
  components: [],
};
axios.defaults.baseURL=process.env.REACT_APP_API_HOST

function App() {
  const isLoggedIn = localStorage.getItem("token");
  console.log(isLoggedIn); // Vérifie si l'utilisateur est connecté en vérifiant la présence du token JWT dans le stockage local
  const [page, setPage] = useState("signin");

  return (
    <RecoveryContext.Provider value={{ page, setPage }}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Signin />} />
            {1 ? (
              <Route path="/App" element={<Global />} />
            ) : (
              <Navigate to="/" />
            )}
            {1 ? (
              <Route path="/prescriptions" element={<Prescriptions />} />
            ) : (
              <Navigate to="/signin" />
            )}
            {/* {isLoggedIn ? (
              <Route path='/Messages' element={<Messages/>} />
            ) : (
              <Navigate to="/signin" />
            )} */}
            {/* {isLoggedIn ? (
              <Route path='/Chat' element={<Chat/>} />
            ) : (
              <Navigate to="/signin" />
            )} */}
            {1 ? (
              <>
                <Route path="/Discussions" element={<Discussions />}>
                  <Route path="u">
                    <Route path="" element={<Navigate to="/Discussions" />} />
                    <Route
                      path=":userID"
                      element={<DiscussionBetweenTwoItem />}
                    />
                  </Route>
                  <Route path="g">
                    <Route path="" element={<Navigate to="/Discussions" />} />
                    <Route
                      path=":groupID"
                      element={<DiscussionBetweenTwoItem />}
                    />
                  </Route>
                </Route>
              </>
            ) : (
              <Navigate to="/signin" />
            )}
            {1 ? (
              <Route path="/Nav" element={<Nav />} />
            ) : (
              <Navigate to="/signin" />
            )}
            <Route path="/form" element={<Form schema={formSchema} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/leftBar" element={<LeftBar />} />
            <Route path="/signupUser" element={<SignupUser />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/Tab" element={<Tab />} />
            <Route path="/SignupAdmin" element={<SignupAdmin />} />
            <Route path="/SigninAdmin" element={<SigninAdmin />} />
            <Route path="/DashboardAdmin" element={<DashboardAdmin />} />
            <Route path="/CentreTraitement" element={<CentreTraitement />} />
            <Route path="/Statistiques" element={<Statistiques />} />
            <Route path="/Messages" element={<Messages />} />
            <Route path="/Notes" element={<Notes />} />
            <Route path="/Statistique" element={<Statistique />} />
            <Route path="/Calendrier" element={<Calendrier />} />

            <Route path="/Calendar" element={<Calendar />} />
            <Route path="/FileViewer" element={<FileViewer />} />

            <Route
              path="/ListCentreTraitement"
              element={<ListCentreTraitement />}
            />
            <Route path="/GestionUser" element={<GestionUser />} />

            <Route
              path="/AffichageCentreTraitement"
              element={<AffichageCentreTraitement />}
            />

            <Route path="/GestionPatient" element={<GestionPatient />} />
            <Route path="/GestionRDV" element={<GestionRDV />} />
            {1 ? (
              <>
                <Route path="/Messageries" element={<Messageries />}>
                  <Route path="u">
                    <Route path="" element={<Navigate to="/Messageries" />} />
                    <Route
                      path=":userID"
                      element={<DiscussionBetweenTwoItem />}
                    />
                  </Route>
                  <Route path="g">
                    <Route path="" element={<Navigate to="/Messageries" />} />
                    <Route
                      path=":groupID"
                      element={<DiscussionBetweenTwoItem />}
                    />
                  </Route>
                </Route>
              </>
            ) : (
              <Navigate to="/SigninAdmin" />
            )}
            <Route
              path="/ListCentreTraitement"
              element={<ListCentreTraitement />}
            />
            <Route path="/Notifications" element={<Notification />} />

            <Route path="/" element={<DashboardAdmin />} />
          </Routes>
        </BrowserRouter>
      </div>
    </RecoveryContext.Provider>
  );
}

export default App;
