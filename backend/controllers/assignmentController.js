import { db } from "../config/firebaseAdmin.js";

export const getAssignments = async (req, res, next) => {
  try {
    const snapshot = await db
      .collection("assignments")
      .where("status", "==", "active")
      .get();

    const assignments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.json(assignments);
  } catch (error) {
    return next(error);
  }
};