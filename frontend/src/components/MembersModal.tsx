import { useEffect, useState, type FormEvent } from "react";
import { Modal } from "./Modal";
import { Loader, ErrorBanner, EmptyState } from "./StateViews";
import { ApiRequestError } from "../api/client";
import { getAllUsers } from "../api/users";
import type { User } from "../api/types";

interface MemberLike {
  id: string;
  userId: number;
  createdAt: string;
}

interface MembersModalProps<T extends MemberLike> {
  title: string;
  onClose: () => void;
  fetchMembers: () => Promise<T[]>;
  addMember: (userId: number) => Promise<T>;
  removeMember: (member: T) => Promise<unknown>;
}

export function MembersModal<T extends MemberLike>({
  title,
  onClose,
  fetchMembers,
  addMember,
  removeMember,
}: MembersModalProps<T>) {
  const [members, setMembers] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [users, setUsers] = useState<User[] | null>(null);
  const [usersError, setUsersError] = useState<string | null>(null);

  const [selectedUserId, setSelectedUserId] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    fetchMembers()
      .then(setMembers)
      .catch((err) => setError(err instanceof ApiRequestError ? err.message : "Failed to load members."))
      .finally(() => setLoading(false));
  };

  const loadUsers = () => {
    setUsersError(null);
    getAllUsers()
      .then(setUsers)
      .catch((err) => setUsersError(err instanceof ApiRequestError ? err.message : "Failed to load users."));
  };

  useEffect(load, []);
  useEffect(loadUsers, []);

  const userById = new Map((users ?? []).map((u) => [u.id, u]));
  const memberUserIds = new Set((members ?? []).map((m) => m.userId));
  const availableUsers = (users ?? []).filter((u) => !memberUserIds.has(u.id));

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    const userId = Number(selectedUserId);
    if (!selectedUserId || Number.isNaN(userId)) {
      setAddError("Select a user to add.");
      return;
    }

    setAdding(true);
    setAddError(null);
    try {
      const member = await addMember(userId);
      setMembers((prev) => (prev ? [member, ...prev] : [member]));
      setSelectedUserId("");
    } catch (err) {
      setAddError(err instanceof ApiRequestError ? err.message : "Failed to add member.");
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (member: T) => {
    setRemoving(true);
    setRemoveError(null);
    try {
      await removeMember(member);
      setMembers((prev) => prev?.filter((m) => m.id !== member.id) ?? null);
      setConfirmingId(null);
    } catch (err) {
      setRemoveError(err instanceof ApiRequestError ? err.message : "Failed to remove member.");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <Modal title={title} onClose={onClose}>
      <form className="member-add-form" onSubmit={handleAdd}>
        <label className="field">
          <span>Add member</span>
          <div className="member-add-row">
            <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
              <option value="">
                {users === null ? "Loading users..." : availableUsers.length === 0 ? "No users to add" : "Select a user"}
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
        {usersError && <ErrorBanner message={usersError} onRetry={loadUsers} />}
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
                <span>{user ? user.email : ""}</span>

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
