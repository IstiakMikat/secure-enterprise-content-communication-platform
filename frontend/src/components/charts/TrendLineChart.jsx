import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function TrendLineChart({ data }) {
  return (
    <div className="panel h-80 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.07)" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="failedLogins" stroke="#ef4444" strokeWidth={2} />
          <Line type="monotone" dataKey="otpFailures" stroke="#f59e0b" strokeWidth={2} />
          <Line type="monotone" dataKey="sessions" stroke="#19b4a6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TrendLineChart;

