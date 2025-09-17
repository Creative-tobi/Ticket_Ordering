import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Api from "../component/Api";

const OrganizerOTP = () => {
  const [OTP, setOTP] = useState({ OTP: "" });
  const [resend, setResend] = useState(false);

  const navigate = useNavigate();

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
        const organizeremail = localStorage.getItem("organizeremail");
        const organizerOTP = localStorage.getItem("organizerOTP");
        console.log("Organizer Email and OTP from localStorage:", organizeremail, organizerOTP);

    const res = await Api.post("/organizer/verifyOtp", { OTP: organizerOTP, email: organizeremail });
      console.log("Organizer OTP verification", res.data);
      alert("OTP verified successfully!");
      navigate("/organizer/login");
    } catch (error) {
      console.error(
        "Organizer OTP verification error:",
        error.response?.data || error.message
      );

      alert(error.response?.data?.message || "OTP verification failed");
      const send = await Api.put("/organizer/resendOtp", {
        email: localStorage.getItem("organizeremail"),
      });
      console.log("Resend OTP", send.data);
      alert("OTP resent successfully! Please check your email.");
      setResend(true);
    }
  };
  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
          Enter OTP
        </h2>
        <input
          type="Number"
          value={OTP.OTP}
          onChange={(e) => setOTP(e.target.value)}
          placeholder="Enter OTP"
          className="w-full px-4 py-2 mb-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
        />

        {/* Submit Button */}
        <button
          onClick={handleVerifyOTP}
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200">
          Verify OTP
        </button>
      </div>
    </section>
  );
};

export default OrganizerOTP;
