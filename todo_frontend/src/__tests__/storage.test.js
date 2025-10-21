// Basic unit tests (stubs) for storage utility.

import { loadTodos, saveTodos, loadAudit, saveAudit } from '../utils/storage';

beforeEach(() => {
  window.localStorage.clear();
});

describe('storage', () => {
  test('saves and loads todos', () => {
    const todos = [{ id: '1', text: 'A', completed: false, createdAt: '', updatedAt: '' }];
    saveTodos(todos);
    expect(loadTodos()).toEqual(todos);
  });

  test('saves and loads audit', () => {
    const entries = [{ userId: 'u', action: 'X', timestamp: 't' }];
    saveAudit(entries);
    expect(loadAudit()).toEqual(entries);
  });
});
