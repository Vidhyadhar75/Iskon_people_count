import { useEffect, useState } from "react";

export default function Header() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 20px",
      borderRadius: 15,
      background: "linear-gradient(135deg, #ff9800, #ffcc80)",
      color: "#4e342e",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
    }}>

      {/* LEFT: LOGO + TITLE */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          fontSize: 30,
          background: "#fff",
          borderRadius: "50%",
          padding: 10
        }}>
          🛕
        </div>

        <div>
          <h2 style={{ margin: 0 }}>ISKCON Dashboard</h2>
          <p style={{ margin: 0, fontSize: 12 }}>
            Smart Crowd Analytics System
          </p>
        </div>
      </div>

      {/* RIGHT: TIME */}
      <div style={{ textAlign: "right" }}>
        <h3 style={{ margin: 0 }}>{time}</h3>
        <p style={{ margin: 0, fontSize: 12 }}>Live Monitoring</p>
      </div>

    </div>
  );
}