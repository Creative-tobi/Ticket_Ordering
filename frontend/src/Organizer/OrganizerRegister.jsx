import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Api from "../component/Api";

const OrganizerRegister = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await Api.post("/organizer/register", data);
      console.log("Organizer registration", res.data);

      if (res.data.token) localStorage.setItem("token", res.data.token);
      if (res.data.user?._id)
        localStorage.setItem("OrganizerID", res.data.user._id);
      if(res.data.organizer?.email) localStorage.setItem("organizeremail", res.data.organizer.email);
      if (res.data.organizer?.OTP)
         localStorage.setItem("organizerOTP", res.data.organizer.OTP);

      alert("Organizer registered successfully!");
      navigate("/organizer/verifyOTP");
    } catch (error) {
      console.error(
        "Organizer register error:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold text-center text-purple-600 mb-6">
          Organizer Registration
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={data.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={data.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={data.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200">
            Register
          </button>

          <button
            type="submit"
            className="w-full  text-purple-600 border-1 py-2 rounded-lg hover:bg-purple-200 transition duration-200">
            <Link to="/attendee/register">Register as attendee</Link>
          </button>

          {/* Redirect to Login */}
          <p className="text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              to="/organizer/login"
              className="text-purple-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default OrganizerRegister;
