import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const AdminRepayments = () => {
  const [repayments, setRepayments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    api.get('api/loans/admin/repayments/', {
      headers: { Authorization: `Token ${token}` }
    })
    .then(res => setRepayments(res.data))
    .catch(() => setError('❌ Access denied or failed to load repayments.'));
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
            boxShadow: "0 0 10px rgba(255,0,0,0.6)",
            width: "100%",
            maxWidth: "700px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem", color: "#ff4d4d", textAlign: "center" }}>
            📋 All Loan Repayments
          </h2>

          {error && (
            <p style={{ color: "#ff4d4d", fontWeight: "bold", marginBottom: "1rem", textAlign: "center" }}>
              {error}
            </p>
          )}

          <ul style={{ listStyle: "none", padding: 0 }}>
            {repayments.map((r, i) => (
              <li
                key={i}
                style={{
                  marginBottom: "1rem",
                  padding: "1rem",
                  backgroundColor: "#1b263b",
                  borderRadius: "8px",
                  boxShadow: "0 0 6px rgba(255,0,0,0.3)",
                  fontSize: "0.95rem",
                }}
              >
                <span style={{ color: "#ccc" }}>{r.timestamp}</span>:{" "}
                <strong style={{ color: "#00aaff" }}>{r.user}</strong> repaid{" "}
                <span style={{ color: "#ffc107", fontWeight: "bold" }}>
                  KES {r.amount}
                </span>{" "}
                for Loan #{r.loan_id}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminRepayments;