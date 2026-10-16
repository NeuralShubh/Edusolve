import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const dir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: dir,
  base: './',
  plugins: [react()],
  build: {
    outDir: path.resolve(dir, '../dist-admin'),
    emptyOutDir: true,
  },
})
