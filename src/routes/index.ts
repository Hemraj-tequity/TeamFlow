import express from "express";
import authRoutes from "./auth.routes.js";
import { AUTH_BASE_PATH } from "../utils/constants.js";
import organizationRoutes from "./organization.routes.js";
import organizationMemberRoutes from "./organization-member.routes.js";
import organizationProjectRouter from "./organization-projects.routes.js";

const router = express.Router();

router.use(AUTH_BASE_PATH, authRoutes);
router.use(organizationRoutes);
router.use(organizationMemberRoutes);
router.use(organizationProjectRouter);

export default router;
