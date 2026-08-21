import { Router } from "express";
import { SendOTPController, VerifyOTPController, RefreshTokenController /* registerController */ } from "../controllers/auth.controller.js";
import { AUTH_REFRESH_TOKEN_PATH, AUTH_SEND_OTP_PATH, AUTH_VERIFY_OTP_PATH } from "../utils/constants.js";
import { loginLimiter } from "../utils/authHelper.js";

const authRouter = Router();

// authRouter.post("/register", registerController);
authRouter.post(AUTH_SEND_OTP_PATH, loginLimiter, SendOTPController);
authRouter.post(AUTH_VERIFY_OTP_PATH, VerifyOTPController);
authRouter.post(AUTH_REFRESH_TOKEN_PATH, RefreshTokenController);

export default authRouter;