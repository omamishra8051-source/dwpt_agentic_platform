import { useEffect, useState } from "react";

import {
  getHighways,
  addHighway,
  updateHighway,
  deleteHighway,
} from "../api/highwayApi";

import HighwayCard from "../components/highways/HighwayCard";
import HighwayForm from "../components/highways/HighwayForm";

function Highways() {
  const [highways, setHighways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingHighway, setEditingHighway] = useState(null);

  const loadHighways = async () => {
    setLoading(true);

    try {
      const data = await getHighways();
      setHighways(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHighways();
  }, []);

  const handleSubmit = async (highway) => {
    if (editingHighway) {
      await updateHighway(editingHighway.id, highway);
      setEditingHighway(null);
    } else {
      await addHighway(highway);
    }

    loadHighways();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete highway?")) return;

    await deleteHighway(id);

    loadHighways();
  };

  const filtered = highways.filter((highway) =>
    highway.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold">
          Highways
        </h1>

        <span className="text-slate-400">
          {highways.length} Highway(s)
        </span>

      </div>

      <HighwayForm
        onSubmit={handleSubmit}
        editingHighway={editingHighway}
        onCancel={() => setEditingHighway(null)}
      />

      <input
        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 mb-8"
        placeholder="Search highways..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">

          {filtered.map((highway) => (
            <HighwayCard
              key={highway.id}
              highway={highway}
              onEdit={setEditingHighway}
              onDelete={handleDelete}
            />
          ))}

        </div>
      )}

    </div>
  );
}

export default Highways;