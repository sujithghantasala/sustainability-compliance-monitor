import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get("/api/stats")
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load analytics");
      });
  }, []);

  const analytics = useMemo(() => {
    if (!stats) return null;

    const total = stats.total || 0;
    const compliant = stats.compliant || 0;
    const nonCompliant = stats.nonCompliant || 0;
    const avgScore = stats.avgScore || 0;
    const complianceRate = total ? Math.round((compliant / total) * 100) : 0;
    const riskRate = total ? Math.round((nonCompliant / total) * 100) : 0;

    let mood = "Stable";
    let message = "Compliance is balanced. Keep reviewing weak records.";

    if (complianceRate >= 75) {
      mood = "Healthy";
      message = "Most records are compliant. Focus on closing the remaining gaps.";
    } else if (riskRate >= 50) {
      mood = "Needs Attention";
      message = "Non-compliant records are leading the workload. Prioritize remediation.";
    }

    return {
      total,
      compliant,
      nonCompliant,
      avgScore,
      complianceRate,
      riskRate,
      mood,
      message,
    };
  }, [stats]);

  if (!analytics) return <p className="app-page">Loading analytics...</p>;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#334155",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#64748b" },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#64748b" },
        grid: { color: "rgba(148, 163, 184, 0.18)" },
      },
    },
  };

  const barData = {
    labels: ["Total", "Compliant", "Non-Compliant"],
    datasets: [
      {
        label: "Records",
        data: [analytics.total, analytics.compliant, analytics.nonCompliant],
        backgroundColor: ["#106EBE", "#0FFCBE", "#fb7185"],
        borderRadius: 8,
        maxBarThickness: 72,
      },
    ],
  };

  const doughnutData = {
    labels: ["Compliant", "Non-Compliant"],
    datasets: [
      {
        data: [analytics.compliant, analytics.nonCompliant],
        backgroundColor: ["#0FFCBE", "#fb7185"],
        borderColor: ["#ffffff", "#ffffff"],
        borderWidth: 4,
        hoverOffset: 8,
      },
    ],
  };

  const metrics = [
    {
      label: "Compliance Rate",
      value: `${analytics.complianceRate}%`,
      helper: "Records marked compliant",
    },
    {
      label: "Risk Load",
      value: `${analytics.riskRate}%`,
      helper: "Records needing action",
    },
    {
      label: "Average Score",
      value: analytics.avgScore ? analytics.avgScore.toFixed(2) : 0,
      helper: "Overall score quality",
    },
    {
      label: "Total Records",
      value: analytics.total,
      helper: "Companies in scope",
    },
  ];

  return (
    <main className="app-page">
      <section className="mb-6 overflow-hidden rounded-lg bg-[#106EBE] text-white shadow-sm">
        <div className="grid gap-6 p-6 lg:grid-cols-[1.3fr_0.7fr] lg:p-8">
          <div>
            <p className="text-sm font-semibold uppercase text-[#0FFCBE]">
              Analytics
            </p>
            <h1 className="mt-2 text-3xl font-bold">Compliance Pulse</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50">
              A quick read on where your compliance portfolio stands today,
              where risk is building, and what deserves attention before the
              demo.
            </p>
          </div>

          <div className="rounded-lg border border-white/20 bg-white/10 p-5">
            <p className="text-sm text-blue-100">Current state</p>
            <p className="mt-2 text-3xl font-bold">{analytics.mood}</p>
            <p className="mt-3 text-sm leading-6 text-blue-50">
              {analytics.message}
            </p>
          </div>
        </div>
      </section>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((item) => (
          <div key={item.label} className="metric-card">
            <p className="metric-label">{item.label}</p>
            <p className="metric-value">{item.value}</p>
            <p className="mt-2 text-xs text-slate-500">{item.helper}</p>
          </div>
        ))}
      </div>

      <section className="mb-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="panel">
          <h2 className="text-lg font-bold text-slate-950">
            Portfolio Balance
          </h2>
          <div className="mt-6 space-y-5">
            <ProgressRow
              label="Compliant"
              value={analytics.compliant}
              total={analytics.total}
              color="bg-[#0FFCBE]"
            />
            <ProgressRow
              label="Non-Compliant"
              value={analytics.nonCompliant}
              total={analytics.total}
              color="bg-rose-400"
            />
          </div>
        </div>

        <div className="panel border-l-4 border-l-[#0FFCBE]">
          <h2 className="text-lg font-bold text-slate-950">Human Readout</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Readout label="Records" value={analytics.total} />
            <Readout label="Clear" value={analytics.compliant} />
            <Readout label="Review" value={analytics.nonCompliant} />
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-600">
            Use this page in the demo as your control tower: show the numbers,
            open a risky record, then generate AI recommendations from the detail
            screen.
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-950">
              Records Overview
            </h2>
            <p className="text-sm text-slate-500">Volume by review status</p>
          </div>
          <Bar data={barData} options={chartOptions} />
        </section>

        <section className="panel">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-950">
              Compliance Distribution
            </h2>
            <p className="text-sm text-slate-500">
              Split between clear and review-needed records
            </p>
          </div>
          <div className="mx-auto max-w-sm">
            <Doughnut
              data={doughnutData}
              options={{ plugins: chartOptions.plugins }}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function ProgressRow({ label, value, total, color }) {
  const percentage = total ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className="text-slate-500">{value} records</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-slate-500">{percentage}% of portfolio</p>
    </div>
  );
}

function Readout({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#106EBE]">{value}</p>
    </div>
  );
}
