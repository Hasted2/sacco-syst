import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-900/80 backdrop-blur-sm px-4 font-sans text-slate-100">
      
      <div className="w-full max-w-sm mb-6 flex justify-between items-center z-10">
        <Link to="/login" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center">
          &larr; Back to Login
        </Link>
      </div>

      <form
        onSubmit={handleReset}
        className="glass-panel w-full max-w-sm p-8 rounded-2xl z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            Reset Password
          </h2>
          <p className="text-slate-400 text-sm mt-2">Enter your email to receive a reset link</p>
        </div>

        <div className="mb-8">
          <label className="block text-slate-300 text-sm font-semibold mb-2">Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100 placeholder-slate-500 transition-all"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5"
        >
          Send Reset Link
        </button>

        {message && (
          <div className="mt-6 text-center text-sm font-medium">
            <span className={message.includes("✅") ? "text-emerald-400" : "text-rose-400"}>
              {message}
            </span>
          </div>
        )}
      </form>
    </div>
  );
};

export default PasswordReset;
