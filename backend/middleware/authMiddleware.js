import { admin, db } from "../config/firebaseAdmin.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: token missing" });
    }

    const idToken = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const userDoc = await db.collection("Users").doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User record not found" });
    }

    const userData = userDoc.data();

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: userData.role,
    };

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ error: "Unauthorized: invalid token" });
  }
};