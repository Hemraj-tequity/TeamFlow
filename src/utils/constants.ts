export const API_BASE_PATH = "/api";

export const AUTH_BASE_PATH = "/auth";
export const AUTH_LOGIN_PATH = "/login";

export const endpoints = {
  createOrganization : "/organization",
  getAllOrganizations : "/organization/all",
  getOrganizationById : "/organization/:id",
  updateOrganization : "/organization/:id"
};

export const COMMON_MESSAGES = {
  INTERNAL_SERVER_ERROR: "Internal server error",
} as const;

export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: "Login successful",
  LOGIN_FAILED: "Login failed",
  MISSING_CREDENTIALS: "Email and password are required",
  INVALID_CREDENTIALS: "Invalid email or password",
} as const;

export const ORG_MESSAGES = {
    MISSING_FIELDS: "All the fields are required",
    ALREADY_EXIST: "Organization already exist",
    CREATE_SUCCESS: "Organization created successfully",
    CREATE_FAILED: "Organization creation failed",
    GETALL_SUCCESS: "Organization fetched successfully",
    MISSING_ORG_ID: "Organization ID is required",
    NOT_FOUND: "Organization not found",
    UPDATE_SUCCESS: "Organization Updated successfully",
} as const;
