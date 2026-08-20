import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

interface AccessTokenPayload {
  sub: string;
  tokenVersion: number;
  type: "access";
}

declare global {
namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw ApiError.unauthorized("Unauthorized");
  }

  try {
    req.user = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as AccessTokenPayload;

    next();
  } catch {
    throw ApiError.unauthorized("Unauthorized");
  }
};