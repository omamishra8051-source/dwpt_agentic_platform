import { NavLink } from "react-router-dom";

const links = [
  { name: "Dashboard", path: "/dashboard", icon: "🏠" },
  { name: "Vehicles", path: "/vehicles", icon: "🚗" },
  { name: "Highways", path: "/highways", icon: "🛣️" },
  { name: "Charging", path: "/charging", icon: "⚡" },
  { name: "Live Status", path: "/status", icon: "📡" },
  { name: "Track Map", path: "/track", icon: "🗺️" },
  { name: "AI Agents", path: "/agents", icon: "🤖" },
  { name: "Analytics", path: "/analytics", icon: "📊" },
  { name: "Settings", path: "/settings", icon: "⚙️" },
];

function Sidebar() {
  return (
    <aside className="w-64 min-h-[calc(100vh-64px)] bg-slate-800 border-r border-slate-700">
      <nav className="flex flex-col p-4 gap-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `rounded-lg p-3 transition ${
                isActive
                  ? "bg-cyan-600 text-white"
                  : "hover:bg-slate-700"
              }`
            }
          >
            {link.icon} {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;