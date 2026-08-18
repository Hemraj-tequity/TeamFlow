import { prisma } from "../lib/prisma.js";
import { OrganizationStatus } from "../generated/prisma/enums.js";
import { COMMON_MESSAGES, ORG_MESSAGES } from "../utils/constants.js";
import { ApiError } from "../utils/ApiError.js";

export const createOrganization = async (
  name: string,
  slug: string,
  status: string,
) => {
  try {
    if (!name || !slug || !status) {
      throw ApiError.badRequest(ORG_MESSAGES.MISSING_FIELDS);
    }

    const findorganization = await prisma.organization.findUnique({
      where: {
        slug,
      },
    });

    if (findorganization) {
      throw ApiError.conflict(ORG_MESSAGES.ALREADY_EXIST);
    }

    const organization = await prisma.organization.create({
      data: {
        name,
        slug,
        status: status as OrganizationStatus,
      },
    });

    return organization;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.internal(COMMON_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const getAllOrganization = async () => {
  try {
    const findorganization = await prisma.organization.findMany();

    return findorganization;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.internal(COMMON_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const getOrganizationById = async (id: string) => {
  try {
    if (!id) {
      throw ApiError.badRequest(ORG_MESSAGES.MISSING_ORG_ID);
    }

    const findorganization = await prisma.organization.findUnique({
      where: {
        id,
      },
    });

    if (!findorganization) {
      throw ApiError.notFound(ORG_MESSAGES.NOT_FOUND);
    }

    return findorganization;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw ApiError.internal(COMMON_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const updateOrganization = async (
  id: string,
  name: string,
  slug: string,
  status: string
) => {
  try {
    if (!id || !name || !slug || !status) {
      throw ApiError.badRequest(ORG_MESSAGES.MISSING_FIELDS);
    }

    const findorganization = await prisma.organization.findUnique({
      where: {
        id,
      },
    });

    if (!findorganization) {
      throw ApiError.notFound(ORG_MESSAGES.NOT_FOUND);
    }

    const organization = await prisma.organization.update({
      where: {
        id,
      },
      data: {
        name,
        slug,
        status: status as OrganizationStatus,
      },
    });

    return organization;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.internal(COMMON_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const deleteOrganization = async (id: string) => {
  try {
    if (!id) {
      throw ApiError.badRequest(ORG_MESSAGES.MISSING_ORG_ID);
    }

    const findorganization = await prisma.organization.findUnique({
      where: {
        id,
      },
    });

    if (!findorganization) {
      throw ApiError.notFound(ORG_MESSAGES.NOT_FOUND);
    }

    const organization = await prisma.organization.delete({
      where: {
        id
      }
    });

    return organization;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.internal(COMMON_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};
