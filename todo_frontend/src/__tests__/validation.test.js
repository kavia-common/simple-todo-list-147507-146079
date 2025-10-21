// Basic unit tests (stubs) for validation utility.

import { validateTodoText, ValidationError } from '../utils/validation';

describe('validation', () => {
  test('accepts valid text', () => {
    expect(validateTodoText('Buy milk')).toBe(true);
  });

  test('rejects empty', () => {
    expect(() => validateTodoText('   ')).toThrow(ValidationError);
  });

  test('rejects too long', () => {
    const long = 'a'.repeat(201);
    expect(() => validateTodoText(long)).toThrow(ValidationError);
  });
});
