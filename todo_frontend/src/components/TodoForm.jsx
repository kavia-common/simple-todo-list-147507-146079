/*
============================================================================
REQUIREMENT TRACEABILITY
============================================================================
Requirement ID: REQ-TODO-FE-UI-FORM
User Story: As a user, I can add a todo with validation.
Acceptance Criteria: Non-empty, max 200 chars, disabled when no permission.
GxP Impact: YES - Data entry validation
Risk Level: LOW
Validation Protocol: VP-TODO-FE-FORM
============================================================================
*/

import React, { useState } from 'react';
import { validateTodoText, ValidationError } from '../utils/validation';

// PUBLIC_INTERFACE
export function TodoForm({ onAdd, canCreate }) {
  /** This is a public component.
   * Props:
   * - onAdd: (text: string) => void
   * - canCreate: boolean
   */
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    try {
      validateTodoText(text);
      if (!canCreate) {
        throw new ValidationError('You do not have permission to add todos.');
      }
      onAdd(text.trim());
      setText('');
      setError('');
    } catch (err) {
      setError(err instanceof ValidationError ? err.message : 'Unable to add todo.');
    }
  };

  return (
    <form onSubmit={onSubmit} aria-label="Add todo form">
      <div className="form-row">
        <input
          className="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new todo..."
          maxLength={200}
          aria-invalid={!!error}
          aria-describedby="todo-helper todo-error"
        />
        <div className="helper" id="todo-helper">
          Max 200 characters. Provide clear, action-oriented descriptions.
        </div>
        {error ? <div id="todo-error" className="error" role="alert">{error}</div> : null}
        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={!canCreate}>
            Add Todo
          </button>
        </div>
      </div>
    </form>
  );
}
