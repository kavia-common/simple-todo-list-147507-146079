/*
============================================================================
REQUIREMENT TRACEABILITY
============================================================================
Requirement ID: REQ-TODO-FE-VALIDATION
User Story: Validate inputs to ensure data integrity.
Acceptance Criteria: Non-empty, <=200 chars; error class provided.
GxP Impact: YES - Data integrity (ALCOA+)
Risk Level: LOW
Validation Protocol: VP-TODO-FE-VAL
============================================================================
*/

// PUBLIC_INTERFACE
export class ValidationError extends Error {
  /** This is a public class used to signal validation issues. */
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

// PUBLIC_INTERFACE
export function validateTodoText(text) {
  /** Validate todo text content.
   * This is a public function.
   * @param {string} text
   * @returns {true}
   * @throws {ValidationError} when invalid
   */
  if (typeof text !== 'string') throw new ValidationError('Todo must be a string.');
  const trimmed = text.trim();
  if (trimmed.length === 0) throw new ValidationError('Todo cannot be empty.');
  if (trimmed.length > 200) throw new ValidationError('Todo cannot exceed 200 characters.');
  return true;
}
