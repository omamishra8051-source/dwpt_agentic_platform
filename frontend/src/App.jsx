import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import Highways from "./pages/Highways";
import Charging from "./pages/Charging";
import VehicleStatus from "./pages/VehicleStatus";
import TrackMap from "./pages/TrackMap";
import Agents from "./pages/Agents";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/highways" element={<Highways />} />
        <Route path="/charging" element={<Charging />} />
        <Route path="/status" element={<VehicleStatus />} />
        <Route path="/track" element={<TrackMap />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;