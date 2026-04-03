import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { searchNews, searchYoutube } from "../controllers/contentController.js";

const router = express.Router();

router.get("/search", verifyToken, searchNews);
router.get("/api/youtube/search", verifyToken, searchYoutube);

export default router;