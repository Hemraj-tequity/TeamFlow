import { Request, Response } from "express";
import { PROJECT_MESSAGES } from "../utils/constants.js";
import { createProject, getAllProjects, deleteProject, getProjectById } from "../services/organization-project.service.js";

export const createProjectController = async (
  req: Request,
  res: Response
) => {
  const { organizationId, name, description } = req.body;

  const project = await createProject(organizationId, name, description);

  return res.status(201).json({
    success: true,
    message: PROJECT_MESSAGES.CREATE_SUCCESS,
    project,
  });
};

export const getAllProjectsController = async (
  req: Request,
  res: Response
) => {
  const orgId = req.params.orgId as string;

  const projects = await getAllProjects(orgId);

  return res.status(200).json({
    success: true,
    message: PROJECT_MESSAGES.GETALL_SUCCESS,
    projects,
  });
};

export const getProjectByIdController = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id as string;

  const projects = await getProjectById(id);

  return res.status(200).json({
    success: true,
    message: PROJECT_MESSAGES.GETALL_SUCCESS,
    projects,
  });
};

export const deleteProjectController = async (
  req: Request,
  res: Response
) => {
  const { organizationId, projectId } = req.body;

  await deleteProject(organizationId, projectId);

  return res.status(200).json({
    success: true,
    message: PROJECT_MESSAGES.DELETE_PROJECT_SUCCESS
  });
};