/*
============================================================================
REQUIREMENT TRACEABILITY
============================================================================
Requirement ID: REQ-TODO-FE-AUDIT
User Story: Capture an audit trail for CRUD operations.
Acceptance Criteria: User ID, ISO timestamp, action, before/after, reason, error.
GxP Impact: YES - Audit Trail (ALCOA+)
Risk Level: LOW
Validation Protocol: VP-TODO-FE-AUDIT
============================================================================
*/

// PUBLIC_INTERFACE
export const AUDIT_ACTIONS = Object.freeze({
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  COMPLETE: 'COMPLETE',
  UNCOMPLETE: 'UNCOMPLETE',
  FRONTEND_ERROR: 'FRONTEND_ERROR'
});

/**
 * PUBLIC_INTERFACE
 * createAuditLogger
 * This is a public function.
 * Creates an audit logger that appends to a stored list and persists via a callback.
 * @param {() => {id: string, role: string}} getUser - returns current user info.
 * @param {(entries: any[]) => void} setEntries - invoked after appending an entry.
 * @returns {{ log: (action: string, payload?: any) => void, error: (action: string, payload?: any) => void }}
 */
export function createAuditLogger(getUser, setEntries) {
  let buffer = [];

  const append = (entry) => {
    buffer = [...buffer, entry];
    setEntries(buffer);
  };

  // Function: log
  // Purpose: Write an audit entry for business actions.
  // GxP Critical: Yes
  // Parameters: action, payload (may include before/after, reason)
  // Returns: void
  // Throws: none
  // Audit: N/A (this is the auditor)
  const log = (action, payload = {}) => {
    const user = getUser();
    const entry = {
      userId: user?.id || 'unknown',
      action,
      timestamp: new Date().toISOString(),
      before: payload.before ?? null,
      after: payload.after ?? null,
      reason: payload.reason ?? undefined
    };
    append(entry);
  };

  // Function: error
  // Purpose: Capture technical errors in audit trail.
  // GxP Critical: Yes
  // Parameters: action label, payload with error details
  // Returns: void
  const error = (action, payload = {}) => {
    const user = getUser();
    const entry = {
      userId: user?.id || 'unknown',
      action,
      timestamp: new Date().toISOString(),
      error: payload.technical || payload.message || 'Unknown error'
    };
    append(entry);
  };

  return { log, error };
}
