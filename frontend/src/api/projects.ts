import { apiRequest, endpoints } from "./client";
import type { Project } from "./types";

interface GetAllProjectsResponse {
  success: true;
  message: string;
  projects: Project[];
}

interface CreateProjectResponse {
  success: true;
  message: string;
  project: Project;
}

export const getAllProjects = (organizationId: string) =>
  apiRequest<GetAllProjectsResponse>(endpoints.getAllProjects(organizationId)).then((res) => res.projects);

export const createProject = (organizationId: string, name: string, description: string) =>
  apiRequest<CreateProjectResponse>(endpoints.createProject, {
    method: "POST",
    body: { organizationId, name, description },
  }).then((res) => res.project);

export const deleteProject = (organizationId: string, projectId: string) =>
  apiRequest<{ success: true; message: string }>(endpoints.deleteProject, {
    method: "DELETE",
    body: { organizationId, projectId },
  });
