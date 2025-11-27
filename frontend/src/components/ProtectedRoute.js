import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {
  // Use the same key you store JWT in (authToken)
  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  const isStaff = localStorage.getItem("is_staff") === "true";

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If route is admin-only but user is not staff, redirect to dashboard
  if (adminOnly && !isStaff) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise render the protected children
  return children;
}