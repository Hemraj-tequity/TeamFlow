import { Router } from "express";
import { endpoints } from "../utils/constants.js";
import {
  createCommentController,
  deleteCommentController,
  getCommentByIdController,
  getAllCommentsController,
  updateCommentController,
} from "../controllers/comment.controller.js";

const commentRouter = Router();

commentRouter.post(endpoints.createComment, createCommentController);
commentRouter.get(endpoints.getAllComments, getAllCommentsController);
commentRouter.get(endpoints.getCommentById, getCommentByIdController);
commentRouter.patch(endpoints.updateComment, updateCommentController);
commentRouter.delete(endpoints.deleteComment, deleteCommentController);

export default commentRouter;
