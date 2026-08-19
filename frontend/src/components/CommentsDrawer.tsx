import { useEffect, useState, type FormEvent } from "react";
import { Drawer } from "./Drawer";
import { Loader, ErrorBanner, EmptyState } from "./StateViews";
import { ApiRequestError } from "../api/client";
import { createComment, deleteComment, getAllComments, updateComment } from "../api/comments";
import { getAllUsers } from "../api/users";
import { useAuth } from "../context/AuthContext";
import type { Comment, User } from "../api/types";

interface CommentsDrawerProps {
  taskId: string;
  taskTitle: string;
  onClose: () => void;
}

export function CommentsDrawer({ taskId, taskTitle, onClose }: CommentsDrawerProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [users, setUsers] = useState<User[] | null>(null);

  const [content, setContent] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [rowError, setRowError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    getAllComments(taskId)
      .then(setComments)
      .catch((err) => setError(err instanceof ApiRequestError ? err.message : "Failed to load comments."))
      .finally(() => setLoading(false));
  };

  useEffect(load, [taskId]);
  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch(() => setUsers(null));
  }, []);

  const userById = new Map((users ?? []).map((u) => [u.id, u]));

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setAdding(true);
    setAddError(null);
    try {
      const comment = await createComment(taskId, user.id, content.trim());
      setComments((prev) => (prev ? [...prev, comment] : [comment]));
      setContent("");
    } catch (err) {
      setAddError(err instanceof ApiRequestError ? err.message : "Failed to add comment.");
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (comment: Comment) => {
    setEditError(null);
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async (comment: Comment) => {
    setSaving(true);
    setEditError(null);
    try {
      const updated = await updateComment(comment.id, editContent.trim());
      setComments((prev) => prev?.map((c) => (c.id === comment.id ? updated : c)) ?? null);
      setEditingId(null);
    } catch (err) {
      setEditError(err instanceof ApiRequestError ? err.message : "Failed to update comment.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (comment: Comment) => {
    setDeleting(true);
    setRowError(null);
    try {
      await deleteComment(comment.taskId, comment.id);
      setComments((prev) => prev?.filter((c) => c.id !== comment.id) ?? null);
      setConfirmingId(null);
    } catch (err) {
      setRowError(err instanceof ApiRequestError ? err.message : "Failed to delete comment.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Drawer title={`Comments — ${taskTitle}`} onClose={onClose}>
      <form className="member-add-form" onSubmit={handleAdd}>
        <label className="field">
          <span>Add a comment</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
            required
            placeholder="Write a comment..."
          />
        </label>
        {addError && <p className="field-error">{addError}</p>}
        <div className="modal-actions">
          <button type="submit" className="btn btn-primary" disabled={adding || !content.trim()}>
            {adding ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </form>

      {loading && <Loader label="Loading comments..." />}
      {!loading && error && <ErrorBanner message={error} onRetry={load} />}
      {!loading && !error && comments && comments.length === 0 && (
        <EmptyState title="No comments yet" hint="Be the first to comment on this task." />
      )}

      {!loading && !error && comments && comments.length > 0 && (
        <ul className="members-list">
          {comments.map((comment) => {
            const author = userById.get(comment.userId);
            const isEditing = editingId === comment.id;

            return (
              <li key={comment.id} className="members-list-item comment-item">
                <div className="comment-main">
                  <div className="comment-header">
                    <span className="member-user">{author ? author.email : `User #${comment.userId}`}</span>
                    <span className="muted comment-date">
                      {new Date(comment.createdAt).toLocaleString()}
                      {comment.updatedAt !== comment.createdAt ? " (edited)" : ""}
                    </span>
                  </div>

                  {isEditing ? (
                    <>
                      <textarea
                        className="comment-edit-textarea"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={2}
                      />
                      {editError && <p className="field-error">{editError}</p>}
                      <div className="task-actions">
                        <button
                          type="button"
                          className="btn btn-primary"
                          disabled={saving || !editContent.trim()}
                          onClick={() => handleSaveEdit(comment)}
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost"
                          disabled={saving}
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="comment-content">{comment.content}</p>
                  )}
                </div>

                {!isEditing && (
                  <div className="task-actions">
                    <button type="button" className="btn btn-ghost" onClick={() => startEdit(comment)}>
                      Edit
                    </button>

                    {confirmingId === comment.id ? (
                      <div className="member-confirm">
                        <button
                          type="button"
                          className="btn btn-danger"
                          disabled={deleting}
                          onClick={() => handleDelete(comment)}
                        >
                          {deleting ? "..." : "Yes"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost"
                          disabled={deleting}
                          onClick={() => setConfirmingId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-danger-ghost"
                        onClick={() => {
                          setRowError(null);
                          setConfirmingId(comment.id);
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {rowError && <p className="field-error">{rowError}</p>}
    </Drawer>
  );
}
