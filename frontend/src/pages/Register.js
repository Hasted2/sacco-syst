import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("auth/register/", {
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        national_id: nationalId,
      });
      setMessage("✅ Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
    // ✅ Show backend error message
    if (err.response.data.detail) {
      setMessage(`❌ ${err.response.data.detail}`);
    } else {
      // If backend sends multiple field errors
      const errors = Object.entries(err.response.data)
        .map(([field, msgs]) => `${field}: ${msgs}`)
        .join(", ");
      setMessage(`❌ ${errors}`);
    }
  } else {
    setMessage("❌ Registration failed. Try again.");
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
        onSubmit={handleRegister}
        style={{
          backgroundColor: "rgba(20, 20, 30, 0.9)",
          color: "#f5f5f5",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.8)",
          width: "320px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "1rem",
            color: "#00aaff",
          }}
        >
          Register
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
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="National ID Number"
          value={nationalId}
          onChange={(e) => setNationalId(e.target.value)}
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
            transition: "background-color 0.2s ease",
          }}
        >
          Register
        </button>

        {message && (
          <p
            style={{
              marginTop: "1rem",
              textAlign: "center",
              color: "#f5f5f5",
            }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Register;
