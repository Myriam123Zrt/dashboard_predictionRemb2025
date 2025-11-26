export default function KPICard({ title, value, subtitle, variation, accent }) {
  const accentColor =
    accent === "orange"
      ? "text-orange-500"
      : accent === "red"
      ? "text-red-500"
      : "text-blue-600";

  return (
    <div className="p-5 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col gap-1">
      <div className="text-gray-500 text-xs uppercase tracking-wide">
        {title}
      </div>
      <div className={`text-2xl font-bold ${accentColor}`}>{value}</div>

      {subtitle && (
        <div className="text-xs text-gray-400">{subtitle}</div>
      )}

      {variation !== undefined && (
        <div
          className={`text-xs font-medium ${
            parseFloat(variation) >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {parseFloat(variation) >= 0 ? `+${variation}%` : `${variation}%`}
        </div>
      )}
    </div>
  );
}
