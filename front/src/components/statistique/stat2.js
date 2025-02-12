import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

function Stat2() {
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
          "http://localhost:4001/patients/total"
        );
        const { totalPatients } = totalPatientsResponse.data;

        // Fetch the counts of waiting and completed patients for prescriptions
        const prescriptionStatusResponse = await axios.get(
          "http://localhost:4001/patients/prescription-status-count"
        );
        const {
          waitingCount: prescriptionWaitingCount,
          completedCount: prescriptionCompletedCount,
        } = prescriptionStatusResponse.data;

        // Fetch the counts of waiting and completed patients for scanners
        const scannerStatusResponse = await axios.get(
          "http://localhost:4001/patients/scanner-status-count"
        );
        const {
          waitingCount: scannerWaitingCount,
          completedCount: scannerCompletedCount,
        } = scannerStatusResponse.data;

        // Fetch the counts of waiting and completed patients for importations
        const importationStatusResponse = await axios.get(
          "http://localhost:4001/patients/importation-status-count"
        );
        const {
          waitingCount: importationWaitingCount,
          completedCount: importationCompletedCount,
        } = importationStatusResponse.data;

        // Fetch the counts of waiting and completed patients for contourages
        const contourageStatusResponse = await axios.get(
          "http://localhost:4001/patients/contourage-status-count"
        );
        const {
          waitingCount: contourageWaitingCount,
          completedCount: contourageCompletedCount,
        } = contourageStatusResponse.data;

        // Fetch the counts of waiting and completed patients for dosimetries
        const dosimetrieStatusResponse = await axios.get(
          "http://localhost:4001/patients/dosimetrie-status-count"
        );
        const {
          waitingCount: dosimetrieWaitingCount,
          completedCount: dosimetrieCompletedCount,
        } = dosimetrieStatusResponse.data;
 // Fetch the counts of waiting and completed patients for validation
 const validationStatusResponse = await axios.get(
  "http://localhost:4001/patients/validation-status-count"
);
const {
  waitingCount: validationWaitingCount,
  completedCount: validationCompletedCount,
} = validationStatusResponse.data;
// Fetch the counts of waiting and completed patients for qualite
const qualiteStatusResponse = await axios.get(
  "http://localhost:4001/patients/qualite-status-count"
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

  return <Bar options={options} data={data} />;
}

export default Stat2;
