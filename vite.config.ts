// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Explicitly set base path to root
  base: '/',
  // Ensure consistent asset hashing
  build: {
    // Use a consistent hash method for asset filenames
    rollupOptions: {
      output: {
        // Use a simpler asset naming pattern 
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
})