export default function Table({ minuteData }) {
  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 20,
      padding: 20,
      marginTop: 30,
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
    }}>

      <h2 style={{ marginBottom: 15 }}>📋 Detailed Data</h2>

      <div style={{
        maxHeight: 300,
        overflowY: "auto",
        borderRadius: 10
      }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse"
        }}>

          {/* HEADER */}
          <thead style={{
            position: "sticky",
            top: 0,
            background: "#ffe0b2"
          }}>
            <tr>
              <th style={thStyle}>Time</th>
              <th style={thStyle}>In</th>
              <th style={thStyle}>Out</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {minuteData.map((d, i) => (
              <tr
                key={i}
                style={{
                  background: i % 2 === 0 ? "#fafafa" : "#ffffff",
                  transition: "background 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#e3f2fd"}
                onMouseLeave={(e) =>
                  e.currentTarget.style.background = i % 2 === 0 ? "#fafafa" : "#ffffff"
                }
              >
                <td style={tdStyle}>{d.minute}</td>
                <td style={{ ...tdStyle, color: "#2e7d32", fontWeight: "bold" }}>
                  {d.in_count}
                </td>
                <td style={{ ...tdStyle, color: "#c62828", fontWeight: "bold" }}>
                  {d.out_count}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* EMPTY STATE */}
      {minuteData.length === 0 && (
        <p style={{ textAlign: "center", marginTop: 20 }}>
          No data available
        </p>
      )}

    </div>
  );
}


// 🔥 STYLES
const thStyle = {
  padding: 12,
  textAlign: "left",
  fontWeight: "bold"
};

const tdStyle = {
  padding: 10
};