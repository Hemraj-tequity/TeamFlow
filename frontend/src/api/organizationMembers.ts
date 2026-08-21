import { apiRequest, endpoints } from "./client";
import { encryptValue, decryptValue } from "../utils/crypto";
import type { OrganizationMember } from "./types";

interface GetAllOrganizationMembersResponse {
  success: true;
  message: string;
  organizationMembers: string;
}

interface CreateOrganizationMemberResponse {
  success: true;
  message: string;
  organizationMember: OrganizationMember;
}

export const getAllOrganizationMembers = (organizationId: string) =>
  apiRequest<GetAllOrganizationMembersResponse>(endpoints.getAllOrganizationMembers(organizationId)).then((res) =>
    decryptValue<OrganizationMember[]>(res.organizationMembers)
  );

export const createOrganizationMember = async (userId: number, organizationId: string) => {
  const [encryptedUserId, encryptedOrganizationId] = await Promise.all([
    encryptValue(userId),
    encryptValue(organizationId),
  ]);

  return apiRequest<CreateOrganizationMemberResponse>(endpoints.createOrganizationMember, {
    method: "POST",
    body: { userId: encryptedUserId, organizationId: encryptedOrganizationId },
  }).then((res) => res.organizationMember);
};

export const deleteOrganizationMember = (memberId: string) =>
  apiRequest<{ success: true; message: string }>(endpoints.deleteOrganizationMember(memberId), {
    method: "DELETE",
  });
