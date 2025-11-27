import React, { useState } from "react";
import api from "../api/axios";
import { useParams } from "react-router-dom";

const RepaymentForm = () => {
  const { loanId } = useParams(); // loanId comes from the route
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const repayLoan = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`loans/${loanId}/repay/`, { amount });
      setMessage(`✅ Repayment submitted: ${response.data.amount} KSH`);
      setAmount("");
    } catch (err) {
      console.error("Error submitting repayment:", err);
      setMessage("❌ Failed to submit repayment.");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "1rem", color: "#333" }}>
        💳 Repay Loan #{loanId}
      </h2>
      <form onSubmit={repayLoan} style={{ marginBottom: "1rem" }}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter repayment amount"
          required
          style={{
            padding: "0.5rem",
            width: "200px",
            marginRight: "1rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Submit Repayment
        </button>
      </form>
      {message && (
        <p style={{ fontWeight: "bold", color: message.includes("✅") ? "#007700" : "#cc0000" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default RepaymentForm;