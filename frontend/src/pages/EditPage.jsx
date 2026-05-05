import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function EditPage() {
  const { id } = useParams();

  const [form, setForm] = useState({
    companyName: "",
    complianceScore: "",
    status: "",
    description: "",
  });

  const fetchData = async () => {
    try {
      const res = await API.get(`/api/${id}`);
      setForm(res.data);
    } catch (err) {
      console.error("Error loading record:", err);
      alert("Failed to load record");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    if (!form.companyName || !form.status) {
      alert("Company and status required");
      return;
    }

    if (form.complianceScore !== "" && isNaN(form.complianceScore)) {
      alert("Score must be a number");
      return;
    }

    if (form.complianceScore < 0 || form.complianceScore > 100) {
      alert("Score must be between 0 and 100");
      return;
    }

    try {
      await API.put(`/api/${id}`, {
        ...form,
        complianceScore: form.complianceScore
          ? Number(form.complianceScore)
          : null,
      });

      alert("Updated successfully");
      window.location.href = "/list";
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed");
    }
  };

  return (
    <main className="app-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Record</h1>
          <p className="page-subtitle">
            Update compliance status, scoring, and audit context.
          </p>
        </div>
      </div>

      <section className="panel max-w-3xl space-y-5">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-slate-700">
            Company
          </span>
          <input
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            className="form-control"
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">
              Score
            </span>
            <input
              name="complianceScore"
              type="number"
              value={form.complianceScore || ""}
              onChange={handleChange}
              className="form-control"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">
              Status
            </span>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select Status</option>
              <option value="COMPLIANT">Compliant</option>
              <option value="NON-COMPLIANT">Non-Compliant</option>
            </select>
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-slate-700">
            Description
          </span>
          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            className="form-control min-h-32"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button onClick={handleUpdate} className="btn-accent">
            Update
          </button>
          <button
            onClick={() => (window.location.href = "/list")}
            className="btn-muted"
          >
            Cancel
          </button>
        </div>
      </section>
    </main>
  );
}
