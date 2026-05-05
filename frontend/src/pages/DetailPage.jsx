import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function DetailPage() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [aiData, setAiData] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Fetch record
  useEffect(() => {
    API.get(`/api/${id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [id]);

  // AI call
  const handleAI = async () => {
    try {
      setAiLoading(true);

      const res = await API.post("/api/ai/recommend", {
        companyName: data.companyName,
        description: data.description,
      });

      // ✅ FIX: store string instead of array
      setAiData(res.data.insight);

    } catch (err) {
      console.error(err);
      alert("AI failed");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{data.companyName}</h1>

      <p>Score: {data.complianceScore}</p>
      <p>Status: {data.status}</p>
      <p>Description: {data.description}</p>

      {/* BUTTON */}
      <button
        onClick={handleAI}
        className="bg-purple-600 text-white px-4 py-2 mt-4"
      >
        Generate AI Insights
      </button>

      {/* LOADING */}
      {aiLoading && <p className="mt-4">Loading AI...</p>}

      {/* RESULT */}
      {aiData && (
        <div className="mt-4 border p-4 bg-gray-100">
          <h2 className="font-bold">AI Recommendation</h2>
          <p>{aiData}</p>
        </div>
      )}
    </div>
  );
}

export default DetailPage;