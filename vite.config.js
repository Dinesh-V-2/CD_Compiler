import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/CD_Compiler/',
  server: {
    port: 5173,
    host: true
  },
  test: {
    globals: true,
    environment: 'node'
  }
});
