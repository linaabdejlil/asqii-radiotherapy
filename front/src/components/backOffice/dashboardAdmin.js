import React, { useState, useEffect } from "react";
import "../../style/signin.css";
import LeftBar from "./leftBar";
import NotificationList from "./notificationList";
import backoffice from "../../assets/images/backoffice.png";

function DashboardAdmin() {
  return (
    <div
      style={{
        backgroundImage: `url(${backoffice})`,
        backgroundSize: "cover",
        height: "100vh",
        width: "100vw",
        position: "relative", // Ensures the child absolute positioning is relative to this div
      }}
    >
      <LeftBar />
      <div
        style={{
          position: "absolute", // Absolutely position this div inside the parent
          right: 20, // 20px from the right edge of the viewport
          bottom: 20, // 20px from the bottom edge of the viewport
        }}
      >
        <NotificationList />
      </div>
    </div>
  );
}

export default DashboardAdmin;
