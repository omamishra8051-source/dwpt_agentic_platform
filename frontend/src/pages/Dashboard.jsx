function Dashboard() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-xl p-6">
          Vehicles
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          Highways
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          Charging
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          AI Agents
        </div>
      </div>
    </>
  );
}

export default Dashboard;