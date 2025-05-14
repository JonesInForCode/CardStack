// Simple, cleaned vite.config.ts without Tailwind references
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})