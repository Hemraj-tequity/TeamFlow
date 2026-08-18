import { Request, Response } from "express";
import { PROJECT_MEMBER_MESSAGES } from "../utils/constants.js";
import { addProjectMember, getAllProjectMembers, deleteProjectMember } from "../services/organization-project-member.service.js";

export const createProjectMemberController = async (
  req: Request,
  res: Response
) => {
  const { projectId, userId } = req.body;

  const projectMember = await addProjectMember(projectId, userId);

  return res.status(201).json({
    success: true,
    message: PROJECT_MEMBER_MESSAGES.CREATE_SUCCESS,
    projectMember,
  });
};

export const getAllProjectMemberController = async (
  req: Request,
  res: Response
) => {
  const projectId = req.params.projectId as string;

  const projectMembers = await getAllProjectMembers(projectId);

  return res.status(200).json({
    success: true,
    message: PROJECT_MEMBER_MESSAGES.GETALL_SUCCESS,
    projectMembers,
  });
};

export const deleteProjectMemberController = async (
  req: Request,
  res: Response
) => {
  const { projectId, id } = req.body;

  await deleteProjectMember(projectId, id);

  return res.status(200).json({
    success: true,
    message: PROJECT_MEMBER_MESSAGES.DELETE_PROJECT_MEMBER_SUCCESS
  });
};