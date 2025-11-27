import React, { useEffect, useState } from "react";
import api from "../api/axios";

const MyLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLoans = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get("loans/list/", {
          headers: { Authorization: `Token ${token}` },
        });
        setLoans(response.data);
      } catch (err) {
        console.error("Error fetching loans:", err);
        setError("❌ Failed to load loans.");
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  if (loading) {
    return <p style={{ color: "#00aaff" }}>Loading loans...</p>;
  }

  if (error) {
    return <p style={{ color: "#ff4d4d" }}>{error}</p>;
  }

  return (
    <div
      style={{
        backgroundColor: "rgba(20,20,30,0.95)",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 0 15px rgba(0,170,255,0.6)",
        marginTop: "2rem",
      }}
    >
      <h2 style={{ marginBottom: "1rem", color: "#00aaff" }}> My Loans</h2>

      {loans.length === 0 ? (
        <p style={{ color: "#f5f5f5" }}>You have no loans yet.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            color: "#f5f5f5",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid #00aaff" }}>
              <th style={{ padding: "0.5rem" }}>Date</th>
              <th style={{ padding: "0.5rem" }}>Amount</th>
              <th style={{ padding: "0.5rem" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id} style={{ borderBottom: "1px solid #333" }}>
                <td style={{ padding: "0.5rem" }}>
                  {new Date(loan.date).toLocaleDateString()}
                </td>
                <td style={{ padding: "0.5rem" }}>{loan.amount} KES</td>
                <td
                  style={{
                    padding: "0.5rem",
                    color:
                      loan.status === "Approved"
                        ? "#00ff99"
                        : loan.status === "Rejected"
                        ? "#ff4d4d"
                        : "#ffaa00",
                  }}
                >
                  {loan.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyLoans;