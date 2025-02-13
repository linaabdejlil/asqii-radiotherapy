import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

function Stat1() {
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

  return (
    <div>
      <Pie data={chartData} />
    </div>
  );
}

export default Stat1;
