import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Api from "../component/Api";

const AdminRegistration = () => {
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
      const res = await Api.post("/admin/register", data);
      console.log("Admin registration", res.data);

      if (res.data.token) localStorage.setItem("token", res.data.token);
      if (res.data.user?._id)
        localStorage.setItem("AdminID", res.data.user._id);
      if(res.data.user?.email)
      localStorage.setItem("email", res.data.user.email);
    if (res.data.admin?.email)
      localStorage.setItem("organizeremail", res.data.admin.email);
    if (res.data.admin?.OTP)
      localStorage.setItem("organizerOTP", res.data.admin.OTP);


      alert("Admin registered successfully!");
      navigate("/admin/verifyOTP");
    } catch (error) {
      console.error(
        "Admin register error:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold text-center text-red-600 mb-6">
          Admin Registration
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
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
          />

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

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-200">
            Register
          </button>

          {/* Redirect */}
          <p className="text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link to="/admin/login" className="text-red-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default AdminRegistration;
