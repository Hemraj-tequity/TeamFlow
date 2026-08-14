import jwt from "jsonwebtoken";

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