export type UserRole = "ADMIN" | "MANAGER" | "USER";
export type OrganizationStatus = "ACTIVE" | "INACTIVE";
export type ProjectStatus = "ACTIVE" | "ARCHIVED";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "COMPLETED" | "CANCELLED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  accessToken: string;
  refreshToken: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  status: OrganizationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  assigneeId: number | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface OrganizationMember {
  id: string;
  userId: number;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  id: string;
  userId: number;
  projectId: string;
  createdAt: string;
}

export interface ApiFailure {
  success: false;
  message: string;
  errors?: unknown;
}
