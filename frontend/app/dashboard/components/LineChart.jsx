import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function PredictionLineChart({ history, forecast }) {
  // 1) On prépare les deux séries
  const histData = history.dates.map((d, i) => ({
    date: d,
    hist: history.values[i],
  }));

  const forecastData = forecast.dates.map((d, i) => ({
    date: d,
    pred: forecast.values[i],
  }));

  // 2) On fusionne par date pour avoir un seul tableau
  const mergedMap = {};

  histData.forEach((p) => {
    mergedMap[p.date] = { ...(mergedMap[p.date] || { date: p.date }), hist: p.hist };
  });

  forecastData.forEach((p) => {
    mergedMap[p.date] = { ...(mergedMap[p.date] || { date: p.date }), pred: p.pred };
  });

  const merged = Object.values(mergedMap).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 h-96">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        Historique (N-1) & Prévision (N)
      </h3>
      <ResponsiveContainer>
        <LineChart data={merged}>
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(v) => v.toLocaleString()} />
          <Tooltip
            formatter={(value) => `${Number(value).toLocaleString()} €`}
          />

          <Legend />
          <Line
            type="monotone"
            dataKey="hist"
            stroke="#1E88E5"          // bleu
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Historique"
          />
          <Line
            type="monotone"
            dataKey="pred"
            stroke="#FB8C00"          // orange
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Prévision"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
