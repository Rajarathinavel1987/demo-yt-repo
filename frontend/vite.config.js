import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // In development, forward /api requests to the Express server
    // so the frontend can call /api/todos without CORS trouble.
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
