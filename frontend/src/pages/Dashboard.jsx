import { useEffect, useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import API from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/stats")
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const analytics = useMemo(() => {
    if (!stats) return null;

    const total = stats.total || 0;
    const compliant = stats.compliant || 0;
    const nonCompliant = stats.nonCompliant || 0;
    const pending = Math.max(0, total - compliant - nonCompliant);
    const complianceRate = total > 0 ? Math.round((compliant / total) * 100) : 0;

    return { total, compliant, nonCompliant, pending, complianceRate };
  }, [stats]);

  if (loading) return <p className="app-page">Loading dashboard...</p>;
  if (!analytics) return <p className="app-page">No data available</p>;

  const metrics = [
    { label: "Total Records", value: analytics.total, note: "Tracked companies" },
    { label: "Compliant", value: analytics.compliant, note: "Ready for review" },
    { label: "Non-Compliant", value: analytics.nonCompliant, note: "Needs attention" },
    {
      label: "Average Score",
      value: stats.avgScore ? stats.avgScore.toFixed(2) : 0,
      note: "Across active records",
    },
  ];

  const chartData = [
    { name: "Compliant", value: analytics.compliant, color: "#0FFCBE" },
    { name: "Pending", value: analytics.pending, color: "#f59e0b" },
    { name: "Non-Compliant", value: analytics.nonCompliant, color: "#fb7185" },
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
        <div className="rounded-lg bg-[#1B4F8A] px-5 py-3 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase text-blue-100">Compliance Rate</p>
          <p className="text-2xl font-bold">{analytics.complianceRate}%</p>
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

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="panel">
          <h2 className="text-lg font-bold text-slate-950">Status Mix</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={105}>
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel border-l-4 border-l-[#0FFCBE]">
          <p className="text-sm font-semibold uppercase text-[#1B4F8A]">Next Step</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Review non-compliant records first, then use AI recommendations from the detail page
            to prepare a remediation plan.
          </p>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-[#0FFCBE]" style={{ width: `${analytics.complianceRate}%` }} />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
