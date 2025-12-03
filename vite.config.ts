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
        SUPABASE_URL: env.SUPABASE_URL || 'https://usgowottnszzozjhxque.supabase.co',
        SUPABASE_KEY: env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzZ293b3R0bnN6em96amh4cXVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NDkxMDMsImV4cCI6MjA4MDMyNTEwM30.yxu5caAfXaRag0x5jNSc6wSHUSfmHNeNVbaf_iv9w_w'
      }
    }
  };
});