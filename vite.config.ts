import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Prevent "process is not defined" error
      // Note: You must create a .env file with API_KEY=your_key_here locally
      'process.env': {
        API_KEY: env.API_KEY || ''
      }
    }
  };
});