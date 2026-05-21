import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// For GitHub Pages: the site is served from /escape-decisions/ on
// https://USER.github.io/escape-decisions/. We only apply that base on
// production builds (npm run build / npm run deploy). Dev keeps `/`.
const isProd = process.env.NODE_ENV === 'production'

export default defineConfig({
  base: isProd ? '/escape-decisions/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})
