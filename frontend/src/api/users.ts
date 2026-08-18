import { apiRequest, endpoints } from "./client";
import type { User } from "./types";

interface GetAllUsersResponse {
  success: true;
  message: string;
  users: User[];
}

export const getAllUsers = () =>
  apiRequest<GetAllUsersResponse>(endpoints.getAllUsers).then((res) => res.users);
