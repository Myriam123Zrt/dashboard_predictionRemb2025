"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

export default function FamilleBarChart({ data }) {

  // On regroupe par famille et année
  const grouped = {};

  data.forEach((row) => {
    const fam = row["Famille d'acte"];
    const year = row["ANNEE"];
    const total = row["total_remboursement"];

    if (!grouped[fam]) grouped[fam] = { 2024: 0, 2025: 0 };
    grouped[fam][year] = total;
  });

  const labels = Object.keys(grouped);

  const values2024 = labels.map((fam) => grouped[fam][2024]);
  const values2025 = labels.map((fam) => grouped[fam][2025]);

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
          callback: (value) =>
            Math.round(value).toLocaleString() + " €",
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow border border-gray-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Répartition par famille d’acte (2024 vs 2025)
      </h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}
