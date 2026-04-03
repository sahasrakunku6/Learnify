import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import "./config/env.js";

import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(helmet());
app.use(express.json({ limit: "10kb" }));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

app.use("/", healthRoutes);
app.use("/", authRoutes);
app.use("/", aiRoutes);
app.use("/", contentRoutes);
app.use("/", bookRoutes);
app.use("/", assignmentRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

export default app;