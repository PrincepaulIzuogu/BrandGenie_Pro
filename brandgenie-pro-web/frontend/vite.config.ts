import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/submit-name': {
        target: 'http://mobile-backend:8000',
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
});
