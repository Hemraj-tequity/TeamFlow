import { Request, Response } from "express";
import { loginUser, /* registerUser */ } from "../services/auth.service.js";
import { AUTH_MESSAGES } from "../utils/constants.js";

// export const registerController = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const { email, password, name, role } = req.body;

//     const user = await registerUser(email, password, name, role);

//     return res.status(200).json({
//       success: true,
//       message: "User registered successfully",
//       user,
//     });
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: error instanceof Error
//         ? error.message
//         : "Registration failed",
//     });
//   }
// };

export const loginController = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const user = await loginUser(email, password);

    return res.status(200).json({
      success: true,
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      user,
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: AUTH_MESSAGES.LOGIN_FAILED,
    });
  }
};