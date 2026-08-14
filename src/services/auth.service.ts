import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import { UserRole } from "../generated/prisma/enums.js";
import { AUTH_MESSAGES } from "../utils/constants.js";
import { generateAccessToken, generateRefreshToken } from "../utils/authHelper.js";
import { ApiError } from "../utils/ApiError.js";

// export const registerUser = async (
//   email: string,
//   password: string,
//   name: string,
//   role: UserRole
// ) => {
//   if (!email || !password || !name || !role) {
//     throw new Error("Email, password, name, and role are required");
//   }

//   const existingUser = await prisma.user.findUnique({
//     where: {
//       email,
//     },
//   });

//   if (existingUser) {
//     throw new Error("User already exists");
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
//   };
// };

export const loginUser = async (
  email: string,
  password: string
) => {
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

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw ApiError.unauthorized(AUTH_MESSAGES.INVALID_CREDENTIALS);
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};