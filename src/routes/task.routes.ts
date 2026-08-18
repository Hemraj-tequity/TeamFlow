import { Router } from "express";
import { endpoints } from "../utils/constants.js";
import {
  createTaskController,
  deleteTaskController,
  getTaskByIdController,
  getAllTasksController,
  updateTaskController,
} from "../controllers/task.controller.js";

const taskRouter = Router();

taskRouter.post(endpoints.createTask, createTaskController);
taskRouter.get(endpoints.getAllTasks, getAllTasksController);
taskRouter.get(endpoints.getTaskById, getTaskByIdController);
taskRouter.patch(endpoints.updateTask, updateTaskController);
taskRouter.delete(endpoints.deleteTask, deleteTaskController);

export default taskRouter;
