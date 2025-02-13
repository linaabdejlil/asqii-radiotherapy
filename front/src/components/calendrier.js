import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../style/calendrier.css";

const localizer = momentLocalizer(moment);

function Calendrier() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  function getRandomTime() {
    const startHour = 8; // Heure de début à 8h
    const endHour = 16; // Dernier début possible à 16h pour une séance d'une heure
    const randomHour =
      Math.floor(Math.random() * (endHour - startHour + 1)) + startHour;
    const randomMinute = Math.floor(Math.random() * 60); // Minute aléatoire pour plus de variété

    return { randomHour, randomMinute };
  }

  const eventPropGetter = (event) => {
    const eventDate = new Date(event.start);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log(event); // Check the event object structure and values

    if (event.reporte) {
      return {
        style: {
          backgroundColor: "#ff0000", // Red color for postponed sessions
          color: "white",
        },
      };
    }
    if (eventDate < today) {
      return {
        style: {
          backgroundColor: "#00E4B0",
          color: "white",
        },
      };
    }
    if (eventDate > today) {
      return {
        style: {
          backgroundColor: "#ff8b3d",
          color: "white",
        },
      };
    }
    return {};
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get("seances/getAll");
      const seances = response.data.map((seance) => {
        const { randomHour, randomMinute } = getRandomTime();
        const startDate = new Date(seance.dateSeance);
        startDate.setHours(randomHour, randomMinute, 0); // Définit les heures et minutes aléatoires

        const endDate = new Date(startDate);
        endDate.setHours(startDate.getHours() + 1); // Ajoute une heure pour la fin de la séance

        return {
          title: seance.patientNom,
          start: startDate,
          end: endDate,
          reporte: seance.reporte, // Assurez-vous que cette donnée est fournie par votre API
        };
      });

      setEvents(seances);
    } catch (error) {
      console.error("Failed to fetch events", error);
    }
  };

  return (
    <div
      className="cal"
      style={{ marginTop: 50, marginLeft: 170, height: 680, width: 1200 }}
    >
      <div
        style={{
          marginTop: -20,
          marginBottom: 30,
          fontSize: 20,
          marginLeft: 130,
        }}
      >
        <span style={{ color: "#00E4B0" }}>●</span> Séance réalisée avec
        succès&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span style={{ color: "#ff8b3d" }}>●</span> Séance
        future&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span style={{ color: "#ff0000" }}>●</span> Séance reportée
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600, width: 800, marginTop: -10, marginLeft: 40 }}
        selectable={true}
        eventPropGetter={eventPropGetter}
      />
    </div>
  );
}

export default Calendrier;
