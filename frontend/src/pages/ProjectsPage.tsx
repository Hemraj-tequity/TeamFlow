import { useEffect, useState, type FormEvent } from "react";
import { getAllOrganizations } from "../api/organizations";
import { createProject, deleteProject, getAllProjects } from "../api/projects";
import { addProjectMember, deleteProjectMember, getAllProjectMembers } from "../api/projectMembers";
import { ApiRequestError } from "../api/client";
import type { Organization, Project } from "../api/types";
import { Loader, ErrorBanner, EmptyState } from "../components/StateViews";
import { Modal } from "../components/Modal";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { MembersModal } from "../components/MembersModal";
import { TasksModal } from "../components/TasksModal";

export function ProjectsPage() {
  const [organizations, setOrganizations] = useState<Organization[] | null>(null);
  const [orgsLoading, setOrgsLoading] = useState(true);
  const [orgsError, setOrgsError] = useState<string | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");

  const [projects, setProjects] = useState<Project[] | null>(null);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [membersProject, setMembersProject] = useState<Project | null>(null);
  const [tasksProject, setTasksProject] = useState<Project | null>(null);

  const loadOrganizations = () => {
    setOrgsLoading(true);
    setOrgsError(null);
    getAllOrganizations()
      .then((orgs) => {
        setOrganizations(orgs);
        setSelectedOrgId((current) => current || orgs[0]?.id || "");
      })
      .catch((err) => setOrgsError(err instanceof ApiRequestError ? err.message : "Failed to load organizations."))
      .finally(() => setOrgsLoading(false));
  };

  useEffect(loadOrganizations, []);

  const loadProjects = (orgId: string) => {
    if (!orgId) {
      setProjects(null);
      return;
    }
    setProjectsLoading(true);
    setProjectsError(null);
    getAllProjects(orgId)
      .then(setProjects)
      .catch((err) => setProjectsError(err instanceof ApiRequestError ? err.message : "Failed to load projects."))
      .finally(() => setProjectsLoading(false));
  };

  useEffect(() => {
    loadProjects(selectedOrgId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrgId]);

  const handleCreated = (project: Project) => {
    setProjects((prev) => (prev ? [project, ...prev] : [project]));
    setShowCreate(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteProject(deleteTarget.organizationId, deleteTarget.id);
      setProjects((prev) => prev?.filter((p) => p.id !== deleteTarget.id) ?? null);
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(err instanceof ApiRequestError ? err.message : "Failed to delete project.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Projects</h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowCreate(true)}
          disabled={!selectedOrgId}
        >
          New Project
        </button>
      </div>

      {orgsLoading && <Loader label="Loading organizations..." />}
      {!orgsLoading && orgsError && <ErrorBanner message={orgsError} onRetry={loadOrganizations} />}

      {!orgsLoading && !orgsError && organizations && organizations.length === 0 && (
        <EmptyState
          title="No organizations yet"
          hint="Create an organization first, then come back to add projects."
        />
      )}

      {!orgsLoading && !orgsError && organizations && organizations.length > 0 && (
        <>
          <label className="field org-select">
            <span>Organization</span>
            <select value={selectedOrgId} onChange={(e) => setSelectedOrgId(e.target.value)}>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </label>

          {projectsLoading && <Loader label="Loading projects..." />}
          {!projectsLoading && projectsError && (
            <ErrorBanner message={projectsError} onRetry={() => loadProjects(selectedOrgId)} />
          )}
          {!projectsLoading && !projectsError && projects && projects.length === 0 && (
            <EmptyState title="No projects yet" hint="Create the first project for this organization." />
          )}

          {!projectsLoading && !projectsError && projects && projects.length > 0 && (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td>{project.name}</td>
                      <td className="muted">{project.description || "—"}</td>
                      <td>
                        <span className={`badge badge-${project.status === "ACTIVE" ? "active" : "inactive"}`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="muted">{new Date(project.createdAt).toLocaleDateString()}</td>
                      <td className="row-actions">
                        <button type="button" className="btn btn-ghost" onClick={() => setTasksProject(project)}>
                          Tasks
                        </button>
                        <button type="button" className="btn btn-ghost" onClick={() => setMembersProject(project)}>
                          Members
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger-ghost"
                          onClick={() => {
                            setDeleteError(null);
                            setDeleteTarget(project);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {showCreate && (
        <CreateProjectModal
          organizationId={selectedOrgId}
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Project"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`}
          busy={deleting}
          error={deleteError}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {membersProject && (
        <MembersModal
          title={`Members — ${membersProject.name}`}
          onClose={() => setMembersProject(null)}
          fetchMembers={() => getAllProjectMembers(membersProject.id)}
          addMember={(userId) => addProjectMember(membersProject.id, userId)}
          removeMember={(member) => deleteProjectMember(membersProject.id, member.id)}
        />
      )}

      {tasksProject && (
        <TasksModal
          projectId={tasksProject.id}
          projectName={tasksProject.name}
          onClose={() => setTasksProject(null)}
        />
      )}
    </div>
  );
}

function CreateProjectModal({
  organizationId,
  onClose,
  onCreated,
}: {
  organizationId: string;
  onClose: () => void;
  onCreated: (project: Project) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const project = await createProject(organizationId, name.trim(), description.trim());
      onCreated(project);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Failed to create project.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="New Project" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <label className="field">
          <span>Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
        </label>

        <label className="field">
          <span>Description</span>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} />
        </label>

        {error && <p className="field-error">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
