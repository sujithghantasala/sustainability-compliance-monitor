import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import API from "../services/api";

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [period, setPeriod] = useState("30d");

  useEffect(() => {
    API.get("/api/stats")
      .then((res) => setStats(res.data))
      .catch(() => setStats(null));
  }, []);

  const analytics = useMemo(() => {
    if (!stats) return null;

    const total = stats.total || 0;
    const compliant = stats.compliant || 0;
    const nonCompliant = stats.nonCompliant || 0;
    const pending = Math.max(0, total - compliant - nonCompliant);
    const avgScore = stats.avgScore || 0;
    const complianceRate = total ? Math.round((compliant / total) * 100) : 0;
    const riskRate = total ? Math.round((nonCompliant / total) * 100) : 0;

    return { total, compliant, nonCompliant, pending, avgScore, complianceRate, riskRate };
  }, [stats]);

  if (!analytics) return <p className="app-page">Loading analytics...</p>;

  const barData = [
    { name: "Total", value: analytics.total },
    { name: "Compliant", value: analytics.compliant },
    { name: "Pending", value: analytics.pending },
    { name: "Non-Compliant", value: analytics.nonCompliant },
  ];

  const pieData = [
    { name: "Compliant", value: analytics.compliant, color: "#0FFCBE" },
    { name: "Pending", value: analytics.pending, color: "#f59e0b" },
    { name: "Non-Compliant", value: analytics.nonCompliant, color: "#fb7185" },
  ];

  const metrics = [
    { label: "Compliance Rate", value: `${analytics.complianceRate}%`, helper: "Records marked compliant" },
    { label: "Risk Load", value: `${analytics.riskRate}%`, helper: "Records needing action" },
    { label: "Average Score", value: analytics.avgScore ? analytics.avgScore.toFixed(2) : 0, helper: "Overall score quality" },
    { label: "Period", value: period.toUpperCase(), helper: "Selected reporting window" },
  ];

  return (
    <main className="app-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Compare compliance posture and risk concentration.</p>
        </div>
        <select value={period} onChange={(e) => setPeriod(e.target.value)} className="form-control max-w-48">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((item) => (
          <div key={item.label} className="metric-card">
            <p className="metric-label">{item.label}</p>
            <p className="metric-value">{item.value}</p>
            <p className="mt-2 text-xs text-slate-500">{item.helper}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-950">Records Overview</h2>
            <p className="text-sm text-slate-500">Volume by review status</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.3)" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Records" fill="#1B4F8A" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-950">Compliance Distribution</h2>
            <p className="text-sm text-slate-500">Split between clear, pending, and review-needed records</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110}>
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </main>
  );
}
