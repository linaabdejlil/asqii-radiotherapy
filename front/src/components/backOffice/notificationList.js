import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./style/notification.css";
import socketIO from "../../services/socketIO";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false); // State to show/hide notification

  useEffect(() => {
    socketIO.on("newNotification", async (notification) => {
      console.log("New notification received:", notification);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
      handleNewNotification();
    });

    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleNewNotification = () => {
    setShowNotification(true); // Show the notification
    setTimeout(() => {
      setShowNotification(false); // Hide the notification after 5000 milliseconds (5 seconds)
    }, 5000);
  };

  const lastNotificationMessage =
    notifications.length > 0
      ? notifications[notifications.length - 1].content
      : "No notifications";

  return (
    <div>
      {showNotification && (
        <div className="notifications-container">
          <div className="info">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="info-svg"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <div className="info-prompt-wrap">
                <div className="notification">
                  <div className="bell-container">
                    <div className="bell"></div>
                  </div>
                  <span className="notification-text">
                    {lastNotificationMessage}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
