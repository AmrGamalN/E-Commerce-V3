import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/Logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem("userId");
        navigate("/login/email");
      } else {
        console.error("Logout failed:", data.message);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "#333", color: "white" }}>
      <h2>My App</h2>
      <button onClick={handleLogout} style={{ padding: "10px", cursor: "pointer", background: "red", color: "white" }}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
