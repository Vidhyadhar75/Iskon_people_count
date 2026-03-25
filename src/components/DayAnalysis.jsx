export default function DayAnalysis({
  selectedDate,
  setSelectedDate,
  fetchDayAnalysis,
  dayData
}) {
  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 20,
      padding: 20,
      marginTop: 30,
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
    }}>

      {/* HEADER */}
      <h2 style={{ marginBottom: 10 }}>📅 Day Analysis</h2>

      {/* INPUT SECTION */}
      <div style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        marginBottom: 20,
        flexWrap: "wrap"
      }}>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ccc"
          }}
        />

        <button
          onClick={fetchDayAnalysis}
          style={{
            padding: "10px 20px",
            borderRadius: 10,
            border: "none",
            background: "#1565c0",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          Analyze
        </button>
      </div>

      {/* RESULT */}
      {dayData?.total && (
        <div style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap"
        }}>

          <MiniCard title="Visitors" value={dayData.total.total_in} color="#2e7d32" />
          <MiniCard title="Exits" value={dayData.total.total_out} color="#c62828" />
          <MiniCard title="Peak Hour" value={dayData.peak?.hour + ":00"} color="#f9a825" />
          <MiniCard title="Low Hour" value={dayData.low?.hour + ":00"} color="#6a1b9a" />

        </div>
      )}

    </div>
  );
}


// 🔥 MINI CARD COMPONENT
function MiniCard({ title, value, color }) {
  return (
    <div style={{
      flex: "1 1 150px",
      padding: 15,
      borderRadius: 12,
      background: "#f5f5f5",
      textAlign: "center"
    }}>
      <h4 style={{ margin: 0 }}>{title}</h4>
      <h2 style={{ marginTop: 10, color }}>{value || "--"}</h2>
    </div>
  );
}