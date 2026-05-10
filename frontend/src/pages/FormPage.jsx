import { useState } from "react";
import API from "../services/api";

function FormPage() {
  const [form, setForm] = useState({
    companyName: "",
    complianceScore: "",
    status: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.companyName || !form.status || form.complianceScore === "") {
      alert("Company, score, and status required");
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

    const payload = {
      ...form,
      complianceScore: Number(form.complianceScore),
    };

    API.post("/api/create", payload)
      .then(() => {
        alert("Saved!");
        window.location.href = "/list";
      })
      .catch((err) => {
        console.error(err);
        alert("Create failed");
      });
  };

  return (
    <main className="app-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Record</h1>
          <p className="page-subtitle">
            Add a company compliance entry for tracking and AI review.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="panel max-w-3xl space-y-5">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-slate-700">
            Company
          </span>
          <input
            name="companyName"
            placeholder="Company name"
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
              type="number"
              name="complianceScore"
              placeholder="0 - 100"
              value={form.complianceScore}
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
              <option value="PENDING_REVIEW">Pending Review</option>
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
            placeholder="Describe sustainability practices, risks, or audit notes"
            value={form.description}
            onChange={handleChange}
            className="form-control min-h-32"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button type="submit" className="btn-accent">
            Submit
          </button>
          <button
            type="button"
            onClick={() => (window.location.href = "/list")}
            className="btn-muted"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}

export default FormPage;
