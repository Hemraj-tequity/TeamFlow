import { Router } from "express";
import {
    createOrganizationController,
    getAllOrganizationController,
    getOrganizationByIdController,
    updateOrganizationController
} from "../controllers/organization.controller.js";
import { endpoints } from "../utils/constants.js";

const organizationRouter = Router();

organizationRouter.post(endpoints.createOrganization, createOrganizationController);
organizationRouter.get(endpoints.getAllOrganizations, getAllOrganizationController);
organizationRouter.get(endpoints.getOrganizationById, getOrganizationByIdController);
organizationRouter.patch(endpoints.updateOrganization, updateOrganizationController);

export default organizationRouter;