import { Request, Response } from "express";
import { ORG_MEMBER_MESSAGES } from "../utils/constants.js";
import { createOrganizationMember, deleteOrganizationMember, getAllOrganizationMember } from "../services/organization-member.service.js";

export const createOrganizationMemberController = async (
  req: Request,
  res: Response
) => {
  const { userId, organizationId } = req.body;

  const organizationMember = await createOrganizationMember(userId, organizationId);

  return res.status(201).json({
    success: true,
    message: ORG_MEMBER_MESSAGES.CREATE_SUCCESS,
    organizationMember,
  });
};

export const getAllOrganizationMemberController = async (
  req: Request,
  res: Response
) => {
  const orgId = req.params.id as string;

  const organizationMembers = await getAllOrganizationMember(orgId);

  return res.status(200).json({
    success: true,
    message: ORG_MEMBER_MESSAGES.GETALL_MEMBERS_SUCCESS,
    organizationMembers,
  });
};

export const deleteOrganizationMemberController = async (
  req: Request,
  res: Response
) => {
  const orgMemberId = req.params.id as string;

  const organization = await deleteOrganizationMember(orgMemberId);

  return res.status(200).json({
    success: true,
    message: ORG_MEMBER_MESSAGES.DELETE_MEMBERS_SUCCESS,
    organization,
  });
};