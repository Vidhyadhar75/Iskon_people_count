import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

// 🔥 WEEK ORDER
const weekOrder = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const weekShort = ["Monday","Tueday","Wednesday","Thursday","Friday","Saturday","Sunday"];

export default function WeeklyMonthly({ weekData, monthData }) {

  // ================= WEEK FORMAT =================
  const sortedWeek = weekOrder.map((day, index) => {
    const found = weekData.find(d => d.day === day);
    return {
      day: weekShort[index],
      in_count: found?.in_count || 0,
      out_count: found?.out_count || 0
    };
  });

  // ================= MONTH FORMAT =================
  const formattedMonth = monthData.map(d => ({
    day: new Date(d.day).getDate(),
    in_count: d.in_count,
    out_count: d.out_count
  }));

  // ================= INSIGHTS =================
  const peakDay = sortedWeek.reduce((max, d) =>
    d.in_count > (max?.in_count || 0) ? d : max, {}
  );

  const totalMonth = formattedMonth.reduce((sum, d) =>
    sum + d.in_count, 0
  );

  return (
    <div style={{ marginTop: 30 }}>

      {/* ================= WEEKLY ================= */}
      <ChartCard 
        title="📅 Weekly Analytics"
        subtitle="Visitor distribution across days"
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sortedWeek}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="in_count" fill="#4caf50" name="In" />
            <Bar dataKey="out_count" fill="#f44336" name="Out" />
          </BarChart>
        </ResponsiveContainer>

        {/* 🔥 WEEK INSIGHTS */}
        <div style={insightBox}>
          <p>🔥 Peak Day: <b>{peakDay.day}</b></p>
        </div>
      </ChartCard>


      {/* ================= MONTHLY ================= */}
      <ChartCard 
        title="📆 Monthly Analytics"
        subtitle="Daily visitor trend of this month"
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="in_count" stroke="#2196f3" name="In" />
            <Line type="monotone" dataKey="out_count" stroke="#ff5722" name="Out" />
          </LineChart>
        </ResponsiveContainer>

        {/* 🔥 MONTH INSIGHTS */}
        <div style={insightBox}>
          <p>📊 Total Visitors This Month: <b>{totalMonth}</b></p>
        </div>
      </ChartCard>

    </div>
  );
}


// 🔥 CARD WRAPPER
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


// 🔥 INSIGHT BOX
const insightBox = {
  marginTop: 15,
  padding: 10,
  background: "#f5f5f5",
  borderRadius: 10
};