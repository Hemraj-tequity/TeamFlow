export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    statusCode: number,
    message: string,
    details?: unknown,
    isOperational = true
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    Object.setPrototypeOf(this, ApiError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details?: unknown) {
    return new ApiError(400, message, details);
  }

  static unauthorized(message = "Unauthorized", details?: unknown) {
    return new ApiError(401, message, details);
  }

  static forbidden(message = "Forbidden", details?: unknown) {
    return new ApiError(403, message, details);
  }

  static notFound(message = "Not found", details?: unknown) {
    return new ApiError(404, message, details);
  }

  static conflict(message: string, details?: unknown) {
    return new ApiError(409, message, details);
  }

  static rateLimit(message: string, details?: unknown) {
    return new ApiError(429, message, details);
  }

  static internal(message = "Internal server error", details?: unknown) {
    return new ApiError(500, message, details, false);
  }
}
