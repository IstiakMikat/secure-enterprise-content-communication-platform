import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const colors = ["#19b4a6", "#f59e0b", "#ef4444", "#8b5cf6"];

function PieSummaryChart({ data }) {
  return (
    <div className="panel h-80 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={95}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieSummaryChart;

