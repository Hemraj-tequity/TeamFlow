import { Router } from "express";
import {
    createOrganizationController,
    deleteOrganizationController,
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
organizationRouter.delete(endpoints.deleteOrganization, deleteOrganizationController);

export default organizationRouter;