import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

function escapeHtmlAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

process.env.VITE_APP_TITLE ??= process.env.OVERVIEW_TITLE ?? 'Synapse Nexus AI';
process.env.VITE_APP_DESCRIPTION ??= process.env.OVERVIEW_DESCRIPTION ?? 'Premium AI search and machine-learning lab';
process.env.VITE_APP_TITLE = escapeHtmlAttr(process.env.VITE_APP_TITLE);
process.env.VITE_APP_DESCRIPTION = escapeHtmlAttr(process.env.VITE_APP_DESCRIPTION);
process.env.VITE_APP_LOGO_URL ??= process.env.OVERVIEW_LOGO_URL ?? '/favicon.svg';

export default defineConfig(() => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.VITE_PORT || '3000'),
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
    watch: { usePolling: true, interval: 600 },
  },
  build: {
    cssCodeSplit: true,
    chunkSizeWarningLimit: 900,
  },
}));
