import React, { useEffect, useState } from "react";
import api from "../api/axios";

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await api.get("loans/");
        setLoans(response.data);
      } catch (err) {
        console.error("Error fetching loans:", err);
        setError("Failed to load loans.");
      }
    };
    fetchLoans();
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!loans.length) return <p>No loans found.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Loans</h2>
      <ul>
        {loans.map((loan) => (
          <li key={loan.id}>
            {loan.date} — {loan.amount} KSH — {loan.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Loans;