import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Api from "../component/Api";

const AttendeeLogin = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await Api.post("/attendee/login", data);
      console.log("Attendee login", res.data);

      if (res.data.token) localStorage.setItem("token", res.data.token);
      if (res.data.attendee?.id)
        localStorage.setItem("AttendeeID", res.data.attendee.id);

      alert("Attendee login successful!!");
      navigate("/attendee/dashboard");
    } catch (error) {
      console.error(
        "Attendee login error:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Attendee Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
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

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200">
            Login
          </button>

          <button
            type="submit"
            className="w-full  text-blue-600 border-1 py-2 rounded-lg hover:bg-blue-200 transition duration-200">
            <Link to="/organizer/login">Login as organizer</Link>
          </button>

          {/* Redirect Link */}
          <p className="text-center text-gray-600 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              to="/attendee/register"
              className="text-blue-600 hover:underline">
              Create account
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default AttendeeLogin;
