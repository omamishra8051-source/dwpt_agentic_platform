import { useEffect, useState } from "react";

import { getHighways } from "../../api/highwayApi";

function ChargingStationForm({
  onSubmit,
  editingStation,
  onCancel,
}) {
  const [highways, setHighways] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    power_output_kw: 0,
    status: "Available",
    highway_id: "",
  });

  useEffect(() => {
    const loadHighways = async () => {
      const data = await getHighways();
      setHighways(data);
    };

    loadHighways();
  }, []);

  useEffect(() => {
    if (editingStation) {
      setFormData(editingStation);
    } else {
      setFormData({
        name: "",
        location: "",
        power_output_kw: 0,
        status: "Available",
        highway_id: "",
      });
    }
  }, [editingStation]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]:
        ["power_output_kw", "highway_id"].includes(name)
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.highway_id) {
      alert("Please enter a station name and select a highway.");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8"
    >
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">
        {editingStation ? "Edit Charging Station" : "Add Charging Station"}
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        <input
          className="bg-slate-700 rounded-lg p-3"
          name="name"
          placeholder="Station Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          className="bg-slate-700 rounded-lg p-3"
          name="location"
          placeholder="Location (e.g. Km 15)"
          value={formData.location}
          onChange={handleChange}
        />

        <input
          className="bg-slate-700 rounded-lg p-3"
          type="number"
          name="power_output_kw"
          placeholder="Power Output (kW)"
          value={formData.power_output_kw}
          onChange={handleChange}
        />

        <select
          className="bg-slate-700 rounded-lg p-3"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option>Available</option>
          <option>Occupied</option>
          <option>Offline</option>
        </select>

        <select
          className="bg-slate-700 rounded-lg p-3 md:col-span-2"
          name="highway_id"
          value={formData.highway_id}
          onChange={handleChange}
        >
          <option value="">Select Highway</option>

          {highways.map((highway) => (
            <option key={highway.id} value={highway.id}>
              {highway.name}
            </option>
          ))}
        </select>

      </div>

      <div className="flex gap-4 mt-6">

        <button
          className="bg-cyan-600 hover:bg-cyan-700 px-6 py-2 rounded-lg"
          type="submit"
        >
          {editingStation ? "Update Station" : "Add Station"}
        </button>

        {editingStation && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-slate-600 px-6 py-2 rounded-lg"
          >
            Cancel
          </button>
        )}

      </div>
    </form>
  );
}

export default ChargingStationForm;