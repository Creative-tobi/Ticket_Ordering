import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Api from "../component/Api";

const AttendeeRegister = () => {
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
      const res = await Api.post("/attendee/register", data);
      console.log("Attendee registration", res.data);

      if (res.data.token) localStorage.setItem("token", res.data.token);
      if (res.data.user?._id)
        localStorage.setItem("AttendeeID", res.data.user._id);

      alert("Attendee registered successfully!");
      navigate("/attendee/login");
    } catch (error) {
      console.error(
        "Attendee register error:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Attendee Registration
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name Input */}
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={data.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          {/* Email Input */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={data.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          {/* Password Input */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={data.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200">
            Register
          </button>

          <button
            type="submit"
            className="w-full  text-blue-600 border-1 py-2 rounded-lg hover:bg-blue-200 transition duration-200">
            <Link to="/organizer/register">Login as organizer</Link>
          </button>
          {/* Redirect Link */}
          <p className="text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              to="/attendee/login"
              className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default AttendeeRegister;
