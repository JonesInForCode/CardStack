// Clean vite.config.ts - let it find postcss.config.js automatically
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})