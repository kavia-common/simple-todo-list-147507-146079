/*
============================================================================
REQUIREMENT TRACEABILITY
============================================================================
Requirement ID: REQ-TODO-FE-STORAGE
User Story: Persist todos and audit trail locally.
Acceptance Criteria: Save/load to localStorage with error handling.
GxP Impact: YES - Enduring and Available (demo scope)
Risk Level: LOW
Validation Protocol: VP-TODO-FE-STORAGE
============================================================================
*/

const TODOS_KEY = 'ocean_todos_v1';
const AUDIT_KEY = 'ocean_audit_v1';

// PUBLIC_INTERFACE
export function loadTodos() {
  /** Load todos from localStorage. */
  try {
    const raw = window.localStorage.getItem(TODOS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

// PUBLIC_INTERFACE
export function saveTodos(todos) {
  /** Save todos array to localStorage. */
  try {
    window.localStorage.setItem(TODOS_KEY, JSON.stringify(todos || []));
  } catch {
    // ignore for demo; upstream handles error via UI if needed
  }
}

// PUBLIC_INTERFACE
export function loadAudit() {
  /** Load audit entries from localStorage. */
  try {
    const raw = window.localStorage.getItem(AUDIT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

// PUBLIC_INTERFACE
export function saveAudit(entries) {
  /** Save audit entries to localStorage. */
  try {
    window.localStorage.setItem(AUDIT_KEY, JSON.stringify(entries || []));
  } catch {
    // ignore storage failures for demo
  }
}
