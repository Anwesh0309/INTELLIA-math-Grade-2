import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

const ELEVENLABS_API_KEY =
  process.env.VITE_ELEVENLABS_API_KEY || 'sk_b90743b791d41f1957e2f0b64eaf1b356258fb2f932ffef0';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS === 'true' ? '/INTELLIA-math-Grade-2/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api/elevenlabs': {
        target: 'https://api.elevenlabs.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/elevenlabs/, '/v1'),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('xi-api-key', ELEVENLABS_API_KEY);
          });
        }
      }
    }
  }
});
