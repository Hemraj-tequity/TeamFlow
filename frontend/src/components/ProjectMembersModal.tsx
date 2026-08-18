import { useEffect, useState, type FormEvent } from "react";
import { Modal } from "./Modal";
import { Loader, ErrorBanner, EmptyState } from "./StateViews";
import { ApiRequestError } from "../api/client";
import { getAllOrganizationMembers } from "../api/organizationMembers";
import { addProjectMember, deleteProjectMember, getAllProjectMembers } from "../api/projectMembers";
import { getAllUsers } from "../api/users";
import type { ProjectMember, User } from "../api/types";

interface ProjectMembersModalProps {
  projectId: string;
  projectName: string;
  organizationId: string;
  onClose: () => void;
}

export function ProjectMembersModal({
  projectId,
  projectName,
  organizationId,
  onClose,
}: ProjectMembersModalProps) {
  const [members, setMembers] = useState<ProjectMember[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [orgMemberUserIds, setOrgMemberUserIds] = useState<Set<number> | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);
  const [candidatesError, setCandidatesError] = useState<string | null>(null);

  const [selectedUserId, setSelectedUserId] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    getAllProjectMembers(projectId)
      .then(setMembers)
      .catch((err) => setError(err instanceof ApiRequestError ? err.message : "Failed to load members."))
      .finally(() => setLoading(false));
  };

  const loadCandidates = () => {
    setCandidatesError(null);
    Promise.all([getAllOrganizationMembers(organizationId), getAllUsers()])
      .then(([orgMembers, allUsers]) => {
        setOrgMemberUserIds(new Set(orgMembers.map((m) => m.userId)));
        setUsers(allUsers);
      })
      .catch((err) =>
        setCandidatesError(err instanceof ApiRequestError ? err.message : "Failed to load organization members.")
      );
  };

  useEffect(load, [projectId]);
  useEffect(loadCandidates, [organizationId]);

  const userById = new Map((users ?? []).map((u) => [u.id, u]));
  const memberUserIds = new Set((members ?? []).map((m) => m.userId));
  const availableUsers = (users ?? []).filter(
    (u) => orgMemberUserIds?.has(u.id) && !memberUserIds.has(u.id)
  );

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    const userId = Number(selectedUserId);
    if (!selectedUserId || Number.isNaN(userId)) {
      setAddError("Select a member to add.");
      return;
    }

    setAdding(true);
    setAddError(null);
    try {
      const member = await addProjectMember(projectId, userId);
      setMembers((prev) => (prev ? [member, ...prev] : [member]));
      setSelectedUserId("");
    } catch (err) {
      setAddError(err instanceof ApiRequestError ? err.message : "Failed to add member.");
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (member: ProjectMember) => {
    setRemoving(true);
    setRemoveError(null);
    try {
      await deleteProjectMember(projectId, member.id);
      setMembers((prev) => prev?.filter((m) => m.id !== member.id) ?? null);
      setConfirmingId(null);
    } catch (err) {
      setRemoveError(err instanceof ApiRequestError ? err.message : "Failed to remove member.");
    } finally {
      setRemoving(false);
    }
  };

  const candidatesLoaded = orgMemberUserIds !== null && users !== null;

  return (
    <Modal title={`Members — ${projectName}`} onClose={onClose}>
      <form className="member-add-form" onSubmit={handleAdd}>
        <label className="field">
          <span>Add member from organization</span>
          <div className="member-add-row">
            <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
              <option value="">
                {!candidatesLoaded
                  ? "Loading organization members..."
                  : availableUsers.length === 0
                  ? "No organization members to add"
                  : "Select a member"}
              </option>
              {availableUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.email}
                </option>
              ))}
            </select>
            <button type="submit" className="btn btn-primary" disabled={adding || !selectedUserId}>
              {adding ? "Adding..." : "Add"}
            </button>
          </div>
        </label>
        {candidatesLoaded && availableUsers.length === 0 && (
          <p className="muted">
            Only users who are already members of this project's organization can be added. Add them as an
            organization member first.
          </p>
        )}
        {candidatesError && <ErrorBanner message={candidatesError} onRetry={loadCandidates} />}
        {addError && <p className="field-error">{addError}</p>}
      </form>

      {loading && <Loader label="Loading members..." />}
      {!loading && error && <ErrorBanner message={error} onRetry={load} />}
      {!loading && !error && members && members.length === 0 && (
        <EmptyState title="No members yet" hint="Add a member using the dropdown above." />
      )}

      {!loading && !error && members && members.length > 0 && (
        <ul className="members-list">
          {members.map((member) => {
            const user = userById.get(member.userId);
            return (
              <li key={member.id} className="members-list-item">
                <span>{user ? user.email : `User #${member.userId}`}</span>

                {confirmingId === member.id ? (
                  <div className="member-confirm">
                    <span className="field-error inline">Remove?</span>
                    <button
                      type="button"
                      className="btn btn-danger"
                      disabled={removing}
                      onClick={() => handleRemove(member)}
                    >
                      {removing ? "Removing..." : "Yes"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      disabled={removing}
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
                      setRemoveError(null);
                      setConfirmingId(member.id);
                    }}
                  >
                    Remove
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {removeError && <p className="field-error">{removeError}</p>}
    </Modal>
  );
}
