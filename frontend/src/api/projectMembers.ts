import { apiRequest, endpoints } from "./client";
import type { ProjectMember } from "./types";

interface GetAllProjectMembersResponse {
  success: true;
  message: string;
  projectMembers: ProjectMember[];
}

interface CreateProjectMemberResponse {
  success: true;
  message: string;
  projectMember: ProjectMember;
}

export const getAllProjectMembers = (projectId: string) =>
  apiRequest<GetAllProjectMembersResponse>(endpoints.getAllProjectMembers(projectId)).then(
    (res) => res.projectMembers
  );

export const addProjectMember = (projectId: string, userId: number) =>
  apiRequest<CreateProjectMemberResponse>(endpoints.addProjectMember, {
    method: "POST",
    body: { projectId, userId },
  }).then((res) => res.projectMember);

export const deleteProjectMember = (projectId: string, id: string) =>
  apiRequest<{ success: true; message: string }>(endpoints.deleteProjectMember, {
    method: "DELETE",
    body: { projectId, id },
  });
