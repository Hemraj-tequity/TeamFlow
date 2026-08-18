import { Router } from "express";
import { endpoints } from "../utils/constants.js";
import { getAllUsersController } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get(endpoints.getAllUsers, getAllUsersController);

export default userRouter;