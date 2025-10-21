import React, { useState } from "react";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import phone2 from "../assets/phone2.jpg";
import logo from "../assets/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast.error("Please fill in both fields");
      return;
    }
    toast.success("Login successful! 🎉", { duration: 1000 });
    navigate("/home");
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="flex-1  flex flex-col items-center shadow-lg bg-white p-6">
        <div className="flex justify-center items-center my-6">
          <img
            src={logo}
            alt="Company Logo"
            className="w-40 h-40 object-contain"
          />
        </div>

        <div className="w-full max-w-md ">
          <h2 className="text-3xl font-bold text-black">Log In</h2>
          <p className="text-gray-500 mb-6 text-sm">
            To continue, please enter your username and password.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="text-left">
              <Link
                to="/forgot-password"
                className="text-primary hover:text-blue-700 text-sm font-semibold"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-[50%] rounded-full py-3 bg-primary hover:bg-blue-700 text-white font-semibold transition duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      <div className="flex-1 hidden lg:block">
        <img
          src={phone2}
          alt="Phone preview"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default Login;
