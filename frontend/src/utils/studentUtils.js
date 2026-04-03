// utils/studentUtils.js
import { getFirestore, collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { COLLECTIONS } from "../constants/firestorePaths";

export const getStudents = async () => {
  const db = getFirestore();
  const usersQuery = query(collection(db, COLLECTIONS.USERS), where("role", "==", "learner"));
  const snapshot = await getDocs(usersQuery);
  return snapshot.docs.map(doc => doc.id);
};

// You can add more student-related functions here
export const getStudentData = async (studentId) => {
  const db = getFirestore();
  const studentDoc = await getDoc(doc(db, COLLECTIONS.USERS, studentId));
  return studentDoc.exists() ? studentDoc.data() : null;
};