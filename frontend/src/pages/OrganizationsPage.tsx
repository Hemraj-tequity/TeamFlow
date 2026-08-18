import { useEffect, useState, type FormEvent } from "react";
import { createOrganization, getAllOrganizations } from "../api/organizations";
import {
  createOrganizationMember,
  deleteOrganizationMember,
  getAllOrganizationMembers,
} from "../api/organizationMembers";
import { ApiRequestError } from "../api/client";
import type { Organization, OrganizationStatus } from "../api/types";
import { Loader, ErrorBanner, EmptyState } from "../components/StateViews";
import { Modal } from "../components/Modal";
import { MembersModal } from "../components/MembersModal";

export function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [membersOrg, setMembersOrg] = useState<Organization | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    getAllOrganizations()
      .then(setOrganizations)
      .catch((err) => setError(err instanceof ApiRequestError ? err.message : "Failed to load organizations."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreated = (org: Organization) => {
    setOrganizations((prev) => (prev ? [org, ...prev] : [org]));
    setShowCreate(false);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Organizations</h1>
        <button type="button" className="btn btn-primary" onClick={() => setShowCreate(true)}>
          New Organization
        </button>
      </div>

      {loading && <Loader label="Loading organizations..." />}
      {!loading && error && <ErrorBanner message={error} onRetry={load} />}
      {!loading && !error && organizations && organizations.length === 0 && (
        <EmptyState title="No organizations yet" hint="Create your first organization to get started." />
      )}

      {!loading && !error && organizations && organizations.length > 0 && (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Created</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {organizations.map((org) => (
                <tr key={org.id}>
                  <td>{org.name}</td>
                  <td className="muted">{org.slug}</td>
                  <td>
                    <span className={`badge badge-${org.status === "ACTIVE" ? "active" : "inactive"}`}>
                      {org.status}
                    </span>
                  </td>
                  <td className="muted">{new Date(org.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button type="button" className="btn btn-ghost" onClick={() => setMembersOrg(org)}>
                      Members
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreate && (
        <CreateOrganizationModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />
      )}

      {membersOrg && (
        <MembersModal
          title={`Members — ${membersOrg.name}`}
          onClose={() => setMembersOrg(null)}
          fetchMembers={() => getAllOrganizationMembers(membersOrg.id)}
          addMember={(userId) => createOrganizationMember(userId, membersOrg.id)}
          removeMember={(member) => deleteOrganizationMember(member.id)}
        />
      )}
    </div>
  );
}

function CreateOrganizationModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (org: Organization) => void;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<OrganizationStatus>("ACTIVE");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const org = await createOrganization(name.trim(), slug.trim(), status);
      onCreated(org);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Failed to create organization.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="New Organization" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <label className="field">
          <span>Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
        </label>

        <label className="field">
          <span>Slug</span>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="unique-slug" />
        </label>

        <label className="field">
          <span>Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as OrganizationStatus)}>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
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
