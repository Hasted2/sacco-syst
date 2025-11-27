import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // clear token
    navigate("/", { state: { loggedOut: true } }); // pass logout flag
  };

  const linkStyle = {
    padding: "0.6rem 1.2rem",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "bold",
    color: "#00aaff", // ✅ neon blue text
    backgroundColor: "rgba(20,20,30,0.85)", // ✅ semi-transparent dark background
    boxShadow: "0 0 10px rgba(0,170,255,0.6)", // ✅ subtle glow
    transition: "all 0.3s ease",
  };

  const logoutStyle = {
    padding: "0.6rem 1.2rem",
    borderRadius: "6px",
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "rgba(220,53,69,0.9)", // ✅ dark red
    boxShadow: "0 0 10px rgba(220,53,69,0.6)", // ✅ red glow
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  return (
    <nav
      style={{
        backgroundColor: "rgba(10,10,20,0.85)", // ✅ dark semi-transparent navbar
        padding: "1rem",
        display: "flex",
        justifyContent: "center",
        gap: "1rem",
        backdropFilter: "blur(6px)", // ✅ glass-like blur
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <Link
        to="/apply-loan"
        style={linkStyle}
        onMouseEnter={(e) =>
          (e.target.style.boxShadow = "0 0 20px rgba(0,170,255,0.9)")
        }
        onMouseLeave={(e) =>
          (e.target.style.boxShadow = "0 0 10px rgba(0,170,255,0.6)")
        }
      >
        💰 Apply Loan
      </Link>

      <Link
        to="/my-loans"
        style={linkStyle}
        onMouseEnter={(e) =>
          (e.target.style.boxShadow = "0 0 20px rgba(0,170,255,0.9)")
        }
        onMouseLeave={(e) =>
          (e.target.style.boxShadow = "0 0 10px rgba(0,170,255,0.6)")
        }
      >
        📋 My Loans
      </Link>

      <Link
        to="/admin/loans"
        style={linkStyle}
        onMouseEnter={(e) =>
          (e.target.style.boxShadow = "0 0 20px rgba(0,170,255,0.9)")
        }
        onMouseLeave={(e) =>
          (e.target.style.boxShadow = "0 0 10px rgba(0,170,255,0.6)")
        }
      >
        🛠️ Admin Loans
      </Link>

      <button
        onClick={handleLogout}
        style={logoutStyle}
        onMouseEnter={(e) =>
          (e.target.style.boxShadow = "0 0 20px rgba(220,53,69,0.9)")
        }
        onMouseLeave={(e) =>
          (e.target.style.boxShadow = "0 0 10px rgba(220,53,69,0.6)")
        }
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;