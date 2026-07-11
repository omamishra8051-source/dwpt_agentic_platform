import { useEffect, useState } from "react";

import { getVehicleStatuses } from "../api/vehicleApi";
import { getHighways } from "../api/highwayApi";
import { getChargingStations } from "../api/chargingStationApi";

import HighwayTrack from "../components/tracker/HighwayTrack";

function TrackMap() {
  const [highways, setHighways] = useState([]);
  const [stations, setStations] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [highwayData, stationData, vehicleData] = await Promise.all([
          getHighways(),
          getChargingStations(),
          getVehicleStatuses(),
        ]);

        setHighways(highwayData);
        setStations(stationData);
        setVehicles(vehicleData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
          Track Map
        </h1>

        <span className="text-slate-400 text-sm">
          Simulated movement for demo purposes
        </span>
      </div>

      {loading ? (
        <p>Loading track map...</p>
      ) : highways.length === 0 ? (
        <p className="text-slate-400">No highways yet.</p>
      ) : (
        highways.map((highway) => (
          <HighwayTrack
            key={highway.id}
            highway={highway}
            stations={stations.filter(
              (s) => s.highway_id === highway.id
            )}
            vehicles={vehicles.filter(
              (v) => v.highway && v.highway.id === highway.id
            )}
          />
        ))
      )}

    </div>
  );
}

export default TrackMap;