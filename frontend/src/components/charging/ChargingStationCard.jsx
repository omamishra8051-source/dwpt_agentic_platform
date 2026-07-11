import { useEffect, useState } from "react";

import { getHighway } from "../../api/highwayApi";

function ChargingStationCard({ station, onEdit, onDelete }) {
  const [highwayName, setHighwayName] = useState("Loading...");

  useEffect(() => {
    const loadHighway = async () => {
      try {
        const highway = await getHighway(station.highway_id);
        setHighwayName(highway.name);
      } catch {
        setHighwayName("Unknown");
      }
    };

    loadHighway();
  }, [station.highway_id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-500";
      case "Occupied":
        return "bg-yellow-500";
      case "Offline":
        return "bg-red-500";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg">

      <div className="flex justify-between items-center mb-4">

        <h2 className="text-xl font-bold text-cyan-400">
          ⚡ {station.name}
        </h2>

        <span
          className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
            station.status
          )}`}
        >
          {station.status}
        </span>

      </div>

      <div className="space-y-2 text-sm">

        <p>
          <strong>Location:</strong> {station.location}
        </p>

        <p>
          <strong>Power Output:</strong> {station.power_output_kw} kW
        </p>

        <p>
          <strong>Highway:</strong> {highwayName}
        </p>

      </div>

      <div className="flex gap-3 mt-6">

        <button
          onClick={() => onEdit(station)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(station.id)}
          className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg"
        >
          Delete
        </button>

      </div>

    </div>
  );
}

export default ChargingStationCard;