import { Router } from "express";
import { endpoints } from "../utils/constants.js";
import {
    createOrganizationMemberController,
    deleteOrganizationMemberController,
    getAllOrganizationMemberController
} from "../controllers/organization-member.controller.js";

const organizationMemberRouter = Router();

organizationMemberRouter.post(endpoints.createOrganizationMember, createOrganizationMemberController);
organizationMemberRouter.get(endpoints.getAllOrganizationMembers, getAllOrganizationMemberController);
organizationMemberRouter.delete(endpoints.deleteOrganizationMember, deleteOrganizationMemberController);

export default organizationMemberRouter;