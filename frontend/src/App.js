import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Transactions from "./pages/Transactions";
import Loans from "./pages/Loans";
import Repayments from "./pages/Repayments";
import LoanApplication from "./pages/LoanApplication";
import RepaymentForm from "./pages/RepaymentForm";
import AdminLoans from "./pages/AdminLoans";
import Navbar from "./components/Navbar";
import UserLoans from "./pages/UserLoans";
import PasswordReset from "./pages/PasswordReset";
import PasswordResetConfirm from "./pages/PasswordResetConfirm";
import "./index.css";
import DepositForm from "./pages/DepositForm";
import WithdrawForm from "./pages/WithdrawForm";
import MyLoansPage from "./pages/MyLoansPage";
import AdminRepaymentsByUser from "./pages/AdminRepaymentsByUser";
import UserStatement from "./pages/UserStatement"; // ✅ import your new page

function Layout({ children }) {
  const location = useLocation();

  // Define routes where Navbar should NOT appear
  const hideNavbarRoutes = ["/", "/login", "/register", "/password-reset", "/password-reset-confirm"];

  const shouldHideNavbar = hideNavbarRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/90595.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        color: "#f5f5f5",
      }}
    >
      {!shouldHideNavbar && <Navbar />} {/* ✅ Navbar only on protected pages */}
      {children}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/password-reset-confirm/:token" element={<PasswordResetConfirm />} />
          <Route path="/deposit" element={<DepositForm />} />
          <Route path="/withdraw" element={<WithdrawForm />} />
          <Route path="/my-loans" element={<MyLoansPage />} />
          <Route path="/admin/repayments-by-user" element={<AdminRepaymentsByUser />} />
          {/* Protected routes */}
           <Route
            path="/admin/user-statement/:userId"
            element={
              <ProtectedRoute adminOnly={true}>
                <UserStatement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-loans"
            element={
              <ProtectedRoute>
                <UserLoans />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/loans"
            element={
              <ProtectedRoute>
                <Loans />
              </ProtectedRoute>
            }
          />
          <Route
            path="/repayments"
            element={
              <ProtectedRoute>
                <Repayments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/apply-loan"
            element={
              <ProtectedRoute>
                <LoanApplication />
              </ProtectedRoute>
            }
          />
          <Route
            path="/repay/:loanId"
            element={
              <ProtectedRoute>
                <RepaymentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/loans"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminLoans />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;