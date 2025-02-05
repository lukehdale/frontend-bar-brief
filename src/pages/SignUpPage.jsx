import React, { useState } from "react";

import Navbar from "../components/Navbar";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
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
    fetch("http://localhost:8080/auth/signup", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("User created:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-dark-navy text-white">
        <div className="w-full max-w-md p-8 space-y-6 bg-gray-light rounded-md shadow-lg">
          <h1 className="text-2xl font-semibold text-center">Sign Up</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter name"
                className="w-full px-3 py-2 bg-dark-navy text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-bar-blue"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
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
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="w-full px-3 py-2 bg-dark-navy text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-bar-blue"
                value={formData.email}
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
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
