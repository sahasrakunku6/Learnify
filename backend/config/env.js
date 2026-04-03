import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
  "GEMINI_API_KEY",
  "GNEWS_API_KEY",
  "YOUTUBE_API_KEY",
  "FRONTEND_URL",
];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}