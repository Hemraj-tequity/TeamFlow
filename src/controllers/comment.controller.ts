import { Request, Response } from "express";
import { COMMENT_MESSAGES } from "../utils/constants.js";
import {
  createComment,
  getAllComments,
  getCommentById,
  updateComment,
  deleteComment,
} from "../services/comment.service.js";

export const createCommentController = async (
  req: Request,
  res: Response
) => {
  const { taskId, userId, content } = req?.body;

  const comment = await createComment(taskId, userId, content);

  return res.status(201).json({
    success: true,
    message: COMMENT_MESSAGES.CREATE_SUCCESS,
    comment,
  });
};

export const getAllCommentsController = async (
  req: Request,
  res: Response
) => {
  const taskId = req.params.taskId as string;

  const comments = await getAllComments(taskId);

  return res.status(200).json({
    success: true,
    message: COMMENT_MESSAGES.GETALL_SUCCESS,
    comments,
  });
};

export const getCommentByIdController = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id as string;

  const comment = await getCommentById(id);

  return res.status(200).json({
    success: true,
    message: COMMENT_MESSAGES.GET_SUCCESS,
    comment,
  });
};

export const updateCommentController = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id as string;
  const { content } = req.body;

  const comment = await updateComment(id, content);

  return res.status(200).json({
    success: true,
    message: COMMENT_MESSAGES.UPDATE_SUCCESS,
    comment,
  });
};

export const deleteCommentController = async (
  req: Request,
  res: Response
) => {
  const { taskId, commentId } = req.body;

  await deleteComment(taskId, commentId);

  return res.status(200).json({
    success: true,
    message: COMMENT_MESSAGES.DELETE_SUCCESS,
  });
};
