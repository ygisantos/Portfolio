import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import tailwindcss from '@tailwindcss/vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// https://vite.dev/config/
export default defineConfig({
  base: '/Portfolio/', // comment this when dev
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@api': path.resolve(__dirname, './src/api'),
      '@page': path.resolve(__dirname, './src/pages'),
      '@constants': path.resolve(__dirname, '.src/constants'),
      '@assets': path.resolve(__dirname, './src/assets')
    },
  },
})
