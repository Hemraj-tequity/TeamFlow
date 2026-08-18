import { prisma } from "../lib/prisma.js";
import { COMMON_MESSAGES, COMMENT_MESSAGES } from "../utils/constants.js";
import { ApiError } from "../utils/ApiError.js";

export const createComment = async (
  taskId: string,
  userId: number,
  content: string
) => {
  try {
    if (!taskId || !userId || !content) {
      throw ApiError.badRequest(COMMENT_MESSAGES.MISSING_FIELDS);
    }

    const findTask = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!findTask) {
      throw ApiError.notFound(COMMENT_MESSAGES.TASK_NOT_FOUND);
    }

    const findUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!findUser) {
      throw ApiError.notFound(COMMENT_MESSAGES.USER_NOT_FOUND);
    }

    const comment = await prisma.comment.create({
      data: {
        taskId,
        userId,
        content,
      },
    });

    return comment;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.internal(COMMON_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const getAllComments = async (taskId: string) => {
  try {
    if (!taskId) {
      throw ApiError.badRequest(COMMENT_MESSAGES.TASK_NOT_FOUND);
    }

    const comments = await prisma.comment.findMany({
      where: {
        taskId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return comments;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.internal(COMMON_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const getCommentById = async (id: string) => {
  try {
    const findComment = await prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if (!findComment) {
      throw ApiError.notFound(COMMENT_MESSAGES.COMMENT_NOT_FOUND);
    }

    return findComment;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.internal(COMMON_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const updateComment = async (id: string, content: string) => {
  try {
    if (!content) {
      throw ApiError.badRequest(COMMENT_MESSAGES.MISSING_CONTENT);
    }

    const findComment = await prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if (!findComment) {
      throw ApiError.notFound(COMMENT_MESSAGES.COMMENT_NOT_FOUND);
    }

    const comment = await prisma.comment.update({
      where: {
        id,
      },
      data: {
        content,
      },
    });

    return comment;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.internal(COMMON_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const deleteComment = async (taskId: string, commentId: string) => {
  try {
    if (!taskId || !commentId) {
      throw ApiError.badRequest(COMMENT_MESSAGES.MISSING_COMMENT_ID);
    }

    const findComment = await prisma.comment.findUnique({
      where: {
        taskId,
        id: commentId,
      },
    });

    if (!findComment) {
      throw ApiError.notFound(COMMENT_MESSAGES.COMMENT_NOT_FOUND);
    }

    const comment = await prisma.comment.delete({
      where: {
        taskId,
        id: commentId,
      },
    });

    return comment;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.internal(COMMON_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};
