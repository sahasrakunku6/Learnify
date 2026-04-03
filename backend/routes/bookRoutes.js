import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { searchBooks } from "../controllers/bookController.js";

const router = express.Router();

router.get("/books/search", verifyToken, searchBooks);

export default router;