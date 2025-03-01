import React, { useState } from "react";
import { requestForToken } from "../firebase/firebase-config";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

function EmailAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/login",
        { email, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      const userId = response.data.data;
      if (userId) {
        setMessage("Login successful!");

        // تخزين userId في localStorage
        localStorage.setItem("userId", userId);

        const fcmToken = await requestForToken(userId);
        console.log("Login successful, FCM Token:", fcmToken);
        if (fcmToken) {
          await axios.post(
            "http://localhost:8080/api/v1/notification/register-token",
            { fcmToken, userId },
            { withCredentials: true }
          );
          setMessage("Login successful and FCM Token sent successfully!");
          navigate("/Notification");
        } else {
          setMessage("Login successful but FCM Token was not obtained.");
        }
      } else {
        setMessage("Login failed, please check your email and password.");
      }
    } catch (error) {
      setMessage("An error occurred while logging in.");
      console.error("Error logging in: ", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login</h2>
      <form
        onSubmit={handleLogin}
        style={{ display: "inline-block", textAlign: "left" }}
      >
        <div style={{ marginBottom: "10px" }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ display: "block", padding: "8px", width: "250px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ display: "block", padding: "8px", width: "250px" }}
          />
        </div>
        <button
          type="submit"
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          Login
        </button>
      </form>
      <p style={{ marginTop: "20px", color: "blue" }}>{message}</p>
    </div>
  );
}

export default EmailAuth;
