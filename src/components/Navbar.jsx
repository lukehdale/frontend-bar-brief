import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/auth/validate-token", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isValid) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch((error) => {
        console.error("Error validating token:", error);
        setIsAuthenticated(false);
      });
  }, []);

  const handleHomeButtonClick = () => {
    navigate("/");
  };

  const handleSignupButtonClick = () => {
    navigate("/signup");
  };

  const handleLoginButtonClick = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    fetch("http://localhost:8080/auth/logout", {
      method: "POST",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          setIsAuthenticated(false);
          navigate("/");
        }
      })
      .catch((error) => {
        console.log("logout failed", error);
      });
  };

  return (
    <nav className="bg-gray-900 p-4 flex justify-between items-center">
      <h1
        className="cursor-pointer text-xl font-bold text-bar-blue"
        onClick={handleHomeButtonClick}
      >
        Bar Brief
      </h1>
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search bars..."
          className="p-2 rounded bg-gray-800 text-white"
        />
        {isAuthenticated !== true ? (
          <>
            <button
              className="p-2 bg-blue-600 rounded hover:bg-blue-700"
              onClick={handleLoginButtonClick}
            >
              Log In
            </button>
            <button
              className="p-2 bg-green-600 rounded hover:bg-green-700"
              onClick={handleSignupButtonClick}
            >
              Sign Up
            </button>
          </>
        ) : null}
        {isAuthenticated === true ? (
          <button
            onClick={handleLogout}
            className="p-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Logout
          </button>
        ) : null}
      </div>
    </nav>
  );
}
