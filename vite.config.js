import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
      rollupOptions: {
        external: ['react-toastify'],
      }
    },
    plugins: [react()],
    server: {
      port: 8301,
      allowedHosts: ['.apps-tunnel.monday.app'],
      cors: {
        origin: [
          'https://*.monday.com',
          'https://*.monday.app'
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true
      }
    }
  };
});