import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getUserNotifications,
  markNotificationAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/notifications", verifyToken, getUserNotifications);
router.patch("/notifications/:id/read", verifyToken, markNotificationAsRead);

export default router;