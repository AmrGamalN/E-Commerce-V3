import React, { useState, useEffect } from "react";
import { auth } from "../firebase/firebase-config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const PhoneAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [message, setMessage] = useState("");

  // Setup reCAPTCHA
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => console.log("reCAPTCHA Verified!"),
      });
      window.recaptchaVerifier.render();
    }
  }, []);

  // Send OTP
  const sendOTP = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!phoneNumber) {
      setMessage("Enter your phone number!");
      return;
    }

    try {
      const appVerifier = window.recaptchaVerifier;
      const confirm = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirm);
      setMessage(`OTP sent to ${phoneNumber}`);
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage("Failed to send OTP. Try again.");
    }
  };

  // Verify OTP
  const verifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      setMessage("Enter the OTP!");
      return;
    }

    if (!confirmationResult) {
      setMessage("Request OTP first!");
      return;
    }

    try {
      const result = await confirmationResult.confirm(otp);
      setMessage(`Phone verified! Welcome, ${result.user.phoneNumber}`);
    } catch (error) {
      console.error("OTP verification failed:", error);
      setMessage("Invalid OTP. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Phone Authentication</h2>

        {/* Phone Number Input */}
        <form onSubmit={sendOTP} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Phone Number:</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all"
          >
            Send OTP
          </button>
        </form>

        {/* OTP Verification Input */}
        <form onSubmit={verifyOTP} className="space-y-4 mt-4">
          <div>
            <label className="block text-gray-700 font-medium">Enter OTP:</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-all"
          >
            Verify OTP
          </button>
        </form>

        {/* reCAPTCHA Container */}
        <div id="recaptcha-container" className="mt-4"></div>

        {/* Message Display */}
        {message && (
          <div className="mt-4 p-3 text-center text-white font-medium rounded-lg bg-gray-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneAuth;
