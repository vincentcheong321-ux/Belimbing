
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Polyfill for types without @types/node
declare const process: any;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Use '.' instead of process.cwd() to be safe in all environments
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    // Removed 'define: { global: 'window' }' as we handle it in index.html
  };
});
