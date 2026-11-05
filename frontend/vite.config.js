import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In development, /api requests are forwarded to the Express backend,
// so the frontend never needs a hardcoded server URL.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': process.env.VITE_PROXY_TARGET || 'http://localhost:5000',
    },
  },
})
