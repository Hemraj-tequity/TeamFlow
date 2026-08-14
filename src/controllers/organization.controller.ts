import { Request, Response } from "express";
import { 
  createOrganization, 
  getAllOrganization, 
  getOrganizationById, 
  updateOrganization
} from "../services/organization.service.js";
import { ORG_MESSAGES } from "../utils/constants.js";

export const createOrganizationController = async (
  req: Request,
  res: Response
) => {
  const { name, slug, status } = req.body;

  const organization = await createOrganization(name, slug, status);

  return res.status(201).json({
    success: true,
    message: ORG_MESSAGES.CREATE_SUCCESS,
    organization,
  });
};

export const getAllOrganizationController = async (
  req: Request,
  res: Response
) => {
  const organization = await getAllOrganization();

  return res.status(200).json({
    success: true,
    message: ORG_MESSAGES.GETALL_SUCCESS,
    organization,
  });
};

export const getOrganizationByIdController = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id as string;

  const organization = await getOrganizationById(id);

  return res.status(200).json({
    success: true,
    message: ORG_MESSAGES.GETALL_SUCCESS,
    organization,
  });
};

export const updateOrganizationController = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id as string;
  const {name, slug, status} = req.body;

  const organization = await updateOrganization(id, name, slug, status);

  return res.status(200).json({
    success: true,
    message: ORG_MESSAGES.UPDATE_SUCCESS,
    organization,
  });
};