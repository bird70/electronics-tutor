import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH ?? '/',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  test: {
    exclude: ['mechanics-tutor/**', 'node_modules/**'],
  },
});
