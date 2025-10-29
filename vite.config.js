import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    outDir: 'build'
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
});