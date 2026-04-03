import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import Lottie from "lottie-react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { API_BASE } from "../config.js";


export default function SignUp() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("learner"); 
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_no: "",
    password: "",
    dob: "",
    education_lvl: "",
    subject: "",
  });
  const [animationData, setAnimationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/signup_video.json")
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => console.error("Error loading animation:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); 

    let userPayload = {
    first_name: formData.first_name,
    last_name: formData.last_name,
    email: formData.email,
    phone_no: formData.phone_no,
    password: formData.password,
    role: userType,
    createdAt: new Date(), 
  };

  if (userType === "learner") {
    userPayload = {
      ...userPayload,
      dob: formData.dob ? new Date(formData.dob) : null,
      education_lvl: formData.education_lvl,
    };
  } else if (userType === "teacher") {
    userPayload = {
      ...userPayload,
      subject: formData.subject,
    };
  }

    try {
      const response = await fetch(`${API_BASE}/signup`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userPayload),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signup Successful!  Redirecting to login...");
        navigate("/login");
      } else {
        setError(data.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setError("Signup failed due to a server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#F8FAFC]">
      <Header />

      {/* Left Side - Sign Up Form */}
      <div className="w-full mt-10 md:w-1/2 h-full flex items-center justify-center p-6">
        <div className="w-full max-w-lg p-10 rounded-2xl shadow-lg bg-white">
          <h2 className="text-4xl font-bold mb-6 text-center">Sign Up</h2>

          {/* User Type Selection */}
          <div className="flex justify-center mb-6">
            <button 
              className={`px-5 py-2 text-lg font-semibold border-b-2 ${
                userType === "learner" ? "border-blue-600 text-blue-600" : "border-gray-300 text-gray-500"
              }`} 
              onClick={() => setUserType("learner")}
            >
              Learner
            </button>
            <button 
              className={`px-5 py-2 text-lg font-semibold border-b-2 ${
                userType === "teacher" ? "border-blue-600 text-blue-600" : "border-gray-300 text-gray-500"
              }`} 
              onClick={() => setUserType("teacher")}
            >
              Teacher
            </button>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex space-x-3">
              <input type="text" name="first_name" placeholder="First Name" className="w-1/2 p-3 border rounded-lg" onChange={handleChange} required />
              <input type="text" name="last_name" placeholder="Last Name" className="w-1/2 p-3 border rounded-lg" onChange={handleChange} required />
            </div>
            <div className="mb-4">
              <input type="email" name="email" placeholder="Email" className="w-full p-3 border rounded-lg" onChange={handleChange} required />
            </div>
            <div className="mb-4">
              <input type="tel" name="phone_no" placeholder="Phone Number" className="w-full p-3 border rounded-lg" onChange={handleChange} required />
            </div>
            <div className="mb-4">
              <input type="password" name="password" placeholder="Password" className="w-full p-3 border rounded-lg" onChange={handleChange} required />
            </div>

            {/* Learner-Specific Fields */}
            {userType === "learner" && (
              <div className="mb-4 flex space-x-3">
                <input type="date" name="dob" className="w-1/2 p-3 border rounded-lg" onChange={handleChange} required />
                <select name="education_lvl" className="w-1/2 p-3 border rounded-lg" onChange={handleChange} required>
                  <option value="">Education Level</option>
                  <option value="lvl1">Grade 1</option>
                  <option value="lvl2">Grade 2</option>
                  <option value="lvl3">Grade 3</option>
                  <option value="lvl4">Grade 4</option>
                  <option value="lvl5">Grade 5</option>
                  <option value="lvl6">Grade 6</option>
                  <option value="lvl7">Grade 7</option>
                  <option value="lvl8">Grade 8</option>
                  <option value="lvl9">Grade 9</option>
                  <option value="lvl10">Grade 10</option>
                  <option value="lvl11">Grade 11</option>
                  <option value="lvl12">Grade 12</option>
                  <option value="lvlmains">JEE Mains</option>
                  <option value="lvladv">JEE Advanced</option>
                  <option value="lvlupsc">UPSC</option>
                </select>
              </div>
            )}

            {/* Teacher-Specific Fields */}
            {userType === "teacher" && (
              <div className="mb-4">
                <input type="text" name="subject" placeholder="Subject" className="w-full p-3 border rounded-lg" onChange={handleChange} required />
              </div>
            )}

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <button 
              type="submit" 
              className="w-full bg-black text-white py-3 text-lg rounded-lg hover:bg-gray-600 transition"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          {/* Login Redirect */}
          <p className="mt-6 text-center text-lg text-gray-600">
            Already have an account? <a href="/login" className="text-black font-bold underline">Login</a>
          </p>
        </div>
      </div>

      {/* Right Side - Animation */}
      <div className="w-full md:w-1/2 h-1/3 md:h-full flex items-center justify-center">
        {animationData ? (
          <Lottie animationData={animationData} className="w-full h-[80%] max-w-2xl" />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
