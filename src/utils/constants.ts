export const ALGORITHM = "aes-256-gcm";


export const API_BASE_PATH = "/api";

export const AUTH_BASE_PATH = "/auth";
export const AUTH_SEND_OTP_PATH = "/send-otp";
export const AUTH_VERIFY_OTP_PATH = "/verify-otp";
export const AUTH_REFRESH_TOKEN_PATH = "/refresh";

export const endpoints = {
  getAllUsers: "/users",

  createOrganization : "/organization",
  getAllOrganizations : "/organization/all",
  getOrganizationById : "/organization/:id",
  updateOrganization : "/organization/:id",
  deleteOrganization : "/organization/:id",

  createOrganizationMember : "/organization-member",
  getAllOrganizationMembers : "/organization-member/:id",
  deleteOrganizationMember : "/organization-member/:id",

  createProject : "/project",
  getAllProjects : "/project/:orgId/all",
  getProjectById : "/project/:id",
  deleteProject : "/project",

  createTask : "/task",
  getAllTasks : "/task/:projectId/all",
  getTaskById : "/task/:id",
  updateTask : "/task/:id",
  deleteTask : "/task",

  addProjectMember : "/project/member",
  getAllProjectMember : "/project/member/:projectId/all",
  deleteProjectMember : "/project/member",

  createComment : "/comment",
  getAllComments : "/comment/:taskId/all",
  getCommentById : "/comment/:id",
  updateComment : "/comment/:id",
  deleteComment : "/comment",
};

export const COMMON_MESSAGES = {
  INTERNAL_SERVER_ERROR: "Internal server error",
} as const;

export const USERS_MESSAGES = {
  GETALL_USERS: "Users fetched successfully",
  USER_NOT_FOUND: "User not found"
} as const;

export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: "OTP sended successfully",
  LOGIN_FAILED: "Login failed",
  MISSING_CREDENTIALS: "Email and password are required",
  INVALID_CREDENTIALS: "Invalid email or password",
  RATE_LIMIT: "Too many login attempts. Please try again later.",
  REGISTER_SUCCESS: "User registered successfully",
  MISSING_REGISTER_FIELDS: "Email, password, name, and role are required",
  USER_ALREADY_EXISTS: "User already exists",
  EMAIL_AND_OTP_REQUIRED: "Email and OTP is required",
  EMAIL_OTP_NOT_FOUND: "Email and OTP not found",
  INVALID_OTP: "Invalid OTP",
  OTP_EXPIRED: "OTP expired",
  TOO_MANY_WRONG_ATTEMPT: "Too many wrong attempts",
  REFRESH_TOKEN_REQUIRED: "Refresh token is required",
  INVALID_REFRESH_TOKEN: "Invalid refresh token please login again",
  REFRESH_TOKEN_SUCCESS: "Token regenerated successfully.",
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
    DELETE_SUCCESS: "Organization Deleted successfully",
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

export const TASK_MESSAGES = {
  MISSING_FIELDS: "All the fields are required",
  CREATE_SUCCESS: "Task created successfully",
  ALREADY_EXIST: "This task already exist in this project",
  GETALL_SUCCESS: "Task fetched successfully",
  UPDATE_SUCCESS: "Task updated successfully",
  DELETE_TASK_SUCCESS: "This task deleted successfully",
  MISSING_TASK_ID: "Project ID and Task ID both are required",
  TASK_NOT_FOUND: "This task not found in this project",
  PROJECT_NOT_FOUND: "This project not found",
} as const;

export const PROJECT_MEMBER_MESSAGES = {
  MISSING_FIELDS: "All the fields are required",
  CREATE_SUCCESS: "Project member added successfully",
  ALREADY_EXIST: "This member is already exist in this project",
  GETALL_SUCCESS: "Fetched all project members successfully",
  NOT_FOUND: "Members is not found in this project",
  DELETE_PROJECT_MEMBER_SUCCESS: "Member deleted successfully",
} as const;

export const COMMENT_MESSAGES = {
  MISSING_FIELDS: "Task ID, User ID and content are required",
  MISSING_COMMENT_ID: "Task ID and Comment ID both are required",
  MISSING_CONTENT: "Content is required",
  CREATE_SUCCESS: "Comment added successfully",
  GETALL_SUCCESS: "Comments fetched successfully",
  GET_SUCCESS: "Comment fetched successfully",
  UPDATE_SUCCESS: "Comment updated successfully",
  DELETE_SUCCESS: "Comment deleted successfully",
  TASK_NOT_FOUND: "This task not found",
  USER_NOT_FOUND: "This user not found",
  COMMENT_NOT_FOUND: "This comment not found",
} as const;
