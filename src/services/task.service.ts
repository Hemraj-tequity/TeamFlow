import { prisma } from "../lib/prisma.js";
import { TaskStatus, TaskPriority } from "../generated/prisma/enums.js";
import { COMMON_MESSAGES, TASK_MESSAGES } from "../utils/constants.js";
import { ApiError } from "../utils/ApiError.js";

export const createTask = async (
  projectId: string,
  title: string,
  description: string,
  assigneeId: number | undefined,
  status: string | undefined,
  priority: string | undefined
) => {
  try {
    if (!projectId || !title) {
      throw ApiError.badRequest(TASK_MESSAGES.MISSING_FIELDS);
    }

    const findProject = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!findProject) {
      throw ApiError.notFound(TASK_MESSAGES.PROJECT_NOT_FOUND);
    }

    const findTask = await prisma.task.findFirst({
      where: {
        projectId,
        title,
      },
    });

    if (findTask) {
      throw ApiError.conflict(TASK_MESSAGES.ALREADY_EXIST);
    }

    const task = await prisma.task.create({
      data: {
        projectId,
        title,
        description,
        assigneeId,
        status: status as TaskStatus,
        priority: priority as TaskPriority,
      },
    });

    return task;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.internal(COMMON_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const getAllTasks = async (projectId: string) => {
  try {
    const findTasks = await prisma.task.findMany({
      where: {
        projectId,
      },
    });

    return findTasks;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.internal(COMMON_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const getTaskById = async (id: string) => {
  try {
    const findTask = await prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!findTask) {
      throw ApiError.notFound(TASK_MESSAGES.TASK_NOT_FOUND);
    }

    return findTask;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.internal(COMMON_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const updateTask = async (
  id: string,
  title: string,
  description: string,
  assigneeId: number | undefined,
  status: string | undefined,
  priority: string | undefined
) => {
  try {
    if (!id) {
      throw ApiError.badRequest(TASK_MESSAGES.MISSING_TASK_ID);
    }

    const findTask = await prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!findTask) {
      throw ApiError.notFound(TASK_MESSAGES.TASK_NOT_FOUND);
    }

    const task = await prisma.task.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        assigneeId,
        status: status as TaskStatus,
        priority: priority as TaskPriority,
      },
    });

    return task;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.internal(COMMON_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const deleteTask = async (
  projectId: string,
  taskId: string
) => {
  try {
    if (!projectId || !taskId) {
      throw ApiError.badRequest(TASK_MESSAGES.MISSING_TASK_ID);
    }

    const findTask = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!findTask) {
      throw ApiError.notFound(TASK_MESSAGES.TASK_NOT_FOUND);
    }

    const task = await prisma.task.delete({
      where: {
        projectId,
        id: taskId,
      },
    });

    return task;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.internal(COMMON_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};
