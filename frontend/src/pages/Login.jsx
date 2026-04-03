import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; 
import Lottie from "lottie-react";
import Header from "../components/Header.jsx";
import { getFirestore, doc, getDoc } from "firebase/firestore"; 
import { COLLECTIONS } from "../constants/firestorePaths";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const [animationData, setAnimationData] = useState(null);
  const navigate = useNavigate(); 
  const db = getFirestore(); 

  useEffect(() => {
    fetch("/login_video.json")
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => console.error("Error loading animation:", error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    if (!email || !password) {
      setError("Email and Password are required!");
      return;
    }

    try {
      // Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, COLLECTIONS.USERS, user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        setError("User data not found.");
        return;
      }

      const userData = userDoc.data();
      if (userData.role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/profile");
      }
      
    } catch (error) {
      setError(error.message); 
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#F8FAFC]">
      <Header />
      
      {/* Left Side - Animation */}
      <div className="w-full md:w-1/2 h-1/3 md:h-full flex items-center justify-center">
        {animationData ? (
          <Lottie animationData={animationData} className="max-w-full max-h-full" />
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center p-6">
        <div className="w-full max-w-lg p-10 rounded-2xl shadow-lg bg-white">
          <h2 className="text-4xl font-bold mb-6 text-center">Login</h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-lg">Email:</label>
              <input
                type="email"
                className="w-full px-5 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-lg">Password:</label>
              <input
                type="password"
                className="w-full px-5 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 text-lg rounded-lg hover:bg-gray-800 transition"
            >
              Login
            </button>
          </form>
          <p className="mt-6 text-center text-lg text-gray-600">
            Don't have an account? <a href="/signup" className="text-black font-bold underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
