import type { ApiFailure } from "./types";

const API_BASE_PATH = "/api";

export const endpoints = {
  login: "/auth/login",

  createOrganization: "/organization",
  getAllOrganizations: "/organization/all",

  createProject: "/project",
  getAllProjects: (orgId: string) => `/project/${orgId}/all`,
  deleteProject: "/project",

  createOrganizationMember: "/organization-member",
  getAllOrganizationMembers: (orgId: string) => `/organization-member/${orgId}`,
  deleteOrganizationMember: (memberId: string) => `/organization-member/${memberId}`,

  addProjectMember: "/project/member",
  getAllProjectMembers: (projectId: string) => `/project/member/${projectId}/all`,
  deleteProjectMember: "/project/member",
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

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = getAccessToken();

  let response: Response;
  try {
    response = await fetch(`${API_BASE_PATH}${path}`, {
      method: options.method ?? "GET",
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
