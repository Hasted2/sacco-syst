import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom"; // ✅ import Link

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("auth/login/", {
        username,
        password,
      });
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("is_staff", response.data.is_staff);
      localStorage.setItem("refreshToken", response.data.refresh);
      setMessage("✅ Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        if (err.response.data.detail) {
          setMessage(`❌ ${err.response.data.detail}`);
        } else {
          const errors = Object.entries(err.response.data)
            .map(([field, msgs]) => `${field}: ${msgs}`)
            .join(", ");
          setMessage(`❌ ${errors}`);
        }
      } else {
        setMessage("❌ Login failed. Check credentials.");
      }
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.7rem",
    marginBottom: "1rem",
    borderRadius: "6px",
    border: "1px solid #333",
    backgroundColor: "#1b263b",
    color: "#f5f5f5",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          backgroundColor: "rgba(20, 20, 30, 0.9)",
          color: "#f5f5f5",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.8)",
          width: "320px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#00aaff" }}>
          Login
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        <label style={{ display: "flex", alignItems: "center", marginBottom: "1rem", color: "#f5f5f5" }}>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            style={{ marginRight: "0.5rem" }}
          />
          Remember Me
        </label>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.7rem",
            backgroundColor: "#00aaff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Login
        </button>

        {/* ✅ Forgot Password link */}
        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          <Link to="/password-reset" style={{ color: "#00aaff", textDecoration: "none" }}>
            Forgot Password?
          </Link>
        </p>

        {message && (
          <p style={{ marginTop: "1rem", textAlign: "center", color: "red", fontWeight: "bold" }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
