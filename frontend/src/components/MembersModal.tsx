import { useEffect, useState, type FormEvent } from "react";
import { Modal } from "./Modal";
import { Loader, ErrorBanner, EmptyState } from "./StateViews";
import { ApiRequestError } from "../api/client";

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

  const [userIdInput, setUserIdInput] = useState("");
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

  useEffect(load, []);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    const userId = Number(userIdInput);
    if (!userIdInput || Number.isNaN(userId)) {
      setAddError("Enter a valid numeric user ID.");
      return;
    }

    setAdding(true);
    setAddError(null);
    try {
      const member = await addMember(userId);
      setMembers((prev) => (prev ? [member, ...prev] : [member]));
      setUserIdInput("");
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
          <span>Add member by User ID</span>
          <div className="member-add-row">
            <input
              type="number"
              min={1}
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              placeholder="e.g. 1"
            />
            <button type="submit" className="btn btn-primary" disabled={adding}>
              {adding ? "Adding..." : "Add"}
            </button>
          </div>
        </label>
        {addError && <p className="field-error">{addError}</p>}
      </form>

      {loading && <Loader label="Loading members..." />}
      {!loading && error && <ErrorBanner message={error} onRetry={load} />}
      {!loading && !error && members && members.length === 0 && (
        <EmptyState title="No members yet" hint="Add a member using their User ID above." />
      )}

      {!loading && !error && members && members.length > 0 && (
        <ul className="members-list">
          {members.map((member) => (
            <li key={member.id} className="members-list-item">
              <div>
                <span className="member-user">User #{member.userId}</span>
                <span className="muted member-date">
                  {new Date(member.createdAt).toLocaleDateString()}
                </span>
              </div>

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
          ))}
        </ul>
      )}

      {removeError && <p className="field-error">{removeError}</p>}
    </Modal>
  );
}
