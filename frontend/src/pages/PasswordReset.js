import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await api.post("http://127.0.0.1:8000/api/password-reset/", { email }); // ✅ corrected endpoint
      setMessage("✅ Reset link sent! Redirecting to login...");
      setTimeout(() => navigate("/login"), 4000); // ✅ auto redirect after 4s
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to send reset link. Try again.");
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
        onSubmit={handleReset}
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
          Reset Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

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
          Send Reset Link
        </button>

        {message && (
          <p style={{ marginTop: "1rem", textAlign: "center", fontWeight: "bold", color: message.includes("✅") ? "lime" : "red" }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default PasswordReset;
