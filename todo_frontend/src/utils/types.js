/*
============================================================================
REQUIREMENT TRACEABILITY
============================================================================
Requirement ID: REQ-TODO-FE-TYPES
User Story: As a developer, I need common shapes for data structures.
Acceptance Criteria: Provide documented JSDoc typedefs.
GxP Impact: NO (dev-only typing aids)
Risk Level: LOW
Validation Protocol: N/A
============================================================================
*/

/**
 * @typedef {Object} Todo
 * @property {string} id
 * @property {string} text
 * @property {boolean} completed
 * @property {string} createdAt ISO 8601 timestamp
 * @property {string} updatedAt ISO 8601 timestamp
 */

/**
 * @typedef {Object} AuditEntry
 * @property {string} userId
 * @property {string} action
 * @property {string} timestamp ISO 8601
 * @property {any=} before
 * @property {any=} after
 * @property {string=} reason
 * @property {string=} error technical error details if any
 */
