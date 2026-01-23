import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import ErrorHandler from "../ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { safeRedis } from "../redis";
import { updateAccessToken } from "../../controllers/user.controller";
import userModel from "../../models/user.model";

export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    let access_token = req.cookies.access_token as string;
    
    // Fallback to Authorization header if cookie is not present
    if (!access_token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        access_token = authHeader.substring(7);
      }
    }

    // Debug logging for production
    if (process.env.NODE_ENV === "production") {
      console.log("🔍 Auth Debug - Has access_token:", !!access_token);
      console.log("🔍 Auth Debug - Cookies:", Object.keys(req.cookies));
      console.log("🔍 Auth Debug - Has Authorization header:", !!req.headers.authorization);
    }

    if (!access_token) {
      return next(
        new ErrorHandler("Please login to access this resource", 400)
      );
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN || "") as JwtPayload;
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        try {
          await updateAccessToken(req, res, next);
          return;
        } catch (refreshError) {
          return next(new ErrorHandler("Session expired. Please login again.", 401));
        }
      }
      return next(new ErrorHandler("Invalid access token. Please login again.", 401));
    }

    if (!decoded || !decoded.id) {
      return next(new ErrorHandler("Invalid token format", 400));
    }

    // Token is valid, proceed to get user data
    let user;
    try {
      // Try to get user from Redis first
      user = await safeRedis.get(decoded.id);
      
      // If Redis is unavailable or user not in cache, get from database
      if (!user) {
        const dbUser = await userModel.findById(decoded.id);
        
        if (!dbUser) {
          return next(
            new ErrorHandler("User not found. Please login again.", 401)
          );
        }
        
        // Store in Redis for next time (if Redis is available)
        await safeRedis.set(decoded.id, JSON.stringify(dbUser), "EX", "604800").catch(() => {
          console.log("Could not cache user in Redis");
        });
        
        user = JSON.stringify(dbUser);
      }
    } catch (error: any) {
      // Fallback to database on any error
      try {
        const dbUser = await userModel.findById(decoded.id);
        if (!dbUser) {
          return next(new ErrorHandler("User not found. Please login again.", 401));
        }
        user = JSON.stringify(dbUser);
      } catch (dbError: any) {
        return next(new ErrorHandler("Authentication failed. Please login again.", 401));
      }
    }

    req.user = JSON.parse(user);
    next();
  }
);

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
