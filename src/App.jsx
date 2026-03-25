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

const BASE_URL = "https://iskon-people-backend.onrender.com/";

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
  const [active, setActive] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

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
            zIndex: 999
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
        minHeight: "100vh"
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

        {/* TABLE */}
        {active === "table" && (
          <Table minuteData={minuteData} />
        )}

      </div>
    </div>
  );
}

export default App;