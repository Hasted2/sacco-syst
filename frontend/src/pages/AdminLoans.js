import React, { useEffect, useState } from "react";
import api from "../api/axios";

const AdminLoans = () => {
  const [loans, setLoans] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLoans = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get("loans/all/", {
          headers: { Authorization: `Token ${token}` },
        });
        setLoans(response.data);
      } catch (err) {
        console.error("Error fetching loans:", err);
        setMessage("❌ Failed to load loans.");
      }
    };
    fetchLoans();
  }, []);

  const approveLoan = async (loanId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await api.post(`loans/approve/${loanId}/`, {}, {
        headers: { Authorization: `Token ${token}` },
      });
      setMessage(`✅ ${response.data.detail}`);
      setLoans(loans.map(l => l.id === loanId ? { ...l, status: "Approved" } : l));
    } catch (err) {
      console.error("Error approving loan:", err);
      setMessage("❌ Failed to approve loan.");
    }
  };

  const rejectLoan = async (loanId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await api.post(`loans/reject/${loanId}/`, {}, {
        headers: { Authorization: `Token ${token}` },
      });
      setMessage(`❌ ${response.data.detail}`);
      setLoans(loans.map(l => l.id === loanId ? { ...l, status: "Rejected" } : l));
    } catch (err) {
      console.error("Error rejecting loan:", err);
      setMessage("❌ Failed to reject loan.");
    }
  };

  const revokeLoan = async (loanId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await api.post(`loans/revoke/${loanId}/`, {}, {
      headers: { Authorization: `Token ${token}` },
    });
    setMessage(`🔄 ${response.data.detail}`);
    setLoans(loans.map(l => l.id === loanId ? { ...l, status: "Revoked" } : l));
  } catch (err) {
    console.error("Error revoking loan:", err);
    setMessage("❌ Failed to revoke loan.");
  }
};

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/90595.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(6px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "3rem 2rem",
        }}
      >
        {/* Card container */}
        <div
          style={{
            backgroundColor: "rgba(20,20,30,0.9)",
            color: "#f5f5f5",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 0 10px rgba(255,0,0,0.6)",
            width: "100%",
            maxWidth: "800px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <h2 style={{ marginBottom: "1rem", color: "#ff4d4d", textAlign: "center" }}>
            🛠️ Admin Loan Management
          </h2>

          {message && (
            <p
              style={{
                marginBottom: "1rem",
                fontWeight: "bold",
                textAlign: "center",
                color: message.includes("✅") ? "#28a745" : "#ff4d4d",
              }}
            >
              {message}
            </p>
          )}

          <ul style={{ listStyle: "none", padding: 0 }}>
            {loans.map((loan) => (
              <li
                key={loan.id}
                style={{
                  marginBottom: "1.5rem",
                  padding: "1rem",
                  borderRadius: "8px",
                  backgroundColor: "#1b263b",
                  boxShadow: "0 0 6px rgba(255,0,0,0.3)",
                }}
              >
                <div style={{ marginBottom: "0.5rem", fontSize: "0.95rem" }}>
                  <strong>{new Date(loan.date).toLocaleString()}</strong> —{" "}
                  <span style={{ fontWeight: "bold" }}>{loan.amount} KSH</span> —{" "}
                       <span
  style={{
    padding: "0.2rem 0.5rem",
    backgroundColor:
      loan.status === "Approved"
        ? "#28a745"   // green
        : loan.status === "Rejected"
        ? "#dc3545"   // red
        : loan.status === "Revoked"
        ? "#6c757d"   // grey
        : "#ffc107",  // yellow (Pending or others)
    color: "#fff",
    borderRadius: "4px",
    fontSize: "0.85rem",
  }}
>
  {loan.status}
</span>   
                </div>

                {/* ✅ Show user info and reason */}
                <div style={{ marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                  <strong>User:</strong> {loan.user_name || loan.user_id} <br />
                  <strong>Reason:</strong> {loan.reason || "—"}
                </div>

                {loan.status === "Pending" && (
  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
    <button
      onClick={() => approveLoan(loan.id)}
      style={{
        minWidth: "140px",              // ✅ ensures button is wide enough
        padding: "0.8rem 1.5rem",       // ✅ larger padding
        backgroundColor: "#28a745",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "0.95rem",            // ✅ slightly bigger text
        boxShadow: "0 0 10px rgba(40,167,69,0.6)",
        transition: "all 0.3s ease",
        flexGrow: 1,                    // ✅ allows expansion but keeps min width
      }}
    >
      ✅ Approve
    </button>

    <button
      onClick={() => rejectLoan(loan.id)}
      style={{
        minWidth: "140px",              // ✅ ensures button is wide enough
        padding: "0.8rem 1.5rem",       // ✅ larger padding
        backgroundColor: "#dc3545",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "0.95rem",            // ✅ slightly bigger text
        boxShadow: "0 0 10px rgba(220,53,69,0.6)",
        transition: "all 0.3s ease",
        flexGrow: 1,
      }}
    >
      ❌ Reject
    </button>
  </div>
)}

{loan.status.toLowerCase() === "approved" && (
  <button
    onClick={() => revokeLoan(loan.id)}
    style={{
      minWidth: "140px",              // ✅ ensures button is wide enough
      padding: "0.8rem 1.5rem",       // ✅ larger padding
      backgroundColor: "#6c757d",     // grey
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "0.95rem",            // ✅ slightly bigger text
      boxShadow: "0 0 10px rgba(108,117,125,0.6)",
      transition: "all 0.3s ease",
      flexGrow: 1,                    // ✅ expands evenly with others
    }}
  >
    🔄 Revoke Loan
  </button>
)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminLoans;