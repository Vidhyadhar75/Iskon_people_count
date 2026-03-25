import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, ResponsiveContainer
} from "recharts";

export default function Charts({ hourData, minuteData }) {
  return (
    <div style={{ marginTop: 30 }}>

      {/* ================= HOURLY ================= */}
      <ChartCard 
        title="📊 Hourly Visitors"
        subtitle="Visitors entering and exiting per hour"
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={hourData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="in_count" fill="#4caf50" name="In" />
            <Bar dataKey="out_count" fill="#f44336" name="Out" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* ================= MINUTE ================= */}
      <ChartCard 
        title="📈 Crowd Flow Trend"
        subtitle="Real-time movement of people"
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={minuteData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="minute" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="in_count" stroke="#4caf50" name="In" />
            <Line type="monotone" dataKey="out_count" stroke="#f44336" name="Out" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

    </div>
  );
}


// 🔥 CARD WRAPPER FOR CHARTS
function ChartCard({ title, subtitle, children }) {
  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 20,
      padding: 20,
      marginBottom: 25,
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
    }}>
      
      <h2 style={{ marginBottom: 5 }}>{title}</h2>
      <p style={{ marginTop: 0, color: "#666" }}>{subtitle}</p>

      {children}

    </div>
  );
}