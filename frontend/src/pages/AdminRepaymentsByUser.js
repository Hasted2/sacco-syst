import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

const AdminRepaymentsByUser = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get("admin/repayments-by-user/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch(() =>
        setError("❌ Access denied or failed to load repayments by user.")
      );
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/tech-wallpaper.jpg')",
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
            boxShadow: "0 0 10px rgba(0,170,255,0.6)",
            width: "100%",
            maxWidth: "900px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <h2
            style={{
              fontSize: "1.8rem",
              marginBottom: "1rem",
              color: "#00aaff",
              textAlign: "center",
            }}
          >
            📊 Repayments by User
          </h2>

          {error && (
            <p
              style={{
                color: "#ff4d4d",
                fontWeight: "bold",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}

          {users.map((u) => (
            <div
              key={u.user_id}
              style={{
                marginBottom: "2rem",
                padding: "1rem",
                backgroundColor: "#1b263b",
                borderRadius: "8px",
                boxShadow: "0 0 6px rgba(0,170,255,0.3)",
              }}
            >
              <h3 style={{ color: "#00aaff", marginBottom: "0.5rem" }}>
                👤 {u.username} — Total Repaid:{" "}
                <span style={{ color: "#ffc107" }}>{u.total_repaid} KSH</span>
              </h3>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "1rem",
                  fontSize: "0.9rem",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "rgba(20,20,30,0.9)" }}>
                    <th style={{ padding: "0.5rem", textAlign: "left" }}>
                      Loan ID
                    </th>
                    <th style={{ padding: "0.5rem", textAlign: "left" }}>
                      Original Amount
                    </th>
                    <th style={{ padding: "0.5rem", textAlign: "left" }}>
                      Current Balance
                    </th>
                    <th style={{ padding: "0.5rem", textAlign: "left" }}>
                      Repaid Amount
                    </th>
                    <th style={{ padding: "0.5rem", textAlign: "left" }}>
                      Status
                    </th>
                    <th style={{ padding: "0.5rem", textAlign: "left" }}>
                      Date
                    </th>
                    <th style={{ padding: "0.5rem", textAlign: "left" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {u.loans.map((loan) => (
                    <tr key={loan.loan_id}>
                      <td style={{ padding: "0.5rem" }}>{loan.loan_id}</td>
                      <td style={{ padding: "0.5rem" }}>
                        {loan.original_amount}
                      </td>
                      <td style={{ padding: "0.5rem" }}>
                        {loan.current_balance}
                      </td>
                      <td style={{ padding: "0.5rem" }}>
                        {loan.repaid_amount}
                      </td>
                      <td style={{ padding: "0.5rem" }}>{loan.status}</td>
                      <td style={{ padding: "0.5rem" }}>
                        {new Date(loan.date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "0.5rem" }}>
                        <Link
                          to={`/admin/user-statement/${u.user_id}`}
                          style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: "#00aaff",
                            color: "#fff",
                            borderRadius: "6px",
                            textDecoration: "none",
                            fontWeight: "bold",
                          }}
                        >
                          🖨️ Print Statement
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminRepaymentsByUser;
