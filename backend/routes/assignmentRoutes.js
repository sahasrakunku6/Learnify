import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getAssignments } from "../controllers/assignmentController.js";

const router = express.Router();

router.get("/assignments", verifyToken, getAssignments);

export default router;