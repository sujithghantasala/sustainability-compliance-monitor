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

    // ✅ improved validation
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

    const payload = {
      ...form,
      complianceScore: form.complianceScore
        ? Number(form.complianceScore)
        : null,
    };

    API.post("/api/create", payload)
      .then(() => {
        alert("Saved!");

        // ✅ redirect instead of just clearing
        window.location.href = "/list";
      })
      .catch((err) => {
        console.error(err);
        alert("Create failed");
      });
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Create Record</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="companyName"
          placeholder="Company"
          value={form.companyName}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          type="number"
          name="complianceScore"
          placeholder="Score"
          value={form.complianceScore}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="">Select Status</option>
          <option value="COMPLIANT">Compliant</option>
          <option value="NON-COMPLIANT">Non-Compliant</option>
        </select>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2"
        >
          Submit
        </button>

      </form>
    </div>
  );
}

export default FormPage;