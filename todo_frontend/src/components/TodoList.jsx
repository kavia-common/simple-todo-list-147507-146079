/*
============================================================================
REQUIREMENT TRACEABILITY
============================================================================
Requirement ID: REQ-TODO-FE-UI-LIST
User Story: As a user, I can see my list of todos and manage them.
Acceptance Criteria: Renders list, supports edit/delete/complete via item.
GxP Impact: YES - triggers data modifications
Risk Level: LOW
Validation Protocol: VP-TODO-FE-LIST
============================================================================
*/

import React from 'react';
import { TodoItem } from './TodoItem';

// PUBLIC_INTERFACE
export function TodoList({
  todos,
  onEdit,
  onDelete,
  onToggleComplete,
  canEdit,
  canDelete,
  canComplete
}) {
  /** Public component for the todo list. */
  if (!todos || todos.length === 0) {
    return <div className="small">No todos yet. Add your first above.</div>;
    }

  return (
    <div className="todo-list" aria-live="polite">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
          canEdit={canEdit}
          canDelete={canDelete}
          canComplete={canComplete}
        />
      ))}
    </div>
  );
}
