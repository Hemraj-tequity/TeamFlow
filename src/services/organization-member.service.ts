import { prisma } from "../lib/prisma.js";
import { COMMON_MESSAGES, ORG_MEMBER_MESSAGES } from "../utils/constants.js";
import { ApiError } from "../utils/ApiError.js";

export const createOrganizationMember = async (
  userId: number,
  organizationId: string,
) => {
  try {
    if (!userId || !organizationId) {
      throw ApiError.badRequest(ORG_MEMBER_MESSAGES.MISSING_FIELDS);
    }

    const findOrganizationMember = await prisma.organizationMember.findFirst({
      where: {
        userId,
        organizationId
      },
    });

    if (findOrganizationMember) {
      throw ApiError.conflict(ORG_MEMBER_MESSAGES.ALREADY_EXIST);
    }

    const organizationMember = await prisma.organizationMember.create({
      data: {
        userId,
        organizationId,
      },
    });

    return organizationMember;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.internal(COMMON_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const getAllOrganizationMember = async (orgId: string) => {
  try {
    const findorganizationMember = await prisma.organizationMember.findMany({
      where: {
        organizationId: orgId,
      }
    });

    return findorganizationMember;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.internal(COMMON_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const deleteOrganizationMember = async (
  orgMemberId: string
) => {
  try {
    if (!orgMemberId) {
      throw ApiError.badRequest(ORG_MEMBER_MESSAGES.MISSING_MEMBER_ID);
    }

    const findOrganizationMember = await prisma.organizationMember.findUnique({
      where: {
        id: orgMemberId,
      },
    });

    if (!findOrganizationMember) {
      throw ApiError.notFound(ORG_MEMBER_MESSAGES.MEMBER_NOT_FOUND);
    }

    const organizationMember = await prisma.organizationMember.delete({
      where: {
        id: orgMemberId,
      }
    });

    return organizationMember;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.internal(COMMON_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};
