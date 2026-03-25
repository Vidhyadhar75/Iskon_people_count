export default function Sidebar({ active, setActive, isOpen, setIsOpen }) {
  const menu = [
    { id: "dashboard", label: "🏠 Dashboard" },
    { id: "analytics", label: "📊 Analytics" },
    { id: "day", label: "📅 Day Analysis" },
    { id: "table", label: "📋 Data Table" }
  ];

  return (
    <div style={{
      width: 220,
      height: "100vh",
      background: "#1e1e2f",
      color: "#fff",
      padding: 20,
      position: "fixed",
      left: isOpen ? 0 : -220,
      top: 0,
      transition: "left 0.3s ease",
      zIndex: 1000
    }}>
      <h2>🛕 ISKCON</h2>

      {menu.map(item => (
        <div
          key={item.id}
          onClick={() => {
            setActive(item.id);
            setIsOpen(false);
          }}
          style={{
            padding: 12,
            marginTop: 10,
            borderRadius: 10,
            cursor: "pointer",
            background: active === item.id ? "#3949ab" : "transparent"
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}