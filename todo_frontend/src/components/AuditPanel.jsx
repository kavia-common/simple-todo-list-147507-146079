/*
============================================================================
REQUIREMENT TRACEABILITY
============================================================================
Requirement ID: REQ-TODO-FE-AUDIT-VIEW
User Story: As a QA, I can view audit logs for actions.
Acceptance Criteria: Shows a chronological read-only list of audit events.
GxP Impact: YES - audit visibility
Risk Level: LOW
Validation Protocol: VP-TODO-FE-AUDIT
============================================================================
*/

import React from 'react';

// PUBLIC_INTERFACE
export function AuditPanel({ auditEntries }) {
  /** Read-only audit panel. */
  return (
    <div>
      <h3 style={{ margin: '0 0 8px' }}>Audit Trail</h3>
      <div className="small">Frontend-only demo. Replace with server-backed immutable store for production.</div>
      <div>
        {(auditEntries || []).length === 0 ? (
          <div className="small">No audit entries yet.</div>
        ) : (
          (auditEntries || []).slice().reverse().map((e, idx) => (
            <div className="audit-entry" key={`${e.timestamp}-${idx}`}>
              <div><strong>{e.action}</strong> by <code>{e.userId}</code> at {e.timestamp}</div>
              {e.reason ? <div className="small">Reason: {e.reason}</div> : null}
              {e.error ? <div className="small" style={{ color: 'var(--color-error)' }}>Error: {e.error}</div> : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
