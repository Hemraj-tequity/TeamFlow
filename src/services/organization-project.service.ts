import { prisma } from "../lib/prisma.js";
import { COMMON_MESSAGES, ORG_MEMBER_MESSAGES, PROJECT_MESSAGES } from "../utils/constants.js";
import { ApiError } from "../utils/ApiError.js";

export const createProject = async (
  organizationId: string,
  name: string,
  description: string
) => {
  try {
    if (!organizationId || !name || !description) {
      throw ApiError.badRequest(PROJECT_MESSAGES.MISSING_FIELDS);
    }

    const findProject = await prisma.project.findFirst({
      where: {
        name
      },
    });

    if (findProject) {
      throw ApiError.conflict(PROJECT_MESSAGES.ALREADY_EXIST);
    }

    const project = await prisma.project.create({
      data: {
        organizationId,
        name,
        description,
      },
    });

    return project;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.internal(COMMON_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const getAllProjects = async (orgId: string) => {
  try {
    const findProjects = await prisma.project.findMany({
      where: {
        organizationId: orgId,
      }
    });

    return findProjects;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.internal(COMMON_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const getProjectById = async (id: string) => {
  try {
    const findProjects = await prisma.project.findUnique({
      where: {
        id
      }
    });

    if (!findProjects) {
      throw ApiError.notFound(PROJECT_MESSAGES.PROJECT_NOT_FOUND);
    }

    return findProjects;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.internal(COMMON_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const deleteProject = async (
  organizationId: string,
  projectId: string
) => {
  try {
    if (!organizationId || !projectId) {
      throw ApiError.badRequest(PROJECT_MESSAGES.MISSING_PORJECT_ID);
    }

    const findOrganizationMember = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!findOrganizationMember) {
      throw ApiError.notFound(PROJECT_MESSAGES.PROJECT_NOT_FOUND);
    }

    const project = await prisma.project.delete({
      where: {
        organizationId,
        id: projectId,
      }
    });

    return project;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.internal(COMMON_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};
