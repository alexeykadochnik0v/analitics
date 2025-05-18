import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => ({
  plugins: [react()],
  base: command === 'serve' ? '/' : '/analitics/',
  build: {
    outDir: 'dist',
    cssMinify: false, // Отключаем минификацию CSS
  },
  server: {
    historyApiFallback: true,
  },
}))
