import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

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
        if (err.response.data.detail) {
          setMessage(`❌ ${err.response.data.detail}`);
        } else {
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

  const inputClass = "w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-100 placeholder-slate-500 transition-all text-sm";
  const labelClass = "block text-slate-300 text-xs font-semibold mb-1.5 uppercase tracking-wider";

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-900/80 backdrop-blur-sm px-4 py-8 font-sans text-slate-100">
      
      <div className="w-full max-w-lg mb-4 flex justify-between items-center z-10">
        <Link to="/" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center">
          &larr; Back to Home
        </Link>
      </div>

      <form
        onSubmit={handleRegister}
        className="glass-panel w-full max-w-lg p-8 rounded-2xl z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400">
            Create an Account
          </h2>
          <p className="text-slate-400 text-sm mt-2">Join Jamii Sacco today to manage your finances.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass}>First Name</label>
            <input
              type="text"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Last Name</label>
            <input
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className={inputClass}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className={labelClass}>Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass}>Username</label>
            <input
              type="text"
              placeholder="johndoe123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>National ID Number</label>
            <input
              type="text"
              placeholder="ID Number"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              required
              className={inputClass}
            />
          </div>
        </div>

        <div className="mb-8">
          <label className={labelClass}>Password</label>
          <input
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold rounded-lg shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5"
        >
          Register Account
        </button>

        {message && (
          <div className="mt-6 text-center text-sm font-medium">
            <span className={message.includes("✅") ? "text-emerald-400" : "text-rose-400"}>
              {message}
            </span>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-slate-400 border-t border-slate-700/50 pt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
            Log in here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
