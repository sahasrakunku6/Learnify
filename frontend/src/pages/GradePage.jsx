import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { COLLECTIONS } from "../constants/firestorePaths";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Sidebar from "../components/Sidebar";
import Chatbot from "../components/Chatbot";

const GradePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchUserData = async (uid) => {
      if (!uid) return;
      const userDocRef = doc(db, COLLECTIONS.USERS, uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
      setLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [db]);

  if (loading) return <h1 className="text-center text-xl mt-10">Loading...</h1>;

  return (
    <div className="flex bg-[#f7f9fc] min-h-screen">
      <Sidebar />
      <div className="p-8 w-3/4 mx-auto">
        
        {/* Grade Overview */}
        <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-8 rounded-2xl shadow-lg text-center mb-10">
          <h1 className="text-4xl font-extrabold text-blue-800 mb-2">
            🎓 Grade {userData?.grade || "8"}
          </h1>
          <p className="text-lg text-gray-800">
            You've completed{" "}
            <span className="font-semibold">{userData?.progress || "0%"}</span> of this grade!
          </p>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userData?.subjects?.map((subject, index) => {
            const progress = parseInt(subject.progress || "0");
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition"
              >
                <h2 className="text-xl font-bold text-blue-700 mb-2">📘 {subject.name}</h2>
                <p className="text-sm text-gray-600 mb-2">Progress: {subject.progress || "0%"}</p>
                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      progress < 40
                        ? "bg-red-500"
                        : progress < 75
                        ? "bg-yellow-500"
                        : "bg-green-600"
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommended Lesson */}
        <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-blue-700 mb-3">📚 Recommended Learning</h2>
          <p className="text-gray-700 mb-4">
            Next Lesson:{" "}
            <span className="font-semibold text-black">
              {userData?.nextLesson || "No upcoming lesson"}
            </span>
          </p>
          <button className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition">
            Continue Learning
          </button>
        </div>

        {/* Assignments */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">📝 Upcoming Assignments</h2>
          {userData?.assignments?.length > 0 ? (
            <ul className="space-y-2">
              {userData.assignments.map((assignment, index) => (
                <li key={index} className="text-gray-800 flex items-center gap-2">
                  <span className="text-blue-500">📌</span>
                  <span>
                    <strong>{assignment.title}</strong> — Due{" "}
                    <span className="text-red-600 font-medium">{assignment.dueDate}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No upcoming assignments.</p>
          )}
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default GradePage;
