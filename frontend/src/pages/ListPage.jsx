import { useEffect, useState } from "react";
import API from "../services/api";

export default function ListPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [query, setQuery] = useState("");

  const fetchData = async () => {
    try {
      const res = await API.get("/api/all");
      setData(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  

  const handleSearch = async () => {
    try {
      const res = await API.get(`/api/search?q=${query}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      alert("Search failed");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this record?");
    if (!confirmDelete) return;

    try {
      setActionLoading(true);
      await API.delete(`/api/${id}`);
      await fetchData();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setActionLoading(false);
    }
  };

  const filterCompliant = async () => {
    const res = await API.get("/api/status/COMPLIANT");
    setData(res.data);
  };

  const filterNonCompliant = async () => {
    const res = await API.get("/api/status/NON-COMPLIANT");
    setData(res.data);
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Compliance List</h2>

      {/* SEARCH */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search company..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-3">
          Search
        </button>
        <button onClick={fetchData} className="bg-gray-500 text-white px-3">
          Reset
        </button>
      </div>

      {/* FILTER */}
      <div className="mb-4 flex gap-2">
        <button onClick={filterCompliant} className="bg-green-500 text-white px-3 py-1 rounded">
          Compliant
        </button>
        <button onClick={filterNonCompliant} className="bg-red-500 text-white px-3 py-1 rounded">
          Non-Compliant
        </button>
        <button onClick={fetchData} className="bg-gray-500 text-white px-3 py-1 rounded">
          Reset
        </button>
      </div>

      {actionLoading && <p>Processing...</p>}

      {data.length === 0 && <p>No records found</p>}

      {data.map((item) => (
        <div key={item.id} className="border p-3 mb-2 rounded">
          <p><b>{item.companyName}</b></p>
          <p>Status: {item.status}</p>
          <p>Score: {item.complianceScore}</p>

          <div className="mt-2 flex gap-2">
            <button onClick={() => window.location.href = `/details/${item.id}`}>View</button>
            <button onClick={() => window.location.href = `/edit/${item.id}`}>Edit</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}