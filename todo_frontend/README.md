# Ocean Todo (GxP-ready Frontend Demo)

A modern React single-page app for managing todos (add, edit with reason, delete with confirm, complete) with:
- Ocean Professional theme and minimalist UI
- Local persistence via localStorage
- GxP-compliant audit trail logging (user attribution, ISO timestamps, before/after, reason, error)

## Getting Started

- npm start — run dev server at http://localhost:3000
- npm test — run tests (stubs included; expand to reach 80% coverage)
- npm run build — production build

## Structure

- src/App.js — AppShell, role placeholders, audit logging, release checklist
- src/components/* — Header, TodoForm, TodoList, TodoItem, AuditPanel
- src/utils/* — validation, storage, audit helpers
- src/styles/theme.css — Ocean Professional theme

## GxP Notes

- Audit logged for CREATE/UPDATE/DELETE/COMPLETE with ISO 8601 timestamps
- Editing requires "reason for change"
- Error handling logs technical details to audit trail under FRONTEND_ERROR
- Role placeholders are implemented (viewer/editor/admin). Replace the mock user with your Auth provider.
- Demo scope: frontend-only, localStorage; for production, persist to an immutable audit store.

## Theming

Ocean Professional palette (see src/styles/theme.css):
- Primary #3b82f6, Secondary #64748b, Success #06b6d4, Error #EF4444

## Release Checklist (see top of App.js)
- [ ] Inputs validated
- [ ] Audit trail implemented
- [ ] Tests expanded to >=80% coverage
- [ ] Docs complete
- [ ] Security controls reviewed
