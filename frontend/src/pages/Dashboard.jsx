import { useEffect, useState } from "react";

import { getVehicleStatuses } from "../api/vehicleApi";
import { getHighways } from "../api/highwayApi";
import { getChargingStations } from "../api/chargingStationApi";

function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [highways, setHighways] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [vehicleData, highwayData, stationData] = await Promise.all([
          getVehicleStatuses(),
          getHighways(),
          getChargingStations(),
        ]);

        setVehicles(vehicleData);
        setHighways(highwayData);
        setStations(stationData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const averageSoc = vehicles.length
    ? Math.round(
        vehicles.reduce((sum, v) => sum + v.soc, 0) / vehicles.length
      )
    : 0;

  const chargingCount = vehicles.filter(
    (v) => v.status === "Charging"
  ).length;

  const lowSocVehicles = vehicles.filter((v) => v.soc < 30);

  const highwayVehicleCounts = highways.map((highway) => ({
    ...highway,
    vehicleCount: vehicles.filter(
      (v) => v.highway && v.highway.id === highway.id
    ).length,
  }));

  const getSOCColor = (soc) => {
    if (soc >= 70) return "text-green-400";
    if (soc >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  if (loading) {
    return <div className="text-center py-10">Loading dashboard...</div>;
  }

  return (
    <div>

      <h1 className="text-4xl font-bold mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">Vehicles</p>
          <p className="text-3xl font-bold text-cyan-400">
            {vehicles.length}
          </p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">Highways</p>
          <p className="text-3xl font-bold text-cyan-400">
            {highways.length}
          </p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">Charging Stations</p>
          <p className="text-3xl font-bold text-cyan-400">
            {stations.length}
          </p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">Average SOC</p>
          <p className={`text-3xl font-bold ${getSOCColor(averageSoc)}`}>
            {averageSoc}%
          </p>
        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">

          <h2 className="text-xl font-bold text-cyan-400 mb-4">
            Highway Overview
          </h2>

          {highwayVehicleCounts.length === 0 ? (
            <p className="text-slate-400 text-sm">No highways yet.</p>
          ) : (
            <div className="space-y-3">

              {highwayVehicleCounts.map((highway) => (
                <div
                  key={highway.id}
                  className="flex justify-between items-center bg-slate-900 rounded-lg p-3"
                >
                  <div>
                    <p className="font-semibold">{highway.name}</p>
                    <p className="text-xs text-slate-400">
                      {highway.length_km} km · {highway.status}
                    </p>
                  </div>

                  <span className="text-cyan-400 font-bold">
                    {highway.vehicleCount} vehicle(s)
                  </span>
                </div>
              ))}

            </div>
          )}

        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">

          <h2 className="text-xl font-bold text-cyan-400 mb-4">
            ⚠️ Vehicles Needing Charge (SOC &lt; 30%)
          </h2>

          {lowSocVehicles.length === 0 ? (
            <p className="text-slate-400 text-sm">
              All vehicles above 30% SOC.
            </p>
          ) : (
            <div className="space-y-3">

              {lowSocVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="flex justify-between items-center bg-slate-900 rounded-lg p-3"
                >
                  <div>
                    <p className="font-semibold">
                      {vehicle.manufacturer} {vehicle.model}
                    </p>
                    <p className="text-xs text-slate-400">
                      {vehicle.highway
                        ? vehicle.highway.name
                        : "Unassigned"}
                    </p>
                  </div>

                  <span className="text-red-400 font-bold">
                    {vehicle.soc}%
                  </span>
                </div>
              ))}

            </div>
          )}

        </div>

      </div>

      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-xl font-bold text-cyan-400">
            Recent Vehicles
          </h2>

          <span className="text-slate-400 text-sm">
            {chargingCount} currently charging
          </span>

        </div>

        {vehicles.length === 0 ? (
          <p className="text-slate-400 text-sm">No vehicles yet.</p>
        ) : (
          <div className="space-y-2">

            {vehicles.slice(0, 5).map((vehicle) => (
              <div
                key={vehicle.id}
                className="flex justify-between items-center bg-slate-900 rounded-lg p-3 text-sm"
              >
                <span className="font-semibold">
                  {vehicle.manufacturer} {vehicle.model}
                </span>

                <span className="text-slate-400">
                  {vehicle.highway ? vehicle.highway.name : "Unassigned"}
                </span>

                <span className={`font-bold ${getSOCColor(vehicle.soc)}`}>
                  {vehicle.soc}%
                </span>

                <span className="text-slate-400">
                  {vehicle.status}
                </span>
              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Dashboard;