function HighwayCard({ highway, onEdit, onDelete }) {
  const getTrafficColor = (traffic) => {
    switch (traffic) {
      case "Low":
        return "bg-green-500";
      case "Moderate":
        return "bg-yellow-500";
      case "High":
        return "bg-red-500";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg">

      <div className="flex justify-between items-center mb-4">

        <h2 className="text-2xl font-bold text-cyan-400">
          🛣 {highway.name}
        </h2>

        <span
          className={`px-3 py-1 rounded-full text-sm ${getTrafficColor(
            highway.traffic_density
          )}`}
        >
          {highway.traffic_density}
        </span>

      </div>

      <div className="space-y-2">

        <p>
          <strong>Length:</strong> {highway.length_km} km
        </p>

        <p>
          <strong>Speed Limit:</strong> {highway.speed_limit} km/h
        </p>

        <p>
          <strong>Lanes:</strong> {highway.lane_count}
        </p>

        <p>
          <strong>Charging Stations:</strong>{" "}
          {highway.charging_station_count}
        </p>

        <p>
          <strong>Status:</strong> {highway.status}
        </p>

      </div>

      <div className="flex gap-3 mt-6">

        <button
          onClick={() => onEdit(highway)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(highway.id)}
          className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg"
        >
          Delete
        </button>

      </div>

    </div>
  );
}

export default HighwayCard;