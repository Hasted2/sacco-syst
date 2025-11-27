import React from "react";
import MyLoans from "./MyLoans";

const MyLoansPage = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        backgroundColor: "#121212",
        color: "#f5f5f5",
      }}
    >
      <h1 style={{ color: "#00aaff", marginBottom: "1rem" }}> My Loans</h1>
      <MyLoans />
    </div>
  );
};

export default MyLoansPage;