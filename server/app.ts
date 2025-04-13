import express from "express";
import cookieParser from "cookie-parser";
import Cors from "cors";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { ErrorMiddleWare } from "./utils/middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import layoutRouter from "./routes/layout.route";
import analyticsRouter from "./routes/analytics.route";
import { rateLimit } from "express-rate-limit";
import path from "path";
import connectdb from "./utils/db";
import { v2 as cloudinary } from "cloudinary";
import http from "http";
import { initSocketServer } from "./socketServer";

// Initialize Express app
const app = express();

// Configure environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

// Middleware setup
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
  Cors({
    origin: [
      "http://localhost:3000",      
    ],
    credentials: true,
  })
);

// API rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes in mili-sec
  max: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
app.use(limiter);

// Serve static files from the build folder in production
const buildPath = path.join(__dirname, "../client/next");
app.use(express.static(buildPath));

// API Routes
app.use("/api/v1", userRouter);
app.use("/api/v1", courseRouter);
app.use("/api/v1", orderRouter);
app.use("/api/v1", notificationRouter);
app.use("/api/v1", analyticsRouter);
app.use("/api/v1", layoutRouter);

// Test route
app.get("/test", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

// 404 handler
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// Global Error Handler Middleware
app.use(ErrorMiddleWare);

// For local development only - this code will not run on Vercel
if (process.env.NODE_ENV !== 'production') {
  const server = http.createServer(app);
  initSocketServer(server);
  
  server.listen(process.env.PORT || 8000, () => {
    console.log(`Server is connected with ${process.env.PORT || 8000}`);
    connectdb();
  });
} else {
  // For production, just connect to the database
  connectdb();
}

// Export for Vercel serverless functions
export default app;