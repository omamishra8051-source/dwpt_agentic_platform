function Sidebar() {
  const items = [
    "Dashboard",
    "Vehicles",
    "Charging",
    "Agents",
    "Analytics",
    "Settings",
  ];

  return (
    <div
      style={{
        width: "220px",
        background: "#0f172a",
        color: "white",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      {items.map((item) => (
        <div
          key={item}
          style={{
            padding: "15px",
            cursor: "pointer",
            borderRadius: "8px",
            marginBottom: "10px",
            background: "#1e293b",
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;