import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const PasswordResetConfirm = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleResetConfirm = async (e) => {
    e.preventDefault();
    try {
      await api.post(`password-reset-confirm/${token}/`, { password }); // ✅ corrected endpoint
      setMessage("✅ Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Reset failed. Invalid or expired token.");
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
        onSubmit={handleResetConfirm}
        style={{
          backgroundColor: "rgba(20, 20, 30, 0.9)",
          color: "#f5f5f5",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.8)",
          width: "320px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#28a745" }}>
          🔒 Set New Password
        </h2>

        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.7rem",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Reset Password
        </button>

        {message && (
          <p style={{ marginTop: "1rem", textAlign: "center", color: "red", fontWeight: "bold" }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default PasswordResetConfirm;
