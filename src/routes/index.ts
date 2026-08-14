import express from "express";
import authRoutes from "./auth.routes.js";
import { AUTH_BASE_PATH } from "../utils/constants.js";
import organizationRoutes from "./organization.routes.js";

const router = express.Router();

router.use(AUTH_BASE_PATH, authRoutes);
router.use(organizationRoutes);

export default router;
