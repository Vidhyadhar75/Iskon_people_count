export default function Cards({ today, peak }) {

  // ✅ SAFE NUMBER FUNCTION
  const safeNumber = (val) => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };

  const totalIn = safeNumber(today?.total_in);
  const totalOut = safeNumber(today?.total_out);
  const inside = totalIn - totalOut;

  // ✅ SAFE PEAK
  const formatHour = (hour) => {
  if (hour === null || hour === undefined || isNaN(hour)) return "--";

  const h = Number(hour);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;

  return `${hour12}:00 ${ampm}`;
};

const peakDisplay = formatHour(peak?.hour);
  return (
    <div style={{
      display: "flex",
      gap: 20,
      justifyContent: "center",
      flexWrap: "wrap",
      marginTop: 20
    }}>

      <Card 
        title="Visitors Today" 
        value={totalIn} 
        icon="👥"
        gradient="linear-gradient(135deg, #43a047, #66bb6a)" 
      />

      <Card 
        title="Exited" 
        value={totalOut} 
        icon="🚶"
        gradient="linear-gradient(135deg, #e53935, #ef5350)" 
      />

      <Card 
        title="Inside" 
        value={inside} 
        icon="🏠"
        gradient="linear-gradient(135deg, #1e88e5, #42a5f5)" 
      />

      <Card 
        title="Peak Hour" 
        value={peakDisplay}   // ✅ STRING SAFE
        icon="🔥"
        gradient="linear-gradient(135deg, #f9a825, #fbc02d)" 
      />

    </div>
  );
}


// 🔥 CARD COMPONENT (FINAL FIX)
function Card({ title, value, icon, gradient }) {

  // ✅ HANDLE BOTH NUMBER + STRING
  const displayValue =
    typeof value === "number"
      ? (isNaN(value) ? 0 : value)
      : value || "--";

  return (
    <div style={{
      padding: 20,
      borderRadius: 20,
      width: 200,
      color: "#fff",
      background: gradient,
      boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
      transition: "transform 0.2s ease",
      cursor: "pointer"
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
    >
      
      <div style={{ fontSize: 30, marginBottom: 10 }}>
        {icon}
      </div>

      <h4 style={{ margin: 0, opacity: 0.9 }}>{title}</h4>

      <h2 style={{ marginTop: 10, fontSize: 28 }}>
        {displayValue}
      </h2>

    </div>
  );
}