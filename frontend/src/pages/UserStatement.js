// src/pages/UserStatement.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const UserStatement = () => {
  const { userId } = useParams();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`transactions/statement/${userId}/`);
        setTransactions(res.data.transactions || []);
      } catch (err) {
        console.error("Failed to fetch statement:", err);
        setTransactions([]);
      }
    };
    if (userId) fetchData();
  }, [userId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#1b263b", color: "#f5f5f5" }}>
      <h2>User Transaction Statement (User ID: {userId})</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr style={{ backgroundColor: "#00aaff", color: "#fff" }}>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "1rem" }}>
                No transactions found.
              </td>
            </tr>
          ) : (
            transactions.map((t, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #444" }}>
                <td>{t.date}</td>
                <td>{t.type}</td>
                <td>{t.amount}</td>
                <td>{t.description}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <button
        onClick={handlePrint}
        style={{
          marginTop: "1rem",
          padding: "0.7rem 1.5rem",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        🖨️ Print Statement
      </button>
    </div>
  );
};

export default UserStatement;
