import { useEffect, useState } from 'react';
import './App.css';

const API = '/api/todos';
const JSON_HEADERS = { 'Content-Type': 'application/json' };

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  // Load todos once when the component first appears.
  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then(setTodos)
      .catch(() => setError('Could not load todos'));
  }, []);

  async function addTodo(e) {
    e.preventDefault();
    if (!title.trim()) return;
    const res = await fetch(API, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ title }),
    });
    if (!res.ok) return setError('Could not add todo');
    const todo = await res.json();
    // Use the function form so we always update from the latest list.
    setTodos((prev) => [todo, ...prev]);
    setTitle('');
  }

  async function toggleTodo(todo) {
    const res = await fetch(`${API}/${todo._id}`, {
      method: 'PATCH',
      headers: JSON_HEADERS,
      body: JSON.stringify({ completed: !todo.completed }),
    });
    if (!res.ok) return setError('Could not update todo');
    const updated = await res.json();
    setTodos((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
  }

  async function deleteTodo(id) {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (!res.ok) return setError('Could not delete todo');
    setTodos((prev) => prev.filter((t) => t._id !== id));
  }

  return (
    <main className="container">
      <h1>My Todos</h1>

      <form onSubmit={addTodo} className="add-form">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs doing?"
        />
        <button type="submit">Add</button>
      </form>

      {error && <p className="error">{error}</p>}

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className={todo.completed ? 'done' : ''}>
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo)}
              />
              <span>{todo.title}</span>
            </label>
            <button className="delete" onClick={() => deleteTodo(todo._id)}>
              ×
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
