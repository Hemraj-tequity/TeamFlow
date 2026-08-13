import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import { UserRole } from "../generated/prisma/enums.js";
import { AUTH_MESSAGES } from "../utils/constants.js";

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
    throw new Error(AUTH_MESSAGES.MISSING_CREDENTIALS);
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};