import express from "express";
import authRoutes from "./auth.routes.js";
import { AUTH_BASE_PATH } from "../utils/constants.js";

const router = express.Router();

router.use(AUTH_BASE_PATH, authRoutes);

export default router;
