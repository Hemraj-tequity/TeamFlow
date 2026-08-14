import { NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { ApiError } from "../utils/ApiError.js";

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};

const mapPrismaError = (err: Prisma.PrismaClientKnownRequestError): ApiError => {
  switch (err.code) {
    case "P2002": {
      const target = (err.meta?.target as string[] | undefined)?.join(", ");
      return ApiError.conflict(
        target ? `${target} already in use` : "Duplicate value violates a unique constraint"
      );
    }
    case "P2025":
      return ApiError.notFound("Record not found");
    default:
      return ApiError.badRequest("Invalid database request");
  }
};

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  let apiError: ApiError;

  if (err instanceof ApiError) {
    apiError = err;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    apiError = mapPrismaError(err);
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    apiError = ApiError.badRequest("Invalid data provided");
  } else if (err instanceof Error) {
    apiError = new ApiError(500, err.message || "Internal server error", undefined, false);
  } else {
    apiError = ApiError.internal();
  }

  if (!apiError.isOperational) {
    console.error(err);
  } 

  return res.status(apiError.statusCode).json({
    success: false,
    message: apiError.message,
    ...(apiError.details ? { errors: apiError.details } : {}),
  });
};
