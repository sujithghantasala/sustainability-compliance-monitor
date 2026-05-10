import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

const PAGE_SIZE = 8;

export default function ListPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 350);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    fetchData();
  }, [debouncedQuery, status, from, to]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/api/search", {
        params: {
          q: debouncedQuery || undefined,
          status: status || undefined,
          from: from || undefined,
          to: to || undefined,
        },
      });
      setData(res.data);
      setPage(1);
    } catch {
      setError("Failed to load records.");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const pageData = useMemo(
    () => data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [data, page]
  );

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this record?");
    if (!confirmDelete) return;

    try {
      setActionLoading(true);
      await API.delete(`/api/${id}`);
      await fetchData();
    } catch {
      setError("Delete failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const exportCsv = async () => {
    const res = await API.get("/api/export", { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "records.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const uploadCsv = async () => {
    if (!uploadFile) {
      setError("Choose a CSV file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      setActionLoading(true);
      await API.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadFile(null);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const resetFilters = () => {
    setQuery("");
    setDebouncedQuery("");
    setStatus("");
    setFrom("");
    setTo("");
  };

  const statusClass = (recordStatus) =>
    recordStatus === "COMPLIANT"
      ? "bg-emerald-50 text-emerald-700"
      : recordStatus === "PENDING_REVIEW"
        ? "bg-amber-50 text-amber-700"
        : "bg-rose-50 text-rose-700";

  return (
    <main className="app-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Compliance Records</h1>
          <p className="page-subtitle">
            Search, filter, export, upload, and manage compliance reviews.
          </p>
        </div>
        <button onClick={() => (window.location.href = "/add")} className="btn-accent">
          Add Record
        </button>
      </div>

      <section className="panel mb-5">
        <div className="grid gap-3 lg:grid-cols-[1.2fr_0.7fr_0.7fr_0.7fr]">
          <input
            type="text"
            placeholder="Search company..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="form-control"
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-control">
            <option value="">All statuses</option>
            <option value="COMPLIANT">Compliant</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="NON-COMPLIANT">Non-Compliant</option>
          </select>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="form-control" />
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="form-control" />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={resetFilters} className="btn-muted">Reset</button>
          <button onClick={exportCsv} className="btn-primary">Export CSV</button>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
            className="form-control max-w-xs"
          />
          <button onClick={uploadCsv} disabled={actionLoading} className="btn-muted">Upload CSV</button>
        </div>
      </section>

      {error && <p className="mb-4 text-sm font-semibold text-rose-700">{error}</p>}
      {(loading || actionLoading) && <p className="mb-4 text-sm text-slate-600">Loading...</p>}

      {!loading && data.length === 0 ? (
        <div className="panel text-center text-slate-600">No records found.</div>
      ) : (
        <section className="panel overflow-x-auto p-0">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pageData.map((item) => (
                <tr key={item.id} className="align-top">
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-950">{item.companyName}</p>
                    <p className="mt-1 line-clamp-2 max-w-xl text-slate-500">{item.description}</p>
                  </td>
                  <td className="px-4 py-3 font-bold text-[#1B4F8A]">{item.complianceScore}</td>
                  <td className="px-4 py-3">
                    <span className={`status-pill ${statusClass(item.status)}`}>{item.status}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => (window.location.href = `/details/${item.id}`)} className="btn-primary">View</button>
                      <button onClick={() => (window.location.href = `/edit/${item.id}`)} className="btn-muted">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="btn-danger">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Page {page} of {totalPages} - {data.length} records
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1} className="btn-muted">
                Previous
              </button>
              <button onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={page === totalPages} className="btn-muted">
                Next
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
