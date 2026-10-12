import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative asset paths: works on GitHub Pages subpath (/Edusolve/) AND Vercel root.
  base: './',
  build: {
    outDir: 'dist'
  }
})
