import { useEffect, useState } from "react";
import API from "../services/api";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

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
      .then(res => setStats(res.data))
      .catch(err => {
        console.error(err);
        alert("Failed to load analytics");
      });
  }, []);

  if (!stats) return <p className="p-6">Loading analytics...</p>;

  // 📊 BAR DATA
  const barData = {
  labels: ["Total", "Compliant", "Non-Compliant"],
  datasets: [
    {
      label: "Records",
      data: [
        stats.total,
        stats.compliant,
        stats.nonCompliant
      ],
      backgroundColor: [
        "#3b82f6",  // blue
        "#22c55e",  // green
        "#ef4444"   // red
      ]
    }
  ]
};

  // 🥧 PIE DATA
  const pieData = {
  labels: ["Compliant", "Non-Compliant"],
  datasets: [
    {
      data: [
        stats.compliant,
        stats.nonCompliant
      ],
      backgroundColor: [
        "#22c55e",  // green
        "#ef4444"   // red
      ],
      borderColor: [
        "#16a34a",
        "#dc2626"
      ],
      borderWidth: 1
    }
  ]
};

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-6">Analytics Dashboard</h1>

      {/* 🔢 SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-4 rounded">
          <p>Total</p>
          <h2>{stats.total}</h2>
        </div>

        <div className="bg-green-500 text-white p-4 rounded">
          <p>Compliant</p>
          <h2>{stats.compliant}</h2>
        </div>

        <div className="bg-red-500 text-white p-4 rounded">
          <p>Non-Compliant</p>
          <h2>{stats.nonCompliant}</h2>
        </div>

        <div className="bg-yellow-500 text-white p-4 rounded">
          <p>Avg Score</p>
          <h2>{stats.avgScore ? stats.avgScore.toFixed(2) : 0}</h2>
        </div>
      </div>

      {/* 📊 CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white p-4 shadow rounded">
          <h2 className="mb-2">Records Overview</h2>
          <Bar data={barData} />
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h2 className="mb-2">Compliance Distribution</h2>
          <Pie data={pieData} />
        </div>

      </div>
    </div>
  );
}