import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#1E88E5", "#43A047", "#FB8C00", "#E53935", "#8E24AA"];

export default function DonutChart({ data }) {
  return (
    <div className="bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-800 h-80">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            nameKey="label"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
