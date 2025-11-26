"use client";
import { useEffect, useState } from "react";
import axios from "axios";

import KPICard from "./components/KPICard";
import PredictionLineChart from "./components/LineChart";
import ErrorBarChart from "./components/BarChart";
import AnomalyTable from "./components/AnomalyTable";
import Loader from "./components/Loader";

// ⬇⬇⬇ NOUVELLE LIGNE ICI
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
// ⬆⬆⬆

export default function Dashboard() {
  const [currentTab, setCurrentTab] = useState("Synthèse");
  const [histYear, setHistYear] = useState(2024);
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/predict`, {
        params: { hist_year: histYear },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [histYear]);

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader />
      </main>
    );
  }

  const { kpis, history, forecast, segments } = data;

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-6">
        {/* HEADER */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/iga-logo.png"
              alt="IGA Tunisie"
              className="h-10 w-auto"
            />
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <span className="text-blue-600">Prévision</span>
                <span>Remboursements Santé</span>
              </h1>
              <p className="text-sm text-gray-500">
                Visualisation des données historiques et prévisions mensuelles.
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              window.open(`${API_URL}/export`, "_blank")
            }
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-500"
          >
            📥 Exporter les prévisions (Excel)
          </button>
        </header>

        {/* FILTRES */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Année historique :</span>
            <select
              value={histYear}
              onChange={(e) => setHistYear(Number(e.target.value))}
              className="bg-white border border-gray-300 rounded-lg px-2 py-1 text-sm"
            >
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
            </select>
          </div>
        </div>

        {/* LAYOUT AVEC SIDEBAR GAUCHE */}
        <div className="mt-6 flex gap-6">
          {/* SIDEBAR */}
          <aside className="w-56 flex-shrink-0 bg-white border border-gray-200 rounded-2xl p-4 space-y-2">
            {["Synthèse", "Analyse", "Modèle"].map((tab) => (
              <button
                key={tab}
                onClick={() => setCurrentTab(tab)}
                className={
                  "w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition " +
                  (currentTab === tab
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-700 hover:bg-gray-100")
                }
              >
                {tab}
              </button>
            ))}
          </aside>

          {/* CONTENU PRINCIPAL */}
          <section className="flex-1 space-y-6">
            {currentTab === "Synthèse" && (
              <>
                {/* KPI */}
                <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <KPICard
                    title="Total 2024"
                    value={kpis.total_2024.toLocaleString() + " €"}
                    accent="blue"
                  />
                  <KPICard
                    title="Total prédit 2025"
                    value={kpis.total_forecast.toLocaleString() + " €"}
                    accent="orange"
                  />
                  <KPICard
                    title="Variation"
                    value={kpis.variation_pct.toFixed(1) + " %"}
                    variation={kpis.variation_pct.toFixed(1)}
                    accent="red"
                  />
                  <KPICard
                    title="MAPE global"
                    value={kpis.mape_global.toFixed(2) + " %"}
                    accent="blue"
                  />
                </section>

                {/* COURBES HISTORIQUE + PREVISION */}
                <section>
                  <PredictionLineChart history={history} forecast={forecast} />
                </section>
              </>
            )}

            {currentTab === "Analyse" && (
              <section>
                <ErrorBarChart data={segments.mape_by_segment} />
              </section>
            )}

            {currentTab === "Modèle" && (
              <section className="space-y-4">
                <div className="bg-white rounded-2xl p-4Shadow-sm border border-gray-200">
                  <h2 className="font-semibold mb-1">
                    Qualité modèle — résumé
                  </h2>
                  <p className="text-sm text-gray-700">
                    MAPE global :{" "}
                    <span className="font-semibold text-orange-500">
                      {kpis.mape_global.toFixed(2)} %
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Calculé sur les 12 derniers mois historiques.
                  </p>
                </div>

                <AnomalyTable rows={segments.anomalies} />
              </section>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
