import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function DetailPage() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [aiResult, setAiResult] = useState("");
  const [aiTitle, setAiTitle] = useState("");
  const [aiLoading, setAiLoading] = useState("");

  useEffect(() => {
    API.get(`/api/${id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const runAI = async (type) => {
    try {
      setAiLoading(type);
      setAiResult("");

      const payload = {
        companyName: data.companyName,
        description: data.description || data.companyName,
      };

      const endpointByType = {
        describe: "/api/ai/describe",
        recommend: "/api/ai/recommend",
        report: "/api/ai/report",
      };

      const titleByType = {
        describe: "AI Summary",
        recommend: "AI Recommendations",
        report: "AI Report",
      };

      const res = await API.post(endpointByType[type], payload);

      setAiTitle(titleByType[type]);
      setAiResult(res.data.insight || res.data.report);
    } catch (err) {
      console.error(err);
      alert("AI failed");
    } finally {
      setAiLoading("");
    }
  };

  const statusClass =
    data?.status === "COMPLIANT"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-rose-50 text-rose-700";

  if (loading) return <p className="app-page">Loading record...</p>;
  if (!data) return <p className="app-page">No data</p>;

  return (
    <main className="app-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{data.companyName}</h1>
          <p className="page-subtitle">
            Review compliance details and generate AI-assisted outputs.
          </p>
        </div>
        <span className={`status-pill ${statusClass}`}>{data.status}</span>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="panel">
          <h2 className="text-lg font-bold text-slate-950">Record Details</h2>
          <dl className="mt-5 space-y-4">
            <div>
              <dt className="text-sm font-semibold text-slate-500">Score</dt>
              <dd className="text-3xl font-bold text-[#106EBE]">
                {data.complianceScore ?? 0}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-slate-500">
                Description
              </dt>
              <dd className="mt-1 text-sm leading-6 text-slate-700">
                {data.description || "No description added."}
              </dd>
            </div>
          </dl>
        </div>

        <div className="panel">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold text-slate-950">AI Workspace</h2>
            <p className="text-sm text-slate-600">
              Generate a concise summary, recommendations, or a report from the
              same record data.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => runAI("describe")}
              disabled={Boolean(aiLoading)}
              className="btn-primary"
            >
              AI Summary
            </button>

            <button
              onClick={() => runAI("recommend")}
              disabled={Boolean(aiLoading)}
              className="btn-accent"
            >
              AI Recommendations
            </button>

            <button
              onClick={() => runAI("report")}
              disabled={Boolean(aiLoading)}
              className="btn-muted"
            >
              AI Report
            </button>
          </div>

          {aiLoading && (
            <p className="mt-5 rounded-md bg-[#0FFCBE]/20 px-3 py-2 text-sm font-semibold text-[#106EBE]">
              Loading AI...
            </p>
          )}

          {aiResult && (
            <div className="mt-5 rounded-lg border border-[#0FFCBE]/60 bg-[#f2fffc] p-4">
              <h3 className="font-bold text-slate-950">{aiTitle}</h3>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">
                {aiResult}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default DetailPage;
