import { apiRequest, endpoints } from "./client";
import type { OrganizationMember } from "./types";

interface GetAllOrganizationMembersResponse {
  success: true;
  message: string;
  organizationMembers: OrganizationMember[];
}

interface CreateOrganizationMemberResponse {
  success: true;
  message: string;
  organizationMember: OrganizationMember;
}

export const getAllOrganizationMembers = (organizationId: string) =>
  apiRequest<GetAllOrganizationMembersResponse>(endpoints.getAllOrganizationMembers(organizationId)).then(
    (res) => res.organizationMembers
  );

export const createOrganizationMember = (userId: number, organizationId: string) =>
  apiRequest<CreateOrganizationMemberResponse>(endpoints.createOrganizationMember, {
    method: "POST",
    body: { userId, organizationId },
  }).then((res) => res.organizationMember);

export const deleteOrganizationMember = (memberId: string) =>
  apiRequest<{ success: true; message: string }>(endpoints.deleteOrganizationMember(memberId), {
    method: "DELETE",
  });
