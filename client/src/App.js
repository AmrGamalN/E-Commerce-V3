import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";  
import EmailAuth from "./components/LoginWithEmail";  
import PhoneAuth from "./components/LoginWithPhone";  
import Notifications from "./components/Notification";  

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="login/email" element={<EmailAuth />} />
        <Route path="/login/phone" element={<PhoneAuth />} />
        <Route path="/Notification" element={<Notifications />} />
      </Routes>
    </Router>
  );
}

export default App;
