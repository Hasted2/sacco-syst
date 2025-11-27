import React from "react";
import { Link, useLocation } from "react-router-dom";

const Welcome = () => {
  const location = useLocation();
  const loggedOut = location.state?.loggedOut;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundImage: "url('/90595.jpg')", // ✅ same wallpaper as other pages
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        color: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
      }}
    >
      {/* Overlay layer */}
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          backgroundColor: "rgba(0,0,0,0.6)", // ✅ translucent dark overlay
          backdropFilter: "blur(6px)", // ✅ blur effect
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Main content */}
        <div style={{ marginTop: "4rem" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#00aaff" }}>
            👋 Welcome to Jamii Sacco
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              marginBottom: "2rem",
              maxWidth: "500px",
              color: "#f5f5f5",
            }}
          >
            Your trusted platform for applying, tracking and repaying loans with ease.
            Sign up today to get started or log in if you already have an account.
          </p>

          {loggedOut && (
            <p
              style={{
                backgroundColor: "#28a745",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              ✅ You’ve been logged out successfully
            </p>
          )}

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Link
              to="/register"
              style={{
                padding: "0.8rem 1.5rem",
                backgroundColor: "#28a745",
                color: "white",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: "bold",
                boxShadow: "0 0 10px rgba(40,167,69,0.6)", // ✅ green glow
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.target.style.boxShadow = "0 0 20px rgba(40,167,69,0.9)")
              }
              onMouseLeave={(e) =>
                (e.target.style.boxShadow = "0 0 10px rgba(40,167,69,0.6)")
              }
            >
               Register
            </Link>
            <Link
              to="/login"
              style={{
                padding: "0.8rem 1.5rem",
                backgroundColor: "#00aaff",
                color: "white",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: "bold",
                boxShadow: "0 0 10px rgba(0,170,255,0.6)", // ✅ blue glow
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.target.style.boxShadow = "0 0 20px rgba(0,170,255,0.9)")
              }
              onMouseLeave={(e) =>
                (e.target.style.boxShadow = "0 0 10px rgba(0,170,255,0.6)")
              }
            >
               Login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer
          style={{
            marginBottom: "1rem",
            fontSize: "0.9rem",
            opacity: 0.8,
            color: "#f5f5f5",
          }}
        >
          Jamii Sacco © {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
};

export default Welcome;