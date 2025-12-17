import { useState } from "react";
import { api } from "../api";
import "../styles.css";

export default function Login({ goRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    const res = await api("/auth/login", "POST", { email, password });

    if (res.token) {
      localStorage.setItem("token", res.token);
      window.location.href = "/dashboard";
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <p style={{ marginTop: 12 }}>
          Don’t have an account?{" "}
          <span className="link" onClick={goRegister}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
