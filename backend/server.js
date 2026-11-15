import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import todoRoutes from './routes/todos.js';

const app = express();

app.use(cors());
app.use(express.json());

// Open the database connection on demand. On Vercel each function instance
// may be reused between requests, so we only connect when we are not
// already connected (readyState 1 means "connected").
async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
}

app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/todos', todoRoutes);

// Final error handler: any error passed to next(err) ends up here.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

// Locally we start a port. On Vercel, the platform calls the exported app.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}

export default app;
