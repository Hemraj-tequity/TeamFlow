import { useEffect, useState, type FormEvent } from "react";
import { Modal } from "./Modal";
import { Loader, ErrorBanner, EmptyState } from "./StateViews";
import { ApiRequestError } from "../api/client";
import { createTask, deleteTask, getAllTasks, updateTaskStatus } from "../api/tasks";
import type { Task, TaskPriority, TaskStatus } from "../api/types";

const STATUS_OPTIONS: TaskStatus[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "COMPLETED", "CANCELLED"];
const PRIORITY_OPTIONS: TaskPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

interface TasksModalProps {
  projectId: string;
  projectName: string;
  onClose: () => void;
}

export function TasksModal({ projectId, projectName, onClose }: TasksModalProps) {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [rowError, setRowError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    getAllTasks(projectId)
      .then(setTasks)
      .catch((err) => setError(err instanceof ApiRequestError ? err.message : "Failed to load tasks."))
      .finally(() => setLoading(false));
  };

  useEffect(load, [projectId]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);

    try {
      const parsedAssigneeId = assigneeId ? Number(assigneeId) : undefined;
      if (assigneeId && Number.isNaN(parsedAssigneeId)) {
        setCreateError("Assignee User ID must be a number.");
        setCreating(false);
        return;
      }

      const task = await createTask(projectId, title.trim(), description.trim(), parsedAssigneeId, status, priority);
      setTasks((prev) => (prev ? [task, ...prev] : [task]));
      setTitle("");
      setDescription("");
      setAssigneeId("");
      setStatus("TODO");
      setPriority("MEDIUM");
    } catch (err) {
      setCreateError(err instanceof ApiRequestError ? err.message : "Failed to create task.");
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (task: Task, nextStatus: TaskStatus) => {
    setRowError(null);
    const previous = tasks;
    setTasks((prev) => prev?.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t)) ?? null);

    try {
      await updateTaskStatus(task.id, nextStatus);
    } catch (err) {
      setTasks(previous ?? null);
      setRowError(err instanceof ApiRequestError ? err.message : "Failed to update task status.");
    }
  };

  const handleDelete = async (task: Task) => {
    setDeleting(true);
    setRowError(null);
    try {
      await deleteTask(task.projectId, task.id);
      setTasks((prev) => prev?.filter((t) => t.id !== task.id) ?? null);
      setConfirmingId(null);
    } catch (err) {
      setRowError(err instanceof ApiRequestError ? err.message : "Failed to delete task.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal title={`Tasks — ${projectName}`} onClose={onClose} wide>
      <form className="member-add-form" onSubmit={handleCreate}>
        <label className="field">
          <span>Title</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus />
        </label>

        <label className="field">
          <span>Description (optional)</span>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
        </label>

        <div className="task-form-row">
          <label className="field">
            <span>Assignee User ID (optional)</span>
            <input
              type="number"
              min={1}
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              placeholder="e.g. 1"
            />
          </label>

          <label className="field">
            <span>Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Priority</span>
            <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
        </div>

        {createError && <p className="field-error">{createError}</p>}

        <div className="modal-actions">
          <button type="submit" className="btn btn-primary" disabled={creating}>
            {creating ? "Creating..." : "Create Task"}
          </button>
        </div>
      </form>

      {loading && <Loader label="Loading tasks..." />}
      {!loading && error && <ErrorBanner message={error} onRetry={load} />}
      {!loading && !error && tasks && tasks.length === 0 && (
        <EmptyState title="No tasks yet" hint="Create the first task for this project above." />
      )}

      {!loading && !error && tasks && tasks.length > 0 && (
        <ul className="members-list">
          {tasks.map((task) => (
            <li key={task.id} className="members-list-item task-item">
              <div className="task-main">
                <div className="task-title-row">
                  <span className="member-user">{task.title}</span>
                  <span className={`badge badge-priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                </div>
                {task.description && <p className="muted task-description">{task.description}</p>}
                <span className="muted member-date">
                  {task.assigneeId ? `Assignee: User #${task.assigneeId}` : "Unassigned"} ·{" "}
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="task-actions">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task, e.target.value as TaskStatus)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>

                {confirmingId === task.id ? (
                  <div className="member-confirm">
                    <button
                      type="button"
                      className="btn btn-danger"
                      disabled={deleting}
                      onClick={() => handleDelete(task)}
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
                      setConfirmingId(task.id);
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {rowError && <p className="field-error">{rowError}</p>}
    </Modal>
  );
}
