import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await API.get("/api/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Error loading stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <p className="app-page">Loading dashboard...</p>;
  }

  if (!stats) {
    return <p className="app-page">No data available</p>;
  }

  const complianceRate =
    stats.total > 0 ? Math.round((stats.compliant / stats.total) * 100) : 0;

  const metrics = [
    { label: "Total Records", value: stats.total, note: "Tracked companies" },
    { label: "Compliant", value: stats.compliant, note: "Ready for review" },
    {
      label: "Non-Compliant",
      value: stats.nonCompliant,
      note: "Needs attention",
    },
    {
      label: "Average Score",
      value: stats.avgScore ? stats.avgScore.toFixed(2) : 0,
      note: "Across all records",
    },
  ];

  return (
    <main className="app-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Monitor compliance health, record volume, and review priorities.
          </p>
        </div>
        <div className="rounded-lg bg-[#106EBE] px-5 py-3 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase text-blue-100">
            Compliance Rate
          </p>
          <p className="text-2xl font-bold">{complianceRate}%</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="metric-card">
            <p className="metric-label">{metric.label}</p>
            <p className="metric-value">{metric.value}</p>
            <p className="mt-2 text-xs text-slate-500">{metric.note}</p>
          </div>
        ))}
      </div>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="panel">
          <h2 className="text-lg font-bold text-slate-950">Work Queue</h2>
          <p className="mt-2 text-sm text-slate-600">
            Start with non-compliant records, then use AI summary and report
            actions from each record detail page for faster review.
          </p>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#0FFCBE]"
              style={{ width: `${complianceRate}%` }}
            />
          </div>
        </div>

        <div className="panel border-l-4 border-l-[#0FFCBE]">
          <p className="text-sm font-semibold uppercase text-[#106EBE]">
            Next Step
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Review records with weak scores and generate AI recommendations for
            the demo flow.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
