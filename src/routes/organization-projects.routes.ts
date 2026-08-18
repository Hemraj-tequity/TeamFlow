import { Router } from "express";
import { endpoints } from "../utils/constants.js";
import {
    createProjectController,
    deleteProjectController,
    getProjectByIdController,
    getAllProjectsController
} from "../controllers/organization-project.controller.js";

const organizationProjectRouter = Router();

organizationProjectRouter.post(endpoints.createProject, createProjectController);
organizationProjectRouter.get(endpoints.getAllProjects, getAllProjectsController);
organizationProjectRouter.get(endpoints.getProjectById, getProjectByIdController);
organizationProjectRouter.delete(endpoints.deleteProject, deleteProjectController);

export default organizationProjectRouter;