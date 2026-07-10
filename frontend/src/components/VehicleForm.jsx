import { useState } from "react";

function VehicleForm({ onAdd }) {
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [battery, setBattery] = useState("");
  const [soc, setSoc] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!manufacturer || !model || !battery || soc === "") {
      alert("Please fill all fields.");
      return;
    }

    onAdd({
      manufacturer,
      model,
      battery_capacity: battery,
      soc: Number(soc),
    });

    setManufacturer("");
    setModel("");
    setBattery("");
    setSoc("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        justifyContent: "center",
        marginBottom: "30px",
      }}
    >
      <input
        placeholder="Manufacturer"
        value={manufacturer}
        onChange={(e) => setManufacturer(e.target.value)}
      />

      <input
        placeholder="Model"
        value={model}
        onChange={(e) => setModel(e.target.value)}
      />

      <input
        placeholder="Battery"
        value={battery}
        onChange={(e) => setBattery(e.target.value)}
      />

      <input
        type="number"
        placeholder="SOC"
        value={soc}
        onChange={(e) => setSoc(e.target.value)}
      />

      <button type="submit">
        Add Vehicle
      </button>
    </form>
  );
}

export default VehicleForm;