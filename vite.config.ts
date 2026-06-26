import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/SatOnTheHat/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['satellite.js']
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      external: [],
    }
  },
  worker: {
    format: 'es'
  }
})