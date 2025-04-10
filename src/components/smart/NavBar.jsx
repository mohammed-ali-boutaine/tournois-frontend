// Navbar.js
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import { notifySuccess, notifyError } from "../../utils/toast";



const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      fetchUserData();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get("/user");
      setUser(response.data);
    } catch (error) {
      console.log(error);
      handleLogout();
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/logout");
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setUser(null);
      notifySuccess("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      notifyError("Error logging out");
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          Tournament App
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/tournaments"
                className="text-white hover:text-gray-300"
              >
                Tournaments
              </Link>
              <Link to="/matches" className="text-white hover:text-gray-300">
                Matches
              </Link>
              <div className="relative group" ref={dropdownRef}>
                <button
                  className="text-white hover:text-gray-300"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {user?.name || "Profile"}
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-gray-300">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
