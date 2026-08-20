import express from "express";
import authRoutes from "./auth.routes.js";
import { AUTH_BASE_PATH } from "../utils/constants.js";
import organizationRoutes from "./organization.routes.js";
import organizationMemberRoutes from "./organization-member.routes.js";
import organizationProjectRouter from "./organization-projects.routes.js";
import taskRouter from "./task.routes.js";
import organizationProjectMemberRouter from "./organization-project-member.routes.js";
import userRouter from "./user.routes.js";
import commentRouter from "./comment.routes.js";
import { authMiddleware } from "../middlewares/authorization.js";

const router = express.Router();

router.use(AUTH_BASE_PATH, authRoutes);
router.use(authMiddleware, userRouter);
router.use(authMiddleware, organizationRoutes);
router.use(authMiddleware, organizationMemberRoutes);
router.use(authMiddleware, organizationProjectRouter);
router.use(authMiddleware, taskRouter);
router.use(authMiddleware, organizationProjectMemberRouter);
router.use(authMiddleware, commentRouter);

export default router;
