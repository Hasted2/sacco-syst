import React, { useState, useEffect } from "react";
import api from "../api/axios";

const DepositForm = () => {
  const [amount, setAmount] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get("accounts/list/", {
          headers: { Authorization: `Token ${token}` },
        });
        setAccounts(response.data);

        // ✅ If only one account exists, auto‑select it
        if (response.data.length === 1) {
          setSelectedAccount(response.data[0].account_number);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
        setMessage("❌ Failed to load accounts. Please try again.");
      }
    };
    fetchAccounts();
  }, []);

  const handleDeposit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await api.post(
        "accounts/deposit/",
        { amount, account_number: selectedAccount },
        { headers: { Authorization: `Token ${token}` } }
      );

      console.log("Deposit response:", response.data);

      if (response.data.detail) {
        setMessage(
          `${response.data.detail} | New Balance: ${response.data.account.balance} KES`
        );
      }

      setAmount("");
    } catch (error) {
      console.error("Deposit error:", error);

      // ✅ Improved error feedback
      if (error.response && error.response.data.error) {
        setMessage(`❌ ${error.response.data.error}`);
      } else {
        setMessage("❌ Deposit failed. Try again.");
      }
    }
  };

  // ✅ Show message if user has no accounts
  if (accounts.length === 0) {
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
            boxShadow: "0 0 15px rgba(255,0,0,0.6)",
            width: "350px",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "1rem", color: "#ff4d4d" }}>
            ❌ No Account Found
          </h2>
          <p>You don’t have an account yet. Please create one before depositing.</p>
        </div>
      </div>
    );
  }

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
          boxShadow: "0 0 15px rgba(0,255,0,0.6)",
          width: "350px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "1rem", color: "#00ff99" }}> Make a Deposit</h2>

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

        <form onSubmit={handleDeposit}>
          {/* ✅ Show dropdown only if multiple accounts exist */}
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
                border: "1px solid #00ff99",
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
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.6rem",
              marginBottom: "1rem",
              borderRadius: "6px",
              border: "1px solid #00ff99",
              backgroundColor: "#1e1e1e",
              color: "#f5f5f5",
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.8rem",
              backgroundColor: "#00ff99",
              color: "#121212",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 0 10px rgba(0,255,0,0.6)",
              transition: "all 0.3s ease",
            }}
          >
            Submit Deposit
          </button>
        </form>
      </div>
    </div>
  );
};

export default DepositForm;