import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Polyfill for types without @types/node
declare const process: any;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Prevent "process is not defined" error and expose env vars
      'process.env': {
        API_KEY: env.API_KEY || '',
        SUPABASE_URL: env.SUPABASE_URL || '',
        SUPABASE_KEY: env.SUPABASE_KEY || ''
      }
    }
  };
});