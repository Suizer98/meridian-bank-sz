import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': '/src' } },
  // Optional: use the Node mock server instead of MSW.
  // server: { proxy: { '/api': 'http://localhost:4010' } },
})
