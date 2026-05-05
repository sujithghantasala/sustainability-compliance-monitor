import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function EditPage() {
  const { id } = useParams();

  const [form, setForm] = useState({
    companyName: "",
    complianceScore: "",
    status: "",
    description: ""
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
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async () => {
    // ✅ validation
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
    <div className="p-6">
      <h2 className="text-xl mb-4">Edit Record</h2>

      <input
        name="companyName"
        value={form.companyName}
        onChange={handleChange}
        className="border p-2 mb-2 block w-full"
      />

      <input
        name="complianceScore"
        value={form.complianceScore}
        onChange={handleChange}
        className="border p-2 mb-2 block w-full"
      />

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="border p-2 mb-2 block w-full"
      >
        <option value="">Select Status</option>
        <option value="COMPLIANT">Compliant</option>
        <option value="NON-COMPLIANT">Non-Compliant</option>
      </select>

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        className="border p-2 mb-2 block w-full"
      />

      <button
        onClick={handleUpdate}
        className="bg-green-500 text-white px-4 py-2"
      >
        Update
      </button>
    </div>
  );
}