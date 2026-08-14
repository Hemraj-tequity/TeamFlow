export const API_BASE_PATH = "/api";

export const AUTH_BASE_PATH = "/auth";
export const AUTH_LOGIN_PATH = "/login";

export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: "Login successful",
  LOGIN_FAILED: "Login failed",
  MISSING_CREDENTIALS: "Email and password are required",
  INVALID_CREDENTIALS: "Invalid email or password",
  RATE_LIMIT: "Too many login attempts. Please try again later.",
} as const;
