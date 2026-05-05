import { useState } from "react";
import axios from "axios";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        username: username.trim(),
        password: password.trim(),
      });

      if (!res.data.token) {
        alert("No token received");
        return;
      }

      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err);
      alert("Login failed");
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[#106EBE] px-4 py-10">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-950">Sign in</h1>
          <p className="mt-2 text-sm text-slate-600">
            Access the sustainability compliance dashboard.
          </p>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">
              Username
            </span>
            <input
              type="text"
              placeholder="Enter username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">
              Password
            </span>
            <input
              type="password"
              placeholder="Enter password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button onClick={handleLogin} className="btn-accent w-full">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
