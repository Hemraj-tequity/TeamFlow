import { Request, Response } from "express";
import { USERS_MESSAGES } from "../utils/constants.js";
import { getAllUsers } from "../services/user.service.js";

export const getAllUsersController = async (
  _req: Request,
  res: Response
) => {
  const users = await getAllUsers();

  return res.status(200).json({
    success: true,
    message: USERS_MESSAGES.GETALL_USERS,
    users,
  });
};