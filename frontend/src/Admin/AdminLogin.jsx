import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Api from "../component/Api";

const AdminLogin = () => {
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
      const res = await Api.post("/admin/login", data);
      console.log("Admin login", res.data);

      if (res.data.token) localStorage.setItem("token", res.data.token);
      if (res.data.admin?.id)
        localStorage.setItem("AdminID", res.data.admin.id);

      alert("Admin login successful!!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error(
        "Admin login error:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold text-center text-red-600 mb-6">
          Admin Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={data.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={data.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
          />

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-200">
            Login
          </button>

          {/* Redirect */}
          <p className="text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link to="/admin/register" className="text-red-600 hover:underline">
              Create account
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;
