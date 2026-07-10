function StatsCard({ title, value }) {
  return (
    <div
      style={{
        background: "#222",
        padding: "20px",
        borderRadius: "10px",
        width: "220px",
        textAlign: "center",
        border: "1px solid #444",
      }}
    >
      <h3>{title}</h3>

      <h1>{value}</h1>
    </div>
  );
}

export default StatsCard;