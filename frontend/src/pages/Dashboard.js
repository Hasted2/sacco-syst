import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../index.css";
import MyLoans from "./MyLoans";

function Dashboard() {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const navigate = useNavigate();
  const isStaff = localStorage.getItem("is_staff") === "true";

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchBalance = async () => {
      try {
        const response = await api.get("accounts/balance/", {
          headers: { Authorization: `Token ${token}` },
        });
        setBalance(response.data.balance);
      } catch (err) {
        console.error("Error fetching balance:", err);
      }
    };

    const fetchTransactions = async () => {
      try {
        const response = await api.get("accounts/transactions/", {
          headers: { Authorization: `Token ${token}` },
        });
        setTransactions(response.data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };

    fetchBalance();
    fetchTransactions();
  }, []);

  const cardStyle = {
    backgroundColor: "rgba(20,20,30,0.9)",
    color: "#f5f5f5",
    padding: "1.5rem",
    borderRadius: "12px",
    boxShadow: "0 0 10px rgba(0,170,255,0.6)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    textAlign: "center",
    width: "220px",
    flex: "0 1 220px",
  };

  const handleHover = (e, glowColor) => {
    e.currentTarget.style.boxShadow = `0 0 20px ${glowColor}`;
  };

  const handleLeave = (e, glowColor) => {
    e.currentTarget.style.boxShadow = `0 0 10px ${glowColor}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("is_staff");
    localStorage.removeItem("refreshToken");

    setShowLogoutMessage(true);
    setTimeout(() => {
      setShowLogoutMessage(false);
      navigate("/login", { state: { loggedOut: true } });
    }, 3500);
  };
  

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundImage: "url('/90595.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        color: "#f5f5f5",
      }}
    >
      <h1 style={{ marginBottom: "1rem", color: "#00aaff", textAlign: "center" }}>
        {balance !== null ? `Welcome! Balance: ${balance} KSH` : "Loading..."}
      </h1>

      <button
        onClick={() => navigate("/withdraw")}
        style={{
          marginBottom: "2rem",
          padding: "0.6rem 1.2rem",
          backgroundColor: "#ff4d4d",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0 0 10px rgba(255,0,0,0.6)",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) =>
          (e.target.style.boxShadow = "0 0 20px rgba(255,0,0,0.9)")
        }
        onMouseLeave={(e) =>
          (e.target.style.boxShadow = "0 0 10px rgba(255,0,0,0.6)")
        }
      >
         Withdraw
      </button>

      <h2 style={{ marginBottom: "1rem", color: "#f5f5f5" }}>Quick Actions</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          justifyContent: "center",
          marginBottom: "3rem",
        }}
      >
        <div
          style={cardStyle}
          onClick={() => navigate("/apply-loan")}
          onMouseEnter={(e) => handleHover(e, "rgba(0,170,255,0.9)")}
          onMouseLeave={(e) => handleLeave(e, "rgba(0,170,255,0.6)")}
        >
          <h3 style={{ color: "#00aaff" }}>Apply Loan</h3>
          <p>Submit a new loan application</p>
        </div>

        <div
          style={cardStyle}
          onClick={() => navigate("/my-loans")}
          onMouseEnter={(e) => handleHover(e, "rgba(0,170,255,0.9)")}
          onMouseLeave={(e) => handleLeave(e, "rgba(0,170,255,0.6)")}
        >
          <h3 style={{ color: "#00aaff" }}>My Loans</h3>
          <p>View your active and past loans</p>
        </div>

       {isStaff && (
  <>
    <div
      style={cardStyle}
      onClick={() => navigate("/admin/loans")}
      onMouseEnter={(e) => handleHover(e, "rgba(255,0,0,0.9)")}
      onMouseLeave={(e) => handleLeave(e, "rgba(255,0,0,0.6)")}
    >
      <h3 style={{ color: "#ff4d4d" }}>Admin Loans</h3>
      <p>Manage all loan applications</p>
    </div>

    <div
      style={cardStyle}
      onClick={() => navigate("/admin/repayments-by-user")}
      onMouseEnter={(e) => handleHover(e, "rgba(0,170,255,0.9)")}
      onMouseLeave={(e) => handleLeave(e, "rgba(0,170,255,0.6)")}
    >
      <h3 style={{ color: "#00aaff" }}>Repayments Report</h3>
      <p>View repayments by user</p>
    </div>
  </>
)}
      </div>

      <h2 style={{ marginBottom: "1rem", color: "#f5f5f5" }}>Other Sections</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          justifyContent: "center",
          marginBottom: "3rem",
        }}
      >
        <div
          style={cardStyle}
          onClick={() => navigate("/transactions")}
          onMouseEnter={(e) => handleHover(e, "rgba(255,193,7,0.9)")}
          onMouseLeave={(e) => handleLeave(e, "rgba(255,193,7,0.6)")}
        >
          <h3 style={{ color: "#ffc107" }}>Transactions</h3>
          <p>Track your financial activity</p>
        </div>

        <div
          style={cardStyle}
          onClick={() => navigate("/repayments")}
          onMouseEnter={(e) => handleHover(e, "rgba(40,167,69,0.9)")}
          onMouseLeave={(e) => handleLeave(e, "rgba(40,167,69,0.6)")}
        >
          <h3 style={{ color: "#28a745" }}>Repayments</h3>
          <p>Manage your loan repayments</p>
        </div>

        <div
          style={cardStyle}
          onClick={() => navigate("/deposit")}
          onMouseEnter={(e) => handleHover(e, "rgba(155,89,182,0.9)")}
          onMouseLeave={(e) => handleLeave(e, "rgba(155,89,182,0.6)")}
        >
          <h3 style={{ color: "#9b59b6" }}>Deposit</h3>
          <p>Make a deposit into your account</p>
        </div>
      </div>

      {/* ✅ Recent Transactions */}
      <h2 style={{ marginBottom: "1rem", color: "#f5f5f5" }}>Recent Transactions</h2>
      <div
        style={{
          backgroundColor: "rgba(20,20,30,0.95)",
          padding: "1rem",
          borderRadius: "8px",
          width: "80%",
          maxWidth: "600px",    
          }}>
        {transactions.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {transactions.slice(0, 5).map((tx) => (
              <li
                key={tx.id}
                style={{
                  marginBottom: "0.5rem",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  paddingBottom: "0.5rem",
                }}
              >
                <strong>{tx.type.toUpperCase()}</strong> of {tx.amount} KSH on{" "}
                {new Date(tx.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ textAlign: "center", color: "#aaa" }}>
            No recent transactions found.
          </p>
        )}
      </div>

      {/* ✅ Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          padding: "0.8rem 1.5rem",
          backgroundColor: "rgba(220,53,69,0.9)",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0 0 10px rgba(220,53,69,0.6)",
          transition: "all 0.3s ease",
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
        }}
        onMouseEnter={(e) =>
          (e.target.style.boxShadow = "0 0 20px rgba(220,53,69,0.9)")
        }
        onMouseLeave={(e) =>
          (e.target.style.boxShadow = "0 0 10px rgba(220,53,69,0.6)")
        }
      >
        Logout
      </button>

      {showLogoutMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "6rem",
            right: "2rem",
            backgroundColor: "#28a745",
            color: "#fff",
            padding: "0.8rem 1.2rem",
            borderRadius: "6px",
            fontWeight: "bold",
            boxShadow: "0 0 10px rgba(40,167,69,0.6)",
          }}
        >
          ✅ Logging out...
        </div>
      )}
    </div>
  );
}

export default Dashboard;