import { useEffect, useState } from "react";

import {
  getChargingStations,
  addChargingStation,
  updateChargingStation,
  deleteChargingStation,
} from "../api/chargingStationApi";

import ChargingStationCard from "../components/charging/ChargingStationCard";
import ChargingStationForm from "../components/charging/ChargingStationForm";

function Charging() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingStation, setEditingStation] = useState(null);

  const loadStations = async () => {
    setLoading(true);

    try {
      const data = await getChargingStations();
      setStations(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStations();
  }, []);

  const handleSubmit = async (station) => {
    try {
      if (editingStation) {
        await updateChargingStation(editingStation.id, station);
        setEditingStation(null);
      } else {
        await addChargingStation(station);
      }

      loadStations();
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.detail
          ? JSON.stringify(err.response.data.detail)
          : "Failed to save charging station."
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this charging station?")) return;

    await deleteChargingStation(id);

    loadStations();
  };

  const filtered = stations.filter((station) =>
    station.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold">
          Charging Stations
        </h1>

        <span className="text-slate-400">
          {stations.length} Station(s)
        </span>

      </div>

      <ChargingStationForm
        onSubmit={handleSubmit}
        editingStation={editingStation}
        onCancel={() => setEditingStation(null)}
      />

      <input
        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 mb-8"
        placeholder="Search stations..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">

          {filtered.map((station) => (
            <ChargingStationCard
              key={station.id}
              station={station}
              onEdit={setEditingStation}
              onDelete={handleDelete}
            />
          ))}

        </div>
      )}

    </div>
  );
}

export default Charging;