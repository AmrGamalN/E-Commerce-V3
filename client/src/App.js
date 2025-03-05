import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import EmailAuth from "./components/LoginWithEmail";
import PhoneAuth from "./components/LoginWithPhone";
import Notifications from "./components/Notification";
import ChatComponent from "./components/ChatComponent";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Logout";
import ChatPage from "./components/ChatPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="login/email" element={<EmailAuth />} />
        <Route path="/login/phone" element={<PhoneAuth />} />
        <Route
          path="/Notification"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Chat"
          element={
            <ProtectedRoute>
              <ChatComponent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/page"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
