export default function Alert({ alert }) {
  if (!alert || !alert.current_people) return null;

  const isAlert = alert.alert;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 20,
      borderRadius: 15,
      marginBottom: 20,
      background: isAlert ? "#ffebee" : "#e8f5e9",
      border: `2px solid ${isAlert ? "#e53935" : "#43a047"}`,
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
    }}>
      
      {/* LEFT */}
      <div>
        <h3 style={{ margin: 0 }}>
          {isAlert ? "🚨 High Crowd Alert" : "✅ Normal Crowd"}
        </h3>

        <p style={{ margin: "5px 0" }}>
          Current People Inside: <b>{alert.current_people}</b>
        </p>

        <p style={{ margin: 0, fontSize: 14 }}>
          {isAlert 
            ? "Crowd exceeds safe limit. Please take action."
            : "Crowd level is under control."}
        </p>
      </div>

      {/* RIGHT STATUS BADGE */}
      <div style={{
        padding: "10px 20px",
        borderRadius: 10,
        background: isAlert ? "#e53935" : "#43a047",
        color: "#fff",
        fontWeight: "bold"
      }}>
        {isAlert ? "ALERT" : "SAFE"}
      </div>

    </div>
  );
}