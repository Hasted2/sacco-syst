import React from "react";
import { Link, useLocation } from "react-router-dom";

const Welcome = () => {
  const location = useLocation();
  const loggedOut = location.state?.loggedOut;

  return (
    <div className="min-h-screen flex flex-col justify-between items-center text-slate-100 font-sans">
      {/* Overlay layer */}
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm -z-10"></div>
      
      {/* Top Navigation */}
      <nav className="w-full flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          Jamii Sacco
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-5 py-2 text-sm font-semibold text-slate-200 hover:text-white transition-colors">
            Login
          </Link>
          <Link to="/register" className="px-5 py-2 text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Main Hero Content */}
      <main className="flex-grow flex flex-col justify-center items-center text-center px-4 mt-8 w-full max-w-4xl mx-auto z-10">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full glass-panel text-sm font-medium text-blue-300">
          ✨ The simplest way to manage your loans
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white tracking-tight leading-tight">
          Financial Freedom, <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">Built for You.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Your trusted platform for applying, tracking, and repaying loans with ease. Join thousands of members securing their financial future today.
        </p>

        {loggedOut && (
          <div className="bg-emerald-500/20 border border-emerald-500 text-emerald-300 px-6 py-3 rounded-lg font-medium mb-8 flex items-center gap-3">
            <span>✅</span> You’ve been securely logged out.
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mx-auto">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 text-lg transition-all transform hover:-translate-y-1 hover:shadow-emerald-500/50"
          >
            Create Free Account
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-3.5 glass-panel text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all transform hover:-translate-y-1"
          >
            Member Login
          </Link>
        </div>
      </main>

      {/* Features Grid below fold */}
      <div className="w-full bg-slate-900/80 backdrop-blur-md border-t border-white/10 py-16 mt-16 z-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 glass-panel rounded-2xl">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-white mb-2">Fast Approvals</h3>
            <p className="text-slate-400 text-sm">Apply for loans and get approved in record time with minimal paperwork.</p>
          </div>
          <div className="p-6 glass-panel rounded-2xl">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-white mb-2">Secure & Private</h3>
            <p className="text-slate-400 text-sm">Bank-grade security ensures your personal and financial data is heavily protected.</p>
          </div>
          <div className="p-6 glass-panel rounded-2xl">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">Easy Tracking</h3>
            <p className="text-slate-400 text-sm">Monitor your loan status, view your statements, and make seamless repayments.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-slate-500 text-sm z-10">
        Jamii Sacco &copy; {new Date().getFullYear()}. All rights reserved.
      </footer>
    </div>
  );
};

export default Welcome;