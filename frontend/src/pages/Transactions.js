import React, { useEffect, useState } from "react";
import api from "../api/axios";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get("transactions/");
        setTransactions(response.data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transactions.");
      }
    };
    fetchTransactions();
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!transactions.length) return <p>No transactions found.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Transactions</h2>
      <ul>
        {transactions.map((tx) => (
          <li key={tx.id}>
            {tx.date} — {tx.type} — {tx.amount} KSH
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transactions;