import { useState } from "react";
import { api } from "../api";
import "../styles.css";

export default function Register({ goLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    const res = await api("/auth/register", "POST", {
      name,
      email,
      password,
    });

    if (res.message === "User registered successfully") {
      alert("Registered successfully. Please login.");
      goLogin();
    } else {
      alert(res.message || "Registration failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Register</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <button onClick={handleRegister}>Register</button>

        <p style={{ marginTop: 12 }}>
          Already have an account?{" "}
          <span className="link" onClick={goLogin}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
