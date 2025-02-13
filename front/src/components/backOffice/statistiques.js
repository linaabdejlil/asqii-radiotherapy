import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import "./style/listCentreTraitement.css";
import NotificationList from "./notificationList";
import LeftBar from "./leftBar";
import backoffice from "../../assets/images/backoffice.png";
import {
  Chart as ChartJS,
  CategoryScale,
  ArcElement,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title, Tooltip, Legend);


export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Patient Progress Chart",
    },
  },
};

const labels = [
  "Prescription",
  "Scanner de simulation",
  "Importation du scanner",
  "Contourage",
  "Dosimetrie",
  "Validation",
  "Controle qualité",
];


const Statistques = () => {
  const [chartData, setChartData] = useState({
    labels: [
      "Prescription",
      "Scanner de simulation",
      "Importation du scanner",
      "Contourage",
      "Dosimetrie",
      "Validation",
      "Controle qualité",
    ],
    datasets: [
      {
        label: "Nombre des patients",
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: [
          "rgba(255, 0, 124, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 112, 0, 0.2)",
          "rgba(255, 157, 230, 0.2)",
          "rgba(8, 255, 0, 0.2)",
          "rgba(0, 251, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 0, 124, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 112, 0, 1)",
          "rgba(255, 157, 230, 1)",
          "rgba(8, 255, 0, 1)",
          "rgba(0, 251, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all the counts
        const [
          totalPatientsResponse,
          prescriptionStatusResponse,
          scannerStatusResponse,
          importationStatusResponse,
          contourageStatusResponse,
          dosimetrieStatusResponse,
          validationStatusResponse,
        ] = await Promise.all([
          axios.get("patients/total"),
          axios.get("patients/prescription-status-count"),
          axios.get("patients/scanner-status-count"),
          axios.get("patients/importation-status-count"),
          axios.get("patients/contourage-status-count"),
          axios.get("patients/dosimetrie-status-count"),
          axios.get("patients/validation-status-count"),
        ]);

        const {
          waitingCount: prescriptionWaitingCount
        } = prescriptionStatusResponse.data;
        const {
          waitingCount: scannerWaitingCount
        } = scannerStatusResponse.data;
        const {
          waitingCount: importationWaitingCount
        } = importationStatusResponse.data;
        const {
          waitingCount: contourageWaitingCount
        } = contourageStatusResponse.data;
        const {
          waitingCount: dosimetrieWaitingCount
        } = dosimetrieStatusResponse.data;
        const {
          waitingCount: validationWaitingCount
        } = validationStatusResponse.data;
      

        // Update the chart data state
        setChartData({
          labels: [
            "Prescription",
            "Scanner de simulation",
            "Importation du scanner",
            "Contourage",
            "Dosimetrie",
            "Validation",
          ],
          datasets: [
            {
              label: "Nombre des patients",
              data: [
                prescriptionWaitingCount,
                scannerWaitingCount,
                importationWaitingCount,
                contourageWaitingCount,
                dosimetrieWaitingCount,
                validationWaitingCount,
              ],
              backgroundColor: [
                "rgba(255, 0, 124, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 112, 0, 0.2)",
                "rgba(255, 157, 230, 0.2)",
                "rgba(8, 255, 0, 0.2)",
                "rgba(0, 251, 255, 0.2)",
              ],
              borderColor: [
                "rgba(255, 0, 124, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 112, 0, 1)",
                "rgba(255, 157, 230, 1)",
                "rgba(8, 255, 0, 1)",
                "rgba(0, 251, 255, 1)",
              ],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch patient counts", error);
      }
    };

    fetchData();
  }, []);
  const [data, setData] = useState({
    labels,
    datasets: [
      {
        label: "Attente",
        data: [], // will be filled by the fetched data
        backgroundColor: "rgba(255, 136, 0, 0.5)",
      },
      {
        label: "Terminé",
        data: [], // will be filled by the fetched data
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the total number of patients
        const totalPatientsResponse = await axios.get(
          "patients/total"
        );
        const { totalPatients } = totalPatientsResponse.data;

        // Fetch the counts of waiting and completed patients for prescriptions
        const prescriptionStatusResponse = await axios.get(
          "patients/prescription-status-count"
        );
        const {
          waitingCount: prescriptionWaitingCount,
          completedCount: prescriptionCompletedCount,
        } = prescriptionStatusResponse.data;

        // Fetch the counts of waiting and completed patients for scanners
        const scannerStatusResponse = await axios.get(
          "patients/scanner-status-count"
        );
        const {
          waitingCount: scannerWaitingCount,
          completedCount: scannerCompletedCount,
        } = scannerStatusResponse.data;

        // Fetch the counts of waiting and completed patients for importations
        const importationStatusResponse = await axios.get(
          "patients/importation-status-count"
        );
        const {
          waitingCount: importationWaitingCount,
          completedCount: importationCompletedCount,
        } = importationStatusResponse.data;

        // Fetch the counts of waiting and completed patients for contourages
        const contourageStatusResponse = await axios.get(
          "patients/contourage-status-count"
        );
        const {
          waitingCount: contourageWaitingCount,
          completedCount: contourageCompletedCount,
        } = contourageStatusResponse.data;

        // Fetch the counts of waiting and completed patients for dosimetries
        const dosimetrieStatusResponse = await axios.get(
          "patients/dosimetrie-status-count"
        );
        const {
          waitingCount: dosimetrieWaitingCount,
          completedCount: dosimetrieCompletedCount,
        } = dosimetrieStatusResponse.data;
 // Fetch the counts of waiting and completed patients for validation
 const validationStatusResponse = await axios.get(
  "patients/validation-status-count"
);
const {
  waitingCount: validationWaitingCount,
  completedCount: validationCompletedCount,
} = validationStatusResponse.data;
// Fetch the counts of waiting and completed patients for qualite
const qualiteStatusResponse = await axios.get(
  "patients/qualite-status-count"
);
const {
  completedCount: qualiteCompletedCount,
} = qualiteStatusResponse.data;

        // Update data for the chart
        setData({
          labels,
          datasets: [
            {
              label: "Attente",
              data: [
                prescriptionWaitingCount,
                scannerWaitingCount,
                importationWaitingCount,
                contourageWaitingCount,
                dosimetrieWaitingCount,
                validationWaitingCount,
                ...new Array(labels.length - 5).fill(0),
              ],
              backgroundColor: "rgba(255, 136, 0, 0.5)",
            },
            {
              label: "Terminé",
              data: [
                prescriptionCompletedCount,
                scannerCompletedCount,
                importationCompletedCount,
                contourageCompletedCount,
                dosimetrieCompletedCount,
                validationCompletedCount,
                qualiteCompletedCount,
                ...new Array(labels.length - 5).fill(0),
              ],
              backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch patient counts", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      style={{
        backgroundImage: `url(${backoffice})`,
        backgroundSize: "cover",
        height: "100vh",
        width: "100vw",
      }}
    >
      {" "}
      <LeftBar></LeftBar>
      <div
        style={{
          position: "absolute", // Absolutely position this div inside the parent
          right: 20, // 20px from the right edge of the viewport
          bottom: 20, // 20px from the bottom edge of the viewport
        }}
      >
        <NotificationList />
      </div>
      <div style={{ display: "flex" }}>
       
        <div className="containerSideMap" style={{width: 650 , height: 600, marginTop: 160 }}>
        <Pie data={chartData} />

        </div>
        <div className="containerMap" style={{ height: 600, marginTop: 160 }}>
        <Bar options={options} data={data} />
          </div>
      </div>
    </div>
  );
};

export default Statistques;
