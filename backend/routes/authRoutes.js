import express from "express";
import { signup, teacherOnly } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.get("/teacher-only", verifyToken, allowRoles("teacher"), teacherOnly);

export default router;