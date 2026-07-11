function Navbar() {
  return (
    <header className="h-16 border-b border-slate-700 bg-slate-800 flex items-center justify-between px-8">
      <h1 className="text-2xl font-bold text-cyan-400">
        DWPT Agentic Platform
      </h1>

      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-green-500"></div>

        <span>Backend Connected</span>
      </div>
    </header>
  );
}

export default Navbar;