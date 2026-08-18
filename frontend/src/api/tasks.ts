import { apiRequest, endpoints } from "./client";
import type { Task, TaskPriority, TaskStatus } from "./types";

interface GetAllTasksResponse {
  success: true;
  message: string;
  tasks: Task[];
}

interface TaskResponse {
  success: true;
  message: string;
  task: Task;
}

export const getAllTasks = (projectId: string) =>
  apiRequest<GetAllTasksResponse>(endpoints.getAllTasks(projectId)).then((res) => res.tasks);

export const createTask = (
  projectId: string,
  title: string,
  description: string,
  assigneeId: number | undefined,
  status: TaskStatus,
  priority: TaskPriority
) =>
  apiRequest<TaskResponse>(endpoints.createTask, {
    method: "POST",
    body: { projectId, title, description: description || undefined, assigneeId, status, priority },
  }).then((res) => res.task);

export const updateTaskStatus = (taskId: string, status: TaskStatus) =>
  apiRequest<TaskResponse>(endpoints.updateTask(taskId), {
    method: "PATCH",
    body: { status },
  }).then((res) => res.task);

export const deleteTask = (projectId: string, taskId: string) =>
  apiRequest<{ success: true; message: string }>(endpoints.deleteTask, {
    method: "DELETE",
    body: { projectId, taskId },
  });
