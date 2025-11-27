import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const UserLoans = () => {
  const [loans, setLoans] = useState([]);
  const [repayments, setRepayments] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await api.get("loans/");
        setLoans(response.data);
      } catch (err) {
        console.error("Error fetching loans:", err);
        setMessage("❌ Failed to load loans.");
      }
    };
    fetchLoans();
  }, []);

  const fetchRepayments = async (loanId) => {
    try {
      const response = await api.get(`loans/${loanId}/repayments/`);
      setRepayments((prev) => ({ ...prev, [loanId]: response.data }));
    } catch (err) {
      console.error("Error fetching repayments:", err);
    }
  };

  const calculateBalance = (loanId, loanAmount) => {
  const loanRepayments = repayments[loanId] || [];
  const totalRepaid = loanRepayments.reduce(
    (sum, r) => sum + parseFloat(r.amount),
    0
  );
  const balance = parseFloat(loanAmount) - totalRepaid;
  const percentage = (totalRepaid / parseFloat(loanAmount)) * 100;

  let color = "#dc3545"; // red
  if (percentage >= 100) {
    color = "#006400"; // dark green
  } else if (percentage >= 71) {
    color = "#28a745"; // green
  } else if (percentage >= 31) {
    color = "#ffc107"; // yellow
  }

  return { totalRepaid, balance, percentage, color };
};

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "1rem", color: "#333" }}>📋 My Loans</h2>
      {message && <p>{message}</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {loans.map((loan) => {
          const balanceInfo = calculateBalance(loan.id, loan.amount);
          return (
            <li
              key={loan.id}
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <div>
                <strong>Loan #{loan.id}</strong> — {loan.amount} KSH —{" "}
                <em>{loan.status}</em>
              </div>

             {loan.status === "Approved" && balanceInfo.balance > 0 && (
              <Link
    to={`/repay/${loan.id}`}
    style={{
      display: "inline-block",
      marginTop: "0.5rem",
      padding: "0.5rem 1rem",
      backgroundColor: "#28a745",
      color: "white",
      borderRadius: "4px",
      textDecoration: "none",
    }}
  >
💳 Repay Loan
  </Link>
)}
              <button
                onClick={() => fetchRepayments(loan.id)}
                style={{
                  marginLeft: "1rem",
                  padding: "0.3rem 0.8rem",
                  backgroundColor: "#007BFF",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                📜 View Repayments
              </button>

              {repayments[loan.id] && (
                <div style={{ marginTop: "0.5rem" }}>
                  <ul style={{ paddingLeft: "1rem" }}>
                    {repayments[loan.id].map((r) => (
                      <li key={r.id}>
                        {new Date(r.date).toLocaleString()} — {r.amount} KSH
                      </li>
                    ))}
                  </ul>
                  <p style={{ fontWeight: "bold", color: "#333" }}>
                    Remaining Balance: {balanceInfo.balance} KSH
                  </p>

                  {/* Progress Bar */}
                  <div
                    style={{
                      backgroundColor: "#e0e0e0",
                      borderRadius: "6px",
                      overflow: "hidden",
                      height: "20px",
                      width: "100%",
                      marginTop: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        width: `${balanceInfo.percentage}%`,
                        backgroundColor: balanceInfo.color,
                        height: "100%",
                        transition: "width 0.3s ease",
                      }}
                    ></div>
                  </div>
                  <p style={{ fontSize: "0.9rem", marginTop: "0.3rem" }}>
                    {balanceInfo.percentage.toFixed(1)}% repaid
                  </p>

                  {/* Loan Cleared Badge */}
    {balanceInfo.balance <= 0 && (
      <span
        style={{
          display: "inline-block",
          marginTop: "0.5rem",
          padding: "0.4rem 0.8rem",
          backgroundColor: "#006400",
          color: "white",
          borderRadius: "6px",
          fontWeight: "bold",
        }}
      >
        ✅ Loan Cleared
      </span>
    )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UserLoans;