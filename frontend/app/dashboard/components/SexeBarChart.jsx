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

export default function SexeBarChart({ data }) {
  const hommes = data.find((x) => x.Type_sexe === "Homme");
  const femmes = data.find((x) => x.Type_sexe === "Femme");

  const labels = ["Homme", "Femme"];
  const values2024 = [
    hommes ? hommes["2024"] || hommes.total_remboursement : 0,
    femmes ? femmes["2024"] || femmes.total_remboursement : 0,
  ];

  const values2025 = [
    hommes ? hommes["2025"] || hommes.total_remboursement : 0,
    femmes ? femmes["2025"] || femmes.total_remboursement : 0,
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: "2024 (€)",
        data: values2024,
        backgroundColor: "rgba(37, 99, 235, 0.7)", // bleu
      },
      {
        label: "2025 (€)",
        data: values2025,
        backgroundColor: "rgba(255, 159, 64, 0.7)", // orange
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          callback: (value) => Math.round(value).toLocaleString() + " €",
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow border border-gray-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Répartition par sexe (2024 vs 2025)
      </h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}
