import { GoogleGenerativeAI } from "@google/generative-ai";
import admin from "firebase-admin";
import { isNonEmptyString, isValidDifficulty } from "../utils/validators.js";

const db = admin.firestore();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
const handleAiError = (error, res, next) => {
  const msg = error?.message || "";

  if (
    msg.includes("429") ||
    msg.includes("quota") ||
    msg.includes("Too Many Requests")
  ) {
    return res.status(503).json({
      error: "AI service quota is exhausted or temporarily busy. Please try again later.",
    });
  }

  return next(error);
};

export const generateQuiz = async (req, res, next) => {
  try {
    const { topic, difficulty } = req.body;
    const effectiveDifficulty = difficulty || "medium";

    if (!isNonEmptyString(topic)) {
      return res.status(400).json({ error: "Topic is required." });
    }

    if (difficulty && !isValidDifficulty(difficulty)) {
      return res.status(400).json({
        error: "Difficulty must be easy, medium, or hard.",
      });
    }

    const prompt = `
Generate 5 quiz questions on the topic "${topic}" at "${effectiveDifficulty}" level.

Return ONLY valid JSON.
Do not include markdown, code fences, headings, or explanations.

Use exactly this format:
[
  {
    "question": "string",
    "options": ["string", "string", "string", "string"],
    "answer": "string"
  }
]
`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();

    responseText = responseText.replace(/```json|```/g, "").trim();

    let quizQuestions;
    try {
      quizQuestions = JSON.parse(responseText);
    } catch (parseError) {
      return res.status(500).json({ error: "Invalid quiz format from AI" });
    }

    if (!Array.isArray(quizQuestions) || quizQuestions.length === 0) {
      return res.status(500).json({ error: "Quiz generation failed." });
    }

    for (const q of quizQuestions) {
      if (
        !q ||
        !isNonEmptyString(q.question) ||
        !Array.isArray(q.options) ||
        q.options.length !== 4 ||
        !q.options.every((opt) => isNonEmptyString(opt)) ||
        !isNonEmptyString(q.answer)
      ) {
        return res.status(500).json({ error: "Invalid quiz format from AI" });
      }
    }

    return res.json({ questions: quizQuestions });
  } catch (error) {
    return handleAiError(error, res, next);
  }
};

export const motivateUser = async (req, res, next) => {
  try {
    const { mood } = req.body;

    if (!isNonEmptyString(mood)) {
      return res.status(400).json({ error: "Mood is required." });
    }

    const prompt = `
Persona: Act as an empathetic and highly supportive mentor.
Your tone should be warm, gentle, and non-judgmental.
Avoid harsh or overly clinical language.

Context:
The user is a student feeling overwhelmed.
The student's message is: "${mood}"

Task:
1. Acknowledge their feelings briefly.
2. Offer reassurance in 1-2 sentences.
3. Give one simple action they can do in under 60 seconds for immediate relief.

Constraint:
Keep the entire response under 100 words.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    return res.json({ message: responseText });
  } catch (error) {
    return handleAiError(error, res, next);
  }
};

export const chatbotReply = async (req, res, next) => {
  try {
    const { userMessage } = req.body;

    if (!isNonEmptyString(userMessage)) {
      return res.status(400).json({ error: "Message cannot be empty!" });
    }

    const result = await model.generateContent(userMessage);
    const responseText = result.response.text().trim();

    return res.json({ response: responseText });
  } catch (error) {
    return handleAiError(error, res, next);
  }
};