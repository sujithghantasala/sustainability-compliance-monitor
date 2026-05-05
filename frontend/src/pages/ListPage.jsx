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

  const filterByStatus = async (status) => {
    const res = await API.get(`/api/status/${status}`);
    setData(res.data);
  };

  const statusClass = (status) =>
    status === "COMPLIANT"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-rose-50 text-rose-700";

  if (loading) return <div className="app-page">Loading records...</div>;

  return (
    <main className="app-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Compliance Records</h1>
          <p className="page-subtitle">
            Search, filter, edit, and open records for AI-assisted review.
          </p>
        </div>
        <button onClick={() => (window.location.href = "/add")} className="btn-accent">
          Add Record
        </button>
      </div>

      <section className="panel mb-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row">
            <input
              type="text"
              placeholder="Search company..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="form-control sm:max-w-sm"
            />
            <button onClick={handleSearch} className="btn-primary">
              Search
            </button>
            <button onClick={fetchData} className="btn-muted">
              Reset
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => filterByStatus("COMPLIANT")}
              className="btn-muted"
            >
              Compliant
            </button>
            <button
              onClick={() => filterByStatus("NON-COMPLIANT")}
              className="btn-muted"
            >
              Non-Compliant
            </button>
          </div>
        </div>
      </section>

      {actionLoading && <p className="mb-4 text-sm text-slate-600">Processing...</p>}

      {data.length === 0 ? (
        <div className="panel text-center text-slate-600">No records found.</div>
      ) : (
        <div className="grid gap-3">
          {data.map((item) => (
            <article key={item.id} className="panel">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-bold text-slate-950">
                      {item.companyName}
                    </h2>
                    <span className={`status-pill ${statusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Score:{" "}
                    <span className="font-bold text-[#106EBE]">
                      {item.complianceScore ?? 0}
                    </span>
                  </p>
                  {item.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => (window.location.href = `/details/${item.id}`)}
                    className="btn-primary"
                  >
                    View
                  </button>
                  <button
                    onClick={() => (window.location.href = `/edit/${item.id}`)}
                    className="btn-muted"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
