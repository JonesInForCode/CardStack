
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Standard base path
  base: '/',
  build: {
    // Add cache-busting with consistent hash algorithm
    rollupOptions: {
      output: {
        // Simple asset naming with predictable hashes
        entryFileNames: 'assets/[name].[hash:8].js',
        chunkFileNames: 'assets/[name].[hash:8].js',
        assetFileNames: 'assets/[name].[hash:8].[ext]'
      }
    }
  }
})