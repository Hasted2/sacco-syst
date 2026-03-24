import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // clear token
    navigate("/", { state: { loggedOut: true } }); // pass logout flag
  };

  const navLinkClass = "px-4 py-2 rounded-lg font-semibold text-blue-400 bg-slate-800/80 hover:bg-slate-700/80 shadow-[0_0_10px_rgba(0,170,255,0.2)] hover:shadow-[0_0_15px_rgba(0,170,255,0.5)] transition-all text-sm sm:text-base whitespace-nowrap";

  return (
    <nav className="bg-slate-900/95 backdrop-blur-md border-b border-white/10 p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Brand Logo / Home Link */}
        <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 w-full sm:w-auto text-center sm:text-left">
          <Link to="/dashboard">Jamii Sacco Portal</Link>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <Link to="/apply-loan" className={navLinkClass}>
            💰 Apply Loan
          </Link>
          <Link to="/my-loans" className={navLinkClass}>
            📋 My Loans
          </Link>
          <Link to="/admin/loans" className={navLinkClass}>
            🛠️ Admin
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg font-bold text-white bg-rose-600/90 hover:bg-rose-500 shadow-[0_0_10px_rgba(220,53,69,0.3)] hover:shadow-[0_0_15px_rgba(220,53,69,0.6)] transition-all text-sm sm:text-base ml-1 sm:ml-2"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;