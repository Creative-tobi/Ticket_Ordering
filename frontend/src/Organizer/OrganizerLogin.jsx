import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Api from "../component/Api";

const OrganizerLogin = () => {
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
      const res = await Api.post("/organizer/login", data);
      console.log("Organizer login", res.data);

      if (res.data.token) localStorage.setItem("token", res.data.token);
      if (res.data.organizer?.id)
        localStorage.setItem("OrganizerID", res.data.organizer.id);

      alert("Organizer login successful!!");
      navigate("/organizer/dashboard");
    } catch (error) {
      console.error(
        "Organizer login error:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold text-center text-purple-600 mb-6">
          Organizer Login
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
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />

          {/* Password Input */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={data.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200">
            Login
          </button>

           <button
              type="submit"
              className="w-full  text-purple-600 border-1 py-2 rounded-lg hover:bg-purple-200 transition duration-200">
              <Link to="/attendee/login">Login as attendee</Link>
            </button>

          {/* Redirect Link */}
          <p className="text-center text-gray-600 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              to="/organizer/register"
              className="text-purple-600 hover:underline">
              Create account
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default OrganizerLogin;
