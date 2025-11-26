export default function AnomalyTable({ rows }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2">Catégorie</th>
            <th>Réel 2024</th>
            <th>Prédit 2025</th>
            <th>Δ %</th>
            <th>Impact</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b">
              <td>{r.real.toLocaleString()} </td>
              <td>{r.pred.toLocaleString()} €</td>
              <td>{r.impact.toLocaleString()} €</td>


              <td className={r.delta >= 0 ? "text-green-700" : "text-red-700"}>
                {r.delta >= 0 ? "+" : ""}
                {r.delta}%
              </td>
              <td>{r.impact.toLocaleString()} €</td>
              <td>
                <span
                  className={`px-3 py-1 rounded-full text-white text-xs ${
                    r.status === "Anomalie" ? "bg-red-600" : "bg-green-600"
                  }`}
                >
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
