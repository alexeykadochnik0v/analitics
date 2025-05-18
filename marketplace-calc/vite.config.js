import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => ({
  plugins: [react()],
  base: command === 'serve' ? '/' : '/marketplace-calc/',
  build: {
    outDir: 'dist',
  },
  server: {
    historyApiFallback: true,
  },
}))
