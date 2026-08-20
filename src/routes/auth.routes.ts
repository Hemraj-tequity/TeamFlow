import { Router } from "express";
import { SendOTPController, VerifyOTPController, /* registerController */ } from "../controllers/auth.controller.js";
import { AUTH_SEND_OTP_PATH, AUTH_VERIFY_OTP_PATH } from "../utils/constants.js";
import { loginLimiter } from "../utils/authHelper.js";
import { authMiddleware } from "../middlewares/authorization.js";

const authRouter = Router();

// authRouter.post("/register", registerController);
authRouter.post(AUTH_SEND_OTP_PATH, loginLimiter, SendOTPController);
authRouter.post(AUTH_VERIFY_OTP_PATH, VerifyOTPController);

export default authRouter;