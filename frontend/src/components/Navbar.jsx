function Navbar({ backendStatus }) {
  return (
    <div
      style={{
        background: "#1e293b",
        color: "white",
        padding: "18px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2>🚗 DWPT Agentic Platform</h2>

      <h3>{backendStatus}</h3>
    </div>
  );
}

export default Navbar;