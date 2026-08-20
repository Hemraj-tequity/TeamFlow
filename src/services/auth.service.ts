import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import { UserRole } from "../generated/prisma/enums.js";
import { AUTH_MESSAGES, USERS_MESSAGES } from "../utils/constants.js";
import {
  generateAccessToken,
  generateOtp,
  generateRefreshToken,
  hashOtp,
} from "../utils/authHelper.js";
import { ApiError } from "../utils/ApiError.js";
import { Resend } from "resend";
import { OTPMAIL } from "../EmailTemplate/Otp.js";

// export const registerUser = async (
//   email: string,
//   password: string,
//   name: string,
//   role: UserRole
// ) => {
//   if (!email || !password || !name || !role) {
//     throw ApiError.badRequest(AUTH_MESSAGES.MISSING_REGISTER_FIELDS);
//   }

//   const existingUser = await prisma.user.findUnique({
//     where: {
//       email,
//     },
//   });

//   if (existingUser) {
//     throw ApiError.conflict(AUTH_MESSAGES.USER_ALREADY_EXISTS);
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const user = await prisma.user.create({
//     data: {
//       email,
//       password: hashedPassword,
//       name,
//       role,
//     },
//   });

//   return {
//     id: user.id,
//     name: user.name,
//     email: user.email,
//     role: user.role,
//   };
// };

export const sendOTPUser = async (email: string, password: string) => {
  try {
    if (!email || !password) {
      throw ApiError.badRequest(AUTH_MESSAGES.MISSING_CREDENTIALS);
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw ApiError.unauthorized(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw ApiError.unauthorized(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const otp = generateOtp();
    const hashedOtp = hashOtp(email, otp);

    const existingOtp = await prisma.otpVerification.findUnique({
      where: { sendto: email },
    });

    if (existingOtp) {
      await prisma.otpVerification.update({
        where: { sendto: email },
        data: {
          otpHash: hashedOtp,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
          attempts: 0,
        },
      });
    } else {
      await prisma.otpVerification.create({
        data: {
          sendto: user.email,
          otpHash: hashedOtp,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
          attempts: 0,
        },
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.EMAIL!,
      subject: "Verify OTP",
      html: OTPMAIL(otp),
    });
  } catch (error: any) {
    throw new Error("Erorr: " + error.message);
  }
};

export const verifyOTPUser = async (email: string, otp: string) => {
  if (!email || !otp) {
    throw ApiError.badRequest(AUTH_MESSAGES.EMAIL_AND_OTP_REQUIRED);
  }

  const OTP = await prisma.otpVerification.findUnique({
    where: {
      sendto: email,
    },
  });

  if (!OTP) {
    throw ApiError.unauthorized(AUTH_MESSAGES.EMAIL_OTP_NOT_FOUND);
  }

  if (OTP.attempts > 3) {
    throw ApiError.unauthorized(AUTH_MESSAGES.TOO_MANY_WRONG_ATTEMPT);
  }

  const hashedOtp = hashOtp(email, otp);

  if (hashedOtp !== OTP.otpHash) {
    await prisma.otpVerification.update({
      where: { sendto: email },
      data: {
        attempts: OTP.attempts + 1,
      },
    });
    throw ApiError.unauthorized(AUTH_MESSAGES.INVALID_OTP);
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw ApiError.unauthorized(USERS_MESSAGES.USER_NOT_FOUND);
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.user.update({
    where: { email },
    data: {
      refreshToken,
    },
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};
