import { useEffect, useState } from "react";

function VehicleForm({
  onSubmit,
  editingVehicle,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    manufacturer: "",
    model: "",
    battery_capacity: "",
    soc: 100,
    position_km: 0,
    target_soc: "",
  });

  useEffect(() => {
    if (editingVehicle) {
      setFormData({
        manufacturer: editingVehicle.manufacturer,
        model: editingVehicle.model,
        battery_capacity: editingVehicle.battery_capacity,
        soc: editingVehicle.soc,
        position_km: editingVehicle.position_km ?? 0,
        target_soc: editingVehicle.target_soc ?? "",
      });
    } else {
      setFormData({
        manufacturer: "",
        model: "",
        battery_capacity: "",
        soc: 100,
        position_km: 0,
        target_soc: "",
      });
    }
  }, [editingVehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]:
        ["soc", "position_km", "target_soc"].includes(name)
          ? value === ""
            ? ""
            : Number(value)
          : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.manufacturer ||
      !formData.model ||
      !formData.battery_capacity
    ) {
      alert("Please fill all required fields.");
      return;
    }

    onSubmit({
      ...formData,
      target_soc: formData.target_soc === "" ? null : formData.target_soc,
    });

    if (!editingVehicle) {
      setFormData({
        manufacturer: "",
        model: "",
        battery_capacity: "",
        soc: 100,
        position_km: 0,
        target_soc: "",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg mb-8"
    >
      <h2 className="text-2xl font-semibold text-cyan-400 mb-6">
        {editingVehicle ? "Edit Vehicle" : "Add Vehicle"}
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        <input
          className="bg-slate-700 rounded-lg p-3 outline-none"
          name="manufacturer"
          placeholder="Manufacturer"
          value={formData.manufacturer}
          onChange={handleChange}
        />

        <input
          className="bg-slate-700 rounded-lg p-3 outline-none"
          name="model"
          placeholder="Model"
          value={formData.model}
          onChange={handleChange}
        />

        <input
          className="bg-slate-700 rounded-lg p-3 outline-none"
          name="battery_capacity"
          placeholder="Battery Capacity"
          value={formData.battery_capacity}
          onChange={handleChange}
        />

        <input
          className="bg-slate-700 rounded-lg p-3 outline-none"
          type="number"
          min="0"
          max="100"
          name="soc"
          placeholder="Current SOC"
          value={formData.soc}
          onChange={handleChange}
        />

        <input
          className="bg-slate-700 rounded-lg p-3 outline-none"
          type="number"
          min="0"
          name="position_km"
          placeholder="Current Position (km)"
          value={formData.position_km}
          onChange={handleChange}
        />

        <input
          className="bg-slate-700 rounded-lg p-3 outline-none"
          type="number"
          min="0"
          max="100"
          name="target_soc"
          placeholder="Target SOC at next station (optional)"
          value={formData.target_soc}
          onChange={handleChange}
        />

      </div>

      <div className="flex gap-4 mt-6">

        <button
          type="submit"
          className="bg-cyan-600 hover:bg-cyan-700 px-6 py-2 rounded-lg transition"
        >
          {editingVehicle
            ? "Update Vehicle"
            : "Add Vehicle"}
        </button>

        {editingVehicle && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-slate-600 hover:bg-slate-500 px-6 py-2 rounded-lg transition"
          >
            Cancel
          </button>
        )}

      </div>
    </form>
  );
}

export default VehicleForm;