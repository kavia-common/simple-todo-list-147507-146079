/*
============================================================================
REQUIREMENT TRACEABILITY
============================================================================
Requirement ID: REQ-TODO-FE-UI-ITEM
User Story: As a user, I can edit, delete, and complete a todo.
Acceptance Criteria: Edit with validation and reason, delete with confirm, toggle complete.
GxP Impact: YES - Data modification and audit triggers
Risk Level: LOW
Validation Protocol: VP-TODO-FE-ITEM
============================================================================
*/

import React, { useState } from 'react';
import { validateTodoText, ValidationError } from '../utils/validation';

// PUBLIC_INTERFACE
export function TodoItem({
  todo,
  onEdit,
  onDelete,
  onToggleComplete,
  canEdit,
  canDelete,
  canComplete
}) {
  /** Public component for a single todo row. */
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(todo.text);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const saveEdit = () => {
    try {
      validateTodoText(text);
      if (!reason || reason.trim().length < 3) {
        throw new ValidationError('Reason for change must be at least 3 characters.');
      }
      onEdit(todo.id, text.trim(), reason.trim());
      setIsEditing(false);
      setError('');
      setReason('');
    } catch (e) {
      setError(e instanceof ValidationError ? e.message : 'Unable to save.');
    }
  };

  return (
    <div className="todo-item">
      <div>
        <h3 className="todo-title">{todo.text}</h3>
        <div className="badges">
          <span className={`badge ${todo.completed ? 'success' : ''}`}>
            {todo.completed ? 'Completed' : 'Open'}
          </span>
          <span className="badge" title={`Created ${todo.createdAt}`}>Created</span>
          <span className="badge" title={`Updated ${todo.updatedAt}`}>Updated</span>
        </div>

        {isEditing && canEdit ? (
          <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
            <input
              className="input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={200}
              aria-label="Edit todo text"
            />
            <input
              className="input"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for change"
              aria-label="Reason for change"
            />
            {error ? <div className="error" role="alert">{error}</div> : null}
            <div className="actions">
              <button className="btn btn-primary" onClick={saveEdit}>Save</button>
              <button className="btn" onClick={() => { setIsEditing(false); setError(''); }}>Cancel</button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="actions">
        <input
          type="checkbox"
          className="checkbox"
          checked={todo.completed}
          onChange={() => canComplete && onToggleComplete(todo.id)}
          disabled={!canComplete}
          aria-label="Toggle complete"
        />
        <button className="btn" onClick={() => setIsEditing(true)} disabled={!canEdit}>Edit</button>
        <button className="btn" onClick={() => onDelete(todo.id)} disabled={!canDelete}>Delete</button>
      </div>
    </div>
  );
}
