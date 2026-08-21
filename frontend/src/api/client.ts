import type { ApiFailure } from "./types";

const API_BASE_PATH = "http://localhost:3000/api";

export const endpoints = {
  sendOtp: "/auth/send-otp",
  verifyOtp: "/auth/verify-otp",
  refresh: "/auth/refresh",

  getAllUsers: "/users",

  createOrganization: "/organization",
  getAllOrganizations: "/organization/all",
  updateOrganization: (id: string) => `/organization/${id}`,
  deleteOrganization: (id: string) => `/organization/${id}`,

  createProject: "/project",
  getAllProjects: (orgId: string) => `/project/${orgId}/all`,
  deleteProject: "/project",

  createTask: "/task",
  getAllTasks: (projectId: string) => `/task/${projectId}/all`,
  updateTask: (taskId: string) => `/task/${taskId}`,
  deleteTask: "/task",

  createOrganizationMember: "/organization-member",
  getAllOrganizationMembers: (orgId: string) => `/organization-member/${orgId}`,
  deleteOrganizationMember: (memberId: string) => `/organization-member/${memberId}`,

  addProjectMember: "/project/member",
  getAllProjectMembers: (projectId: string) => `/project/member/${projectId}/all`,
  deleteProjectMember: "/project/member",

  createComment: "/comment",
  getAllComments: (taskId: string) => `/comment/${taskId}/all`,
  updateComment: (id: string) => `/comment/${id}`,
  deleteComment: "/comment",
};

export class ApiRequestError extends Error {
  status: number;
  errors?: unknown;

  constructor(status: number, message: string, errors?: unknown) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.errors = errors;
  }
}

const ACCESS_TOKEN_KEY = "admin_panel_access_token";

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const setAccessToken = (token: string) => localStorage.setItem(ACCESS_TOKEN_KEY, token);
export const clearAccessToken = () => localStorage.removeItem(ACCESS_TOKEN_KEY);

// Called when a token refresh attempt itself fails (refresh token missing/expired) —
// AuthContext wires this to logout() so the app falls back to the login screen.
let sessionExpiredHandler: (() => void) | null = null;
export const setSessionExpiredHandler = (handler: () => void) => {
  sessionExpiredHandler = handler;
};

// Auth endpoints never get the 401 -> refresh -> retry treatment: send-otp/verify-otp
// don't carry a token yet, and a 401 from refresh itself means the refresh token is dead.
const NO_REFRESH_RETRY_PATHS: string[] = [endpoints.sendOtp, endpoints.verifyOtp, endpoints.refresh];

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
}

interface RefreshResponse {
  success: true;
  message: string;
  accessToken: string;
}

let refreshPromise: Promise<string> | null = null;

function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = rawRequest<RefreshResponse>(endpoints.refresh, { method: "POST" })
      .then((res) => {
        setAccessToken(res.accessToken);
        return res.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function rawRequest<T>(path: string, options: RequestOptions, tokenOverride?: string): Promise<T> {
  const token = tokenOverride !== undefined ? tokenOverride : getAccessToken();

  let response: Response;
  try {
    response = await fetch(`${API_BASE_PATH}${path}`, {
      method: options.method ?? "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiRequestError(0, "Unable to reach the server. Please check your connection.");
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const failure = data as ApiFailure | null;
    throw new ApiRequestError(
      response.status,
      failure?.message || `Request failed with status ${response.status}`,
      failure?.errors
    );
  }

  return data as T;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  try {
    return await rawRequest<T>(path, options);
  } catch (err) {
    const canRetryAfterRefresh = err instanceof ApiRequestError && err.status === 401 && !NO_REFRESH_RETRY_PATHS.includes(path);

    if (!canRetryAfterRefresh) {
      throw err;
    }

    try {
      const newToken = await refreshAccessToken();
      return await rawRequest<T>(path, options, newToken);
    } catch {
      clearAccessToken();
      sessionExpiredHandler?.();
      throw err;
    }
  }
}
