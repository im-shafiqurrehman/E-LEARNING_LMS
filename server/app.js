import express from "express";
export const app = express();

import cookieParser from "cookie-parser";
import Cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { ErrorMiddleWare } from "./utils/middleware/error.js";

import userRouter from "./routes/user.route.js";
import courseRouter from "./routes/course.route.js";
import orderRouter from "./routes/order.route.js";
import notificationRouter from "./routes/notification.route.js";
import layoutRouter from "./routes/layout.route.js";
import analyticsRouter from "./routes/analytics.route.js";

import { rateLimit } from "express-rate-limit";

import path from "path";
import { fileURLToPath } from "url";

// Use this for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

app.use(
  Cors({
    origin: [
      "http://localhost:3000",
      "https://e-learning-lms-frontend-theta.vercel.app",
    ],
    credentials: true,
  })
);

const clientBuildPath = path.join(__dirname, "../client/.next");

// ✅ API rate limiting (before routes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes in milli-sec
  max: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
app.use(limiter);

// ✅ Serve static files from the build folder in production
const buildPath = path.join(__dirname, "../client/next");
app.use(express.static(buildPath));

app.use("/api/v1", userRouter);
app.use("/api/v1", courseRouter);
app.use("/api/v1", orderRouter);
app.use("/api/v1", notificationRouter);
app.use("/api/v1", analyticsRouter);
app.use("/api/v1", layoutRouter);

app.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

app.all("*", (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});

// ✅ Global Error Handler Middleware
app.use(ErrorMiddleWare);

// Export for Vercel or server.js
export default app;
