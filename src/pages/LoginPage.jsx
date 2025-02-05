import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Login successful, navigating to home");
          navigate("/");
        } else {
          return response.json().then((data) => {
            console.error("Login failed:", data.message || "Unknown error");
          });
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
      });
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-dark-navy text-white">
        <div className="w-full max-w-md p-8 space-y-6 bg-gray-light rounded-md shadow-lg">
          <h1 className="text-2xl font-semibold text-center">Log In</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Your Username"
                className="w-full px-3 py-2 bg-dark-navy text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-bar-blue"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Your Password"
                className="w-full px-3 py-2 bg-dark-navy text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-bar-blue"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-bar-blue text-white rounded-md hover:bg-bar-red transition"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
