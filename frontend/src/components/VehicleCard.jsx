function VehicleCard({ vehicle, onDelete }) {
  return (
    <div
      style={{
        border: "1px solid #444",
        borderRadius: "10px",
        padding: "16px",
        width: "280px",
        background: "#222",
      }}
    >
      <h3>{vehicle.manufacturer}</h3>

      <p>
        <strong>Model:</strong> {vehicle.model}
      </p>

      <p>
        <strong>Battery:</strong> {vehicle.battery_capacity}
      </p>

      <p>
        <strong>SOC:</strong> {vehicle.soc}%
      </p>

      <button
        onClick={() => onDelete(vehicle.id)}
        style={{
          marginTop: "10px",
          background: "crimson",
          color: "white",
          border: "none",
          padding: "8px 12px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Delete
      </button>
    </div>
  );
}

export default VehicleCard;