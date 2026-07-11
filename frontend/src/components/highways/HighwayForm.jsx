import { useEffect, useState } from "react";

function HighwayForm({
  onSubmit,
  editingHighway,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    name: "",
    length_km: 0,
    speed_limit: 0,
    lane_count: 2,
    charging_station_count: 0,
    traffic_density: "Low",
    status: "Active",
  });

  useEffect(() => {
    if (editingHighway) {
      setFormData(editingHighway);
    } else {
      setFormData({
        name: "",
        length_km: 0,
        speed_limit: 0,
        lane_count: 2,
        charging_station_count: 0,
        traffic_density: "Low",
        status: "Active",
      });
    }
  }, [editingHighway]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]:
        [
          "length_km",
          "speed_limit",
          "lane_count",
          "charging_station_count",
        ].includes(name)
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name) {
      alert("Please enter a highway name.");
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
        {editingHighway ? "Edit Highway" : "Add Highway"}
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        <input
          className="bg-slate-700 rounded-lg p-3"
          name="name"
          placeholder="Highway Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          className="bg-slate-700 rounded-lg p-3"
          type="number"
          name="length_km"
          placeholder="Length (km)"
          value={formData.length_km}
          onChange={handleChange}
        />

        <input
          className="bg-slate-700 rounded-lg p-3"
          type="number"
          name="speed_limit"
          placeholder="Speed Limit"
          value={formData.speed_limit}
          onChange={handleChange}
        />

        <input
          className="bg-slate-700 rounded-lg p-3"
          type="number"
          name="lane_count"
          placeholder="Lane Count"
          value={formData.lane_count}
          onChange={handleChange}
        />

        <input
          className="bg-slate-700 rounded-lg p-3"
          type="number"
          name="charging_station_count"
          placeholder="Charging Stations"
          value={formData.charging_station_count}
          onChange={handleChange}
        />

        <select
          className="bg-slate-700 rounded-lg p-3"
          name="traffic_density"
          value={formData.traffic_density}
          onChange={handleChange}
        >
          <option>Low</option>
          <option>Moderate</option>
          <option>High</option>
        </select>

      </div>

      <div className="flex gap-4 mt-6">

        <button
          className="bg-cyan-600 hover:bg-cyan-700 px-6 py-2 rounded-lg"
          type="submit"
        >
          {editingHighway ? "Update Highway" : "Add Highway"}
        </button>

        {editingHighway && (
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

export default HighwayForm;