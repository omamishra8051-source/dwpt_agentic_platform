import { useEffect, useState } from "react";

import { getVehicleStatuses } from "../api/vehicleApi";

const POLL_INTERVAL_MS = 5000;

function getSOCColor(soc) {
  if (soc >= 70) return "bg-green-500";
  if (soc >= 40) return "bg-yellow-500";
  return "bg-red-500";
}

function getStatusColor(status) {
  switch (status) {
    case "Charging":
      return "bg-cyan-600";
    case "Idle":
      return "bg-slate-600";
    case "In Transit":
      return "bg-purple-600";
    default:
      return "bg-slate-500";
  }
}

function VehicleStatus() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadStatuses = async () => {
    try {
      const data = await getVehicleStatuses();
      setVehicles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatuses();

    const interval = setInterval(loadStatuses, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const grouped = vehicles.reduce((acc, vehicle) => {
    const highwayName = vehicle.highway
      ? vehicle.highway.name
      : "Unassigned";

    if (!acc[highwayName]) {
      acc[highwayName] = [];
    }

    acc[highwayName].push(vehicle);

    return acc;
  }, {});

  return (
    <div>

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold">
          Live Vehicle Status
        </h1>

        <span className="text-slate-400">
          {vehicles.length} Vehicle(s)
        </span>

      </div>

      {loading ? (

        <div className="text-center py-10">
          Loading vehicle status...
        </div>

      ) : vehicles.length === 0 ? (

        <div className="text-center py-10 text-slate-400">
          No vehicles found.
        </div>

      ) : (

        Object.entries(grouped).map(([highwayName, highwayVehicles]) => (

          <div key={highwayName} className="mb-10">

            <h2 className="text-xl font-bold text-cyan-400 mb-4">
              🛣️ {highwayName}
            </h2>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">

              {highwayVehicles.map((vehicle) => (

                <div
                  key={vehicle.id}
                  className="bg-slate-800 rounded-xl shadow-lg p-5 border border-slate-700"
                >

                  <div className="flex justify-between items-center mb-4">

                    <h3 className="text-lg font-bold">
                      {vehicle.manufacturer} {vehicle.model}
                    </h3>

                    <span
                      className={`text-xs px-3 py-1 rounded-full ${getStatusColor(
                        vehicle.status
                      )}`}
                    >
                      {vehicle.status}
                    </span>

                  </div>

                  <div className="space-y-2 text-sm mb-4">

                    <p>
                      <span className="font-semibold">
                        Station:
                      </span>{" "}
                      {vehicle.charging_station
                        ? vehicle.charging_station.name
                        : "Not connected"}
                    </p>

                  </div>

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

              ))}

            </div>

          </div>

        ))

      )}

    </div>
  );
}

export default VehicleStatus;