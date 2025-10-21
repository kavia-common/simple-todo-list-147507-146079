/*
============================================================================
REQUIREMENT TRACEABILITY
============================================================================
Requirement ID: REQ-TODO-FE-001
User Story: As a user, I want to manage todos (add, edit, delete, complete) so I can track tasks.
Acceptance Criteria:
- App renders with header, input form, and list
- Users can add todos with validation (non-empty, max length 200)
- Users can edit existing todos with validation and reason-for-change
- Users can delete todos with confirmation
- Users can toggle complete status
- State persists via localStorage
- Audit trail entries created for CREATE/UPDATE/DELETE/COMPLETE actions with ISO timestamps and before/after states
- Error handling shows friendly messages and logs technical details to audit trail
- Role/access control placeholders present (e.g., canEdit/canDelete booleans)
- Ocean Professional theme colors used
- Basic unit test stubs included
- Documentation blocks and release checklist present in key files
GxP Impact: YES - Audit trail and access controls are required, data integrity must be preserved.
Risk Level: LOW
Validation Protocol: VP-TODO-FE-001
============================================================================
*/

import React, { useCallback, useEffect, useMemo, useState } from 'react'; // React 18
import './styles/theme.css';
import './index.css';
import { Header } from './components/Header';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { AuditPanel } from './components/AuditPanel';
import { createAuditLogger, AUDIT_ACTIONS } from './utils/audit';
import { loadTodos, saveTodos, loadAudit, saveAudit } from './utils/storage';
import { validateTodoText, ValidationError } from './utils/validation';

/**
 * Mock current user context to support attribution and role checks.
 * In production, replace with real auth context/provider.
 */
const currentUser = {
  id: 'user-001',
  name: 'Demo User',
  role: 'editor', // roles: viewer | editor | admin
};

// Role-based access placeholders (expand per policy)
const roleCapabilities = {
  viewer: { canCreate: false, canEdit: false, canDelete: false, canComplete: false },
  editor: { canCreate: true, canEdit: true, canDelete: true, canComplete: true },
  admin:  { canCreate: true, canEdit: true, canDelete: true, canComplete: true },
};

// PUBLIC_INTERFACE
export default function AppShell() {
  /**
   * GxP: Initialize state from persistent layer and audit trail.
   */
  const [todos, setTodos] = useState(() => loadTodos());
  const [audit, setAudit] = useState(() => loadAudit());
  const [errorMsg, setErrorMsg] = useState('');
  const [theme, setTheme] = useState('light');

  const capabilities = roleCapabilities[currentUser.role] || roleCapabilities.viewer;
  const auditLogger = useMemo(() => createAuditLogger(() => currentUser, (entries) => {
    // persist audit after every append
    saveAudit(entries);
    setAudit(entries);
  }), []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // persist todos on change
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const handleError = useCallback((friendly, technical) => {
    setErrorMsg(friendly);
    auditLogger.error('FRONTEND_ERROR', { message: friendly, technical });
  }, [auditLogger]);

  // PUBLIC_INTERFACE
  const addTodo = useCallback((text) => {
    // Function: addTodo
    // Purpose: Add a new todo item with validation and audit logging.
    // GxP Critical: Yes
    // Parameters: text: string (non-empty, <=200)
    // Returns: void
    // Throws: ValidationError if invalid
    // Audit: CREATE with after-state
    try {
      validateTodoText(text);
      if (!capabilities.canCreate) {
        throw new ValidationError('Insufficient permissions to create.');
      }
      const newTodo = {
        id: `td_${Date.now()}`,
        text,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTodos(prev => {
        const next = [newTodo, ...prev];
        auditLogger.log(AUDIT_ACTIONS.CREATE, { before: null, after: newTodo });
        return next;
      });
      setErrorMsg('');
    } catch (e) {
      const friendly = e instanceof ValidationError ? e.message : 'Unable to add todo.';
      handleError(friendly, e?.stack || String(e));
    }
  }, [auditLogger, capabilities.canCreate, handleError]);

  // PUBLIC_INTERFACE
  const editTodo = useCallback((id, newText, reasonForChange) => {
    // Function: editTodo
    // Purpose: Update text of an existing todo with reason for change.
    // GxP Critical: Yes
    // Parameters: id: string, newText: string (validated), reasonForChange: string (required)
    // Returns: void
    // Throws: ValidationError on invalid inputs or permissions
    // Audit: UPDATE with before/after and reason
    try {
      if (!capabilities.canEdit) throw new ValidationError('Insufficient permissions to edit.');
      validateTodoText(newText);
      if (!reasonForChange || reasonForChange.trim().length < 3) {
        throw new ValidationError('Reason for change must be at least 3 characters.');
      }
      setTodos(prev => {
        const idx = prev.findIndex(t => t.id === id);
        if (idx === -1) return prev;
        const before = prev[idx];
        const after = { ...before, text: newText, updatedAt: new Date().toISOString() };
        const next = [...prev];
        next[idx] = after;
        auditLogger.log(AUDIT_ACTIONS.UPDATE, { before, after, reason: reasonForChange });
        return next;
      });
      setErrorMsg('');
    } catch (e) {
      const friendly = e instanceof ValidationError ? e.message : 'Unable to edit todo.';
      handleError(friendly, e?.stack || String(e));
    }
  }, [auditLogger, capabilities.canEdit, handleError]);

  // PUBLIC_INTERFACE
  const deleteTodo = useCallback((id) => {
    // Function: deleteTodo
    // Purpose: Deletes a todo item after user confirmation.
    // GxP Critical: Yes
    // Parameters: id: string
    // Returns: void
    // Throws: ValidationError if not permitted
    // Audit: DELETE with before-state
    try {
      if (!capabilities.canDelete) throw new ValidationError('Insufficient permissions to delete.');
      setTodos(prev => {
        const item = prev.find(t => t.id === id);
        if (!item) return prev;
        // User confirmation (basic)
        // eslint-disable-next-line no-alert
        const ok = window.confirm('Are you sure you want to delete this todo?');
        if (!ok) return prev;
        const next = prev.filter(t => t.id !== id);
        auditLogger.log(AUDIT_ACTIONS.DELETE, { before: item, after: null });
        return next;
      });
      setErrorMsg('');
    } catch (e) {
      const friendly = e instanceof ValidationError ? e.message : 'Unable to delete todo.';
      handleError(friendly, e?.stack || String(e));
    }
  }, [auditLogger, capabilities.canDelete, handleError]);

  // PUBLIC_INTERFACE
  const toggleComplete = useCallback((id) => {
    // Function: toggleComplete
    // Purpose: Toggle completion status of a todo item.
    // GxP Critical: Yes
    // Parameters: id: string
    // Returns: void
    // Audit: COMPLETE/UNCOMPLETE with before/after
    try {
      if (!capabilities.canComplete) throw new ValidationError('Insufficient permissions to complete.');
      setTodos(prev => {
        const idx = prev.findIndex(t => t.id === id);
        if (idx === -1) return prev;
        const before = prev[idx];
        const after = { ...before, completed: !before.completed, updatedAt: new Date().toISOString() };
        const next = [...prev];
        next[idx] = after;
        auditLogger.log(before.completed ? AUDIT_ACTIONS.UNCOMPLETE : AUDIT_ACTIONS.COMPLETE, { before, after });
        return next;
      });
      setErrorMsg('');
    } catch (e) {
      const friendly = e instanceof ValidationError ? e.message : 'Unable to update status.';
      handleError(friendly, e?.stack || String(e));
    }
  }, [auditLogger, capabilities.canComplete, handleError]);

  const onThemeToggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return (
    <div className="app-shell">
      <div className="card header">
        <div className="header-title">
          <div className="logo" aria-label="App logo">TD</div>
          <div>
            <h1 className="h1">Ocean Todo</h1>
            <div className="small">Signed in as {currentUser.name} · role: {currentUser.role}</div>
          </div>
        </div>
        <div className="header-actions">
          <Header theme={theme} onThemeToggle={onThemeToggle} />
        </div>
      </div>

      {errorMsg ? (
        <div className="card" style={{ padding: 12, borderColor: 'rgba(239,68,68,0.35)' }}>
          <div className="error" role="alert">{errorMsg}</div>
        </div>
      ) : null}

      <div className="card" style={{ padding: 16, marginTop: 12 }}>
        <TodoForm onAdd={addTodo} canCreate={capabilities.canCreate} />
      </div>

      <div className="card" style={{ padding: 12, marginTop: 12 }}>
        <TodoList
          todos={todos}
          onEdit={editTodo}
          onDelete={deleteTodo}
          onToggleComplete={toggleComplete}
          canEdit={capabilities.canEdit}
          canDelete={capabilities.canDelete}
          canComplete={capabilities.canComplete}
        />
      </div>

      <div className="card audit-panel">
        <AuditPanel auditEntries={audit} />
      </div>

      <div className="footer-note">
        Ocean Professional theme · GxP-ready demo · Local only (no backend)
      </div>
    </div>
  );
}

/*
============================================================================
RELEASE GATE CHECKLIST
============================================================================
[ ] All inputs validated
[ ] Audit trail implemented for data modifications
[ ] Unit test coverage >80% (stubs included, expand as needed)
[ ] Integration tests passing (N/A: frontend-only)
[ ] Error handling comprehensive
[ ] Documentation complete
[ ] Security controls verified (role placeholders implemented)
[ ] Performance acceptable
[ ] Code review ready
============================================================================
*/
