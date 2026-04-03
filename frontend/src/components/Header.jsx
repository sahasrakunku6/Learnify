import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Header() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="absolute top-0 left-0 w-full flex justify-between items-center px-4 md:px-10 py-4 bg-transparent text-black z-50">
  <div className="flex items-center space-x-1 cursor-pointer" onClick={() => navigate("/")}>
    <img src="/learnify1.png" alt="Logo" className="h-7 w-auto -mt-1" />  
    <h1 className="text-2xl font-bold tracking-wide">earnify</h1>
  </div>

      <ul className="hidden md:flex space-x-6">
        <li className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="hover:text-gray-700"
          >
            Courses ▼
          </button>
          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-[#ebebeb] text-black rounded-lg shadow-lg z-50">
              <div className="grid grid-cols-2 gap-2 p-2">
                {[...Array(12).keys()].map((i) => (
                  <button key={i} className="px-4 py-2 hover:bg-gray-200 text-left">
                    Grade {i + 1}
                  </button>
                ))}
                <button className="px-4 py-2 hover:bg-gray-200 text-left">JEE Mains</button>
                <button className="px-4 py-2 hover:bg-gray-200 text-left">JEE Advanced</button>
                <button className="px-4 py-2 hover:bg-gray-200 text-left">UPSC</button>
              </div>
            </div>
          )}
        </li>
        <li>
          <a href="#explore" className="hover:text-gray-700">
            Explore
          </a>
        </li>
        <li>
        <a href="#about" className="hover:text-gray-700">About</a>
        </li>
        <li>
          <button onClick={() => navigate("/donate")} className="hover:text-gray-700">
            Donate
          </button>
        </li>
      </ul>

      <div className="flex items-center gap-2 md:gap-4">
        <motion.button
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          whileHover={{ scale: 1.1 }}
          onClick={() => navigate("/login")}
        >
          Log In
        </motion.button>
        <motion.button
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          whileHover={{ scale: 1.1 }}
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </motion.button>
      </div>
    </nav>
  );
}
