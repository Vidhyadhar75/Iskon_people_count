import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

import Header from "./components/Header";
import Cards from "./components/Cards";
import Charts from "./components/Charts";
import DayAnalysis from "./components/DayAnalysis";
import Table from "./components/Table";
import Alert from "./components/Alert";
import WeeklyMonthly from "./components/WeeklyMonthly";
import Sidebar from "./components/Sidebar";

const BASE_URL = "https://iskon-people-backend.onrender.com";

function App() {
  // ================== STATE ==================
  const [today, setToday] = useState({});
  const [hourData, setHourData] = useState([]);
  const [minuteData, setMinuteData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [dayData, setDayData] = useState({});
  const [alert, setAlert] = useState({});
  const [weekData, setWeekData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const [active, setActive] = useState(() => {
  const saved = localStorage.getItem("activeTab");
  console.log("🔥 Loaded active:", saved);
  return saved || "dashboard";
});
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
  setIsOpen(false);
}, [active]);
  const [rangeData, setRangeData] = useState({});
  const [fromDate, setFromDate] = useState("");
  const [fromTime, setFromTime] = useState("00:00");
  const [toDate, setToDate] = useState("");
  const [toTime, setToTime] = useState("23:59");
  useEffect(() => {
  console.log("💾 Saving active:", active);
  localStorage.setItem("activeTab", active);
}, [active]);

  // ================== SOCKET ==================
  useEffect(() => {
    const socket = io(BASE_URL);

    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket");
    });

    socket.on("data", (data) => {
  console.log("📡 LIVE:", data);

  // ✅ FIX TODAY (convert to number)
  setToday({
    total_in: Number(data.today?.total_in || 0),
    total_out: Number(data.today?.total_out || 0)
  });

  // ✅ FIX HOUR DATA
  const fixedHour = data.hourData.map(h => ({
    hour: h.hour,
    in_count: Number(h.in_count),
    out_count: Number(h.out_count)
  }));

  // ✅ FIX MINUTE DATA
  const fixedMinute = data.minuteData.map(m => ({
    minute: m.minute,
    in_count: Number(m.in_count),
    out_count: Number(m.out_count)
  }));

  // ✅ FIX ALERT
  setAlert({
    current_people: Number(data.alert?.current_people || 0),
    alert: data.alert?.alert
  });

  setHourData(fixedHour);
  setMinuteData(fixedMinute);

  setLoading(false);
});

    socket.on("disconnect", () => {
      console.log("❌ Disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // ================== STATIC DATA ==================
  useEffect(() => {
    axios.get(`${BASE_URL}/api/week`)
      .then(res => setWeekData(res.data))
      .catch(err => console.error(err));

    axios.get(`${BASE_URL}/api/month`)
      .then(res => setMonthData(res.data))
      .catch(err => console.error(err));
  }, []);

  // ================== DAY ANALYSIS ==================
  const fetchDayAnalysis = async () => {
    try {
      console.log("📅 Date:", selectedDate);

      const res = await axios.get(`${BASE_URL}/api/day-analysis`, {
        params: { date: selectedDate }
      });

      console.log("✅ Day Data:", res.data);

      setDayData(res.data);
    } catch (err) {
      console.error("❌ Day Analysis Error:", err);
    }
  };
  const fetchRange = async () => {
  try {
    if (!fromDate || !toDate) {
      alert("⚠️ Please select both FROM and TO dates");
      return;
    }

    const from = `${fromDate} ${fromTime}:00`;
    const to = `${toDate} ${toTime}:00`;

    console.log("📤 Sending:", from, to);

    const res = await axios.get(`${BASE_URL}/api/range`, {
      params: { from, to }
    });

    console.log("✅ Range Data:", res.data);

    setRangeData(res.data || {});
  } catch (err) {
    console.error("❌ Range Error:", err);
  }
};
useEffect(() => {
  const today = new Date().toISOString().split("T")[0];

  setFromDate(today);
  setToDate(today);
}, []);

  // ================== PEAK ==================
  const peak = hourData.length > 0
  ? hourData.reduce((max, h) =>
      Number(h.in_count) > Number(max?.in_count || 0) ? h : max
    )
  : null;
  // ================== LOADING ==================
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <h2>🔄 Loading Dashboard...</h2>
      </div>
    );
  }

  // ================== UI ==================
 return (
  <div>

    {/* ☰ MENU BUTTON */}
    <button
      onClick={() => setIsOpen(!isOpen)}
      style={{
        position: "fixed",
        top: 10,
        left: 10,
        zIndex: 1100,
        padding: 10,
        borderRadius: 8,
        border: "none",
        background: "#3949ab",
        color: "#fff",
        fontSize: 18
      }}
    >
      ☰
    </button>

    {/* 🔥 OVERLAY */}
    {isOpen && (
      <div
        onClick={() => setIsOpen(false)}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.3)",
          zIndex: 10
        }}
      />
    )}

    {/* SIDEBAR */}
    <Sidebar
      active={active}
      setActive={setActive}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />

    {/* MAIN CONTENT */}
    <div style={{
      width: "100%",
      padding: "60px 15px 20px",
      background: "#fdf6ec",
      minHeight: "100vh",
      position: "relative",
      zIndex: 20
    }}>

      <Header />
      <Alert alert={alert} />

      {/* DASHBOARD */}
      {active === "dashboard" && (
        <>
          <Cards today={today} peak={peak} />
          <Charts hourData={hourData} minuteData={minuteData} />
        </>
      )}

      {/* ANALYTICS */}
      {active === "analytics" && (
        <WeeklyMonthly weekData={weekData} monthData={monthData} />
      )}

      {/* DAY ANALYSIS */}
      {active === "day" && (
        <DayAnalysis
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          fetchDayAnalysis={fetchDayAnalysis}
          dayData={dayData}
        />
      )}

      {/* ================== RANGE (FIXED UI) ================== */}
      {active === "range" && (
        <div style={{
          background: "#ffffff",
          padding: 25,
          borderRadius: 20,
          marginTop: 20,
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
        }}>

          <h3 style={{ marginBottom: 20 }}>📅 Range Filter</h3>

          <div style={{
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            justifyContent: "space-between"
          }}>

            {/* FROM */}
            <div style={{
              background: "#f5f7ff",
              padding: 20,
              borderRadius: 15,
              minWidth: 250,
              flex: 1
            }}>
              <h4>🔽 From</h4>

              <label>From Date</label><br />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={inputStyle}
              />

              <label>Time</label><br />
              <input
                type="time"
                value={fromTime}
                onChange={(e) => setFromTime(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* TO */}
            <div style={{
              background: "#f5f7ff",
              padding: 20,
              borderRadius: 15,
              minWidth: 250,
              flex: 1
            }}>
              <h4>🔼 To</h4>

              <label>To Date</label><br />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                style={inputStyle}
              />

              <label>Time</label><br />
              <input
                type="time"
                value={toTime}
                onChange={(e) => setToTime(e.target.value)}
                style={inputStyle}
              />
            </div>

          </div>

          {/* BUTTON */}
          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => {
                if (!fromDate || !toDate) {
                  alert("Select both dates");
                  return;
                }
                fetchRange();
              }}
              style={{
                marginTop: 20,
                padding: "12px 25px",
                background: "linear-gradient(135deg, #3949ab, #5c6bc0)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
                fontSize: 16
              }}
            >
              🚀 Get Range Data
            </button>
          </div>

          {/* RESULT */}
          <div style={{
            marginTop: 30,
            display: "flex",
            gap: 20,
            justifyContent: "center",
            flexWrap: "wrap"
          }}>

            <StatCard title="Total In" value={rangeData.total_in} color="#43a047" icon="👥" />
            <StatCard title="Total Out" value={rangeData.total_out} color="#e53935" icon="🚶" />
            <StatCard
              title="Inside"
              value={(rangeData.total_in || 0) - (rangeData.total_out || 0)}
              color="#1e88e5"
              icon="🏠"
            />

          </div>

        </div>
      )}

      {/* TABLE */}
      {active === "table" && (
        <Table minuteData={minuteData} />
      )}

    </div>
  </div>
);
}
const inputStyle = {
  width: "100%",
  padding: 8,
  marginTop: 5,
  marginBottom: 10,
  borderRadius: 8,
  border: "1px solid #ccc"
};

function StatCard({ title, value, color, icon }) {
  return (
    <div style={{
      width: 180,
      padding: 20,
      borderRadius: 15,
      background: color,
      color: "#fff",
      textAlign: "center",
      boxShadow: "0 6px 20px rgba(0,0,0,0.15)"
    }}>
      <div style={{ fontSize: 28 }}>{icon}</div>
      <h4>{title}</h4>
      <h2>{Number(value || 0)}</h2>
    </div>
  );
}
export default App;
