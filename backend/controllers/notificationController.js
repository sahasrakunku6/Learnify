import { db } from "../config/firebaseAdmin.js";

export const getUserNotifications = async (req, res, next) => {
  try {
    const uid = req.user.uid;

    const snapshot = await db
      .collection("Users")
      .doc(uid)
      .collection("notifications")
      .where("read", "==", false)
      .get();

    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.json(notifications);
  } catch (error) {
    return next(error);
  }
};

export const markNotificationAsRead = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const notificationId = req.params.id;

    await db
      .collection("Users")
      .doc(uid)
      .collection("notifications")
      .doc(notificationId)
      .update({ read: true });

    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};