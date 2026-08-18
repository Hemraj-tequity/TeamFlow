import { prisma } from "../lib/prisma.js";
import { COMMON_MESSAGES, PROJECT_MEMBER_MESSAGES } from "../utils/constants.js";
import { ApiError } from "../utils/ApiError.js";

export const addProjectMember = async (
  projectId: string,
  userId: any
) => {
  try {
    if (!projectId || !userId) {
      throw ApiError.badRequest(PROJECT_MEMBER_MESSAGES.MISSING_FIELDS);
    }

    const findProjectMember = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId,
      },
    });

    if (findProjectMember) {
      throw ApiError.conflict(PROJECT_MEMBER_MESSAGES.ALREADY_EXIST);
    }

    const projectMember = await prisma.projectMember.create({
      data: {
        projectId,
        userId
      }
    });

    return projectMember;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.internal(COMMON_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const getAllProjectMembers = async (projectId: string) => {
  try {
    const findProjectMembers = await prisma.projectMember.findMany({
      where: {
        projectId,
      }
    });

    if (!findProjectMembers) {
      throw ApiError.notFound(PROJECT_MEMBER_MESSAGES.NOT_FOUND);
    }

    return findProjectMembers;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.internal(COMMON_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const deleteProjectMember = async (
  projectId: string,
  id: string
) => {
  try {
    if (!projectId || !id) {
      throw ApiError.badRequest(PROJECT_MEMBER_MESSAGES.MISSING_FIELDS);
    }

    const findProjectMember = await prisma.projectMember.findUnique({
      where: {
        projectId,
        id,
      },
    });

    if (!findProjectMember) {
      throw ApiError.notFound(PROJECT_MEMBER_MESSAGES.NOT_FOUND);
    }

    const project = await prisma.projectMember.delete({
      where: {
        projectId,
        id,
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
