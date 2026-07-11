import { useState } from "react";

import { getRecommendation } from "../../api/vehicleApi";

function VehicleRecommendationPanel({ vehicleId, onClose }) {
  const [targetSoc, setTargetSoc] = useState(80);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await getRecommendation(vehicleId, Number(targetSoc));
      setResult(data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Could not calculate recommendation."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-lg p-4 mt-4 border border-purple-700">

      <p className="text-sm font-semibold text-purple-400 mb-3">
        🤖 AI Recommendation
      </p>

      <div className="flex gap-3 mb-3">

        <input
          type="number"
          min="0"
          max="100"
          className="flex-1 bg-slate-700 rounded-lg p-2 text-sm"
          placeholder="Target SOC %"
          value={targetSoc}
          onChange={(e) => setTargetSoc(e.target.value)}
        />

        <button
          onClick={handleCalculate}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm transition disabled:opacity-50"
        >
          {loading ? "Calculating..." : "Calculate"}
        </button>

      </div>

      {error && (
        <p className="text-red-400 text-xs mb-2">
          {error}
        </p>
      )}

      {result && (
        <div className="space-y-1 text-sm bg-slate-800 rounded-lg p-3">

          <p>
            <span className="font-semibold">Distance to station:</span>{" "}
            {result.distance_remaining_km} km
          </p>

          <p>
            <span className="font-semibold">Charging power:</span>{" "}
            {result.charging_power_kw} kW
          </p>

          <p>
            <span className="font-semibold">Charge rate:</span>{" "}
            {result.charge_rate_percent_per_hour}% / hour
          </p>

          <p>
            <span className="font-semibold">Time required:</span>{" "}
            {result.time_required_hours} hr
          </p>

          <p className="text-purple-400 font-bold text-base mt-2">
            Recommended speed: {result.recommended_speed_kmh} km/h
          </p>

          <p className="text-xs text-slate-400 mt-2">
            {result.message}
          </p>

        </div>
      )}

      <button
        onClick={onClose}
        className="w-full bg-slate-600 hover:bg-slate-500 py-2 rounded-lg text-sm mt-3 transition"
      >
        Close
      </button>

    </div>
  );
}

export default VehicleRecommendationPanel;