import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between">

      <div className="flex gap-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/list">Records</Link>
        <Link to="/add">Add</Link>
        <Link to="/analytics">Analytics</Link>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
        className="bg-red-500 px-3 py-1 rounded"
      >
        Logout
      </button>

    </div>
  );
}