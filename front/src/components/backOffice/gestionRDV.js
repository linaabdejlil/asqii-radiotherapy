import React, { useState, useEffect } from "react";
import LeftBar from "./leftBar";
import backoffice from "../../assets/images/backoffice.png";
import Calendrier from "../calendrier";

import Modal from "react-modal";
import axios from "axios";

function GestionRDV() {
  return (
    <div
      style={{
        backgroundImage: `url(${backoffice})`,
        backgroundSize: "cover",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LeftBar />
      <div className="containerMap" style={{ marginLeft: 230 }}>
        <Calendrier />
      </div>
    </div>
  );
}

export default GestionRDV;
