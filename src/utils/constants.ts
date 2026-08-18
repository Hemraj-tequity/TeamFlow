export const API_BASE_PATH = "/api";

export const AUTH_BASE_PATH = "/auth";
export const AUTH_LOGIN_PATH = "/login";

export const endpoints = {
  createOrganization : "/organization",
  getAllOrganizations : "/organization/all",
  getOrganizationById : "/organization/:id",
  updateOrganization : "/organization/:id",
  

  createOrganizationMember : "/organization-member",
  getAllOrganizationMembers : "/organization-member/:id",
  deleteOrganizationMember : "/organization-member/:id",

  createProject : "/project",
  getAllProjects : "/project/:orgId/all",
  getProjectById : "/project/:id",
  deleteProject : "/project",

  addProjectMember : "/project/member",
  getAllProjectMember : "/project/member/:projectId/all",
  deleteProjectMember : "/project/member",
};

export const COMMON_MESSAGES = {
  INTERNAL_SERVER_ERROR: "Internal server error",
} as const;

export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: "Login successful",
  LOGIN_FAILED: "Login failed",
  MISSING_CREDENTIALS: "Email and password are required",
  INVALID_CREDENTIALS: "Invalid email or password",
  RATE_LIMIT: "Too many login attempts. Please try again later.",
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

export const ORG_MEMBER_MESSAGES = {
    MISSING_FIELDS: "userId and organizationId both are required",
    ALREADY_EXIST: "This user is already a member of this organization",
    CREATE_SUCCESS: "Organization member created successfully",
    GETALL_MEMBERS_SUCCESS: "Organization member fetched successfully",
    DELETE_MEMBERS_SUCCESS: "This member deleted successfully",
    MISSING_MEMBER_ID: "Organization Member ID is required",
    MEMBER_NOT_FOUND: "Member not found in this organization",
} as const;

export const PROJECT_MESSAGES = {
  MISSING_FIELDS: "All the fields are required",
  CREATE_SUCCESS: "Project created successfully",
  ALREADY_EXIST: "This project is already exist in this organization",
  GETALL_SUCCESS: "Project fetched successfully",
  DELETE_PROJECT_SUCCESS: "This project deleted successfully",
  MISSING_PORJECT_ID: "Organization ID and Project ID both are required",
  PROJECT_NOT_FOUND: "This project not found in this organization",
} as const;

export const PROJECT_MEMBER_MESSAGES = {
  MISSING_FIELDS: "All the fields are required",
  CREATE_SUCCESS: "Project member added successfully",
  ALREADY_EXIST: "This member is already exist in this project",
  GETALL_SUCCESS: "Fetched all project members successfully",
  NOT_FOUND: "Members is not found in this project",
  DELETE_PROJECT_MEMBER_SUCCESS: "Member deleted successfully",
} as const;
