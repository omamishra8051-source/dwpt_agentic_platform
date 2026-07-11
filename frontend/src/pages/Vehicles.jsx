import { useEffect, useState } from "react";

import {
  getVehicleStatuses,
  addVehicle,
  updateVehicle,
  deleteVehicle,
} from "../api/vehicleApi";

import VehicleCard from "../components/vehicles/VehicleCard";
import VehicleForm from "../components/vehicles/VehicleForm";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingVehicle, setEditingVehicle] = useState(null);

  const loadVehicles = async () => {
    setLoading(true);

    try {
      const data = await getVehicleStatuses();
      setVehicles(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load vehicles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleSubmit = async (vehicle) => {
    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, vehicle);
        setEditingVehicle(null);
      } else {
        await addVehicle(vehicle);
      }

      loadVehicles();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this vehicle?"
    );

    if (!confirmDelete) return;

    await deleteVehicle(id);

    loadVehicles();
  };

  const filteredVehicles = vehicles.filter((vehicle) =>
    `${vehicle.manufacturer} ${vehicle.model}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold">
          Vehicles
        </h1>

        <span className="text-slate-400">
          {vehicles.length} Vehicle(s)
        </span>

      </div>

      <VehicleForm
        onSubmit={handleSubmit}
        editingVehicle={editingVehicle}
        onCancel={() => setEditingVehicle(null)}
      />

      <input
        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 mb-8"
        placeholder="Search vehicles..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (

        <div className="text-center py-10">
          Loading vehicles...
        </div>

      ) : filteredVehicles.length === 0 ? (

        <div className="text-center py-10 text-slate-400">
          No vehicles found.
        </div>

      ) : (

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">

          {filteredVehicles.map((vehicle) => (

            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onEdit={setEditingVehicle}
              onDelete={handleDelete}
              onAssigned={loadVehicles}
            />

          ))}

        </div>

      )}

    </div>
  );
}

export default Vehicles;