import { useEffect, useState } from "react";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  onSnapshot,
  updateDoc
} from "firebase/firestore";
import { COLLECTIONS } from "../constants/firestorePaths";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Sidebar from "../components/Sidebar";
import Chatbot from "../components/Chatbot";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();

  const role = userData?.role || "";
  const subject = role === "teacher" ? (userData?.subject || "") : "";
  const educationLevel = role === "learner" ? (userData?.education_lvl || "") : "";

  useEffect(() => {
    const fetchData = async (uid) => {
      if (!uid) return;

      const userDocRef = doc(db, COLLECTIONS.USERS, uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }

      //notifications
      const notificationsQuery = query(
        collection(db, COLLECTIONS.USERS, uid, "notifications"),
        where("read", "==", false)
      );
      
      const unsubscribeNotifications = onSnapshot(notificationsQuery, (snapshot) => {
        const notificationsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setNotifications(notificationsData);
      });

      setLoading(false);
      return () => {
        unsubscribeNotifications();
      };
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData(user.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [db, auth]);

  const markAsRead = async (notificationId) => {
    try {
      if (!auth.currentUser) return;
      
      await updateDoc(doc(db, COLLECTIONS.USERS, auth.currentUser.uid, "notifications", notificationId), {
        read: true
      });

      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      
    } catch (error) {
      console.error("Error marking notification as read:", error);
      alert("Failed to mark notification as read. Please try again.");
    }
  };

  const markAllAsRead = async () => {
    try {
      if (!auth.currentUser || notifications.length === 0) return;
      
      const batchPromises = notifications.map(notification =>
        updateDoc(doc(db, COLLECTIONS.USERS, auth.currentUser.uid, "notifications", notification.id), {
          read: true
        })
      );
      
      await Promise.all(batchPromises);
      setNotifications([]);
      
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  if (loading) return <h1 className="text-center text-xl">Loading...</h1>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        {/* Notifications Bell */}
        <div className="fixed top-4 right-4 z-50">
          <div className="relative">
            <button className="bg-black text-white p-3 rounded-full hover:bg-gray-600 transition-colors">
              🔔 {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
            
            {/* Notifications Dropdown */}
            {notifications.length > 0 && (
              <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-3 border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg">Notifications ({notifications.length})</h3>
                  <button 
                    onClick={markAllAsRead}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.map(notification => (
                    <div key={notification.id} className="border-b border-gray-100 pb-3 mb-3 last:border-b-0 last:mb-0">
                      <p className="text-gray-800 mb-2">{notification.message}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {notification.createdAt?.toDate?.().toLocaleDateString() || 'New'}
                        </span>
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="text-blue-600 text-sm hover:underline px-2 py-1 rounded hover:bg-blue-50"
                        >
                          Mark as read
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="bg-pink-100 ml-10 p-8 min-h-70 rounded-2xl flex items-center gap-6 shadow-md">
          <img 
            src="https://cdn.vectorstock.com/i/500p/07/06/cute-little-girl-playing-laptop-cartoon-vector-54570706.avif" 
            alt="User" 
            className="w-30 h-30 rounded-full" 
          />
          <div>
            <h1 className="text-6xl font-bold text-pink-700">
              Welcome back, {userData?.first_name || "User"}!
            </h1>
            <p className="text-gray-600 mt-3 text-lg">
              You've learned <strong>{userData?.progress || "0%"}</strong> of your goal this week!  
              Keep it up and improve your results! 🚀
            </p>
          </div>
        </div>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">

          <div className="p-4 bg-white shadow-md rounded-xl min-h-[200px] flex flex-col ml-10">
            <h2 className="text-xl font-bold">🏆 Earned Badges</h2>
            <div className="flex gap-4 mt-3">
              {userData?.badges?.length > 0 ? (
                userData.badges.map((badge, index) => (
                  <div key={index} className="bg-yellow-200 p-2 rounded-md text-center text-sm">
                    {badge}
                  </div>
                ))
              ) : (
                <p>No badges earned yet.</p>
              )}
            </div>
          </div>

          <div className="p-4 bg-white shadow-md rounded-xl">
            <h2 className="text-xl font-bold">🎥 Completed Videos</h2>
            <p className="mt-2">{userData?.completedVideos || 0} lessons completed</p>
          </div>

          <div className="p-4 bg-white shadow-md rounded-xl">
            <h2 className="text-xl font-bold">📚 Continue Learning</h2>
            <p className="mt-2">Next Lesson: {userData?.nextLesson || "No upcoming lesson"}</p>
            <button className="mt-2 bg-black text-white px-4 py-2 rounded-lg">Continue</button>
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default Profile;