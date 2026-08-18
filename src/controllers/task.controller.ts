import { Request, Response } from "express";
import { TASK_MESSAGES } from "../utils/constants.js";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../services/task.service.js";

export const createTaskController = async (
  req: Request,
  res: Response
) => {
  const { projectId, title, description, assigneeId, status, priority } = req?.body;

  const task = await createTask(projectId, title, description, assigneeId, status, priority);

  return res.status(201).json({
    success: true,
    message: TASK_MESSAGES.CREATE_SUCCESS,
    task,
  });
};

export const getAllTasksController = async (
  req: Request,
  res: Response
) => {
  const projectId = req.params.projectId as string;

  const tasks = await getAllTasks(projectId);

  return res.status(200).json({
    success: true,
    message: TASK_MESSAGES.GETALL_SUCCESS,
    tasks,
  });
};

export const getTaskByIdController = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id as string;

  const task = await getTaskById(id);

  return res.status(200).json({
    success: true,
    message: TASK_MESSAGES.GETALL_SUCCESS,
    task,
  });
};

export const updateTaskController = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id as string;
  const { title, description, assigneeId, status, priority } = req.body;

  const task = await updateTask(id, title, description, assigneeId, status, priority);

  return res.status(200).json({
    success: true,
    message: TASK_MESSAGES.UPDATE_SUCCESS,
    task,
  });
};

export const deleteTaskController = async (
  req: Request,
  res: Response
) => {
  const { projectId, taskId } = req.body;

  await deleteTask(projectId, taskId);

  return res.status(200).json({
    success: true,
    message: TASK_MESSAGES.DELETE_TASK_SUCCESS,
  });
};
