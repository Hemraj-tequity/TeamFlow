import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { ApiError } from "./ApiError.js";
import { AUTH_MESSAGES } from "./constants.js";

const JWT_SECRET = process.env.JWT_SECRET!;

export const generateAccessToken = (userId: number) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 15,               // 1 requests
  legacyHeaders: false,    // force browser to user latest header

  handler: (req: any) => {
    const resetTime = req.rateLimit?.resetTime;

    const retryAfterSeconds = resetTime
      ? Math.ceil((resetTime.getTime() - Date.now()) / 1000)
      : 60;

    throw ApiError.rateLimit(
      AUTH_MESSAGES.RATE_LIMIT,
      {
        retryAfterSeconds,
        resetTime,
      }
    );
  },
});