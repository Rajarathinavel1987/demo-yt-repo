import { Router } from 'express';
import Todo from '../models/Todo.js';

const router = Router();

// GET /api/todos - list all todos, newest first
router.get('/', async (req, res) => {
  const todos = await Todo.find().sort({ createdAt: -1 });
  res.json(todos);
});

// POST /api/todos - create a todo
router.post('/', async (req, res) => {
  const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const todo = await Todo.create({ title });
  res.status(201).json(todo);
});

// PATCH /api/todos/:id - change the title and/or completed flag
router.patch('/:id', async (req, res) => {
  const updates = {};
  if (typeof req.body.title === 'string') updates.title = req.body.title;
  if (typeof req.body.completed === 'boolean') updates.completed = req.body.completed;

  const todo = await Todo.findByIdAndUpdate(req.params.id, updates, {
    new: true, // return the updated document, not the old one
    runValidators: true,
  });
  if (!todo) return res.status(404).json({ error: 'Not found' });
  res.json(todo);
});

// DELETE /api/todos/:id - remove a todo
router.delete('/:id', async (req, res) => {
  const todo = await Todo.findByIdAndDelete(req.params.id);
  if (!todo) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});

export default router;
