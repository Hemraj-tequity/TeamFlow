import { Request, Response } from "express";
import { sendOTPUser, verifyOTPUser, /* registerUser */ } from "../services/auth.service.js";
import { AUTH_MESSAGES } from "../utils/constants.js";
// import { Resend } from "resend";

// export const registerController = async (
//   req: Request,
//   res: Response
// ) => {
//   const { email, password, name, role } = req.body;

//   const user = await registerUser(email, password, name, role);

//   return res.status(201).json({
//     success: true,
//     message: AUTH_MESSAGES.REGISTER_SUCCESS,
//     user,
//   });
// };

export const SendOTPController = async (
  req: Request,
  res: Response
) => {
  const { email, password } = req.body;

  await sendOTPUser(email, password);

  return res.status(200).json({
    success: true,
    message: AUTH_MESSAGES.LOGIN_SUCCESS,
  });
};

export const VerifyOTPController = async (
  req: Request,
  res: Response
) => {
  const { email, otp } = req.body;

  const response = await verifyOTPUser(email, otp);

  res.cookie("refreshToken", response.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  const { user: userData, accessToken } = response;
  const { password, refreshToken, ...safeUser } = userData;

  return res.status(200).json({
    success: true,
    message: AUTH_MESSAGES.LOGIN_SUCCESS,
    user: {
      ...safeUser,
      accessToken,
    },
  });
};