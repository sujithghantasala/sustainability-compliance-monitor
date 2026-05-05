import { useState } from "react";
import axios from "axios";

function LoginPage() {
  const [username, setUsername] = useState(""); // 🔥 rename for clarity
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      console.log("Sending:", {
        username: username.trim(),
        password: password.trim(),
      });

      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          username: username.trim(),   // ✅ MUST match backend
          password: password.trim(),
        }
      );

      console.log("LOGIN RESPONSE:", res.data);

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
    <div className="p-6">
      <h1 className="text-xl mb-4">Login</h1>

      <input
        type="text"   // 🔥 changed from email → important
        placeholder="Username"
        className="border p-2 block mb-2"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 block mb-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Login
      </button>
    </div>
  );
}

export default LoginPage;