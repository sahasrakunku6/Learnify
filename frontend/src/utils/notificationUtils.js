// utils/notificationUtils.js
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { COLLECTIONS } from "../constants/firestorePaths";

export const addAssignmentNotification = async (studentId, assignmentId, title) => {
  const db = getFirestore();
  await addDoc(collection(db, COLLECTIONS.USERS, studentId, "notifications"), {
    message: `New assignment: ${title}`,
    type: "assignment",
    assignmentId: assignmentId,
    read: false,
    createdAt: serverTimestamp()
  });
};