import jwt from "jsonwebtoken";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { ApiError } from "./ApiError.js";
import { AUTH_MESSAGES } from "./constants.js";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET!;
const OTP_SECRET = process.env.OTP_SECRET!;

export const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
}

export const hashOtp = (email: string, otp: string) => {
  return crypto
    .createHmac("sha256", OTP_SECRET)
    .update(`${email}:${otp}`)
    .digest("hex");
}

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
  limit: 5,               // 1 requests
  legacyHeaders: false,    // force browser to user latest header

  keyGenerator: (req: any) => {
    return `${ipKeyGenerator(req.ip)}:${req.body?.email}`;
  },

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