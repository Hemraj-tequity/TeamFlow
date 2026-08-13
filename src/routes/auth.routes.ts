import { Router } from "express";
import { loginController, /* registerController */ } from "../controllers/auth.controller.js";
import { AUTH_LOGIN_PATH } from "../utils/constants.js";

const authRouter = Router();

// authRouter.post("/register", registerController);
authRouter.post(AUTH_LOGIN_PATH, loginController);

export default authRouter;