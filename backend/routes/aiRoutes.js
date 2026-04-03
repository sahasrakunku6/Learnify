import express from "express";
import rateLimit from "express-rate-limit";
import { verifyToken } from "../middleware/authMiddleware.js";
import { generateQuiz, motivateUser, chatbotReply} from "../controllers/aiController.js";

const router = express.Router();

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many AI requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/generate-quiz", verifyToken, aiLimiter, generateQuiz);
router.post("/motivate", verifyToken, aiLimiter, motivateUser);
router.post("/chatbot", verifyToken, aiLimiter, chatbotReply);

export default router;