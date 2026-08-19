import { apiRequest, endpoints } from "./client";
import type { Comment } from "./types";

interface GetAllCommentsResponse {
  success: true;
  message: string;
  comments: Comment[];
}

interface CommentResponse {
  success: true;
  message: string;
  comment: Comment;
}

export const getAllComments = (taskId: string) =>
  apiRequest<GetAllCommentsResponse>(endpoints.getAllComments(taskId)).then((res) => res.comments);

export const createComment = (taskId: string, userId: number, content: string) =>
  apiRequest<CommentResponse>(endpoints.createComment, {
    method: "POST",
    body: { taskId, userId, content },
  }).then((res) => res.comment);

export const updateComment = (id: string, content: string) =>
  apiRequest<CommentResponse>(endpoints.updateComment(id), {
    method: "PATCH",
    body: { content },
  }).then((res) => res.comment);

export const deleteComment = (taskId: string, commentId: string) =>
  apiRequest<{ success: true; message: string }>(endpoints.deleteComment, {
    method: "DELETE",
    body: { taskId, commentId },
  });
