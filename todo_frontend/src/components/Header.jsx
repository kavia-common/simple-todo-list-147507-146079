/*
============================================================================
REQUIREMENT TRACEABILITY
============================================================================
Requirement ID: REQ-TODO-FE-UI-HEADER
User Story: As a user, I can see a header and toggle theme.
Acceptance Criteria: Header shows title info; theme toggle exists.
GxP Impact: NO - UI only
Risk Level: LOW
Validation Protocol: VP-TODO-FE-UI
============================================================================
*/

// IMPORTS AND DEPENDENCIES
import React from 'react';

// PUBLIC_INTERFACE
export function Header({ theme, onThemeToggle }) {
  /** This is a public component.
   * Props:
   * - theme: 'light' | 'dark'
   * - onThemeToggle: () => void
   */
  return (
    <div role="toolbar" aria-label="Header actions">
      <button className="btn btn-outline" onClick={onThemeToggle} aria-label="Toggle theme">
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
    </div>
  );
}
