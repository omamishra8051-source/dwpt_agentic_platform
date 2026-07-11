import { useState } from "react";

import VehicleAssignForm from "./VehicleAssignForm";
import VehicleRecommendationPanel from "./VehicleRecommendationPanel";

function VehicleCard({ vehicle, onEdit, onDelete, onAssigned }) {
  const [assigning, setAssigning] = useState(false);
  const [recommending, setRecommending] = useState(false);

  const getSOCColor = (soc) => {
    if (soc >= 70) return "bg-green-500";
    if (soc >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getHealthColor = (health) => {
    switch (health) {
      case "Excellent":
        return "bg-green-600";
      case "Good":
        return "bg-green-500";
      case "Fair":
        return "bg-yellow-500";
      case "Poor":
        return "bg-red-500";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-5 hover:shadow-cyan-500/20 transition-all duration-300 border border-slate-700">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-cyan-400">
          🚗 {vehicle.manufacturer}
        </h2>

        <span
          className={`text-xs px-3 py-1 rounded-full ${getHealthColor(
            vehicle.battery_health
          )}`}
        >
          {vehicle.battery_health}
        </span>
      </div>

      <div className="space-y-2 text-sm">

        <p>
          <span className="font-semibold">Model:</span>{" "}
          {vehicle.model}
        </p>

        <p>
          <span className="font-semibold">
            Battery:
          </span>{" "}
          {vehicle.battery_capacity}
        </p>

        <p>
          <span className="font-semibold">
            Highway:
          </span>{" "}
          {vehicle.highway ? vehicle.highway.name : "Unassigned"}
        </p>

        <p>
          <span className="font-semibold">
            Station:
          </span>{" "}
          {vehicle.charging_station
            ? vehicle.charging_station.name
            : "Not connected"}
        </p>

        <p>
          <span className="font-semibold">
            Status:
          </span>{" "}
          {vehicle.status}
        </p>

      </div>

      <div className="mt-5">

        <div className="flex justify-between mb-1 text-sm">
          <span>SOC</span>

          <span>{vehicle.soc}%</span>
        </div>

        <div className="w-full bg-slate-700 rounded-full h-3">

          <div
            className={`${getSOCColor(
              vehicle.soc
            )} h-3 rounded-full transition-all`}
            style={{
              width: `${vehicle.soc}%`,
            }}
          />

        </div>

      </div>

      <div className="flex gap-3 mt-6">

        <button
          onClick={() => onEdit(vehicle)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition"
        >
          Edit
        </button>

        <button
          onClick={() => setAssigning(!assigning)}
          className="flex-1 bg-cyan-700 hover:bg-cyan-600 py-2 rounded-lg transition"
        >
          {assigning ? "Close" : "Assign"}
        </button>

        <button
          onClick={() => setRecommending(!recommending)}
          className="flex-1 bg-purple-700 hover:bg-purple-600 py-2 rounded-lg transition"
        >
          {recommending ? "Close" : "AI"}
        </button>

        <button
          onClick={() => onDelete(vehicle.id)}
          className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg transition"
        >
          Delete
        </button>

      </div>

      {assigning && (
        <VehicleAssignForm
          vehicleId={vehicle.id}
          onDone={() => {
            setAssigning(false);
            onAssigned();
          }}
          onCancel={() => setAssigning(false)}
        />
      )}

      {recommending && (
        <VehicleRecommendationPanel
          vehicleId={vehicle.id}
          onClose={() => setRecommending(false)}
        />
      )}

    </div>
  );
}

export default VehicleCard;