import { useEffect, useRef, useState } from "react";

import { getVehicles } from "../api/vehicleApi";
import { runAgentPipeline } from "../api/agentApi";

const PIPELINE_STAGES = [
  {
    name: "DataAgent",
    icon: "\u{1F4E5}",
    blurb: "Pulls vehicle, highway & station records",
  },
  {
    name: "MonitoringAgent",
    icon: "\u{1F6A8}",
    blurb: "Flags low SoC / missing assignments",
  },
  {
    name: "RecommendationAgent",
    icon: "\u{26A1}",
    blurb: "Computes speed & charge-rate targets",
  },
  {
    name: "DecisionAgent",
    icon: "\u{1F9E0}",
    blurb: "Synthesizes the final action",
  },
];

const ACTION_STYLES = {
  LOW_SOC: "bg-red-500/10 border-red-500 text-red-400",
  SPEED_WARNING: "bg-amber-500/10 border-amber-500 text-amber-400",
  UNASSIGNED_HIGHWAY: "bg-amber-500/10 border-amber-500 text-amber-400",
  NO_STATION_ASSIGNED: "bg-amber-500/10 border-amber-500 text-amber-400",
  VEHICLE_NOT_FOUND: "bg-red-500/10 border-red-500 text-red-400",
  HALTED: "bg-red-500/10 border-red-500 text-red-400",
  MAINTAIN_RECOMMENDED_SPEED: "bg-green-500/10 border-green-500 text-green-400",
  TARGET_ALREADY_MET: "bg-cyan-500/10 border-cyan-500 text-cyan-400",
  NO_ACTION: "bg-slate-500/10 border-slate-500 text-slate-300",
};

function Agents() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [error, setError] = useState(null);
  const timers = useRef([]);

  useEffect(() => {
    getVehicles()
      .then((data) => {
        setVehicles(data);
        if (data.length > 0) setSelectedId(String(data[0].id));
      })
      .catch((err) => console.error(err));

    return () => timers.current.forEach(clearTimeout);
  }, []);

  const handleRun = async () => {
    if (!selectedId) return;

    timers.current.forEach(clearTimeout);
    timers.current = [];

    setRunning(true);
    setError(null);
    setResult(null);
    setRevealedCount(0);

    try {
      const data = await runAgentPipeline(selectedId);
      setResult(data);

      data.trace.forEach((_, idx) => {
        const t = setTimeout(() => {
          setRevealedCount(idx + 1);
          if (idx === data.trace.length - 1) setRunning(false);
        }, (idx + 1) * 650);
        timers.current.push(t);
      });
    } catch (err) {
      console.error(err);
      setError("Pipeline run failed — is the backend running?");
      setRunning(false);
    }
  };

  const actionStyle = result
    ? ACTION_STYLES[result.action_code] || ACTION_STYLES.NO_ACTION
    : "";

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">AI Agent Pipeline</h1>
      <p className="text-slate-400 mb-8">
        Blackboard-orchestrated agents that inspect fleet state and decide the
        next charging action — the scaffold this platform is designed to
        extend into full autonomous, model-driven decision-making.
      </p>

      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
        <h2 className="text-xl font-bold text-cyan-400 mb-5">Pipeline Architecture</h2>

        <div className="flex flex-col md:flex-row items-stretch gap-3">
          {PIPELINE_STAGES.map((stage, idx) => {
            const isActive = result && idx < revealedCount;
            return (
              <div key={stage.name} className="flex items-center gap-3 flex-1">
                <div
                  className={`flex-1 rounded-lg p-4 border transition-colors duration-300 ${
                    isActive
                      ? "bg-cyan-500/10 border-cyan-400"
                      : "bg-slate-900 border-slate-700"
                  }`}
                >
                  <div className="text-2xl mb-1">{stage.icon}</div>
                  <p className={`font-semibold text-sm ${isActive ? "text-cyan-300" : "text-slate-200"}`}>
                    {stage.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{stage.blurb}</p>
                </div>

                {idx < PIPELINE_STAGES.length - 1 && (
                  <span className="hidden md:block text-slate-600 text-xl">→</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="flex-1">
            <label className="block text-sm text-slate-400 mb-2">Select vehicle</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm"
            >
              {vehicles.length === 0 && <option value="">No vehicles found</option>}
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.manufacturer} {v.model} — SoC {v.soc}%
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRun}
            disabled={running || !selectedId}
            className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-semibold rounded-lg px-6 py-2 text-sm transition-colors"
          >
            {running ? "Running..." : "▶ Run Pipeline"}
          </button>
        </div>

        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </div>

      {result && (
        <div className="space-y-4">
          {result.trace.slice(0, revealedCount).map((step, idx) => (
            <div
              key={idx}
              className="bg-slate-800 rounded-xl p-5 border border-slate-700 animate-[fadeIn_0.4s_ease-in]"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{PIPELINE_STAGES[idx]?.icon}</span>
                  <span className="font-bold text-cyan-400">{step.agent}</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  {step.duration_ms} ms
                </span>
              </div>

              <p className="text-sm text-slate-200 mb-3">{step.summary}</p>

              <pre className="bg-slate-900 rounded-lg p-3 text-xs text-slate-400 overflow-x-auto">
{JSON.stringify(step.output, null, 2)}
              </pre>
            </div>
          ))}

          {revealedCount >= result.trace.length && (
            <div className={`rounded-xl p-6 border-2 ${actionStyle}`}>
              <p className="text-xs uppercase tracking-wide opacity-70 mb-1">
                Final Decision · {result.action_code} · {result.total_duration_ms} ms total
              </p>
              <p className="text-lg font-semibold">{result.final_decision}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Agents;
