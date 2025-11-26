import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ErrorBarChart({ data }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 h-80">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="segment" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="mape" fill="#424242" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
