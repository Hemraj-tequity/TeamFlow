import { apiRequest, endpoints } from "./client";
import type { Organization, OrganizationStatus } from "./types";

interface GetAllOrganizationsResponse {
  success: true;
  message: string;
  organization: Organization[];
}

interface CreateOrganizationResponse {
  success: true;
  message: string;
  organization: Organization;
}

export const getAllOrganizations = () =>
  apiRequest<GetAllOrganizationsResponse>(endpoints.getAllOrganizations).then((res) => res.organization);

export const createOrganization = (name: string, slug: string, status: OrganizationStatus) =>
  apiRequest<CreateOrganizationResponse>(endpoints.createOrganization, {
    method: "POST",
    body: { name, slug, status },
  }).then((res) => res.organization);

export const updateOrganization = (
  id: string,
  name: string,
  slug: string,
  status: OrganizationStatus
) =>
  apiRequest<CreateOrganizationResponse>(endpoints.updateOrganization(id), {
    method: "PATCH",
    body: { name, slug, status },
  }).then((res) => res.organization);

export const deleteOrganization = (id: string) =>
  apiRequest<{ success: true; message: string }>(endpoints.deleteOrganization(id), {
    method: "DELETE",
  });
