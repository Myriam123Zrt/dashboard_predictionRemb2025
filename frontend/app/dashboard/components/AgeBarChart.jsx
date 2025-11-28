"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AgeBarChart({ data }) {
  const labels = data.map((row) => row["Tranche d'age"]);
  const values2024 = data.map((row) => row["Total Rembourssement 2024"]);
  const values2025 = data.map((row) => row["Total Rembourssement 2025"]);

  const chartData = {
    labels,
    datasets: [
      {
        label: "2024 (€)",
        data: values2024,
        backgroundColor: "rgba(37, 99, 235, 0.7)",
      },
      {
        label: "2025 (€)",
        data: values2025,
        backgroundColor: "rgba(255, 159, 64, 0.7)",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          callback: (value) =>
            Math.round(value).toLocaleString() + " €",
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow border border-gray-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Répartition par tranche d’âge (2024 vs 2025)
      </h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}
