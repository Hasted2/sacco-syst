import React, { useState, useEffect } from "react";
import api from "../api/axios";

const LoanApplication = () => {
  const [amount, setAmount] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [message, setMessage] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get("accounts/list/", {
          headers: { Authorization: `Token ${token}` },
        });
        setAccounts(response.data);

        // Auto-select if only one account exists
        if (response.data.length === 1) {
          setSelectedAccount(response.data[0].account_number);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };
    fetchAccounts();
  }, []);

  const handleLoanApplication = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await api.post(
        "loans/apply/", // ✅ backend endpoint for loan applications
        { amount, account_number: selectedAccount, reason },
        { headers: { Authorization: `Token ${token}` } }
      );

      console.log("Loan application response:", response.data);

      if (response.data.detail) {
        setMessage(response.data.detail);
      } else {
        setMessage(
          `✅ Loan application for ${response.data.amount} KES submitted. Status: ${response.data.status}`
        );
      }

      setAmount("");
      setReason("");
    } catch (error) {
      console.error("Loan application error:", error);
      setMessage("❌ Loan application failed. Try again.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
        color: "#f5f5f5",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(20,20,30,0.95)",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 0 15px rgba(0,170,255,0.6)",
          width: "400px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "1rem", color: "#00aaff" }}>
           Loan Application
        </h2>

        {message && (
          <p
            style={{
              marginBottom: "1rem",
              color: message.startsWith("❌") ? "#ff4d4d" : "#00ff99",
              fontWeight: "bold",
            }}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleLoanApplication}>
          {/* Show dropdown only if multiple accounts exist */}
          {accounts.length > 1 && (
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.6rem",
                marginBottom: "1rem",
                borderRadius: "6px",
                border: "1px solid #00aaff",
                backgroundColor: "#1e1e1e",
                color: "#f5f5f5",
              }}
            >
              <option value="">Select Account</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.account_number}>
                  {acc.account_type} – {acc.account_number}
                </option>
              ))}
            </select>
          )}

          <input
            type="number"
            placeholder="Enter loan amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.6rem",
              marginBottom: "1rem",
              borderRadius: "6px",
              border: "1px solid #00aaff",
              backgroundColor: "#1e1e1e",
              color: "#f5f5f5",
            }}
          />

          <textarea
            placeholder="Reason for loan"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.6rem",
              marginBottom: "1rem",
              borderRadius: "6px",
              border: "1px solid #00aaff",
              backgroundColor: "#1e1e1e",
              color: "#f5f5f5",
              minHeight: "80px",
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.8rem",
              backgroundColor: "#00aaff",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 0 10px rgba(0,170,255,0.6)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.target.style.boxShadow = "0 0 20px rgba(0,170,255,0.9)")
            }
            onMouseLeave={(e) =>
              (e.target.style.boxShadow = "0 0 10px rgba(0,170,255,0.6)")
            }
          >
            Submit Loan Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoanApplication;