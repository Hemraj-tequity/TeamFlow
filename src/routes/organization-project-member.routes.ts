import { Router } from "express";
import { endpoints } from "../utils/constants.js";
import {
    createProjectMemberController,
    deleteProjectMemberController,
    getAllProjectMemberController
} from "../controllers/organization-project-member.controller.js";

const organizationProjectMemberRouter = Router();

organizationProjectMemberRouter.post(endpoints.addProjectMember, createProjectMemberController);
organizationProjectMemberRouter.get(endpoints.getAllProjectMember, getAllProjectMemberController);
organizationProjectMemberRouter.delete(endpoints.deleteProjectMember, deleteProjectMemberController);

export default organizationProjectMemberRouter;