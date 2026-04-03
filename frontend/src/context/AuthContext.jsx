import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { COLLECTIONS } from "../constants/firestorePaths";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          setCurrentUser(null);
          setUserData(null);
          setLoading(false);
          return;
        }

        setCurrentUser(user);

        const userRef = doc(db, COLLECTIONS.USERS, user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const rawData = userSnap.data();
          const role = rawData?.role || "";

          const normalizedUserData = {
            uid: rawData?.uid || user.uid,
            first_name: rawData?.first_name || "",
            last_name: rawData?.last_name || "",
            phone_no: rawData?.phone_no || "",
            role,
            createdAt: rawData?.createdAt || null,
            subject: role === "teacher" ? (rawData?.subject || "") : "",
            education_lvl: role === "learner" ? (rawData?.education_lvl || "") : "",
            dob: role === "learner" ? (rawData?.dob || null) : null,
          };

          setUserData(normalizedUserData);
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error("Auth context error:", error.message);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);