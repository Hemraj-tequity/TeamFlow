import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { COMMON_MESSAGES } from "../utils/constants.js";

export const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany();

    return users;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.internal(COMMON_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};
