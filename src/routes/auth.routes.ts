import { Router } from "express";
import { loginController, /* registerController */ } from "../controllers/auth.controller.js";
import { AUTH_LOGIN_PATH } from "../utils/constants.js";
import { loginLimiter } from "../utils/authHelper.js";

const authRouter = Router();

// authRouter.post("/register", registerController);
authRouter.post(AUTH_LOGIN_PATH, loginLimiter, loginController);

export default authRouter;