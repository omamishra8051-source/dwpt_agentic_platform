import { useEffect, useState } from "react";

import { getRecommendation } from "../../api/vehicleApi";

const MIN_DEMO_SECONDS = 8;
const MAX_DEMO_SECONDS = 25;
const DEMO_SECONDS_PER_REAL_HOUR = 6;
const SPEED_JITTER_PERIOD_MS = 2000;
const SPEED_JITTER_AMPLITUDE = 0.25;

function getSocColor(soc) {
  if (soc >= 70) return "#22c55e";
  if (soc >= 40) return "#eab308";
  return "#ef4444";
}

function pseudoRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function smoothJitterFactor(seed, elapsedMs) {
  const bucket = elapsedMs / SPEED_JITTER_PERIOD_MS;
  const idx = Math.floor(bucket);
  const frac = bucket - idx;

  const r1 = pseudoRandom(seed + idx);
  const r2 = pseudoRandom(seed + idx + 1);

  const r = r1 + (r2 - r1) * frac;

  return 1 + (r - 0.5) * 2 * SPEED_JITTER_AMPLITUDE;
}

function HighwayTrack({ highway, stations, vehicles }) {
  const [trips, setTrips] = useState({});
  const [, forceTick] = useState(0);

  const trackStartX = 60;
  const trackEndX = 940;
  const trackWidth = trackEndX - trackStartX;

  const lengthKm = highway.length_km || 1;
  const speedLimit = highway.speed_limit || 60;

  const kmToX = (km) =>
    trackStartX + (clamp(km, 0, lengthKm) / lengthKm) * trackWidth;

  useEffect(() => {
    let cancelled = false;

    const buildTrips = async () => {
      const newTrips = {};

      for (const vehicle of vehicles) {
        const startKm = vehicle.position_km || 0;

        if (vehicle.highway && vehicle.charging_station) {
          const desiredTarget =
            vehicle.target_soc !== null && vehicle.target_soc !== undefined
              ? vehicle.target_soc
              : vehicle.soc;

          try {
            const rec = await getRecommendation(vehicle.id, desiredTarget);

            const endKm = rec.distance_remaining_km + startKm;

            if (rec.soc_needed_percent > 0) {
              const durationSeconds = clamp(
                rec.time_required_hours * DEMO_SECONDS_PER_REAL_HOUR,
                MIN_DEMO_SECONDS,
                MAX_DEMO_SECONDS
              );

              newTrips[vehicle.id] = {
                type: "charging",
                startKm,
                endKm,
                startSoc: vehicle.soc,
                targetSoc: desiredTarget,
                baseSpeed: rec.recommended_speed_kmh,
                durationMs: durationSeconds * 1000,
                startTime: performance.now(),
              };
            } else {
              const durationSeconds = clamp(
                (rec.distance_remaining_km / speedLimit) *
                  DEMO_SECONDS_PER_REAL_HOUR,
                MIN_DEMO_SECONDS,
                MAX_DEMO_SECONDS
              );

              newTrips[vehicle.id] = {
                type: "cruise",
                startKm,
                endKm,
                soc: vehicle.soc,
                baseSpeed: speedLimit,
                durationMs: durationSeconds * 1000,
                startTime: performance.now(),
              };
            }
          } catch {
            newTrips[vehicle.id] = {
              type: "loop",
              startKm: 0,
              endKm: lengthKm,
              soc: vehicle.soc,
              baseSpeed: speedLimit,
              durationMs:
                clamp(
                  (lengthKm / speedLimit) * DEMO_SECONDS_PER_REAL_HOUR,
                  MIN_DEMO_SECONDS,
                  MAX_DEMO_SECONDS
                ) * 1000,
              startTime: performance.now(),
            };
          }
        } else {
          newTrips[vehicle.id] = {
            type: "loop",
            startKm: 0,
            endKm: lengthKm,
            soc: vehicle.soc,
            baseSpeed: speedLimit,
            durationMs:
              clamp(
                (lengthKm / speedLimit) * DEMO_SECONDS_PER_REAL_HOUR,
                MIN_DEMO_SECONDS,
                MAX_DEMO_SECONDS
              ) * 1000,
            startTime: performance.now(),
          };
        }
      }

      if (!cancelled) {
        setTrips(newTrips);
      }
    };

    buildTrips();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicles.map((v) => v.id).join(","), lengthKm]);

  useEffect(() => {
    const interval = setInterval(() => {
      forceTick((t) => t + 1);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const renderVehicle = (vehicle) => {
    const trip = trips[vehicle.id];

    if (!trip) return null;

    const elapsed = performance.now() - trip.startTime;
    const progress = (elapsed % trip.durationMs) / trip.durationMs;

    const currentKm = trip.startKm + progress * (trip.endKm - trip.startKm);
    const x = kmToX(currentKm % lengthKm);

    const jitter = smoothJitterFactor(vehicle.id * 977, elapsed);
    const currentSpeed = Math.max(5, Math.round(trip.baseSpeed * jitter));

    let currentSoc;
    let warning = false;
    let speedLabel;

    if (trip.type === "charging") {
      currentSoc = Math.round(
        trip.startSoc + progress * (trip.targetSoc - trip.startSoc)
      );

      warning =
        Math.abs(currentSpeed - trip.baseSpeed) > trip.baseSpeed * 0.15;

      speedLabel = `${currentSpeed} km/h (rec ${Math.round(trip.baseSpeed)})`;
    } else {
      currentSoc = Math.round(trip.soc);
      speedLabel = `${currentSpeed} km/h`;
    }

    return (
      <g key={vehicle.id} transform={`translate(${x}, 70)`}>
        <circle
          cx="0"
          cy="0"
          r="9"
          fill={getSocColor(currentSoc)}
          stroke={warning ? "#f97316" : "#0f172a"}
          strokeWidth={warning ? "3" : "2"}
        />

        <text x="0" y="4" fontSize="10" textAnchor="middle">
          🚗
        </text>

        <text
          x="0"
          y="24"
          fill="#e2e8f0"
          fontSize="10"
          textAnchor="middle"
        >
          {vehicle.manufacturer} · {currentSoc}%
        </text>

        <text
          x="0"
          y="37"
          fill={warning ? "#fb923c" : "#64748b"}
          fontSize="9"
          textAnchor="middle"
        >
          {warning ? "⚠ " : ""}{speedLabel}
        </text>
      </g>
    );
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 mb-6">

      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-cyan-400">
          🛣️ {highway.name}
        </h3>

        <span className="text-xs text-slate-400">
          {highway.length_km} km · limit {highway.speed_limit} km/h
        </span>
      </div>

      <svg viewBox="0 0 1000 150" className="w-full h-40">

        <line
          x1={trackStartX}
          y1="70"
          x2={trackEndX}
          y2="70"
          stroke="#475569"
          strokeWidth="6"
          strokeLinecap="round"
        />

        <text x={trackStartX} y="105" fill="#94a3b8" fontSize="12">
          0 km
        </text>

        <text x={trackEndX - 30} y="105" fill="#94a3b8" fontSize="12">
          {highway.length_km} km
        </text>

        {stations.map((station) => {
          const x = kmToX(station.position_km || 0);

          return (
            <g key={station.id} transform={`translate(${x}, 70)`}>
              <line x1="0" y1="-14" x2="0" y2="14" stroke="#a855f7" strokeWidth="3" />
              <circle cx="0" cy="-14" r="5" fill="#a855f7" />
              <text
                x="0"
                y="-22"
                fill="#c084fc"
                fontSize="10"
                textAnchor="middle"
              >
                ⚡ {station.name}
              </text>
            </g>
          );
        })}

        {vehicles.map(renderVehicle)}

      </svg>

      {vehicles.length === 0 && (
        <p className="text-slate-500 text-sm text-center mt-2">
          No vehicles assigned to this highway.
        </p>
      )}

    </div>
  );
}

export default HighwayTrack;