import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

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

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-900/80 backdrop-blur-sm px-4 font-sans text-slate-100">
      
      <div className="w-full max-w-sm mb-6 flex justify-between items-center z-10">
        <Link to="/" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center">
          &larr; Back to Home
        </Link>
      </div>

      <form
        onSubmit={handleLogin}
        className="glass-panel w-full max-w-sm p-8 rounded-2xl z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Welcome Back
          </h2>
          <p className="text-slate-400 text-sm mt-2">Log in to manage your loans</p>
        </div>

        <div className="mb-4">
          <label className="block text-slate-300 text-sm font-semibold mb-2">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100 placeholder-slate-500 transition-all"
          />
        </div>

        <div className="mb-6">
          <label className="block text-slate-300 text-sm font-semibold mb-2">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100 placeholder-slate-500 transition-all"
          />
        </div>

        <div className="flex items-center justify-between mb-8">
          <label className="flex items-center text-slate-300 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900 accent-blue-500 mr-2"
            />
            Remember Me
          </label>
          <Link to="/password-reset" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5"
        >
          Sign In
        </button>

        {message && (
          <div className="mt-6 text-center text-sm font-medium">
            <span className={message.includes("✅") ? "text-emerald-400" : "text-rose-400"}>
              {message}
            </span>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-slate-400 border-t border-slate-700/50 pt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
