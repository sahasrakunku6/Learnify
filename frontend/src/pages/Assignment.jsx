import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Sidebar from "../components/Sidebar";
import Chatbot from "../components/Chatbot";
import apiClient from "../apiClient";

const Assignments = () => {
  const [userData, setUserData] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch assignments
        const assignmentsResponse = await apiClient.get("/assignments");
        setAssignments(assignmentsResponse.data || []);
        // Fetch notifications
        const notificationsResponse = await apiClient.get("/notifications");
        setNotifications(notificationsResponse.data);

        setUserData({}); // Placeholder
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const markAsRead = async (notificationId) => {
    try {
      await apiClient.put(`/notifications/${notificationId}/read`);
      // Update local state
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  if (loading) return <h1 className="text-center text-xl">Loading...</h1>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        {/* Upcoming Assignments Section*/}
        <div className="p-4 bg-white rounded-xl mt-6">
          <h2 className="text-4xl font-bold text-black mb-6 text-center">Upcoming Assignments</h2>
          <div className="grid gap-3">
            {assignments.map(assignment => (
              <div key={assignment.id} className="border p-3 rounded-lg w-3/4 mx-auto">
                <h3 className="font-bold">{assignment.title}</h3>
                <p className="text-gray-600">{assignment.description}</p>
                <p className="text-sm text-blue-600">Subject: {assignment.subject}</p>
                {assignment.fileUrl && (
                  <a 
                    href={assignment.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-green-600 underline block mt-2"
                  >
                    Download PDF
                  </a>
                )}
              </div>
            ))}
            
            {assignments.length === 0 && (
              <p className="w-3/4 mx-auto">No upcoming assignments. Enjoy your day! 😊</p>
            )}
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default Assignments;