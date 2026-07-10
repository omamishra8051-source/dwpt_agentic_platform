import { useEffect, useState } from "react";
import {
  getVehicles,
  addVehicle,
  deleteVehicle,
} from "./api/vehicleApi";

import VehicleForm from "./components/VehicleForm";
import VehicleCard from "./components/VehicleCard";
import StatsCard from "./components/StatsCard";

function App() {
  const handleAddVehicle = async (vehicle) => {
  await addVehicle(vehicle);
  fetchVehicles();
};

const handleDeleteVehicle = async (id) => {
  await deleteVehicle(id);
  fetchVehicles();
};
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState("Checking...");

  const fetchVehicles = async () => {
    setLoading(true);

    try {
      const data = await getVehicles();
      setVehicles(data);
      setBackendStatus("🟢 Connected");
    } catch (error) {
      console.error(error);
      setBackendStatus("🔴 Disconnected");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter((vehicle) =>
    `${vehicle.manufacturer} ${vehicle.model}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const averageSOC =
    vehicles.length > 0
      ? Math.round(
          vehicles.reduce((sum, v) => sum + v.soc, 0) / vehicles.length
        )
      : 0;

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        background: "#111827",
        minHeight: "100vh",
        color: "white",
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1>🚗 DWPT Agentic Platform</h1>

        <button
          onClick={fetchVehicles}
          style={{
            padding: "10px 18px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            background: "#2563eb",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Refresh
        </button>
      </div>

      {/* Backend Status */}

      <p
        style={{
          fontSize: "18px",
          marginBottom: "25px",
        }}
      >
        Backend Status: <strong>{backendStatus}</strong>
      </p>

      {/* Stats */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        <StatsCard title="Total Vehicles" value={vehicles.length} />

        <StatsCard title="Average SOC" value={`${averageSOC}%`} />

        <StatsCard
          title="Healthy Vehicles"
          value={vehicles.filter((v) => v.soc >= 50).length}
        />
      </div>

      {/* Search */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "30px",
        }}
      >
        <input
          type="text"
          placeholder="Search manufacturer or model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "400px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid gray",
            fontSize: "16px",
          }}
        />
      </div>
      <VehicleForm onAdd={handleAddVehicle} />

      <h2>Vehicles</h2>

      {loading ? (
        <h3>Loading vehicles...</h3>
      ) : filteredVehicles.length === 0 ? (
        <h3>No vehicles found.</h3>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} onDelete={handleDeleteVehicle} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;