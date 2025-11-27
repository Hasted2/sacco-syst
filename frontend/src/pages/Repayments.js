import React, { useEffect, useState } from "react";
import api from "../api/axios";

const Repayments = () => {
  const [loans, setLoans] = useState([]);
  const [message, setMessage] = useState("");
  const [accountBalance, setAccountBalance] = useState(null);
  const [repayments, setRepayments] = useState({});
  const [openHistory, setOpenHistory] = useState({}); // track which loan history is open

  useEffect(() => {
    const fetchUnpaidLoans = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get("loans/unpaid/", {
          headers: { Authorization: `Token ${token}` },
        });
        setLoans(response.data);
      } catch (err) {
        console.error("Error fetching unpaid loans:", err);
        setMessage("❌ Failed to load unpaid loans.");
      }
    };

    const fetchAccountBalance = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get("accounts/balance/", {
          headers: { Authorization: `Token ${token}` },
        });
        setAccountBalance(response.data.balance);
      } catch (err) {
        console.error("Error fetching account balance:", err);
      }
    };

    fetchUnpaidLoans();
    fetchAccountBalance();
  }, []);

  const fetchRepayments = async (loanId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await api.get(`loans/repayments/${loanId}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setRepayments(prev => ({ ...prev, [loanId]: response.data }));
    } catch (err) {
      console.error("Error fetching repayments:", err);
    }
  };

  const toggleHistory = (loanId) => {
    const isOpen = openHistory[loanId];
    setOpenHistory(prev => ({ ...prev, [loanId]: !isOpen }));
    if (!isOpen) {
      fetchRepayments(loanId);
    }
  };

  const repayLoan = async (loanId, amount) => {
    const token = localStorage.getItem("token");

    if (accountBalance !== null && amount > accountBalance) {
      setMessage("❌ Repayment failed: Insufficient account balance.");
      return;
    }

    try {
      const response = await api.post(`loans/repay/${loanId}/`, { amount }, {
        headers: { Authorization: `Token ${token}` },
      });

      setAccountBalance(response.data.balance);
      setMessage(`✅ ${response.data.detail} | Remaining Balance: ${response.data.balance} KSH`);

      setLoans(loans.map(l => l.id === loanId ? { ...l, status: "Repaid" } : l));

      fetchRepayments(loanId);
    } catch (err) {
      console.error("Error repaying loan:", err.response?.data || err);
      setMessage(`❌ ${err.response?.data?.detail || "Failed to repay loan."}`);
    }
  };

  return (
    <div style={{
      padding: "2rem",
      fontFamily: "Segoe UI, sans-serif",
      backgroundColor: "#121212",
      minHeight: "100vh",
      color: "#e0e0e0",
      overflowY: "auto"
    }}>
      <h2 style={{
        marginBottom: "1.5rem",
        color: "#4caf50",
        textShadow: "0 0 4px rgba(76,175,80,0.5)"
      }}>
        💳 Repayments. Manage your loan repayments
      </h2>

      {accountBalance !== null && (
        <p style={{ marginBottom: "1rem", fontWeight: "bold" }}>
          Current Balance: {accountBalance} KSH
        </p>
      )}

      {message && (
        <div style={{
          marginBottom: "1rem",
          padding: "0.8rem 1rem",
          borderRadius: "6px",
          backgroundColor: message.includes("✅") ? "#2e7d32" : "#c62828",
          color: "#fff",
          fontWeight: "bold"
        }}>
          {message}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {loans.map((loan) => (
          <div key={loan.id} style={{
            backgroundColor: "#1e1e1e",
            borderRadius: "10px",
            padding: "1.5rem",
            boxShadow: "0 0 10px rgba(0,0,0,0.6)"
          }}>
            <div style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "0.5rem"
}}>
  <h3 style={{ color: "#fff" }}>
    {loan.amount} KSH
  </h3>
  {/* Status badge */}
  <span style={{
    padding: "0.3rem 0.7rem",
    borderRadius: "12px",
    fontSize: "0.85rem",
    fontWeight: "bold",
    color: "#fff",
    backgroundColor:
      loan.status === "Approved" ? "#4caf50" :
      loan.status === "Repaid" ? "#2e7d32" :
      loan.status === "Pending" ? "#ff9800" :
      loan.status === "Rejected" ? "#c62828" :
      loan.status === "Revoked" ? "#6a1b9a" :
      "#757575"
  }}>
    {loan.status}
  </span>
</div>
            {/* progress bar */}
  <div style={{ marginBottom: "1rem" }}>
    <div style={{
      height: "10px",
      borderRadius: "5px",
      backgroundColor: "#333",
      overflow: "hidden"
    }}>
      <div style={{
        width: `${((loan.original_amount - loan.amount) / loan.original_amount) * 100}%`,
        height: "100%",
        backgroundColor: "#4caf50",
        transition: "width 0.3s ease"
      }} />
    </div>
    <small style={{ color: "#aaa" }}>
      {loan.original_amount - loan.amount} KSH repaid / {loan.original_amount} KSH total
    </small>
  </div>

            <p style={{ marginBottom: "1rem", color: "#aaa" }}>
              {loan.reason || "No reason provided"}
            </p>

            <div style={{ marginBottom: "1rem" }}>
  <div style={{
    height: "10px",
    borderRadius: "5px",
    backgroundColor: "#333",
    overflow: "hidden"
  }}>
    <div style={{
      width: `${((loan.original_amount - loan.amount) / loan.original_amount) * 100}%`,
      height: "100%",
      backgroundColor: "#4caf50",
      transition: "width 0.3s ease"
    }} />
  </div>
  <small style={{ color: "#aaa" }}>
    {loan.original_amount - loan.amount} KSH repaid / {loan.original_amount} KSH total
  </small>
</div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const amount = parseFloat(e.target.elements.amount.value);
                repayLoan(loan.id, amount);
              }}
            >
              <input
                type="number"
                name="amount"
                placeholder="Enter repayment amount"
                required
                style={{
                  padding: "0.6rem",
                  width: "100%",
                  marginBottom: "0.8rem",
                  border: "1px solid #333",
                  borderRadius: "6px",
                  backgroundColor: "#2c2c2c",
                  color: "#fff"
                }}
              />
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "0.7rem",
                  backgroundColor: "#4caf50",
                  color: "#000",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
              >
                Repay
              </button>
            </form>

            {/* Accordion repayment history */}
            <div style={{ marginTop: "1rem" }}>
              <button
                onClick={() => toggleHistory(loan.id)}
                style={{
                  marginBottom: "0.5rem",
                  backgroundColor: "#333",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "0.4rem 0.8rem",
                  cursor: "pointer"
                }}
              >
                {openHistory[loan.id] ? "Hide Repayment History" : "View Repayment History"}
              </button>
              {openHistory[loan.id] && repayments[loan.id] && (
                <ul style={{
                  listStyle: "none",
                  padding: 0,
                  marginTop: "0.5rem",
                  borderTop: "1px solid #444",
                  paddingTop: "0.5rem"
                }}>
                  {repayments[loan.id].map((r) => (
                    <li key={r.id} style={{ color: "#ccc", marginBottom: "0.3rem" }}>
                      {r.date}: {r.amount} KSH
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Repayments;