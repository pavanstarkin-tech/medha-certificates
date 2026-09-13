import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative base path ensures universal compatibility on Vercel, GitHub Pages, Netlify, etc.
  base: './',
  server: {
    port: 5173,
    open: false
  }
});
