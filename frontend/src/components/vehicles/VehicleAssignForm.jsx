import { useEffect, useState } from "react";

import { getHighways } from "../../api/highwayApi";
import { getChargingStations } from "../../api/chargingStationApi";
import { assignVehicle } from "../../api/vehicleApi";

function VehicleAssignForm({ vehicleId, onDone, onCancel }) {
  const [highways, setHighways] = useState([]);
  const [stations, setStations] = useState([]);

  const [highwayId, setHighwayId] = useState("");
  const [stationId, setStationId] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    const loadHighways = async () => {
      const data = await getHighways();
      setHighways(data);
    };

    loadHighways();
  }, []);

  useEffect(() => {
    if (!highwayId) {
      setStations([]);
      setStationId("");
      return;
    }

    const loadStations = async () => {
      const all = await getChargingStations();

      setStations(
        all.filter(
          (station) => station.highway_id === Number(highwayId)
        )
      );
    };

    loadStations();
    setStationId("");
  }, [highwayId]);

  const handleConfirm = async () => {
    if (!highwayId || !stationId) {
      setError("Select both a highway and a station.");
      return;
    }

    try {
      await assignVehicle(vehicleId, {
        highway_id: Number(highwayId),
        charging_station_id: Number(stationId),
      });

      onDone();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Assignment failed."
      );
    }
  };

  return (
    <div className="bg-slate-900 rounded-lg p-4 mt-4 border border-slate-700">

      <p className="text-sm font-semibold text-cyan-400 mb-3">
        Assign to Highway + Station
      </p>

      <select
        className="w-full bg-slate-700 rounded-lg p-2 mb-3 text-sm"
        value={highwayId}
        onChange={(e) => setHighwayId(e.target.value)}
      >
        <option value="">Select Highway</option>

        {highways.map((highway) => (
          <option key={highway.id} value={highway.id}>
            {highway.name}
          </option>
        ))}
      </select>

      <select
        className="w-full bg-slate-700 rounded-lg p-2 mb-3 text-sm"
        value={stationId}
        onChange={(e) => setStationId(e.target.value)}
        disabled={!highwayId}
      >
        <option value="">
          {highwayId ? "Select Station" : "Select a highway first"}
        </option>

        {stations.map((station) => (
          <option key={station.id} value={station.id}>
            {station.name}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-red-400 text-xs mb-3">
          {error}
        </p>
      )}

      <div className="flex gap-3">

        <button
          onClick={handleConfirm}
          className="flex-1 bg-cyan-600 hover:bg-cyan-700 py-2 rounded-lg text-sm transition"
        >
          Confirm
        </button>

        <button
          onClick={onCancel}
          className="flex-1 bg-slate-600 hover:bg-slate-500 py-2 rounded-lg text-sm transition"
        >
          Cancel
        </button>

      </div>

    </div>
  );
}

export default VehicleAssignForm;