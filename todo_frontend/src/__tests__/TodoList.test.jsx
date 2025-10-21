// Basic component test (stub) for TodoList.

import { render, screen, fireEvent } from '@testing-library/react';
import { TodoList } from '../components/TodoList';

const baseTodos = [
  { id: '1', text: 'First', completed: false, createdAt: 't', updatedAt: 't' },
  { id: '2', text: 'Second', completed: true, createdAt: 't', updatedAt: 't' },
];

test('renders todos', () => {
  render(
    <TodoList
      todos={baseTodos}
      onEdit={jest.fn()}
      onDelete={jest.fn()}
      onToggleComplete={jest.fn()}
      canEdit
      canDelete
      canComplete
    />
  );
  expect(screen.getByText('First')).toBeInTheDocument();
  expect(screen.getByText('Second')).toBeInTheDocument();
});

test('calls toggle complete', () => {
  const onToggle = jest.fn();
  render(
    <TodoList
      todos={[baseTodos[0]]}
      onEdit={jest.fn()}
      onDelete={jest.fn()}
      onToggleComplete={onToggle}
      canEdit
      canDelete
      canComplete
    />
  );
  const cb = screen.getByRole('checkbox');
  fireEvent.click(cb);
  expect(onToggle).toHaveBeenCalled();
});
