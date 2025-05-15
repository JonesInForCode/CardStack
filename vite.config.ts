// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { version } from './package.json'

export default defineConfig({
  plugins: [react()],
  // Standard base path
  base: '/',
  build: {
    // Generate a new hash each build for every file
    rollupOptions: {
      output: {
        // Use version in asset filenames for better cache busting
        entryFileNames: `assets/[name].[hash:8].v${version}.js`,
        chunkFileNames: `assets/[name].[hash:8].v${version}.js`,
        assetFileNames: `assets/[name].[hash:8].v${version}.[ext]`
      }
    }
  },
  // Generate the version.json during build
  define: {
    __APP_VERSION__: JSON.stringify(version),
  }
})